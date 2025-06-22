import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';
import { PairChatProvider } from '@/contexts/PairChatContext';
import { GlobalPairChat } from '@/components/chat/GlobalPairChat';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { AnimationProvider } from '@/contexts/AnimationContext';

export const metadata: Metadata = {
  title: 'SocialCart',
  description: 'Your Social E-commerce Destination',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <PairChatProvider>
            <CartProvider>
              <ChatProvider>
                <AnimationProvider>
                  <MainLayoutWrapper>
                    {children}
                  </MainLayoutWrapper>
                  <GlobalPairChat />
                  <Toaster />
                </AnimationProvider>
              </ChatProvider>
            </CartProvider>
          </PairChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
