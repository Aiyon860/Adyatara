import {
  Scene,
  Character,
  Story,
  Menu,
  Script,
  Image,
  Sound,
} from "narraleaf-react";
import { addScore, setEnding, unlockKnowledge } from "@/lib/game-utils";

// --- PENGATURAN KARAKTER ---
const narrator = new Character("Narator", { color: "#9A8A7A" });
const mbokSrini = new Character("Mbok Srini", { color: "#EAA87E" });
const timunMas = new Character("Timun Mas", { color: "#F5C542" });
const butoIjo = new Character("Buto Ijo", { color: "#E8724A" });
const pertapa = new Character("Pertapa Sakti", { color: "#F5F0EB" });

// --- GAMBAR EKSPRESI KARAKTER ---
const IMG = { zoom: 0.65, position: { yalign: 0.45, xalign: 0.5 } };

const imgMbok1 = new Image({
  src: "/images/stories/timun-mas/chars/mboksrini/1.webp",
  ...IMG,
});
const imgMbok2 = new Image({
  src: "/images/stories/timun-mas/chars/mboksrini/2.webp",
  ...IMG,
});
const imgMbok3 = new Image({
  src: "/images/stories/timun-mas/chars/mboksrini/3.webp",
  ...IMG,
});
const imgMbok4 = new Image({
  src: "/images/stories/timun-mas/chars/mboksrini/4.webp",
  ...IMG,
});

const imgTimun1 = new Image({
  src: "/images/stories/timun-mas/chars/timunmas/1.webp",
  ...IMG,
});
const imgTimun2 = new Image({
  src: "/images/stories/timun-mas/chars/timunmas/2.webp",
  ...IMG,
});
const imgTimun3 = new Image({
  src: "/images/stories/timun-mas/chars/timunmas/3.webp",
  ...IMG,
});
const imgTimun4 = new Image({
  src: "/images/stories/timun-mas/chars/timunmas/4.webp",
  ...IMG,
});
const imgTimun5 = new Image({
  src: "/images/stories/timun-mas/chars/timunmas/5.webp",
  ...IMG,
});

const imgButo1 = new Image({
  src: "/images/stories/timun-mas/chars/butoijo/1.webp",
  ...IMG,
});
const imgButo2 = new Image({
  src: "/images/stories/timun-mas/chars/butoijo/2.webp",
  ...IMG,
});
const imgButo3 = new Image({
  src: "/images/stories/timun-mas/chars/butoijo/3.webp",
  ...IMG,
});
const imgButo4 = new Image({
  src: "/images/stories/timun-mas/chars/butoijo/4.webp",
  ...IMG,
});

const imgPertapa1 = new Image({
  src: "/images/stories/timun-mas/chars/pertapa/1.webp",
  ...IMG,
});
const imgPertapa2 = new Image({
  src: "/images/stories/timun-mas/chars/pertapa/2.webp",
  ...IMG,
});
const imgPertapa3 = new Image({
  src: "/images/stories/timun-mas/chars/pertapa/3.webp",
  ...IMG,
});
const imgPertapa4 = new Image({
  src: "/images/stories/timun-mas/chars/pertapa/4.webp",
  ...IMG,
});

// --- BACKGROUND MUSIC (BGM) ---
const bgm1 = new Sound({
  src: "/music/timun-mas/1.mp3",
  loop: true,
  volume: 0.2,
}); // Desa Damai
const bgm2 = new Sound({
  src: "/music/timun-mas/2.mp3",
  loop: true,
  volume: 0.2,
}); // Raksasa / Menegangkan
const bgm3 = new Sound({
  src: "/music/timun-mas/3.mp3",
  loop: true,
  volume: 0.2,
}); // Gua / Magis
const bgm4 = new Sound({
  src: "/music/timun-mas/4.mp3",
  loop: true,
  volume: 0.2,
}); // Pengejaran Cepat
const bgm5 = new Sound({
  src: "/music/timun-mas/5.mp3",
  loop: true,
  volume: 0.2,
}); // Rawa Mendidih / Klimaks

// --- VOICE ACTING ---
// Mbok Srini
const vMbok1 = new Sound({ src: "/audio/timun-mas/mboksrini/1.mp3" });
const vMbok2 = new Sound({ src: "/audio/timun-mas/mboksrini/2.mp3" });
const vMbok3 = new Sound({ src: "/audio/timun-mas/mboksrini/3.mp3" });
const vMbok4 = new Sound({ src: "/audio/timun-mas/mboksrini/4.mp3" });
const vMbok5 = new Sound({ src: "/audio/timun-mas/mboksrini/5.mp3" });

// Timun Mas
const vTimun1 = new Sound({ src: "/audio/timun-mas/timunmas/1.mp3" });
const vTimun2 = new Sound({ src: "/audio/timun-mas/timunmas/2.mp3" });
const vTimun3 = new Sound({ src: "/audio/timun-mas/timunmas/3.mp3" });
const vTimun4 = new Sound({ src: "/audio/timun-mas/timunmas/4.mp3" });
const vTimun5 = new Sound({ src: "/audio/timun-mas/timunmas/5.mp3" });
const vTimun6 = new Sound({ src: "/audio/timun-mas/timunmas/6.mp3" });
const vTimun7 = new Sound({ src: "/audio/timun-mas/timunmas/7.mp3" });
const vTimun8 = new Sound({ src: "/audio/timun-mas/timunmas/8.mp3" });

// Buto Ijo
const vButo1 = new Sound({ src: "/audio/timun-mas/butoijo/1.mp3" });
const vButo2 = new Sound({ src: "/audio/timun-mas/butoijo/2.mp3" });
const vButo3 = new Sound({ src: "/audio/timun-mas/butoijo/3.mp3" });
const vButo4 = new Sound({ src: "/audio/timun-mas/butoijo/4.mp3" });
const vButo5 = new Sound({ src: "/audio/timun-mas/butoijo/5.mp3" });
const vButo6 = new Sound({ src: "/audio/timun-mas/butoijo/6.mp3" });

// Pertapa Sakti
const vPertapa1 = new Sound({ src: "/audio/timun-mas/pertapa/1.mp3" });
const vPertapa2 = new Sound({ src: "/audio/timun-mas/pertapa/2.mp3" });
const vPertapa3 = new Sound({ src: "/audio/timun-mas/pertapa/3.mp3" });
const vPertapa4 = new Sound({ src: "/audio/timun-mas/pertapa/4.mp3" });
const vPertapa5 = new Sound({ src: "/audio/timun-mas/pertapa/5.mp3" });
const vPertapa6 = new Sound({ src: "/audio/timun-mas/pertapa/6.mp3" });
const vPertapa7 = new Sound({ src: "/audio/timun-mas/pertapa/7.mp3" });

// --- PENGATURAN BACKGROUND SCENE ---
const sceneIntro = new Scene("intro", {
  background: "/images/stories/timun-mas/bg/village-day.webp",
});
const sceneBorn = new Scene("born", {
  background: "/images/stories/timun-mas/bg/village-day.webp",
});
const sceneHermit = new Scene("hermit", {
  background: "/images/stories/timun-mas/bg/mountain-hermit.webp",
});
const sceneQuiz1 = new Scene("quiz1", {
  background: "/images/stories/timun-mas/bg/mountain-temple.webp",
});
const sceneQuiz2 = new Scene("quiz2", {
  background: "/images/stories/timun-mas/bg/mountain-temple.webp",
});
const sceneChaseStart = new Scene("chase-start", {
  background: "/images/stories/timun-mas/bg/forest-run.webp",
});
const sceneChaseMid = new Scene("chase-mid", {
  background: "/images/stories/timun-mas/bg/forest-dark.webp",
});
const sceneChaseEnd = new Scene("chase-end", {
  background: "/images/stories/timun-mas/bg/swamp.webp",
});
const sceneRefuse = new Scene("refuse", {
  background: "/images/stories/timun-mas/bg/sad.webp",
});
const sceneVictory = new Scene("victory", {
  background: "/images/stories/timun-mas/bg/victory.webp",
});

// --- STORY FLOW ---

// 1. INTRO & PERJANJIAN
sceneIntro.action([
  bgm1.play(), // Mulai BGM Desa Damai
  narrator.say`Di sebuah desa yang asri di Jawa Tengah, hiduplah Mbok Srini. Kesunyian adalah teman satu-satunya sejak ia menjanda.`,

  imgMbok1.show({ ease: "easeInOut", duration: 1000 }),
  vMbok1.play(),
  mbokSrini.say(
    "Ya Tuhan, andaikan aku memiliki seorang anak untuk menemani masa tuaku...",
  ),
  vMbok1.stop(),
  imgMbok1.hide({ ease: "easeInOut", duration: 1000 }),

  bgm1.stop(), // Hentikan BGM Damai
  bgm2.play(), // Ganti BGM Menegangkan (Buto Ijo Muncul)
  narrator.say`Doanya tak dijawab oleh langit, melainkan oleh getaran hebat dari dasar bumi. Buto Ijo, raksasa penguasa hutan, muncul menutupi mentari.`,

  imgButo1.show({ ease: "easeInOut", duration: 1000 }),
  vButo1.play(),
  butoIjo.say(
    "Hahaha! Aku mendengar rintihanmu, perempuan tua. Ambillah biji mentimun ini. Tanamlah, dan kau akan mendapat seorang anak.",
  ),
  vButo1.stop(),

  vButo2.play(),
  butoIjo.say(
    "Tapi ingat! Saat anak itu berusia 17 tahun, dagingnya akan menjadi santapanku!",
  ),
  vButo2.stop(),
  imgButo1.hide({ ease: "easeInOut", duration: 1000 }),

  imgMbok2.show({ ease: "easeInOut", duration: 1000 }),
  vMbok2.play(),
  mbokSrini.say("A-apa?! Raksasa... daging anakku?!"),
  vMbok2.stop(),
  imgMbok2.hide({ ease: "easeInOut", duration: 1000 }),

  Menu.prompt("Apa keputusan yang harus diambil Mbok Srini?")
    .choose("Terima perjanjian Buto Ijo (Mulai Petualangan)", [
      Script.execute(({ storable }) => {
        addScore(storable, 10);
        unlockKnowledge(storable, "K1");
      }),
      sceneIntro.jumpTo(sceneBorn),
    ])
    .choose("Tolak dengan tegas (Akhir Cepat)", [
      sceneIntro.jumpTo(sceneRefuse),
    ]),
]);

// 2. KELAHIRAN & MASA KECIL
sceneBorn.action([
  bgm2.stop(),
  bgm1.play(), // Kembali ke BGM Damai
  narrator.say`Dari buah mentimun emas yang memancarkan cahaya, lahirlah bayi perempuan yang dinamai Timun Mas.`,
  narrator.say`Mbok Srini mendidiknya dengan penuh cinta. Timun Mas tumbuh menjadi gadis yang tidak hanya cantik, tapi juga cerdas dan tangkas.`,

  imgMbok4.show({ ease: "easeInOut", duration: 1000 }),
  vMbok3.play(),
  mbokSrini.say(
    "Anakku, hari ulang tahunmu yang ke-17 telah tiba. Ibu tidak akan membiarkan raksasa itu memakanmu.",
  ),
  vMbok3.stop(),
  imgMbok4.hide({ ease: "easeInOut", duration: 1000 }),

  imgTimun1.show({ ease: "easeInOut", duration: 1000 }),
  vTimun1.play(),
  timunMas.say(
    "Apa yang harus kita lakukan, Ibu? Aku tidak takut, tapi aku butuh petunjuk.",
  ),
  vTimun1.stop(),
  imgTimun1.hide({ ease: "easeInOut", duration: 1000 }),

  narrator.say`Mengingat petunjuk dalam mimpinya, Mbok Srini menyuruh Timun Mas menemui Pertapa Sakti di Gunung Gandul.`,
  sceneBorn.jumpTo(sceneHermit),
]);

// 3. PERTEMUAN PERTAPA
sceneHermit.action([
  bgm1.stop(),
  bgm3.play(), // BGM Gua / Magis
  narrator.say`Setelah perjalanan mendaki yang melelahkan, Timun Mas tiba di sebuah gua suci.`,

  imgPertapa1.show({ ease: "easeInOut", duration: 1000 }),
  vPertapa1.play(),
  pertapa.say(
    "Aku sudah menunggumu, Timun Mas. Aku memiliki empat bungkusan sakti, tapi kau harus tahu cara kerja alam sebelum menggunakannya.",
  ),
  vPertapa1.stop(),
  imgPertapa1.hide({ ease: "easeInOut", duration: 1000 }),

  imgPertapa2.show({ ease: "easeInOut", duration: 1000 }),
  vPertapa2.play(),
  pertapa.say(
    "Ujian pertama: Untuk menghambat langkah raksasa, kau butuh sesuatu yang tumbuh dan merambat dengan cepat.",
  ),
  vPertapa2.stop(),
  imgPertapa2.hide({ ease: "easeInOut", duration: 1000 }),

  sceneHermit.jumpTo(sceneQuiz1),
]);

// 4. KUIS EDUKASI 1
sceneQuiz1.action([
  imgTimun2.show({ ease: "easeInOut", duration: 1000 }),
  vTimun2.play(),
  timunMas.say("Sesuatu yang tumbuh dan merambat... apa ya?"),
  vTimun2.stop(),
  imgTimun2.hide({ ease: "easeInOut", duration: 1000 }),

  Menu.prompt(
    "Benda alam apa yang memiliki siklus pertumbuhan vegetatif paling cepat untuk mengikat musuh?",
  )
    .choose("Batu Kerikil", [
      imgPertapa4.show({ ease: "easeInOut", duration: 1000 }),
      vPertapa3.play(),
      pertapa.say(
        "Batu memang keras, tapi ia benda mati. Ia tak bisa bertumbuh menahan raksasa.",
      ),
      vPertapa3.stop(),
      imgPertapa4.hide({ ease: "easeInOut", duration: 1000 }),

      Script.execute(({ storable }) => addScore(storable, 0)),
      sceneQuiz1.jumpTo(sceneQuiz2),
    ])
    .choose("Biji Mentimun", [
      imgPertapa3.show({ ease: "easeInOut", duration: 1000 }),
      vPertapa4.play(),
      pertapa.say(
        "Tepat sekali! Biji menyimpan embrio kehidupan. Dalam kondisi yang tepat, ia akan membelah sel dan tumbuh menjadi ladang sulur yang kuat.",
      ),
      vPertapa4.stop(),
      imgPertapa3.hide({ ease: "easeInOut", duration: 1000 }),

      Script.execute(({ storable }) => {
        addScore(storable, 20);
        unlockKnowledge(storable, "K2");
      }),
      sceneQuiz1.jumpTo(sceneQuiz2),
    ]),
]);

// 5. KUIS EDUKASI 2
sceneQuiz2.action([
  imgPertapa2.show({ ease: "easeInOut", duration: 1000 }),
  vPertapa5.play(),
  pertapa.say(
    "Ujian kedua: Raksasa itu sangat kuat. Kau butuh kekuatan alam yang bisa menenggelamkannya dengan massa jenis air yang pekat.",
  ),
  vPertapa5.stop(),
  imgPertapa2.hide({ ease: "easeInOut", duration: 1000 }),

  imgTimun2.show({ ease: "easeInOut", duration: 1000 }),
  vTimun3.play(),
  timunMas.say("Massa jenis air yang pekat dari laut..."),
  vTimun3.stop(),
  imgTimun2.hide({ ease: "easeInOut", duration: 1000 }),

  Menu.prompt(
    "Senyawa mineral apa yang berasal dari laut dan bisa menciptakan lautan buatan?",
  )
    .choose("Garam (Natrium Klorida)", [
      imgPertapa3.show({ ease: "easeInOut", duration: 1000 }),
      vPertapa6.play(),
      pertapa.say(
        "Benar! Garam menyerap kelembapan dan mewakili kekuatan lautan luas. Ini bungkusan kedua dan ketigamu (Garam dan Jarum).",
      ),
      vPertapa6.stop(),
      imgPertapa3.hide({ ease: "easeInOut", duration: 1000 }),

      Script.execute(({ storable }) => {
        addScore(storable, 20);
        unlockKnowledge(storable, "K3");
      }),
      sceneQuiz2.jumpTo(sceneChaseStart),
    ])
    .choose("Pasir Putih", [
      imgPertapa4.show({ ease: "easeInOut", duration: 1000 }),
      vPertapa7.play(),
      pertapa.say(
        "Kurang tepat. Pasir tidak larut dalam air dan tak bisa membentuk lautan. Tapi bawalah bungkusan-bungkusan ini, waktumu hampir habis!",
      ),
      vPertapa7.stop(),
      imgPertapa4.hide({ ease: "easeInOut", duration: 1000 }),

      Script.execute(({ storable }) => addScore(storable, 5)),
      sceneQuiz2.jumpTo(sceneChaseStart),
    ]),
]);

// 6. PENGEJARAN — BAGIAN 1
sceneChaseStart.action([
  bgm3.stop(), // Stop BGM Gua
  bgm4.play(), // Mulai BGM Action/Pengejaran
  narrator.say`Begitu Timun Mas turun gunung, bumi bergetar hebat. Buto Ijo datang menagih janji!`,

  imgButo2.show({ ease: "easeInOut", duration: 1000 }),
  vButo3.play(),
  butoIjo.say("TIMUN MAS! Dagingmu pasti sangat manis! Jangan lari kau!"),
  vButo3.stop(),
  imgButo2.hide({ ease: "easeInOut", duration: 1000 }),

  imgTimun3.show({ ease: "easeInOut", duration: 1000 }),
  vTimun4.play(),
  timunMas.say("Ah! Dia sudah menemukanku!"),
  vTimun4.stop(),
  imgTimun3.hide({ ease: "easeInOut", duration: 1000 }),

  imgTimun4.show({ ease: "easeInOut", duration: 1000 }),
  vTimun5.play(),
  timunMas.say("Aku harus menggunakan pengetahuanku! Pertama, Biji Mentimun!"),
  vTimun5.stop(),
  imgTimun4.hide({ ease: "easeInOut", duration: 1000 }),

  narrator.say`Timun Mas melempar biji tersebut. Tiba-tiba, tanah merekah dan tumbuhlah ladang mentimun dengan sulur-sulur raksasa yang melilit tubuh Buto Ijo.`,

  imgButo3.show({ ease: "easeInOut", duration: 1000 }),
  vButo4.play(),
  butoIjo.say("Argh! Tanaman sialan! Kau pikir ini bisa menahanku?!"),
  vButo4.stop(),
  imgButo3.hide({ ease: "easeInOut", duration: 1000 }),

  narrator.say`Dengan kekuatan penuh, Buto Ijo merobek tanaman itu dan kembali mengejar.`,
  sceneChaseStart.jumpTo(sceneChaseMid),
]);

// 7. PENGEJARAN — BAGIAN 2
sceneChaseMid.action([
  narrator.say`Jarak semakin dekat. Timun Mas melempar bungkusan kedua: Jarum!`,
  narrator.say`Jarum itu berubah menjadi hutan bambu yang sangat rimbun dan berduri tajam, menusuk kaki raksasa tersebut.`,

  imgButo3.show({ ease: "easeInOut", duration: 1000 }),
  vButo5.play(),
  butoIjo.say("Aaaarrgh! Kakiku berdarah! Tapi aku takkan melepaskanmu!"),
  vButo5.stop(),
  imgButo3.hide({ ease: "easeInOut", duration: 1000 }),

  imgTimun4.show({ ease: "easeInOut", duration: 1000 }),
  vTimun6.play(),
  timunMas.say("Dia masih bertahan! Sekarang, Garam!"),
  vTimun6.stop(),
  imgTimun4.hide({ ease: "easeInOut", duration: 1000 }),

  narrator.say`Garam yang dilempar bereaksi dengan tanah, menciptakan lautan luas yang bergelombang hebat. Buto Ijo harus berenang dengan susah payah.`,
  sceneChaseMid.jumpTo(sceneChaseEnd),
]);

// 8. PENGEJARAN — BAGIAN 3 (AKHIR PENGEJARAN)
sceneChaseEnd.action([
  // bgm4.stop(),
  // bgm5.play(), // Transisi BGM ke Rawa / Klimaks
  narrator.say`Raksasa itu berhasil menyeberangi lautan, namun tenaganya sudah terkuras habis.`,

  imgTimun4.show({ ease: "easeInOut", duration: 1000 }),
  vTimun7.play(),
  timunMas.say("Ini senjata terakhirku. Terasi, kembalikan dia ke dalam bumi!"),
  vTimun7.stop(),
  imgTimun4.hide({ ease: "easeInOut", duration: 1000 }),

  narrator.say`Terasi yang terbuat dari fermentasi udang itu dilempar, mengubah tanah kering menjadi rawa lumpur hisap yang mendidih.`,

  imgButo4.show({ ease: "easeInOut", duration: 1000 }),
  vButo6.play(),
  butoIjo.say("Tidaaaaak! Tolong! Aku tidak bisa bergerak!"),
  vButo6.stop(),
  imgButo4.hide({ ease: "easeInOut", duration: 1000 }),

  narrator.say`Semakin Buto Ijo meronta, semakin cepat lumpur itu menariknya ke bawah, hingga ia tenggelam sepenuhnya.`,
  sceneChaseEnd.jumpTo(sceneVictory),
]);

// 9. ENDINGS
sceneVictory.action([
  bgm4.stop(),
  bgm5.play(), // BGM Kemenangan
  // bgm5.stop(),
  // bgm6.play(), // BGM Kemenangan
  narrator.say`Hutan kembali sunyi. Ancaman telah musnah.`,

  imgMbok3.show({ ease: "easeInOut", duration: 1000 }),
  vMbok4.play(),
  mbokSrini.say("Timun Mas! Anakku! Kau selamat!"),
  vMbok4.stop(),
  imgMbok3.hide({ ease: "easeInOut", duration: 1000 }),

  imgTimun5.show({ ease: "easeInOut", duration: 1000 }),
  vTimun8.play(),
  timunMas.say("Ibu! Kita akhirnya bebas!"),
  vTimun8.stop(),
  imgTimun5.hide({ ease: "easeInOut", duration: 1000 }),

  narrator.say`Dengan keberanian dan ilmu pengetahuan yang dimilikinya, Timun Mas berhasil mengubah takdirnya. Ia dan ibunya hidup bahagia selamanya.`,
  bgm5.stop(),
  Script.execute(({ storable }) => setEnding(storable, "best")),
]);

sceneRefuse.action([
  bgm2.stop(),
  bgm5.play(), // Gunakan BGM Dark/Swamp untuk Bad Ending
  narrator.say`Karena ketakutan yang melumpuhkan akal sehat, Mbok Srini menolak. Buto Ijo marah dan menghancurkan desa tersebut.`,

  imgMbok1.show({ ease: "easeInOut", duration: 1000 }),
  vMbok5.play(),
  mbokSrini.say("Maafkan aku... aku terlalu takut..."),
  vMbok5.stop(),
  imgMbok1.hide({ ease: "easeInOut", duration: 1000 }),

  narrator.say`Mbok Srini hidup dalam penyesalan mendalam. Tamat (Bad Ending).`,
  bgm5.stop(),
  Script.execute(({ storable }) => setEnding(storable, "bad")),
]);

// Create and export story
const story = new Story("Legenda Timun Mas");
story.entry(sceneIntro);

export default story;
export const storyMeta = {
  title: "Legenda Timun Mas: Petualangan Sains & Keberanian",
  region: "Jawa Tengah",
  description:
    "Bantu Timun Mas melarikan diri dari Buto Ijo menggunakan pengetahuan tentang alam dan benda ajaib.",
  difficulty: "Menengah",
  coverImage: "/stories/timun-mas/cover.jpg",
};
