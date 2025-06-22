
'use client';

import { useCart } from '@/contexts/CartContext';
import { getProductById } from '@/lib/mockData';
import type { UserProfile, Product } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Heart, Pencil, LogOut, Leaf } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AccountPage() {
  const { favorites } = useCart();
  const { currentUser: user, logout, updateUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (!user) {
      router.replace('/');
    } else {
        setName(user.name);
        setUsername(user.username);
        setBio(user.bio);
        setAvatarUrl(user.avatarUrl);
    }
  }, [user, router]);

  const favoriteProducts = user ? favorites.map(id => getProductById(id)).filter((p): p is Product => p !== undefined) : [];

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out successfully.' });
    router.push('/');
  };

  const handleSaveChanges = () => {
    if (!user || !name || !username) {
        toast({
            variant: 'destructive',
            title: 'Update failed',
            description: 'Name and username cannot be empty.',
        });
        return;
    }
    const success = updateUser({ name, username, bio, avatarUrl });
    if (success) {
      toast({ title: 'Profile updated successfully!' });
      setIsEditing(false); // Close dialog
    } else {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'That username is already taken. Please choose another one.',
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto flex h-full items-center justify-center py-12 px-4 text-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow text-center md:text-left space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <p className="max-w-prose">{user.bio}</p>
          <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10 text-lg py-2 px-4">
            <Leaf className="mr-2 h-5 w-5" /> {(user.ecoPoints || 0).toLocaleString()} Eco Points
          </Badge>
          <div className="flex gap-2 justify-center md:justify-start">
             <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                    <Button variant="outline"><Pencil className="mr-2 h-4 w-4" /> Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="avatar-url">Avatar URL</Label>
                            <Input id="avatar-url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button variant="ghost" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
          </div>
        </div>
      </header>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="orders"><ShoppingBag className="mr-2 h-4 w-4" /> Order History</TabsTrigger>
          <TabsTrigger value="favorites"><Heart className="mr-2 h-4 w-4" /> Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Your past orders will be displayed here.</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-12">
              <p>You have no past orders.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="favorites">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>My Favorites</CardTitle>
              <CardDescription>Products you've saved will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {favoriteProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                  {favoriteProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <p>You have no favorite items yet. Favorite items from product pages to see them here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
