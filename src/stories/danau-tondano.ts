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
const tonaasU = new Character("Tonaas Utara", { color: "#795548" });
const marimbow = new Character("Marimbow", { color: "#E91E63" });
const maharimbow = new Character("Maharimbow", { color: "#4A90E2" });

// --- GAMBAR EKSPRESI KARAKTER ---
const IMG = { zoom: 0.65, position: { yalign: 0.45, xalign: 0.5 } };

// Marimbow
const imgMar1 = new Image({
  src: "/images/tondano/marimbow/normal.webp",
  ...IMG,
}); // Cantik jelita
const imgMar2 = new Image({
  src: "/images/tondano/marimbow/disguise.webp",
  ...IMG,
}); // Penyamaran pria
const imgMar3 = new Image({
  src: "/images/tondano/marimbow/fight.webp",
  ...IMG,
}); // Siaga bertarung
const imgMar4 = new Image({
  src: "/images/tondano/marimbow/revealed.webp",
  ...IMG,
}); // Rambut terurai
const imgMar5 = new Image({ src: "/images/tondano/marimbow/sad.webp", ...IMG }); // Bimbang/Sedih

// Maharimbow
const imgMah1 = new Image({
  src: "/images/tondano/maharimbow/guard.webp",
  ...IMG,
}); // Waspada
const imgMah2 = new Image({
  src: "/images/tondano/maharimbow/surprised.webp",
  ...IMG,
}); // Terkejut
const imgMah3 = new Image({
  src: "/images/tondano/maharimbow/love.webp",
  ...IMG,
}); // Jatuh hati

// Tonaas
const imgTonaas = new Image({
  src: "/images/tondano/tonaas-utara/old.webp",
  ...IMG,
});

// --- BACKGROUND MUSIC (BGM) ---
const bgmIntro = new Sound({
  src: "/music/tondano/minahasa_intro.mp3",
  loop: true,
  volume: 0.2,
});
const bgmForest = new Sound({
  src: "/music/tondano/forest_mystery.mp3",
  loop: true,
  volume: 0.2,
});
const bgmFight = new Sound({
  src: "/music/tondano/action_drums.mp3",
  loop: true,
  volume: 0.2,
});
const bgmRomance = new Sound({
  src: "/music/tondano/kolintang_soft.mp3",
  loop: true,
  volume: 0.2,
});
const bgmPanic = new Sound({
  src: "/music/tondano/disaster_eruption.mp3",
  loop: true,
  volume: 0.2,
});

// --- VOICE ACTING (VA) ---
const vMarSumpah = new Sound({ src: "/audio/tondano/mar/sumpah.mp3" });
const vMahSiapa = new Sound({ src: "/audio/tondano/mah/siapa_kau.mp3" });
const vTonaasPeringatan = new Sound({
  src: "/audio/tondano/tonaas/peringatan.mp3",
});

// --- PENGATURAN BACKGROUND SCENE ---
const sceneIntro = new Scene("intro", {
  background: "/images/tondano/bg/panorama.webp",
});
const sceneNorth = new Scene("north", {
  background: "/images/tondano/bg/village_north.webp",
});
const sceneBorder = new Scene("border", {
  background: "/images/tondano/bg/border_forest.webp",
});
const sceneBattle = new Scene("battle", {
  background: "/images/tondano/bg/battle_ground.webp",
});
const sceneHome = new Scene("home", {
  background: "/images/tondano/bg/tonaas_house.webp",
});

// Jalur Bad Ending
const sceneEruption = new Scene("eruption", {
  background: "/images/tondano/bg/volcano.webp",
});
const sceneFlood = new Scene("flood", {
  background: "/images/tondano/bg/flood_strike.webp",
});
const sceneFinalBad = new Scene("final_bad", {
  background: "/images/tondano/bg/lake_tondano.webp",
});

// Jalur Good Ending
const sceneFinalGood = new Scene("final_good", {
  background: "/images/tondano/bg/prosperity_village.webp",
});

// --- STORY FLOW ---

// 1. PENDAHULUAN & EDUKASI GEOGRAFI
sceneIntro.action([
  bgmIntro.play(),
  narrator.say`Provinsi Sulawesi Utara adalah daerah paling utara di Pulau Sulawesi. Di provinsi ini terbentang rangkaian pegunungan yang mengelilingi sebuah danau bernama Danau Tondano.`,

  Menu.prompt(
    "Kuis Geografi: Danau Tondano merupakan danau terluas di provinsi mana?",
  )
    .choose("Sulawesi Utara", [
      Script.execute(({ storable }) => {
        addScore(storable, 20);
        unlockKnowledge(storable, "GEO1");
      }),
      narrator.say`Tepat sekali! Danau ini adalah ikon kebanggaan masyarakat Minahasa.`,
      sceneIntro.jumpTo(sceneNorth),
    ])
    .choose("Sulawesi Selatan", [
      narrator.say`Kurang tepat. Danau Tondano terletak di Kabupaten Minahasa, Sulawesi Utara.`,
      sceneIntro.jumpTo(sceneNorth),
    ]),
]);

// 2. SUMPAH & PENYAMARAN
sceneNorth.action([
  narrator.say`Dahulu, wilayah Minahasa dipimpin oleh para Tonaas. Marimbow, putri Tonaas Utara, merasa lelah karena terus-menerus didatangi tamu laki-laki yang ingin melamarnya.`,
  imgMar1.show({ ease: "easeInOut", duration: 1000 }),
  vMarSumpah.play(),
  marimbow.say`Aku bersumpah demi rakyat di utara, aku takkan menikah terlebih dahulu sebelum siap menggantikan posisi ayah sebagai Tonaas!`,
  vMarSumpah.stop(),

  imgTonaas.show({ ease: "easeInOut", duration: 1000 }),
  vTonaasPeringatan.play(),
  tonaasU.say`Tapi anakku, bagaimana jika kau lupa dengan sumpahmu ini? Berhati-hatilah.`,
  vTonaasPeringatan.stop(),
  imgTonaas.hide(),

  marimbow.say`Aku akan menerima semua resikonya. Mulai hari ini, aku akan mengubah penampilanku agar mereka mengira aku seorang laki-laki.`,
  imgMar1.hide(),
  imgMar2.show({ ease: "easeInOut", duration: 1000 }),
  narrator.say`Sejak saat itu, Marimbow berpakaian layaknya laki-laki. Ia bisa dengan bebas mempelajari ilmu beladiri dan berburu di hutan.`,
  sceneNorth.jumpTo(sceneBorder),
]);

// 3. KONFLIK PERBATASAN & PERTARUNGAN
sceneBorder.action([
  bgmIntro.stop(),
  bgmForest.play(),
  narrator.say`Suatu hari, Marimbow terlalu sibuk mencari hewan buruan hingga tidak sadar telah memasuki wilayah Selatan.`,

  imgMah1.show({ ease: "easeInOut", duration: 1000 }),
  vMahSiapa.play(),
  maharimbow.say`Siapa kau?! Kenapa berani memasuki wilayah ini? Kamu pasti mata-mata yang dikirim dari Utara!`,
  vMahSiapa.stop(),

  imgMar2.show(),
  marimbow.say`Tuduhanmu tidak benar! Aku hanya sedang berburu dan tidak tahu kalau sudah tersesat. Biarkan aku kembali!`,

  maharimbow.say`Aku tidak percaya! Kau akan menjadi tawananku untuk menghadap Tonaas di Selatan!`,
  narrator.say`Marimbow menolak keras. Dalam kelelahannya, ia berusaha melawan dan terjadilah pertarungan sengit!`,
  bgmForest.stop(),
  bgmFight.play(),
  sceneBorder.jumpTo(sceneBattle),
]);

// 4. TERBONGKARNYA RAHASIA
sceneBattle.action([
  imgMar3.show(),
  narrator.say`Marimbow berusaha mengelak dari serangan Maharimbow. Namun, gerakan tersebut justru membuka kedoknya.`,
  narrator.say`Tutup kepalanya terlepas... dan rambut hitam panjangnya tiba-tiba terurai!`,

  imgMar3.hide(),
  imgMar4.show({ ease: "easeInOut", duration: 800 }),
  bgmFight.stop(),
  bgmRomance.play(),

  imgMah1.hide(),
  imgMah2.show({ ease: "easeInOut", duration: 800 }),
  maharimbow.say`Seorang... wanita? Aku tidak menyangka lawanku secantik ini. Maafkan jika aku melukaimu.`,

  marimbow.say`Aku Marimbow, putri Tonaas Utara. Sudah kubilang aku hanya tersesat karena hewan buruan.`,
  maharimbow.say`Bisakah kau berjanji padaku... datanglah kembali ke sini beberapa hari lagi?`,
  sceneBattle.jumpTo(sceneHome),
]);

// 5. PENOLAKAN ORANG TUA & PILIHAN AKHIR
sceneHome.action([
  narrator.say`Semenjak itu, mereka sering berjumpa di perbatasan. Maharimbow akhirnya melamar, namun Marimbow bimbang karena sumpahnya.`,
  narrator.say`Ia mencoba berbicara pada orang tuanya, namun sang Ayah mengingatkannya dengan keras.`,

  imgTonaas.show(),
  tonaasU.say`Bukankah kau berjanji tidak menikah sebelum jadi Tonaas? Ayah harap kau memikirkannya lagi!`,
  imgTonaas.hide(),

  imgMar5.show(),
  marimbow.say`Maharimbow, orang tuaku tidak mengizinkan. Sumpah itu... aku takut akan resikonya.`,

  imgMah3.show(),
  maharimbow.say`Mari kita lanjutkan rencana kita. Kita menikah diam-diam di desa yang jauh tanpa sepengetahuan mereka. Hanya kita berdua.`,

  Menu.prompt("Pilihan Sulit: Apa yang akan Marimbow putuskan?")
    .choose("Ikuti Maharimbow & Menikah Diam-diam", [
      Script.execute(({ storable }) => {
        addScore(storable, 10);
        unlockKnowledge(storable, "KARUARI_BROKEN");
      }),
      sceneHome.jumpTo(sceneEruption),
    ])
    .choose("Pegang Teguh Sumpah demi Rakyat & Orang Tua", [
      Script.execute(({ storable }) => {
        addScore(storable, 30);
        unlockKnowledge(storable, "INTEGRITY_WIN");
      }),
      sceneHome.jumpTo(sceneFinalGood),
    ]),
]);

// 6. BENCANA (ALUR ASLI)
sceneEruption.action([
  bgmRomance.stop(),
  bgmPanic.play(),
  narrator.say`Pasangan itu melakukan pernikahan secara diam-diam tanpa restu orang tua. Namun, alam tidak tinggal diam.`,
  narrator.say`Sesaat setelah janji diucapkan, Gunung Kaweng yang menjulang tinggi tiba-tiba menyemburkan lahar panas!`,
  narrator.say`Terjadi gempa bumi dahsyat yang menyebabkan batu-batuan tebing berjatuhan. Rumah-rumah hancur porak-poranda.`,

  Menu.prompt(
    "Kuis Geologi: Berdasarkan legenda, gunung apa yang meletus akibat pelanggaran sumpah ini?",
  )
    .choose("Gunung Kaweng", [
      Script.execute(({ storable }) => addScore(storable, 10)),
      narrator.say`Benar. Letusan Gunung Kaweng menandai dimulainya malapetaka ini.`,
    ])
    .choose("Gunung Klabat", [
      narrator.say`Kurang tepat. Dalam legenda Danau Tondano, Gunung Kaweng-lah yang disebut meletus.`,
    ]),
  sceneEruption.jumpTo(sceneFlood),
]);

// 6A. AIR BAH (FLOOD SCENE)
sceneFlood.action([
  narrator.say`Bencana belum berhenti. Tiba-tiba datanglah air bah yang menerjang desa-desa di sekitar gunung tinggi.`,
  narrator.say`Banyak manusia, rumah, dan hewan yang tenggelam akibat terjangan air bah dahsyat tersebut.`,
  narrator.say`Bencana ini dipercaya sebagai akibat dari Marimbow yang melanggar sumpahnya sendiri demi cinta.`,
  sceneFlood.jumpTo(sceneFinalBad),
]);

// 7A. FINAL BAD ENDING
sceneFinalBad.action([
  narrator.say`Daerah yang telah terendam air bah tersebut sekarang berubah menjadi danau besar yang diberi nama Danau Tondano.`,
  narrator.say`Danau yang indah ini menjadi pengingat abadi bagi masyarakat Minahasa tentang kesakralan sebuah janji.`,
  narrator.say`Tamat (Bad Ending).`,
  bgmPanic.stop(),
  Script.execute(({ storable }) => setEnding(storable, "bad")),
]);

// 7B. FINAL GOOD ENDING
sceneFinalGood.action([
  imgMar5.show(),
  marimbow.say`Maafkan aku Maharimbow. Aku mencintaimu, tapi aku tidak bisa membangun kebahagiaan di atas sumpah yang patah dan kehancuran rakyatku.`,
  imgMah3.show(),
  maharimbow.say`Jika itu keputusanmu... maka aku akan setia menunggumu sampai kau resmi menjadi Tonaas.`,
  narrator.say`Marimbow memegang janjinya. Ia memimpin Utara dengan bijak. Setelah masa tugasnya usai, barulah mereka bersatu dalam restu yang sempurna.`,
  narrator.say`Gunung Kaweng tetap tenang, dan wilayah Minahasa hidup dalam kemakmuran abadi.`,
  narrator.say`Tamat (Best Ending).`,
  bgmRomance.stop(),
  Script.execute(({ storable }) => setEnding(storable, "best")),
]);

// EXPORT STORY
const story = new Story("Legenda Danau Tondano");
story.entry(sceneIntro);

export default story;

export const storyMeta = {
  title: "Legenda Danau Tondano: Sumpah Sang Tonaas",
  region: "Sulawesi Utara",
  description:
    "Dilema antara cinta terlarang dan sumpah suci yang menentukan nasib tanah Minahasa.",
  difficulty: "Menengah",
  coverImage: "/images/tondano/cover.webp",
};
