'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, LogIn, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { VoiceAssistant } from '@/components/voice/VoiceAssistant';

export function Header() {
  const { cartCount } = useCart();
  const { currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '/products', label: 'Products', icon: null },
    { href: '/social', label: 'Social', icon: null },
    { href: '/chat', label: 'Chat', icon: null },
    { href: '/leaderboard', label: 'Leaderboard', icon: null },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/products" className="mr-6 flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-primary font-headline">SocialCart</span>
        </Link>
        
        <div className="hidden md:flex flex-1 items-center space-x-4">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-primary flex items-center gap-1">
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <div className="relative w-full max-w-xs">
              <Input type="search" placeholder="Search products..." className="pl-10" />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <VoiceAssistant />
             <Button variant="ghost" size="icon" asChild>
              <Link href="/visual-search" aria-label="Visual Search">
                <Camera className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart" aria-label="Shopping Cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
             {currentUser ? (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/account" aria-label="My Account">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/"><LogIn className="mr-2 h-4 w-4" />Login</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex md:hidden flex-1 justify-end items-center">
            <VoiceAssistant />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/visual-search" aria-label="Visual Search">
                <Camera className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart" aria-label="Shopping Cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm flex flex-col p-0 gap-0">
              <SheetHeader className="p-4 border-b">
                 <Link href="/products" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl text-primary font-headline">SocialCart</span>
                </Link>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <div className="p-4 flex-grow">
                <nav className="flex flex-col space-y-4">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className="text-lg transition-colors hover:text-primary flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                      {link.icon && <link.icon className="h-5 w-5" />}
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 relative w-full">
                  <Input type="search" placeholder="Search products..." className="pl-10" />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
               <div className="p-4 border-t">
                 {currentUser ? (
                    <Link href="/account" className="flex items-center text-lg transition-colors hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="mr-2 h-5 w-5" /> Account
                    </Link>
                  ) : (
                    <Link href="/" className="flex items-center text-lg transition-colors hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                        <LogIn className="mr-2 h-5 w-5" /> Login
                    </Link>
                  )}
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
