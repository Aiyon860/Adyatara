import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { constructMetadata } from "@/lib/metadata";
import { User, Mail, Calendar, Award, Trophy, Edit } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = constructMetadata({
  title: "Profile",
  description: "Lihat dan kelola profil Anda",
  path: "/dashboard/profile",
});

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userData = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      bio: true,
      avatarUrl: true,
      image: true,
      level: true,
      totalScore: true,
      createdAt: true,
      gameSessions: {
        where: {
          status: "completed",
        },
        select: {
          id: true,
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

  const avatarUrl = userData.avatarUrl || userData.image || null;
  const completedStories = userData.gameSessions.length;
  const knowledgeUnlocked = userData.userKnowledges.length;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#0D0A08] text-[#F5F0EB] p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profil Saya</h1>
          <p className="text-[#9A8A7A] text-sm">
            Informasi akun dan statistik Anda
          </p>
        </div>
        <Link href="/dashboard/profile/edit">
          <Button className="bg-[#E8724A] hover:bg-[#F0956E] text-white">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profil
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2 bg-[#1A1410] border-[#2E2318] relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#E8724A]/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#E8724A]/30" />
          <CardHeader className="pb-4">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userData.name || "User"}
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#E8724A]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#2E2318] border-2 border-[#E8724A] flex items-center justify-center">
                    <User className="w-12 h-12 text-[#9A8A7A]" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#E8724A] rounded-full flex items-center justify-center text-xs font-bold">
                  {userData.level}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#F5F0EB] mb-1">
                  {userData.name || "Penjelajah"}
                </h2>
                <div className="flex items-center gap-2 text-[#9A8A7A] mb-3">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{userData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[#9A8A7A] mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Bergabung sejak {formatDate(userData.createdAt)}
                  </span>
                </div>

                {/* Bio */}
                {userData.bio && (
                  <div className="mt-4 p-4 bg-[#0D0A08] rounded-lg border border-[#2E2318]">
                    <p className="text-sm text-[#9A8A7A] italic">
                      &quot;{userData.bio}&quot;
                    </p>
                  </div>
                )}
                {!userData.bio && (
                  <div className="mt-4 p-4 bg-[#0D0A08] rounded-lg border border-[#2E2318] border-dashed">
                    <p className="text-sm text-[#9A8A7A]">
                      Belum ada bio. Tambahkan bio Anda dengan{" "}
                      <Link
                        href="/dashboard/profile/edit"
                        className="text-[#E8724A] hover:underline"
                      >
                        edit profil
                      </Link>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Summary */}
        <Card className="bg-[#1A1410] border-[#2E2318] relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#E8724A]/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#E8724A]/30" />
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#F5F0EB]">
              Statistik Ringkas
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#E8724A]/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-[#E8724A]" />
              </div>
              <div>
                <p className="text-xs text-[#9A8A7A] uppercase tracking-wider">
                  Level
                </p>
                <p className="text-2xl font-bold text-[#F5F0EB]">
                  {userData.level}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#E8724A]/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#E8724A]" />
              </div>
              <div>
                <p className="text-xs text-[#9A8A7A] uppercase tracking-wider">
                  Total Skor
                </p>
                <p className="text-2xl font-bold text-[#F5F0EB]">
                  {userData.totalScore.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="h-px bg-[#2E2318]" />

            <div>
              <p className="text-xs text-[#9A8A7A] uppercase tracking-wider mb-2">
                Pencapaian
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9A8A7A]">Cerita Selesai</span>
                  <span className="text-[#F5F0EB] font-medium">
                    {completedStories}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9A8A7A]">Pengetahuan Terbuka</span>
                  <span className="text-[#F5F0EB] font-medium">
                    {knowledgeUnlocked}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
