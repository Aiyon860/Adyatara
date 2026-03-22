"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Share2, Sparkles, BookOpen, Clock } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function ResultPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     async function fetchStats() {
       if (!sessionId) {
           setLoading(false);
           return;
       }
       try {
           const res = await fetch(`/api/game/${sessionId}`);
           if (res.ok) {
               const details = await res.json();
               setData(details);
           }
       } catch(e) {
           toast.error("Gagal mendapatkan status terakhir");
       } finally {
           setLoading(false);
       }
     }
     fetchStats();
  }, [sessionId]);

  const stats = [
    { label: "Skor Akhir", value: data ? data.session.score : "0", prefix: "", icon: Sparkles },
    { label: "Waktu", value: "--:--", prefix: "", icon: Clock },
    { label: "Pengetahuan", value: data?.session?.score > 10 ? "2" : "1", prefix: "+", icon: BookOpen },
    { label: "Cabang Cerita", value: "A", prefix: "Peringkat", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-[#0A0705] relative flex flex-col items-center justify-center py-12 px-6 overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1549487222-26db1357c96a?auto=format&fit=crop&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(100%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0705] via-[#0A0705]/80 to-transparent z-0" />
      
      {/* Main Content */}
      <div className="w-full max-w-4xl z-10 flex flex-col items-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-[#D96B4A]" />
            <h2 className="text-[#D96B4A] tracking-[0.3em] text-xs font-semibold uppercase">
              Permainan Selesai
            </h2>
            <div className="h-[1px] w-12 bg-[#D96B4A]" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
            Akhir Perjalanan
          </h1>
          <p className="text-gray-400 font-light max-w-xl mx-auto text-lg">
            Anda telah menyelesaikan kisah {loading ? "..." : (data?.node?.story?.title || "Sangkuriang")}. Keputusan yang Anda ambil telah mengubah takdir mereka selamanya.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-[#120D0A]/80 border border-gray-800 p-6 flex flex-col items-center justify-center relative group hover:border-[#D96B4A]/50 transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-500 mb-3 group-hover:text-[#D96B4A] transition-colors" />
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-serif text-white">
                  {stat.prefix && <span className="text-sm text-[#D96B4A] mr-1">{stat.prefix}</span>}
                  {stat.value}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md"
        >
          <Link 
            href="/dashboard"
            className="w-full text-center py-4 px-8 bg-[#D96B4A] text-white tracking-widest text-xs font-semibold hover:bg-[#E86B52] transition-colors"
          >
            KEMBALI KE PETA
          </Link>
          
          <button 
            className="w-full sm:w-auto py-4 px-8 border border-gray-700 text-gray-300 flex justify-center items-center gap-2 hover:border-gray-500 hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs tracking-widest font-semibold">BAGIKAN</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function GameResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0705]" />}>
            <ResultPageContent />
        </Suspense>
    )
}
