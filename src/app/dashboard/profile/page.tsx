import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { constructMetadata } from "@/lib/metadata";
import { User, Mail, Calendar, Award, Trophy, Edit } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#0A0705] text-[#F5F0EB] p-6 md:p-8">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#D96B4A]/30"></div>
            <p className="text-[9px] tracking-[0.3em] text-[#D96B4A] uppercase font-medium">PROFIL</p>
          </div>
          <h1 className="text-4xl font-serif text-white mb-3">Profil Saya</h1>
          <p className="text-[13px] text-gray-400 font-light">
            Informasi akun dan statistik Anda
          </p>
        </div>
        <Link
          href="/dashboard/profile/edit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E86B52] hover:bg-[#D96B4A] text-white text-xs font-semibold rounded-none transition-all tracking-[0.2em] uppercase"
        >
          <Edit className="w-4 h-4" />
          EDIT PROFIL
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 relative p-8 bg-[#0D0907] border border-transparent group">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userData.name || "User"}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#D96B4A]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-[#D96B4A] flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-500" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#D96B4A] rounded-full flex items-center justify-center text-xs font-bold text-white">
                {userData.level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-serif text-white mb-2">
                {userData.name || "Penjelajah"}
              </h2>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Mail className="w-4 h-4" />
                <span className="text-[13px]">{userData.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-[13px]">
                  Bergabung sejak {formatDate(userData.createdAt)}
                </span>
              </div>

              {/* Bio */}
              {userData.bio && (
                <div className="mt-4 p-4 bg-[#0A0705] border border-gray-800 relative">
                  <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-700" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-700" />
                  <p className="text-[13px] text-gray-400 italic font-light">
                    &quot;{userData.bio}&quot;
                  </p>
                </div>
              )}
              {!userData.bio && (
                <div className="mt-4 p-4 bg-[#0A0705] border border-dashed border-gray-800 relative">
                  <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-700" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-700" />
                  <p className="text-[13px] text-gray-500">
                    Belum ada bio. Tambahkan bio Anda dengan{" "}
                    <Link
                      href="/dashboard/profile/edit"
                      className="text-[#D96B4A] hover:text-[#E86B52] transition-colors"
                    >
                      edit profil
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="relative p-8 bg-[#0D0907] border border-transparent group">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />

          <h3 className="text-lg font-serif text-white mb-6">Statistik Ringkas</h3>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="inline-flex p-3 border border-gray-800/80 rounded-sm relative">
                <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-gray-600"></div>
                <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-gray-600"></div>
                <Award className="w-5 h-5 text-[#D96B4A]" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">Level</p>
                <p className="text-2xl font-serif text-white">{userData.level}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="inline-flex p-3 border border-gray-800/80 rounded-sm relative">
                <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-gray-600"></div>
                <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-gray-600"></div>
                <Trophy className="w-5 h-5 text-[#D96B4A]" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">Total Skor</p>
                <p className="text-2xl font-serif text-white">{userData.totalScore.toLocaleString()}</p>
              </div>
            </div>

            <div className="h-px bg-gray-800 my-4" />

            <div>
              <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase mb-4">Pencapaian</p>
              <div className="space-y-3">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-400">Cerita Selesai</span>
                  <span className="text-white font-medium">{completedStories}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-400">Pengetahuan Terbuka</span>
                  <span className="text-white font-medium">{knowledgeUnlocked}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
