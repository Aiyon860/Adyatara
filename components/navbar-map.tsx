"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, Menu, X, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function StatusCard() {
  return (
    <Card className="bg-[#7C444F]/10 border border-[#E16A54]/30 backdrop-blur-sm w-96 rounded-none">
      <CardContent className="flex items-center">
        <div className="flex items-center gap-4 flex-1 justify-center">
          <Trophy className="size-6 text-[#E16A54]" />
          <div className="flex flex-col gap-y-1">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Level
            </span>
            <span className="text-xl text-white leading-none">5</span>
          </div>
        </div>
        <div className="w-px h-8  bg-[#E16A54]/30" />
        <div className="flex items-center gap-4 flex-1 justify-center">
          <Star className="size-6 text-[#E16A54]" />
          <div className="flex flex-col gap-y-1">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Progress
            </span>
            <span className="text-xl text-white leading-none">25%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const percent = Math.round((value / max) * 100);

  return (
    <div className="flex flex-col gap-1 min-w-30 w-44">
      <div className="flex justify-between text-sm text-gray-500 uppercase tracking-wider">
        <span>JAWA TENGAH</span>
        <span className="text-[#E16A54]">{value / 10}%</span>
      </div>
      <div className="h-0.5 rounded-none bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-none bg-[#F39E60]"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function NavbarMap() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-20">
      <div className="flex items-center justify-between px-10 md:px-14 py-4 bg-[#080407]/80 backdrop-blur-md border-b border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="size-14 border-2 border-amber-950 flex items-center justify-center"></div>
          <span className="text-gray-300 font-kurale text-lg hidden sm:block tracking-[0.5rem]">
            ADYATARA
          </span>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-y-3 gap-x-8">
          <StatusCard />
          <ProgressBar value={740} max={1000} />
          <div className="w-px h-8 bg-white/10 mx-1" />
          <div className="size-14 border-2 border-amber-950 flex items-center justify-center">
            <span><LogOut className="size-6 text-white" /></span>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-[#E8C0A8] cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#080407]/90 backdrop-blur-md border-b border-white/5"
          >
            <div className="flex flex-col gap-3 p-4">
              <StatusCard />
              <ProgressBar value={740} max={1000} />
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5 w-full cursor-pointer"
              >
                <LogOut className="size-4" />
                Keluar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
