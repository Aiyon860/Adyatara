"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, User, Save, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    session?.user?.avatarUrl || session?.user?.image || null
  );

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      bio: session?.user?.bio || "",
      avatarUrl: session?.user?.avatarUrl || "",
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
        
        // Update session with new data
        await update({
          user: {
            ...session?.user,
            name: values.name,
            email: values.email,
            bio: values.bio,
            avatarUrl: values.avatarUrl,
          },
        });
        
        router.push("/dashboard/profile");
        router.refresh();
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
    <div className="min-h-screen bg-[#0D0A08] text-[#F5F0EB] p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-2 text-[#9A8A7A] hover:text-[#F5F0EB] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Kembali ke Profil</span>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit Profil</h1>
        <p className="text-[#9A8A7A] text-sm">
          Perbarui informasi profil dan pengaturan akun Anda
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Profile Information */}
        <Card className="bg-[#1A1410] border-[#2E2318] relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#E8724A]/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#E8724A]/30" />
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#F5F0EB]">
              Informasi Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                className="space-y-6"
              >
                {/* Avatar Upload */}
                <div className="flex items-start gap-6">
                  <div className="relative">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-[#E8724A]"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#2E2318] border-2 border-[#E8724A] flex items-center justify-center">
                        <User className="w-12 h-12 text-[#9A8A7A]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <FormLabel className="text-[#F5F0EB]">Foto Profil</FormLabel>
                    <FormDescription className="text-[#9A8A7A] text-sm mb-3">
                      Upload foto profil Anda. Maksimal 5MB.
                    </FormDescription>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isUploadingAvatar}
                        className="border-[#E8724A] text-[#E8724A] hover:bg-[#E8724A]/10"
                        onClick={() => document.getElementById("avatar-upload")?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploadingAvatar ? "Mengunggah..." : "Upload Foto"}
                      </Button>
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
                </div>

                {/* Name */}
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F5F0EB]">Nama</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan nama Anda"
                          className="bg-[#0D0A08] border-[#2E2318] text-[#F5F0EB] focus:border-[#E8724A]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F5F0EB]">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="email@example.com"
                          className="bg-[#0D0A08] border-[#2E2318] text-[#F5F0EB] focus:border-[#E8724A]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bio */}
                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F5F0EB]">Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Ceritakan sedikit tentang diri Anda..."
                          className="bg-[#0D0A08] border-[#2E2318] text-[#F5F0EB] focus:border-[#E8724A] min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription className="text-[#9A8A7A] text-xs">
                        Maksimal 500 karakter
                      </FormDescription>
                      <FormMessage />
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

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-[#E8724A] hover:bg-[#F0956E] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-[#2E2318] text-[#9A8A7A] hover:bg-[#1A1410]"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="bg-[#1A1410] border-[#2E2318] relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#E8724A]/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#E8724A]/30" />
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#F5F0EB]">
              Ubah Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                className="space-y-4"
              >
                {/* Current Password */}
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F5F0EB]">
                        Password Saat Ini
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Masukkan password saat ini"
                          className="bg-[#0D0A08] border-[#2E2318] text-[#F5F0EB] focus:border-[#E8724A]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F5F0EB]">
                        Password Baru
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Masukkan password baru"
                          className="bg-[#0D0A08] border-[#2E2318] text-[#F5F0EB] focus:border-[#E8724A]"
                        />
                      </FormControl>
                      <FormDescription className="text-[#9A8A7A] text-xs">
                        Minimal 8 karakter, harus mengandung huruf besar, huruf
                        kecil, dan angka
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F5F0EB]">
                        Konfirmasi Password Baru
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Konfirmasi password baru"
                          className="bg-[#0D0A08] border-[#2E2318] text-[#F5F0EB] focus:border-[#E8724A]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#E8724A] hover:bg-[#F0956E] text-white"
                >
                  {isPending ? "Mengubah..." : "Ubah Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
