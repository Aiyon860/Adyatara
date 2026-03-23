import type { Story } from "narraleaf-react";

export interface StoryMeta {
  title: string;
  region: string;
  description: string;
  difficulty: string;
  coverImage: string;
}

type StoryModule = { default: Story; storyMeta: StoryMeta };

export const storyRegistry: Record<string, () => Promise<StoryModule>> = {
  "prambanan": () => import("./prambanan"),
  "timun-mas": () => import("./timun-mas"),
};

export const storyInfoMap: Record<string, { title: string; coverImage: string }> = {
  "prambanan": { title: "Legenda Candi Prambanan", coverImage: "/images/jawa-tengah.jpg" },
  "timun-mas": { title: "Legenda Timun Mas", coverImage: "/images/jawa-tengah.jpg" },
};

export const endingLabels: Record<string, { label: string; color: string }> = {
  best: { label: "Best Ending", color: "#F5C542" },
  good: { label: "Good Ending", color: "#4ADE80" },
  neutral: { label: "Neutral Ending", color: "#9CA3AF" },
  bad: { label: "Bad Ending", color: "#EF4444" },
};

export const regionStoryMap: Record<string, string> = {
  "sumatra": "",
  "jawa": "prambanan",
  "kalimantan": "",
  "sulawesi": "",
  "bali-nusa": "",
  "papua": "",
};

export const regionNames: Record<string, string> = {
  "sumatra": "SUMATRA",
  "jawa": "JAWA",
  "kalimantan": "KALIMANTAN",
  "sulawesi": "SULAWESI",
  "bali-nusa": "BALI & NUSA TENGGARA",
  "papua": "PAPUA",
};

export async function loadStory(slug: string): Promise<StoryModule | null> {
  const loader = storyRegistry[slug];
  if (!loader) return null;
  return loader();
}
