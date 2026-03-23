"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, User, Upload, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile, updatePassword } from "@/actions/profile";
import { profileSchema, passwordSchema, type ProfileFormValues, type PasswordFormValues } from "@/lib/validations/profile";

export default function ProfileEditForm() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update avatar preview and form values when session changes
  useEffect(() => {
    if (session?.user) {
      setAvatarPreview(session.user.avatarUrl || session.user.image || null);
      
      // Update form values when session loads
      profileForm.reset({
        name: session.user.name || "",
        email: session.user.email || "",
        bio: session.user.bio || "",
        avatarUrl: session.user.avatarUrl || "",
      });
    }
  }, [session?.user]);

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      avatarUrl: "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitProfile = (values: ProfileFormValues) => {
    startTransition(async () => {
      const result = await updateProfile(values);
      
      if (result.success) {
        toast.success("Profil berhasil diperbarui!");
        
        // Trigger session refresh with new data
        // This will call JWT callback with trigger: "update" and update the token
        await update({
          name: values.name,
          email: values.email,
          bio: values.bio,
          avatarUrl: values.avatarUrl,
        });
        
        // Refresh the router cache first to ensure server components get fresh data
        router.refresh();
        
        // Small delay to ensure refresh is processed, then navigate
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push("/dashboard/profile");
      } else {
        toast.error(result.error || "Gagal memperbarui profil");
      }
    });
  };

  const onSubmitPassword = (values: PasswordFormValues) => {
    startTransition(async () => {
      const result = await updatePassword(values);
      
      if (result.success) {
        toast.success("Password berhasil diubah!");
        passwordForm.reset();
      } else {
        toast.error(result.error || "Gagal mengubah password");
      }
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.url) {
        setAvatarPreview(data.url);
        profileForm.setValue("avatarUrl", data.url);
        toast.success("Foto berhasil diunggah!");
      } else {
        toast.error(data.error || "Gagal mengunggah foto");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal mengunggah foto");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0705] text-[#F5F0EB] p-6 md:p-8">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-[11px] tracking-[0.2em] uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Profil
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#D96B4A]/30"></div>
          <p className="text-[9px] tracking-[0.3em] text-[#D96B4A] uppercase font-medium">PENGATURAN</p>
        </div>
        <h1 className="text-4xl font-serif text-white mb-3">Edit Profil</h1>
        <p className="text-[13px] text-gray-400 font-light">
          Perbarui informasi profil dan pengaturan akun Anda
        </p>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Profile Information */}
        <div className="relative p-8 bg-[#0D0907] border border-transparent group">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />

          <h2 className="text-lg font-serif text-white mb-8">Informasi Profil</h2>

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-start gap-6 mb-8">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-[#D96B4A]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-[#D96B4A] flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] tracking-[0.2em] text-gray-300 uppercase font-medium mb-2">FOTO PROFIL</p>
                  <p className="text-[13px] text-gray-500 mb-4">Upload foto profil Anda. Maksimal 5MB.</p>
                  <button
                    type="button"
                    disabled={isUploadingAvatar}
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-800 text-[11px] tracking-[0.2em] text-gray-300 hover:border-[#D96B4A]/50 hover:text-white transition-colors uppercase"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploadingAvatar ? "MENGUNGGAH..." : "UPLOAD FOTO"}
                  </button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                  />
                </div>
              </div>

              {/* Name */}
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] tracking-[0.2em] text-gray-300 uppercase font-medium">NAMA</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Masukkan nama Anda"
                          className="bg-[#0D0907] border border-gray-800 rounded-none px-4 py-6 text-[13px] text-gray-300 placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-[#D96B4A]/50 focus-visible:border-[#D96B4A]/50"
                        />
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-600/50 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-gray-600/50 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-gray-600/50 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-600/50 pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#D96B4A] text-xs font-light" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] tracking-[0.2em] text-gray-300 uppercase font-medium">EMAIL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="email"
                          placeholder="email@example.com"
                          className="bg-[#0D0907] border border-gray-800 rounded-none px-4 py-6 text-[13px] text-gray-300 placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-[#D96B4A]/50 focus-visible:border-[#D96B4A]/50"
                        />
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-600/50 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-gray-600/50 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-gray-600/50 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-600/50 pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#D96B4A] text-xs font-light" />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={profileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] tracking-[0.2em] text-gray-300 uppercase font-medium">BIO</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          {...field}
                          placeholder="Ceritakan sedikit tentang diri Anda..."
                          className="bg-[#0D0907] border border-gray-800 rounded-none px-4 py-4 text-[13px] text-gray-300 placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-[#D96B4A]/50 focus-visible:border-[#D96B4A]/50 min-h-[120px] resize-none"
                        />
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-600/50 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-gray-600/50 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-gray-600/50 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-600/50 pointer-events-none" />
                      </div>
                    </FormControl>
                    <p className="text-[11px] text-gray-500">Maksimal 500 karakter</p>
                    <FormMessage className="text-[#D96B4A] text-xs font-light" />
                  </FormItem>
                )}
              />

              {/* Avatar URL (hidden, managed by upload) */}
              <FormField
                control={profileForm.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E86B52] hover:bg-[#D96B4A] text-white text-xs font-semibold rounded-none transition-all tracking-[0.2em] uppercase disabled:opacity-50"
                >
                  {isPending ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
                  {!isPending && <ArrowRight className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-8 py-4 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 text-xs rounded-none transition-all tracking-[0.2em] uppercase"
                >
                  BATAL
                </button>
              </div>
            </form>
          </Form>
        </div>

        {/* Change Password */}
        <div className="relative p-8 bg-[#0D0907] border border-transparent group">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-800 group-hover:border-[#D96B4A]/60 transition-colors" />

          <h2 className="text-lg font-serif text-white mb-8">Ubah Password</h2>

          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
              {/* Current Password */}
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] tracking-[0.2em] text-gray-300 uppercase font-medium">PASSWORD SAAT INI</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="bg-[#0D0907] border border-gray-800 rounded-none px-4 py-6 text-[13px] text-gray-300 placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-[#D96B4A]/50 focus-visible:border-[#D96B4A]/50 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-600/50 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-gray-600/50 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-gray-600/50 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-600/50 pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#D96B4A] text-xs font-light" />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] tracking-[0.2em] text-gray-300 uppercase font-medium">PASSWORD BARU</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showNewPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="bg-[#0D0907] border border-gray-800 rounded-none px-4 py-6 text-[13px] text-gray-300 placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-[#D96B4A]/50 focus-visible:border-[#D96B4A]/50 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-600/50 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-gray-600/50 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-gray-600/50 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-600/50 pointer-events-none" />
                      </div>
                    </FormControl>
                    <p className="text-[11px] text-gray-500">Minimal 8 karakter, harus mengandung huruf besar, huruf kecil, dan angka</p>
                    <FormMessage className="text-[#D96B4A] text-xs font-light" />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] tracking-[0.2em] text-gray-300 uppercase font-medium">KONFIRMASI PASSWORD BARU</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="bg-[#0D0907] border border-gray-800 rounded-none px-4 py-6 text-[13px] text-gray-300 placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-[#D96B4A]/50 focus-visible:border-[#D96B4A]/50 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-600/50 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-gray-600/50 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-gray-600/50 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-600/50 pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#D96B4A] text-xs font-light" />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E86B52] hover:bg-[#D96B4A] text-white text-xs font-semibold rounded-none transition-all tracking-[0.2em] uppercase disabled:opacity-50"
                >
                  {isPending ? "MENGUBAH..." : "UBAH PASSWORD"}
                  {!isPending && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
