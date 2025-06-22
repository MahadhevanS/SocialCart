'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { LeafFall } from '@/components/effects/LeafFall';

interface AnimationContextType {
  triggerLeafFall: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [isLeafFallActive, setIsLeafFallActive] = useState(false);

  const triggerLeafFall = useCallback(() => {
    // If an animation is already running, don't start another one
    if (isLeafFallActive) return;

    setIsLeafFallActive(true);
    // Animation duration is max 8s, let's turn it off after 9s to be safe.
    setTimeout(() => {
      setIsLeafFallActive(false);
    }, 9000);
  }, [isLeafFallActive]);

  return (
    <AnimationContext.Provider value={{ triggerLeafFall }}>
      {children}
      {isLeafFallActive && <LeafFall />}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};
