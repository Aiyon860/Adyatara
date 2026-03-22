"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, LayoutDashboard, LogIn, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const hideNavbar = pathname?.startsWith("/dashboard") || pathname?.startsWith("/game");

    if (hideNavbar) return null;

    return (
        <header className="fixed top-0 z-50 w-full backdrop-blur-xs transition-all duration-300">
            <div className="container mx-auto flex h-24 items-center justify-between px-4 max-w-6xl">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 font-bold text-2xl z-20">
                    <img src="/images/adyatara-logo.png" alt="Adyatara Logo" className="w-14 h-14 object-contain" />
                    <span className="text-white font-serif tracking-widest text-lg font-medium">Adyatara</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-12 flex-1 mx-12 justify-center">
                    {!session?.user && (
                        <>
                            <Link href="/" className="text-[#E86B52] hover:text-[#D96B4A] transition-colors text-sm font-semibold tracking-wide">
                                Home
                            </Link>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light tracking-wide">
                                Fitur
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light tracking-wide">
                                Karakter
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-light tracking-wide">
                                Cerita
                            </a>
                        </>
                    )}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {session?.user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="hidden md:flex items-center text-muted hover:text-primary transition-colors text-sm gap-2"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="border-border text-foreground hover:border-primary"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Keluar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/auth/signin"
                                className="hidden md:flex items-center justify-center px-10 py-2.5 bg-linear-to-b from-[#EAA87E] to-[#D96B4A] text-gray-900 hover:opacity-90 transition-opacity text-sm font-semibold rounded-md shadow-md shadow-[#D96B4A]/20"
                            >
                                Masuk
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden ml-4 text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-border bg-card p-4 space-y-3">
                    {!session?.user && (
                        <>
                            <Link href="/" className="block text-secondary hover:text-primary py-2">
                                HOME
                            </Link>
                            <a href="#" className="block text-muted hover:text-primary py-2">
                                FITUR
                            </a>
                            <a href="#" className="block text-muted hover:text-primary py-2">
                                KARAKTER
                            </a>
                            <a href="#" className="block text-muted hover:text-primary py-2">
                                CERITA
                            </a>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
