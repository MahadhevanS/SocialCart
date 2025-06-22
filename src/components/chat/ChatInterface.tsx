
'use client';

import { useState, useRef, useEffect } from 'react';
import type { UserProfile, ChatMessage } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Users, XCircle, Hourglass, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePairChat } from '@/contexts/PairChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ChatInterfaceProps {
  recipient: UserProfile;
  isSidebar?: boolean;
}

export function ChatInterface({ recipient, isSidebar = false }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { 
      sendPairChatRequest, 
      acceptPairChatRequest, 
      declinePairChatRequest, 
      getInvitationForConversation,
      endPairChat 
    } = usePairChat();
  const { currentUser } = useAuth();
  const { sendMessage, getMessages } = useChat();

  const messages = getMessages(recipient.id);
  const invitation = getInvitationForConversation(recipient.id);
  const isMyRequest = invitation?.from.id === currentUser?.id;
  const isIncomingRequest = invitation?.from.id === recipient.id;

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, invitation]);

  const handleStartPairShop = () => {
    sendPairChatRequest(recipient);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    sendMessage(recipient.id, newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="w-full h-full flex flex-col bg-muted/20">
        <div className="flex flex-row items-center gap-2 border-b p-4 bg-background">
          <Avatar className="h-12 w-12">
            <AvatarImage src={recipient.avatarUrl} alt={recipient.name} data-ai-hint="person portrait" />
            <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h2 className="font-semibold text-lg">{recipient.name}</h2>
             <div className="flex items-center gap-2">
                <span className={cn(
                    "h-2 w-2 rounded-full",
                    recipient.isOnline ? "bg-green-500" : "bg-slate-400"
                )} />
                <p className="text-sm text-muted-foreground">
                    {recipient.isOnline ? "Online" : "Offline"}
                </p>
            </div>
          </div>
          {isSidebar ? (
            <Button variant="outline" size="sm" onClick={endPairChat} className="ml-auto">
                <XCircle className="mr-2 h-4 w-4" />
                End Session
            </Button>
          ) : invitation && isMyRequest ? (
            <Button variant="outline" size="sm" disabled className="ml-auto">
                <Hourglass className="mr-2 h-4 w-4" />
                Request Sent
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleStartPairShop} className="ml-auto" disabled={!!invitation}>
                <Users className="mr-2 h-4 w-4" />
                Pair Shop
            </Button>
          )}
        </div>
        <div className="flex-grow p-0 overflow-hidden">
          <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
            {invitation && isIncomingRequest && (
              <Alert className="my-4 bg-primary/5 border-primary/20">
                <Hourglass className="h-4 w-4" />
                <AlertTitle className="font-semibold">{recipient.name} wants to Pair Shop!</AlertTitle>
                <AlertDescription className="flex items-center justify-between mt-2">
                  <p>Start a shared shopping session?</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => acceptPairChatRequest(invitation.id)}>
                      <Check className="mr-2 h-4 w-4" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => declinePairChatRequest(invitation.id)}>
                      <X className="mr-2 h-4 w-4" /> Decline
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              {messages.length === 0 && !invitation && (
                <div className="text-center text-muted-foreground py-12">
                  <p>You are now connected with {recipient.name}. Start the conversation!</p>
                </div>
              )}
              {messages.map((message, index) => {
                const isUserMessage = message.senderId === currentUser?.id;
                return (
                  <div
                    key={index}
                    className={cn(
                      'flex items-end gap-2',
                      isUserMessage ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {!isUserMessage && (
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={recipient.avatarUrl} alt={recipient.name} data-ai-hint="person portrait" />
                         <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-xs md:max-w-md rounded-lg px-4 py-2 break-words shadow-md',
                        isUserMessage
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background'
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              autoComplete="off"
              disabled={!currentUser}
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim() || !currentUser}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
