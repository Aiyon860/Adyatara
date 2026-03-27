"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const hideNavbar = pathname?.startsWith("/dashboard") || pathname?.startsWith("/game");

    if (hideNavbar) return null;

    // Tombol Masuk mengarah ke dashboard jika sudah login, ke signin jika belum
    const masukHref = session?.user ? "/dashboard" : "/auth/signin";

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
                    <Link href="/#beranda" className="text-[#E86B52] hover:text-[#D96B4A] transition-colors text-sm font-semibold tracking-wide">
                        Home
                    </Link>
                    <Link href="/#fitur" className="text-gray-400 hover:text-white transition-colors text-sm font-light tracking-wide">
                        Fitur
                    </Link>
                    <Link href="/#cerita" className="text-gray-400 hover:text-white transition-colors text-sm font-light tracking-wide">
                        Cerita
                    </Link>
                    <Link href="/#tentang" className="text-gray-400 hover:text-white transition-colors text-sm font-light tracking-wide">
                        Tentang
                    </Link>
                </nav>

                {/* Right Actions - Tombol Masuk saja */}
                <div className="flex items-center gap-3">
                    <Link
                        href={masukHref}
                        className="hidden md:flex items-center justify-center px-10 py-2.5 bg-linear-to-b from-[#EAA87E] to-[#D96B4A] text-gray-900 hover:opacity-90 transition-opacity text-sm font-semibold rounded-md shadow-md shadow-[#D96B4A]/20"
                    >
                        Masuk
                    </Link>
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
                    <Link href="/#beranda" className="block text-secondary hover:text-primary py-2" onClick={() => setIsOpen(false)}>
                        HOME
                    </Link>
                    <Link href="/#fitur" className="block text-muted hover:text-primary py-2" onClick={() => setIsOpen(false)}>
                        FITUR
                    </Link>
                    <Link href="/#cerita" className="block text-muted hover:text-primary py-2" onClick={() => setIsOpen(false)}>
                        CERITA
                    </Link>
                    <Link href="/#tentang" className="block text-muted hover:text-primary py-2" onClick={() => setIsOpen(false)}>
                        TENTANG
                    </Link>
                    
                    {/* Mobile menu - Tombol Masuk */}
                    <Link href={masukHref} className="block text-primary hover:text-primary py-2 font-semibold" onClick={() => setIsOpen(false)}>
                        MASUK
                    </Link>
                </div>
            )}
        </header>
    );
}
