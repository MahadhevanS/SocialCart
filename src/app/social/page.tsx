'use client';

import type { UserProfile } from '@/lib/types';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserPlus, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const UserCard = ({ user }: { user: UserProfile }) => {
  const { toggleFollow, isFollowing } = useAuth();
  const { toast } = useToast();
  const isFollowed = isFollowing(user.id);

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFollow(user.id);
    toast({
      title: isFollowed ? `Unfollowed ${user.name}` : `Followed ${user.name}!`,
      description: isFollowed ? `You are no longer following @${user.username}.` : `You can now see @${user.username}'s updates and chat with them.`
    });
  };

  return (
    <Card className="flex flex-col text-center items-center shadow-lg transition-all hover:shadow-xl">
      <CardHeader>
        <Link href={`/profile/${user.username}`}>
          <Avatar className="w-24 h-24 border-4 border-background ring-2 ring-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <CardTitle className="pt-4 text-primary font-headline">
          <Link href={`/profile/${user.username}`} className="hover:underline">
            {user.name}
          </Link>
        </CardTitle>
        <CardDescription>@{user.username}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{user.bio}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant={isFollowed ? 'default' : 'outline'} 
          className="w-full"
          onClick={handleFollowToggle}
        >
          {isFollowed ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
          {isFollowed ? 'Following' : 'Follow'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function SocialPage() {
  const { users, currentUser } = useAuth();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center font-headline text-primary">Discover People</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* We filter out the current user to simulate not being able to follow yourself */}
        {users.filter(u => u.id !== currentUser?.id).map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
