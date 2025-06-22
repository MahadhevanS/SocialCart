
'use client';

import { getProductById } from '@/lib/mockData';
import type { UserProfile, Product } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Star, MessageCircle, UserPlus, UserCheck, Leaf } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface ProfilePageClientProps {
  user: UserProfile;
}

const Stat = ({ label, value, icon }: { label: string; value: number | string, icon?: React.ReactNode }) => (
  <div className="text-center">
    <p className="font-bold text-lg flex items-center justify-center gap-1">
      {icon}
      {value}
    </p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const ProductGrid = ({ productIds }: { productIds: string[] }) => {
  const products = productIds.map(id => getProductById(id)).filter((p): p is Product => p !== undefined);

  if (products.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No items here yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export function ProfilePageClient({ user }: ProfilePageClientProps) {
  const { toggleFollow, isFollowing, currentUser } = useAuth();
  const { toast } = useToast();

  const isFollowed = isFollowing(user.id);
  const isOwnProfile = currentUser?.id === user.id;

  const handleFollowToggle = () => {
    toggleFollow(user.id);
     toast({
      title: isFollowed ? `Unfollowed ${user.name}` : `Followed ${user.name}!`,
      description: isFollowed ? `You are no longer following @${user.username}.` : `You can now see @${user.username}'s updates and chat with them.`
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">{user.name}</h1>
          <p className="text-muted-foreground mb-4">@{user.username}</p>
          <p className="max-w-prose mb-4">{user.bio}</p>
          <div className="flex justify-center md:justify-start gap-4">
            {/* You can't follow yourself */}
            { !isOwnProfile && (
                <Button variant={isFollowed ? 'default' : 'outline'} onClick={handleFollowToggle}>
                    {isFollowed ? <UserCheck className="mr-2" /> : <UserPlus className="mr-2" />}
                    {isFollowed ? 'Following' : 'Follow'}
                </Button>
            )}
            <Button asChild variant="outline">
              <Link href={`/chat/${user.username}`}>
                <MessageCircle className="mr-2" /> Message
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 md:gap-8 pt-4 md:pt-0">
          <Stat label="Followers" value={user.followers.toLocaleString()} />
          <Stat label="Following" value={user.following.toLocaleString()} />
          <Stat label="Eco Points" value={user.ecoPoints.toLocaleString()} icon={<Leaf className="h-4 w-4 text-primary" />} />
        </div>
      </header>

      <Separator className="my-8" />
      
      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="favorites"><Heart className="mr-2" /> Favorites</TabsTrigger>
          <TabsTrigger value="wishlist"><Star className="mr-2" /> Wishlist</TabsTrigger>
        </TabsList>
        <TabsContent value="favorites">
          <ProductGrid productIds={user.favorites} />
        </TabsContent>
        <TabsContent value="wishlist">
          <ProductGrid productIds={user.wishlist} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
