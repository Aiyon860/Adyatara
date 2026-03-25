"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex bg-[#0A0705] text-[#F5F0EB]">
      {/* Left side - Image & Text */}
      <div
        className="hidden md:flex md:w-[45%] relative overflow-hidden flex-col justify-end p-16"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10, 7, 5, 0.4) 0%, rgba(10, 7, 5, 0.9) 100%), url('/images/auth-background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 max-w-md">
          <p className="text-[10px] tracking-[0.3em] text-[#D96B4A] uppercase font-medium mb-6">
            INTERACTIVE STORYTELLING
          </p>
          <h2 className="text-5xl md:text-6xl font-serif text-white leading-[1.1] mb-6 drop-shadow-lg">
            Kembali ke
            <br />
            Nusantara
          </h2>
          <p className="text-[13px] text-gray-300 font-light leading-relaxed">
            Lanjutkan perjalananmu melalui cerita rakyat Indonesia. Kisahmu
            menunggumu.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-[55%] flex flex-col justify-center px-8 md:px-24 py-12 relative">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-14 md:mb-20 hidden md:flex items-center gap-4">
            <div className="w-8 h-8 border border-gray-600"></div>
            <span className="text-[11px] tracking-[0.4em] font-serif text-gray-300 uppercase">
              ADYATARA
            </span>
          </div>

          <div className="mb-12">
            <h1 className="text-[2.5rem] font-serif text-white mb-3">
              Selamat Datang
            </h1>
            <p className="text-[13px] text-gray-400 font-light">
              Masuk untuk melanjutkan perjalanan budayamu
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 flex items-center justify-center gap-4 opacity-70">
            <div className="h-px bg-gray-800 flex-1"></div>
            <span className="text-[9px] tracking-[0.3em] text-gray-500 uppercase">
              ATAU
            </span>
            <div className="h-px bg-gray-800 flex-1"></div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[13px] text-gray-400 font-light">
              Belum punya akun?{" "}
              <Link
                href="/auth/register"
                className="text-[#D96B4A] hover:text-[#E86B52] transition-colors font-medium"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
