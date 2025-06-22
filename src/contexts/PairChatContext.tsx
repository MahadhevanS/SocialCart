
'use client';

import type { UserProfile } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export interface PairChatInvitation {
  id: string;
  from: UserProfile;
  to: UserProfile;
  status: 'pending' | 'accepted' | 'declined';
}

interface PairChatContextType {
  isPairChatActive: boolean;
  activeRecipient: UserProfile | null;
  activeInvitation: PairChatInvitation | null;
  sendPairChatRequest: (recipient: UserProfile) => void;
  acceptPairChatRequest: (invitationId: string) => void;
  declinePairChatRequest: (invitationId: string) => void;
  endPairChat: () => void;
  getInvitationForConversation: (participantId: string) => PairChatInvitation | undefined;
  navigateShared: (path: string) => void;
}

const PairChatContext = createContext<PairChatContextType | undefined>(undefined);
const SHARED_NAV_KEY = 'socialCartSharedNav';


export const PairChatProvider = ({ children }: { children: ReactNode }) => {
  const [invitations, setInvitations] = useState<PairChatInvitation[]>([]);
  const [isPairChatActive, setIsPairChatActive] = useState(false);
  const [activeRecipient, setActiveRecipient] = useState<UserProfile | null>(null);
  const [activeInvitation, setActiveInvitation] = useState<PairChatInvitation | null>(null);

  const { currentUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Load and sync invitations with localStorage
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const storedInvites = localStorage.getItem('socialCartPairChatInvites');
        if (storedInvites) {
          const parsedInvites: PairChatInvitation[] = JSON.parse(storedInvites);
          // Simple cleanup of old invites
          const recentInvites = parsedInvites.filter(inv => inv.status === 'pending' || inv.status === 'accepted');
          setInvitations(recentInvites);
        }
      } catch (error) {
        console.error('Failed to load pair chat invites from localStorage', error);
      }
    };
    
    syncFromStorage();
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  useEffect(() => {
    // Avoid writing initial empty array
    if (invitations.length === 0 && !localStorage.getItem('socialCartPairChatInvites')) return;
    try {
      localStorage.setItem('socialCartPairChatInvites', JSON.stringify(invitations));
    } catch (error) {
       console.error('Failed to save pair chat invites to localStorage', error);
    }
  }, [invitations]);


  // Effect to handle state changes based on invitations
  useEffect(() => {
    if (!currentUser) return;
    
    // Check for an accepted invitation to start the session
    const acceptedInvite = invitations.find(
      inv => inv.status === 'accepted' && (inv.from.id === currentUser.id || inv.to.id === currentUser.id)
    );

    if (acceptedInvite && !isPairChatActive) {
      const recipient = acceptedInvite.from.id === currentUser.id ? acceptedInvite.to : acceptedInvite.from;
      setActiveRecipient(recipient);
      setActiveInvitation(acceptedInvite);
      setIsPairChatActive(true);
    } else if (!acceptedInvite && isPairChatActive) {
      // If the active invitation is gone, end the session
      endPairChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitations, currentUser, isPairChatActive]);


  // This effect listens for the other user's navigation during a pair session
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === SHARED_NAV_KEY && e.newValue) {
            try {
                const { path, initiatorId } = JSON.parse(e.newValue);
                // Navigate only if we are in an active session and the initiator is the other person
                if (isPairChatActive && activeRecipient && initiatorId === activeRecipient.id) {
                    router.push(path);
                }
            } catch (error) {
                console.error("Failed to parse shared navigation event", error);
            }
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isPairChatActive, activeRecipient, router]);


  const sendPairChatRequest = (recipient: UserProfile) => {
    if (!currentUser) return;
    
    // Prevent sending a new request if one already exists between the two users
    const existingInvite = invitations.some(inv => 
        ((inv.from.id === currentUser.id && inv.to.id === recipient.id) || 
         (inv.from.id === recipient.id && inv.to.id === currentUser.id)) &&
        inv.status === 'pending'
    );
    
    if (existingInvite) {
        toast({ title: "Request already sent", description: "You already have a pending request with this user."});
        return;
    }

    const newInvitation: PairChatInvitation = {
      id: uuidv4(),
      from: currentUser,
      to: recipient,
      status: 'pending',
    };
    setInvitations(prev => [...prev, newInvitation]);
    toast({ title: "Request Sent!", description: `Your pair shopping request has been sent to ${recipient.name}.`})
  };

  const acceptPairChatRequest = (invitationId: string) => {
    setInvitations(prev =>
      prev.map(inv => (inv.id === invitationId ? { ...inv, status: 'accepted' } : inv))
    );
  };

  const declinePairChatRequest = (invitationId: string) => {
     const inviteToDecline = invitations.find(inv => inv.id === invitationId);
     if (inviteToDecline) {
       setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
       toast({ title: "Request Declined", description: "You have declined the pair shopping request."});
     }
  };
  
  const endPairChat = () => {
    if (activeInvitation) {
        setInvitations(prev => prev.filter(inv => inv.id !== activeInvitation.id));
    }
    setIsPairChatActive(false);
    setActiveRecipient(null);
    setActiveInvitation(null);
  };

  const getInvitationForConversation = (participantId: string): PairChatInvitation | undefined => {
      if (!currentUser) return undefined;
      return invitations.find(inv => 
        inv.status === 'pending' &&
        ((inv.from.id === currentUser.id && inv.to.id === participantId) || (inv.from.id === participantId && inv.to.id === currentUser.id))
      );
  }

  const navigateShared = (path: string) => {
      // Always navigate the current user's screen
      router.push(path);
      
      // If in a pair chat session, notify the other user to navigate too
      if (isPairChatActive && currentUser) {
          localStorage.setItem(SHARED_NAV_KEY, JSON.stringify({ path, initiatorId: currentUser.id, timestamp: Date.now() }));
      }
  };

  return (
    <PairChatContext.Provider
      value={{
        isPairChatActive,
        activeRecipient,
        activeInvitation,
        sendPairChatRequest,
        acceptPairChatRequest,
        declinePairChatRequest,
        endPairChat,
        getInvitationForConversation,
        navigateShared,
      }}
    >
      {children}
    </PairChatContext.Provider>
  );
};

export const usePairChat = () => {
  const context = useContext(PairChatContext);
  if (context === undefined) {
    throw new Error('usePairChat must be used within a PairChatProvider');
  }
  return context;
};
