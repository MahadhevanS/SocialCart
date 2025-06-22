
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Leaf } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function LeaderboardPage() {
  const { users, currentUser } = useAuth();

  const sortedUsers = [...users].sort((a, b) => b.ecoPoints - a.ecoPoints);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <Trophy className="mx-auto h-16 w-16 text-accent mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Carbon Footprint Leaderboard</h1>
        <p className="text-muted-foreground mt-2 text-lg">See how your eco-friendly shopping stacks up against others!</p>
      </div>

      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle>Top Eco Warriors</CardTitle>
          <CardDescription>Users are ranked by their total Eco Points earned.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Eco Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user, index) => {
                const rank = index + 1;
                return (
                  <TableRow key={user.id} className={cn(currentUser?.id === user.id && 'bg-accent/20')}>
                    <TableCell className="font-bold text-xl text-center">{getRankBadge(rank)}</TableCell>
                    <TableCell>
                      <Link href={`/profile/${user.username}`} className="flex items-center gap-4 group">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-base group-hover:text-primary">{user.name}</p>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                       <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10 text-lg py-2 px-3">
                         <Leaf className="mr-2 h-5 w-5" /> {user.ecoPoints.toLocaleString()}
                       </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
