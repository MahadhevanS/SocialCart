
'use client';

import type { ChatMessage } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

type ChatHistories = {
  [conversationId: string]: ChatMessage[];
};

interface ChatContextType {
  sendMessage: (recipientId: string, text: string) => void;
  getMessages: (recipientId: string) => ChatMessage[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Helper to create a consistent conversation ID
const getConversationId = (userId1: string, userId2: string) => {
  return [userId1, userId2].sort().join('--');
};


export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatHistories, setChatHistories] = useState<ChatHistories>({});
  const { currentUser, users } = useAuth();
  const { toast } = useToast();

  // Effect to load initial data and listen for cross-tab changes
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const storedHistories = localStorage.getItem('socialCartChatHistory');
        if (storedHistories) {
          setChatHistories(JSON.parse(storedHistories));
        }
      } catch (error) {
        console.error('Failed to load chat history from localStorage', error);
        localStorage.removeItem('socialCartChatHistory');
      }
    };

    syncFromStorage(); // Initial load
    
    // Add listener to sync changes across tabs
    window.addEventListener('storage', syncFromStorage);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', syncFromStorage);
    };
  }, []);

  // Effect to save changes from this tab to localStorage
  useEffect(() => {
    // Don't save on initial mount if the state is empty
    if (Object.keys(chatHistories).length === 0 && !localStorage.getItem('socialCartChatHistory')) {
      return;
    }
    try {
      localStorage.setItem('socialCartChatHistory', JSON.stringify(chatHistories));
    } catch (error) {
      console.error('Failed to save chat history to localStorage', error);
    }
  }, [chatHistories]);

  const sendMessage = (recipientId: string, text: string) => {
    if (!currentUser) return;

    const recipient = users.find(user => user.id === recipientId);
    const conversationId = getConversationId(currentUser.id, recipientId);
    const newMessage: ChatMessage = {
      senderId: currentUser.id,
      text,
    };

    setChatHistories(prev => {
      const existingHistory = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: [...existingHistory, newMessage],
      };
    });
    
    if (recipient && !recipient.isOnline) {
      toast({
        title: `${recipient.name} is currently offline`,
        description: "We've sent them a notification. They'll see your message when they're back.",
      });
    }
  };

  const getMessages = (recipientId: string) => {
    if (!currentUser) return [];
    const conversationId = getConversationId(currentUser.id, recipientId);
    return chatHistories[conversationId] || [];
  };

  return (
    <ChatContext.Provider value={{ sendMessage, getMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
