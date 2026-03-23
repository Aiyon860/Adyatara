import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { constructMetadata } from "@/lib/metadata";
import {
  Trophy,
  Award,
  BookOpen,
  Lightbulb,
  Clock,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Dashboard - Statistik",
  description: "Lihat statistik permainan dan progress Anda",
  path: "/dashboard",
});

const REGIONS = [
  "Sumatra",
  "Jawa",
  "Kalimantan",
  "Sulawesi",
  "Bali-Nusa Tenggara",
  "Papua",
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Fetch user data
  const userData = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      level: true,
      totalScore: true,
      createdAt: true,
      gameSessions: {
        include: {
          story: true,
        },
        orderBy: {
          startedAt: "desc",
        },
      },
      userKnowledges: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!userData) {
    redirect("/auth/signin");
  }

  // Calculate stats
  const totalScore = userData.totalScore || 0;
  const level = userData.level || 1;
  const completedStories = userData.gameSessions.filter(
    (s) => s.status === "completed"
  ).length;
  const totalStories = await db.story.count();
  const knowledgeUnlocked = userData.userKnowledges.length;
  const recentActivities = userData.gameSessions.slice(0, 5);

  // Calculate progress to next level (simple formula: level * 1000)
  const currentLevelThreshold = (level - 1) * 1000;
  const nextLevelThreshold = level * 1000;
  const levelProgress =
    ((totalScore - currentLevelThreshold) /
      (nextLevelThreshold - currentLevelThreshold)) *
    100;

  // Calculate region progress
  const storiesByRegion = await db.story.groupBy({
    by: ["region"],
    _count: {
      id: true,
    },
  });

  const completedByRegion = await db.gameSession.groupBy({
    by: ["storyId"],
    where: {
      userId: session.user.id,
      status: "completed",
    },
    _count: {
      id: true,
    },
  });

  const completedStoryIds = completedByRegion.map((g) => g.storyId);
  const completedStoriesData = await db.story.findMany({
    where: {
      id: {
        in: completedStoryIds,
      },
    },
    select: {
      region: true,
    },
  });

  const regionProgress = REGIONS.map((region) => {
    const total =
      storiesByRegion.find((s) => s.region === region)?._count.id || 0;
    const completed = completedStoriesData.filter(
      (s) => s.region === region
    ).length;
    return {
      name: region,
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Baru saja";
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days === 1) return "1 hari yang lalu";
    return `${days} hari yang lalu`;
  };

  return (
    <div className="min-h-screen bg-[#0A0705] text-[#F5F0EB] p-6 md:p-8">
      {/* Welcome Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#D96B4A]/30"></div>
          <p className="text-[9px] tracking-[0.3em] text-[#D96B4A] uppercase font-medium">DASHBOARD</p>
        </div>
        <h1 className="text-4xl font-serif text-white mb-3">
          Selamat Datang, {userData.name || "Penjelajah"}!
        </h1>
        <p className="text-[13px] text-gray-400 font-light">
          Lihat progress dan pencapaian Anda dalam menjelajahi budaya Nusantara
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Score */}
        <div className="relative p-6 bg-[#0D0907] border border-transparent group min-h-[140px]">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />

          <div className="mb-4 inline-flex p-3 border border-gray-800/80 group-hover:border-[#D96B4A]/30 rounded-sm transition-colors relative">
            <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-gray-600"></div>
            <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-gray-600"></div>
            <Trophy className="w-5 h-5 text-[#D96B4A]" strokeWidth={2} />
          </div>
          <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase mb-2">Total Skor</p>
          <p className="text-3xl font-serif text-[#D96B4A]">
            {totalScore.toLocaleString()}
          </p>
        </div>

        {/* Level */}
        <div className="relative p-6 bg-[#0D0907] border border-transparent group min-h-[140px]">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />

          <div className="mb-4 inline-flex p-3 border border-gray-800/80 group-hover:border-[#D96B4A]/30 rounded-sm transition-colors relative">
            <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-gray-600"></div>
            <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-gray-600"></div>
            <Award className="w-5 h-5 text-[#D96B4A]" strokeWidth={2} />
          </div>
          <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase mb-2">Level</p>
          <div className="flex items-end gap-2 mb-3">
            <p className="text-3xl font-serif text-white">{level}</p>
            <p className="text-sm text-gray-500 mb-1">/ Level {level + 1}</p>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D96B4A] to-[#E86B52] rounded-full transition-all"
              style={{ width: `${Math.min(levelProgress, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-2">
            {Math.round(levelProgress)}% menuju level berikutnya
          </p>
        </div>

        {/* Stories Completed */}
        <div className="relative p-6 bg-[#0D0907] border border-transparent group min-h-[140px]">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />

          <div className="mb-4 inline-flex p-3 border border-gray-800/80 group-hover:border-[#D96B4A]/30 rounded-sm transition-colors relative">
            <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-gray-600"></div>
            <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-gray-600"></div>
            <BookOpen className="w-5 h-5 text-[#D96B4A]" strokeWidth={2} />
          </div>
          <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase mb-2">Cerita Selesai</p>
          <p className="text-3xl font-serif text-white">{completedStories}</p>
          <p className="text-[10px] text-gray-500 mt-1">dari {totalStories} cerita</p>
        </div>

        {/* Knowledge Unlocked */}
        <div className="relative p-6 bg-[#0D0907] border border-transparent group min-h-[140px]">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />

          <div className="mb-4 inline-flex p-3 border border-gray-800/80 group-hover:border-[#D96B4A]/30 rounded-sm transition-colors relative">
            <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-gray-600"></div>
            <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-gray-600"></div>
            <Lightbulb className="w-5 h-5 text-[#D96B4A]" strokeWidth={2} />
          </div>
          <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase mb-2">Pengetahuan</p>
          <p className="text-3xl font-serif text-white">{knowledgeUnlocked}</p>
          <p className="text-[10px] text-gray-500 mt-1">pengetahuan terbuka</p>
        </div>
      </div>

      {/* Region Progress & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Region Progress */}
        <div className="relative p-8 bg-[#0D0907] border border-transparent group">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />

          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex p-2 border border-gray-800/80 rounded-sm relative">
              <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-gray-600"></div>
              <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-gray-600"></div>
              <TrendingUp className="w-4 h-4 text-[#D96B4A]" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-serif text-white">Progress Per Region</h3>
          </div>

          <div className="space-y-5">
            {regionProgress.map((region) => (
              <div key={region.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] text-gray-300">{region.name}</span>
                  <span className="text-[11px] text-gray-500">
                    {region.completed}/{region.total}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D96B4A] to-[#E86B52] rounded-full transition-all"
                    style={{ width: `${region.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {regionProgress.length === 0 && (
              <p className="text-[13px] text-gray-500 text-center py-8">
                Belum ada progress di region manapun.{" "}
                <Link href="/explore" className="text-[#D96B4A] hover:text-[#E86B52] transition-colors">
                  Mulai jelajah sekarang!
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="relative p-8 bg-[#0D0907] border border-transparent group">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />

          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex p-2 border border-gray-800/80 rounded-sm relative">
              <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-gray-600"></div>
              <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-gray-600"></div>
              <Clock className="w-4 h-4 text-[#D96B4A]" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-serif text-white">Aktivitas Terbaru</h3>
          </div>

          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b border-gray-800/50 last:border-0 last:pb-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      activity.status === "completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-[13px] text-gray-300">
                      {activity.status === "completed" ? "Selesai" : "Memainkan"}{" "}
                      &quot;{activity.story.title}&quot;
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {formatDate(activity.startedAt)} •{" "}
                      {activity.status === "completed"
                        ? `Skor: ${activity.score}`
                        : "Dalam progress"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[13px] text-gray-500 text-center py-8">
                Belum ada aktivitas.{" "}
                <Link href="/explore" className="text-[#D96B4A] hover:text-[#E86B52] transition-colors">
                  Mulai petualangan Anda!
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Achievements Section (Placeholder) */}
      <div className="relative p-8 bg-[#0D0907] border border-transparent group">
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
        <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />

        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex p-2 border border-gray-800/80 rounded-sm relative">
            <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-gray-600"></div>
            <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-gray-600"></div>
            <Trophy className="w-4 h-4 text-[#D96B4A]" strokeWidth={2} />
          </div>
          <h3 className="text-lg font-serif text-white">Pencapaian</h3>
        </div>

        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-[13px] text-gray-500">
            Sistem pencapaian akan segera hadir...
          </p>
        </div>
      </div>
    </div>
  );
}
