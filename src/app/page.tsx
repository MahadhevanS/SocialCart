'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, currentUser } = useAuth();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  // Form states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  useEffect(() => {
    setIsClient(true);
    if (currentUser) {
      router.push('/products');
    }
  }, [currentUser, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginUsername);
    if (success) {
      toast({ title: 'Login Successful!', description: 'Welcome back!' });
      router.push('/products');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'User not found. Please check your username or sign up.',
      });
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupUsername || !signupPassword) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Please fill out all fields.',
      });
      return;
    }
    const success = signup(signupName, signupUsername);
    if (success) {
      toast({ title: 'Account Created!', description: 'Welcome to SocialCart!' });
      router.push('/products');
    } else {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'A user with that username already exists.',
      });
    }
  };

  const AuthFormSkeleton = () => (
    <CardContent className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </CardContent>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-background p-4">
      <div className="container mx-auto flex justify-center px-4">
        <Tabs defaultValue="login" className="w-full max-w-md">
          <Card className="shadow-2xl overflow-hidden rounded-2xl border border-border/20">
            <CardHeader className="text-center bg-gradient-to-b from-primary/90 to-primary p-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-primary-foreground" />
              <CardTitle className="text-2xl sm:text-3xl font-bold font-headline mt-2 text-primary-foreground">Welcome to SocialCart</CardTitle>
              <CardDescription className="text-primary-foreground/80">Login or create an account to start shopping</CardDescription>
            </CardHeader>
             <TabsList className="grid w-full grid-cols-2 rounded-none bg-muted/50 p-1">
                <TabsTrigger value="login" className="rounded-none py-3 text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-inner">Login</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-none py-3 text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-inner">Sign Up</TabsTrigger>
              </TabsList>
            <TabsContent value="login">
              {!isClient ? <AuthFormSkeleton /> : (
                <CardContent className="space-y-4 pt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username-login">Username</Label>
                      <Input id="username-login" type="text" placeholder="janedoe" required value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-login">Password</Label>
                      <Input id="password-login" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                  </form>
                </CardContent>
              )}
            </TabsContent>
            <TabsContent value="signup">
              {!isClient ? <AuthFormSkeleton /> : (
                 <CardContent className="space-y-4 pt-6">
                   <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-signup">Name</Label>
                      <Input id="name-signup" type="text" placeholder="Jane Doe" required value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username-signup">Username</Label>
                      <Input id="username-signup" type="text" placeholder="janedoe" required value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup">Password</Label>
                      <Input id="password-signup" type="password" required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full">Create Account</Button>
                  </form>
                </CardContent>
              )}
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
