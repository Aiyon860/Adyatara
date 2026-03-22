"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [node, setNode] = useState<any>(null);

  useEffect(() => {
    async function initGame() {
      if (sessionId) {
        try {
          const res = await fetch(`/api/game/${sessionId}`);
          if (!res.ok) throw new Error("Gagal mengambil sesi permainan");
          const data = await res.json();
          
          if (data.session.status === "completed") {
              router.replace(`/game/result?sessionId=${sessionId}`);
              return;
          }

          setSession(data.session);
          setNode(data.node);
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Jika tidak ada sessionId, otomatis mulai cerita pertama
        try {
          const storiesRes = await fetch("/api/stories");
          const stories = await storiesRes.json();
          
          if (!stories || stories.length === 0) {
            toast.error("Belum ada cerita yang tersedia dari server.");
            setLoading(false);
            return;
          }

          const storyId = stories[0].id;
          
          const startRes = await fetch("/api/game/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storyId }),
          });
          
          if (!startRes.ok) throw new Error("Gagal memulai permainan. Pastikan anda sudah login.");
          const newSession = await startRes.json();
          
          router.replace(`/game?sessionId=${newSession.id}`);
        } catch (error: any) {
          toast.error(error.message);
          setLoading(false);
        }
      }
    }
    
    initGame();
  }, [sessionId, router]);

  const handleChoice = async (choiceId: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/game/choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, choiceId }),
      });
      
      if (!res.ok) throw new Error("Gagal mengirim pilihan");
      
      const updatedSession = await res.json();
      
      if (updatedSession.status === "completed") {
        router.push(`/game/result?sessionId=${sessionId}`);
      } else {
        const nodeRes = await fetch(`/api/game/${sessionId}`);
        const data = await nodeRes.json();
        setSession(data.session);
        setNode(data.node);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0705]">
        <Loader2 className="w-10 h-10 animate-spin text-[#D96B4A]" />
      </div>
    );
  }

  if (!node) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0705] text-white">
              <h2 className="text-2xl font-serif text-[#D96B4A]">Sesi Permainan Tidak Ditemukan</h2>
              <button onClick={() => router.push("/dashboard")} className="mt-4 px-6 py-2 border border-[#D96B4A] text-[#D96B4A] hover:bg-[#D96B4A]/10">Kembali ke Peta</button>
          </div>
      )
  }

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-between py-12 px-6 overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(13, 10, 8, 0.4) 0%, rgba(13, 10, 8, 0.7) 50%, rgba(13, 10, 8, 0.95) 100%), url('https://images.unsplash.com/photo-1549487222-26db1357c96a?auto=format&fit=crop&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[#D96B4A]/5 mix-blend-color-burn"></div>

      {/* Trivial corner brackets on the edges of the screen */}
      <div className="absolute top-12 left-12 w-6 h-6 border-l border-t border-gray-600/40" />
      <div className="absolute top-12 right-12 w-6 h-6 border-r border-t border-gray-600/40" />
      <div className="absolute bottom-12 left-12 w-6 h-6 border-l border-b border-gray-600/40" />
      <div className="absolute bottom-12 right-12 w-6 h-6 border-r border-b border-gray-600/40" />

      {/* Header Bar */}
      <div className="w-full max-w-6xl flex justify-between items-start z-10 relative">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-4 w-0.5 bg-[#D96B4A]/80"></div>
            <p className="text-[10px] tracking-[0.3em] text-[#D96B4A] uppercase font-medium">ADYATARA KISAH</p>
          </div>
          <h2 className="text-3xl md:text-[2.5rem] font-serif text-white mb-1 drop-shadow-md">
            Mengeksplorasi Jejak
          </h2>
          <p className="text-xs text-gray-400 font-light mb-8">Nusantara</p>

          <div className="w-full flex flex-col gap-2 max-w-5xl">
            <div className="h-[3px] w-full bg-gray-800/80 rounded-full overflow-hidden relative shadow-inner">
               <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#D96B4A] to-[#E86B52] w-[50%] rounded-full shadow-[0_0_10px_2px_rgba(232,107,82,0.4)]"></div>
            </div>
            <div className="flex justify-between items-center px-1">
               <span className="text-xl text-gray-500 font-light">Node ID: {node.id.slice(-4)}</span>
               <span className="text-xl text-[#D96B4A]">Aktif</span>
            </div>
          </div>
        </div>

        {/* Right Stats */}
        <div className="flex bg-[#0A0705]/80 border border-gray-800/80 p-0.5 relative backdrop-blur-sm self-start mt-2">
           <div className="absolute top-0 left-0 w-1.5 h-1.5 border-l border-t border-gray-600/50" />
           <div className="absolute top-0 right-0 w-1.5 h-1.5 border-r border-t border-gray-600/50" />
           <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-l border-b border-gray-600/50" />
           <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-r border-b border-gray-600/50" />

           <div className="px-6 py-3 border-r border-gray-800/60 flex flex-col items-center justify-center min-w-[100px]">
             <span className="text-[8px] tracking-[0.3em] text-gray-500 uppercase mb-1">SKOR</span>
             <span className="text-[#D96B4A] font-medium text-lg">{session.score}</span>
           </div>
           <div className="px-6 py-3 flex items-center justify-center gap-3 min-w-[120px]">
             <Clock className="w-4 h-4 text-gray-500" />
             <span className="text-gray-300 font-mono text-base font-light">--:--</span>
           </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* Dialogue Box */}
      <div className="w-full max-w-5xl z-10">
        <div className="bg-[#0A0705] border border-gray-800/80 p-10 relative">
          {/* Subtle corner ticks */}
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-700/50" />
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-gray-700/50" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-gray-700/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-700/50" />

          {/* Narator Badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-4 w-[3px] bg-[#D96B4A]"></div>
            <p className="text-[10px] tracking-[0.4em] text-[#D96B4A] uppercase font-medium">
              {node.type === "choice" ? "PILIHAN" : node.type === "ending" ? "AKHIR CERITA" : "NARATOR"}
            </p>
          </div>

          <p className="text-gray-200 text-[17px] leading-relaxed font-light mb-10 text-justify">
            {node.content}
          </p>

          <div className="h-px w-full bg-gray-800/60 mb-8" />

          {/* Choices */}
          <div className="space-y-4">
            {node.choices?.length > 0 ? (
                node.choices.map((choice: any, index: number) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id)}
                    className="w-full p-5 border border-gray-800/80 bg-transparent flex items-center gap-5 hover:border-[#D96B4A]/50 hover:bg-[#D96B4A]/5 cursor-pointer transition-all group text-left"
                  >
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-7 h-7 border border-gray-700/80 text-[11px] text-gray-500 font-mono group-hover:border-[#D96B4A]/50 group-hover:text-[#D96B4A] transition-colors">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <span className="text-gray-300 text-[14px] font-light group-hover:text-white transition-colors">
                      {choice.text}
                    </span>
                  </button>
                ))
            ) : (
                node.type === "ending" && (
                    <button
                        onClick={() => router.push(`/game/result?sessionId=${sessionId}`)}
                        className="w-full p-5 border border-[#D96B4A]/30 bg-[#D96B4A]/10 text-[#D96B4A] flex items-center justify-center gap-2 hover:bg-[#D96B4A]/20 transition-all font-serif"
                    >
                        Lihat Hasil Akhir Permainan
                    </button>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0705] flex items-center justify-center" />}>
            <GameContent />
        </Suspense>
    )
}
