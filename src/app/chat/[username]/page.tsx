'use client';

import { useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// A skeleton component that mimics the layout of the chat interface
const ChatPageSkeleton = () => (
  <div className="flex h-full flex-col bg-background">
    <div className="flex flex-row items-center gap-2 border-b p-4 bg-background">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-grow space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-9 w-28 rounded-md" />
    </div>
    <div className="flex-grow p-6 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <p>Loading Chat...</p>
        </div>
    </div>
    <div className="p-4 border-t bg-background">
      <div className="flex w-full items-center space-x-2">
        <Skeleton className="h-10 flex-grow rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
    </div>
  </div>
);


export default function ChatPage() {
  const [isClient, setIsClient] = useState(false);
  const params = useParams<{ username: string }>();
  const { getUserByUsername } = useAuth();

  useEffect(() => {
    // This effect runs only once on the client after the component mounts.
    setIsClient(true);
  }, []);
  
  const recipient = isClient ? getUserByUsername(params.username) : undefined;

  // After mounting and trying to get the user, if they don't exist, call notFound.
  if (isClient && !recipient) {
    notFound();
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      {isClient && recipient ? (
        <ChatInterface recipient={recipient} />
      ) : (
        <ChatPageSkeleton />
      )}
    </div>
  );
}
