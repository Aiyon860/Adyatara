"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();
    const hideFooter = pathname?.startsWith("/dashboard") || pathname?.startsWith("/game");

    if (hideFooter) return null;

    return (
        <footer className="bg-[#0A0705] border-t border-gray-800/60 font-sans mt-auto">
            <div className="container mx-auto px-4 max-w-6xl py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] tracking-[0.3em] text-gray-500 uppercase">
                    <div className="font-medium text-white/90">ADYATARA</div>
                    <div className="text-center">© 2026 ADYATARA • MELESTARIKAN WARISAN BUDAYA INDONESIA</div>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">KEBIJAKAN</Link>
                        <Link href="#" className="hover:text-white transition-colors">PRIVASI</Link>
                        <Link href="#" className="hover:text-white transition-colors">KONTAK</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
