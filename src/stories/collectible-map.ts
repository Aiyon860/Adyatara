/**
 * Mapping: storySlug -> ending -> collectible names to award.
 * Kept in a separate file (no narraleaf-react dependency) so it can
 * be safely imported from server-side API routes.
 */
export const storyCollectibleMap: Record<string, Record<string, string[]>> = {
  prambanan: {
    best: [
      "Candi Prambanan",
      "Keris Yogyakarta",
      "Gamelan Jawa",
    ],
    neutral: [
      "Wayang Kulit",
      "Batik Parang",
    ],
    bad: [
      "Gudeg",
    ],
  },
  "timun-mas": {
    best: [
      "Malioboro",
      "Angklung",
      "Nasi Pecel",
    ],
    bad: [
      "Rumah Joglo",
      "Jamu Tradisional",
      "Lumpia Semarang",
    ],
  },
  "danau-tondano": {
    best: [
      "Danau Tondano",
      "Watu Pinabetengan",
      "Monumen Yesus Memberkati",
      "Rumah Woloan",
      "Pedang Bara Sangihe",
    ],
    neutral: [
      "Kolintang",
      "Cakalang Fufu",
      "Alat Musik Kolintang",
    ],
    bad: [
      "Pakaian Adat Minahasa",
      "Tinutuan (Bubur Manado)",
      "Tari Kabasaran",
      "Tinutuan",
    ],
  },
  "malin-kundang": {
    best: [
      "Jam Gadang",
      "Rendang",
    ],
    neutral: [
      "Rumah Gadang",
      "Tari Piring",
    ],
    bad: [
      "Songket Minang",
      "Kerupuk Sanjai",
    ],
  },
};
