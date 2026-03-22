import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { constructMetadata } from "@/lib/metadata";
import { LogOut, Award, Trophy } from "lucide-react";
import Link from "next/link";
import MapWrapper from "@/components/dashboard/map-wrapper";

export const metadata = constructMetadata({
    title: "Dashboard - Pilih Provinsi",
    description: "Jelajahi peta Indonesia dan mulai petualangan Anda",
    path: "/dashboard",
});

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const userData = await db.user.findUnique({
        where: { id: session.user.id },
        select: { level: true, totalScore: true }
    });

    const level = userData?.level || 1;
    const score = userData?.totalScore || 0;

    return (
        <div className="h-screen w-full bg-[#0A0705] text-[#F5F0EB] relative overflow-hidden flex flex-col">
            {/* Background Particles/Stars effect */}
            <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
                <div className="absolute top-[20%] left-[10%] w-1 h-1 rounded-full bg-[#D96B4A] shadow-[0_0_8px_2px_#D96B4A]" />
                <div className="absolute top-[60%] left-[80%] w-1 h-1 rounded-full bg-[#D96B4A] shadow-[0_0_8px_2px_#D96B4A]" />
                <div className="absolute top-[80%] left-[20%] w-1.5 h-1.5 rounded-full bg-[#E86B52] shadow-[0_0_10px_3px_#E86B52] opacity-50" />
                <div className="absolute top-[30%] left-[70%] w-1 h-1 rounded-full bg-[#E86B52] shadow-[0_0_8px_2px_#D96B4A]" />
            </div>

            {/* Map Area */}
            <div className="absolute inset-0 z-0 h-full w-full">
                <MapWrapper />
            </div>

            {/* UI overlay layer */}
            <div className="relative z-10 w-full h-full flex flex-col pointer-events-none">
                {/* Header */}
                <div className="flex items-center justify-between p-8 w-full mr-auto ml-auto md:px-12">
                    {/* Left - Logo */}
                    <Link href="/" className="flex items-center gap-4 pointer-events-auto">
                        <div className="w-8 h-8 border border-gray-700/50 flex items-center justify-center relative">
                            <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-gray-500" />
                            <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-gray-500" />
                        </div>
                        <span className="text-[11px] tracking-[0.4em] font-serif text-gray-300 uppercase">ADYATARA</span>
                    </Link>

                    {/* Right - Stats */}
                    <div className="flex items-center gap-8 pointer-events-auto">
                        {/* Stats Box */}
                        <div className="relative border border-gray-800/80 bg-[#0D0907]/50 flex items-center py-3 px-8">
                            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-l border-t border-gray-600/50" />
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-r border-t border-gray-600/50" />
                            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-l border-b border-gray-600/50" />
                            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-r border-b border-gray-600/50" />

                            <div className="flex items-center gap-3 pr-8 border-r border-gray-800">
                                <Award className="w-4 h-4 text-[#D96B4A]" strokeWidth={2} />
                                <div>
                                    <p className="text-[9px] tracking-[0.2em] text-gray-500 uppercase mb-0.5">LEVEL</p>
                                    <p className="text-[13px] font-medium text-white">{level}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pl-8">
                                <Trophy className="w-4 h-4 text-[#D96B4A]" strokeWidth={2} />
                                <div>
                                    <p className="text-[9px] tracking-[0.2em] text-gray-500 uppercase mb-0.5">SKOR TOTAL</p>
                                    <p className="text-[13px] font-medium text-white">{score}</p>
                                </div>
                            </div>
                        </div>

                        {/* Current Region Info */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">JAWA TENGAH</span>
                                <span className="text-[10px] text-[#D96B4A]">25%</span>
                            </div>
                            <div className="h-[2px] w-12 bg-gray-800 relative">
                                <div className="absolute top-0 left-0 h-full w-1/4 bg-[#D96B4A]"></div>
                            </div>
                        </div>

                        {/* Exit button */}
                        <Link href="/api/auth/signout" className="w-10 h-10 border border-gray-800 flex items-center justify-center hover:bg-gray-800/50 transition-colors cursor-pointer ml-4 pointer-events-auto">
                            <LogOut className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                        </Link>
                    </div>
                </div>

                {/* Title */}
                <div className="flex flex-col items-center mt-2">
                    <p className="text-[10px] tracking-[0.4em] text-[#D96B4A] uppercase font-medium mb-3">
                        PETA NUSANTARA
                    </p>
                    <h1 className="text-4xl md:text-[2.5rem] font-serif text-white">
                        Pilih Provinsi
                    </h1>
                </div>

                {/* Legend Bottom */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-10 bg-[#0a0705]/80 px-8 py-3 rounded-full border border-gray-800/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#EAA87E]" />
                        <span className="text-[9px] tracking-[0.2em] text-gray-500 uppercase font-medium">SELESAI</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E86B52] shadow-[0_0_10px_2px_rgba(232,107,82,0.6)]" />
                        <span className="text-[9px] tracking-[0.2em] text-gray-500 uppercase font-medium">AKTIF</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#8C3A2A]" />
                        <span className="text-[9px] tracking-[0.2em] text-gray-500 uppercase font-medium">TERSEDIA</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                        <span className="text-[9px] tracking-[0.2em] text-gray-500 uppercase font-medium">TERKUNCI</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
