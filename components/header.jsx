import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { FolderOpen, PenBox } from 'lucide-react'
import UserMenu from './user-menu'
import { checkUser } from '@/lib/checkUser'
import DailyQuote from './daily-quote'

/**
 * Header Component
 * Main application header containing navigation, authentication buttons, and user menu.
 * Uses Next.js Server Components for user checking.
 */
const Header = async () => {
    // Ensure user data is synced with our database
    await checkUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-amber-200/50 bg-gradient-to-r from-amber-50/95 via-orange-50/95 to-amber-50/95 backdrop-blur-xl shadow-lg shadow-amber-900/10 transition-all duration-500">
            <nav className='container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 flex items-center justify-between'>
                {/* Logo Section */}
                <Link href={"/"} className="transition-transform duration-300 hover:scale-105">
                    <Image
                        src="/logo.png"
                        alt="EchoNote Logo"
                        width={200}
                        height={60}
                        className="h-12 w-auto object-contain drop-shadow-md"
                    />
                </Link>

                {/* Daily Quote Section */}
                <DailyQuote />

                <div className="flex items-center space-x-3">
                    {/* Authorized view: Collections Button */}
                    <SignedIn>
                        <Link href="/dashboard#collections">
                            <Button variant="outline" className={"flex items-center gap-2"}>
                                <FolderOpen size={18} />
                                <span className='hidden md:inline'>Collections</span>
                            </Button>
                        </Link>
                    </SignedIn>

                    {/* Write Button (Always visible but action might be guarded implicitly by route) */}
                    <Link href="/journal/write">
                        <Button variant="journal" className={"flex items-center gap-2"}>
                            <PenBox size={18} />
                            <span className='hidden md:inline'>Write New</span>
                        </Button>
                    </Link>

                    {/* Guest view: Login Button */}
                    <SignedOut>
                        <SignInButton forceRedirectUrl='/dashboard'>
                            <Button variant="outline">Login</Button>
                        </SignInButton>
                    </SignedOut>

                    {/* Authorized view: User Menu */}
                    <SignedIn>
                        <UserMenu />
                    </SignedIn>
                </div>
            </nav>
        </header>
    )
}

export default Header