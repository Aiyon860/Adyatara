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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-[#0D0A08] text-[#F5F0EB] p-6 md:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Selamat Datang, {userData.name || "Penjelajah"}!
        </h1>
        <p className="text-[#9A8A7A] text-sm">
          Lihat progress dan pencapaian Anda dalam menjelajahi budaya Nusantara
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Score */}
        <Card className="bg-[#1A1410] border-[#2E2318] relative overflow-hidden group hover:border-[#E8724A]/50 transition-colors">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#E8724A]/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#E8724A]/30" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#9A8A7A] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#E8724A]" />
              Total Skor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E8724A]">
              {totalScore.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Level */}
        <Card className="bg-[#1A1410] border-[#2E2318] relative overflow-hidden group hover:border-[#E8724A]/50 transition-colors">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#E8724A]/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#E8724A]/30" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#9A8A7A] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#E8724A]" />
              Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-3xl font-bold text-[#F5F0EB]">{level}</div>
              <div className="text-sm text-[#9A8A7A] mb-1">
                / Level {level + 1}
              </div>
            </div>
            <div className="w-full h-2 bg-[#2E2318] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E8724A] to-[#F0956E] rounded-full transition-all"
                style={{ width: `${Math.min(levelProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-[#9A8A7A] mt-1">
              {Math.round(levelProgress)}% menuju level berikutnya
            </div>
          </CardContent>
        </Card>

        {/* Stories Completed */}
        <Card className="bg-[#1A1410] border-[#2E2318] relative overflow-hidden group hover:border-[#E8724A]/50 transition-colors">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#E8724A]/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#E8724A]/30" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#9A8A7A] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#E8724A]" />
              Cerita Selesai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#F5F0EB]">
              {completedStories}
            </div>
            <div className="text-xs text-[#9A8A7A] mt-1">
              dari {totalStories} cerita
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Unlocked */}
        <Card className="bg-[#1A1410] border-[#2E2318] relative overflow-hidden group hover:border-[#E8724A]/50 transition-colors">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#E8724A]/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#E8724A]/30" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#9A8A7A] flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#E8724A]" />
              Pengetahuan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#F5F0EB]">
              {knowledgeUnlocked}
            </div>
            <div className="text-xs text-[#9A8A7A] mt-1">
              pengetahuan terbuka
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Region Progress & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Region Progress */}
        <Card className="bg-[#1A1410] border-[#2E2318] relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#E8724A]/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#E8724A]/30" />
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#F5F0EB] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#E8724A]" />
              Progress Per Region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {regionProgress.map((region) => (
              <div key={region.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-[#F5F0EB]">
                    {region.name}
                  </span>
                  <span className="text-xs text-[#9A8A7A]">
                    {region.completed}/{region.total}
                  </span>
                </div>
                <div className="w-full h-2 bg-[#2E2318] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E8724A] to-[#F0956E] rounded-full transition-all"
                    style={{ width: `${region.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {regionProgress.length === 0 && (
              <p className="text-sm text-[#9A8A7A] text-center py-8">
                Belum ada progress di region manapun.{" "}
                <Link
                  href="/explore"
                  className="text-[#E8724A] hover:underline"
                >
                  Mulai jelajah sekarang!
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[#1A1410] border-[#2E2318] relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#E8724A]/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#E8724A]/30" />
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#F5F0EB] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#E8724A]" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-3 border-b border-[#2E2318] last:border-0 last:pb-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      activity.status === "completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#F5F0EB]">
                      {activity.status === "completed"
                        ? "Selesai"
                        : "Memainkan"}{" "}
                      &quot;{activity.story.title}&quot;
                    </p>
                    <p className="text-xs text-[#9A8A7A] mt-0.5">
                      {formatDate(activity.startedAt)} •{" "}
                      {activity.status === "completed"
                        ? `Skor: ${activity.score}`
                        : "Dalam progress"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#9A8A7A] text-center py-8">
                Belum ada aktivitas.{" "}
                <Link
                  href="/explore"
                  className="text-[#E8724A] hover:underline"
                >
                  Mulai petualangan Anda!
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section (Placeholder) */}
      <Card className="bg-[#1A1410] border-[#2E2318] relative">
        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#E8724A]/30" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#E8724A]/30" />
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#F5F0EB] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#E8724A]" />
            Pencapaian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-[#9A8A7A] mx-auto mb-4 opacity-50" />
            <p className="text-[#9A8A7A] text-sm">
              Sistem pencapaian akan segera hadir...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
