'use client';

import { usePairChat } from '@/contexts/PairChatContext';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isPairChatActive } = usePairChat();

  return (
    <div className={cn(
      "min-h-screen flex flex-col relative transition-all duration-300 ease-in-out",
      // On medium screens and up, add padding to the right to make space for the chat sidebar.
      // The sidebar is max-w-md (28rem) + right-4 (1rem) offset + 1rem gap = 30rem of space needed.
      { 'md:pr-[30rem]': isPairChatActive }
    )}>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
