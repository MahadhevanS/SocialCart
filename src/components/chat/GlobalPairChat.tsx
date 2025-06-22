'use client';

import { usePairChat } from '@/contexts/PairChatContext';
import { ChatInterface } from './ChatInterface';

export function GlobalPairChat() {
  const { isPairChatActive, activeRecipient } = usePairChat();

  if (!isPairChatActive || !activeRecipient) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 h-[60vh] w-full max-w-md transform-none transition-transform md:bottom-4 md:right-4 md:h-[calc(100vh-2rem)]">
        <div className="h-full w-full overflow-hidden rounded-t-lg border bg-card shadow-2xl md:rounded-lg">
            <ChatInterface recipient={activeRecipient} isSidebar={true} />
        </div>
    </div>
  );
}
