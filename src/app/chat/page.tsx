
'use client';

import { MessageSquare, Users, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { users, currentUser } = useAuth();

  // If there's no logged-in user, we can't determine who they are following.
  if (!currentUser) {
     return (
        <div className="container mx-auto py-8 px-4">
            <Card className="text-center py-12">
                <CardHeader className="flex flex-col items-center">
                    <Users className="h-20 w-20 text-muted-foreground mb-4" />
                    <p className="text-2xl text-muted-foreground mb-2">Please log in to see your chats.</p>
                </CardHeader>
                <CardContent>
                    <Button asChild size="lg">
                    <Link href="/">Login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
     );
  }

  const followedUsers = users.filter(user => currentUser.followingIds.includes(user.id));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <MessageSquare className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Chat Central</h1>
        <p className="text-muted-foreground mt-2 text-lg">Start a conversation with the people you follow.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {followedUsers.length > 0 ? (
          <div className="space-y-4">
            {followedUsers.map(user => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <Link href={`/profile/${user.username}`} className="flex items-center gap-4 group">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                         <p className="font-semibold text-xl group-hover:text-primary">{user.name}</p>
                         <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", user.isOnline ? 'bg-green-500' : 'bg-slate-400')} />
                      </div>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                  </Link>
                  <Button asChild>
                    <Link href={`/chat/${user.username}`}>
                      <MessageCircle className="mr-2 h-4 w-4" /> Chat
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardHeader className="flex flex-col items-center">
                <Users className="h-20 w-20 text-muted-foreground mb-4" />
                <p className="text-2xl text-muted-foreground mb-2">You aren't following anyone yet.</p>
                <p className="text-muted-foreground mb-6">Find people on the social page to start chatting.</p>
            </CardHeader>
            <CardContent>
                <Button asChild size="lg">
                  <Link href="/social">Discover People</Link>
                </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
