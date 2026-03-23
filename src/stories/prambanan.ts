import { Scene, Character, Story, Menu, Script, Image } from "narraleaf-react";
import { addScore, setEnding } from "@/lib/game-utils";
const narrator = new Character("Narator", { color: "#D96B4A" });
const bandung = new Character("Bandung Bondowoso", { color: "#E86B52" });
const roro = new Character("Roro Jonggrang", { color: "#EAA87E" });

const bandung1 = new Image({
  src: "/images/prambanan/bandung/1.png",
  zoom: 0.7,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const bandung2 = new Image({
  src: "/images/prambanan/bandung/2.png",
  zoom: 0.7,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const bandung3 = new Image({
  src: "/images/prambanan/bandung/3.png",
  zoom: 0.7,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const bandung5 = new Image({
  src: "/images/prambanan/bandung/5.png",
  zoom: 0.7,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const bandung6 = new Image({
  src: "/images/prambanan/bandung/6.png",
  zoom: 0.7,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const bandung7 = new Image({
  src: "/images/prambanan/bandung/7.png",
  zoom: 0.7,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const bandung8 = new Image({
  src: "/images/prambanan/bandung/8.png",
  zoom: 0.7,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const bandung9 = new Image({
  src: "/images/prambanan/bandung/9.png",
  zoom: 0.7,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const bandung10 = new Image({
  src: "/images/prambanan/bandung/10.png",
  zoom: 0.7,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});

const roro1 = new Image({
  src: "/images/prambanan/roro/1.png",
  zoom: 0.6,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const roro2 = new Image({
  src: "/images/prambanan/roro/2.png",
  zoom: 0.6,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const roro4 = new Image({
  src: "/images/prambanan/roro/4.png",
  zoom: 0.6,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const roro5 = new Image({
  src: "/images/prambanan/roro/5.png",
  zoom: 0.6,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const roro6 = new Image({
  src: "/images/prambanan/roro/6.png",
  zoom: 0.6,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});
const roro7 = new Image({
  src: "/images/prambanan/roro/7.png",
  zoom: 0.6,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});

const roro8 = new Image({
  src: "/images/prambanan/roro/8.png",
  zoom: 0.6,
  position: {
    yalign: 0.45,
    xalign: 0.5,
  },
});

// Scenes
const sceneIntro = new Scene("intro", {
  background: "/images/prambanan/1.jpeg",
});

const sceneChoice1 = new Scene("choice1", {
  background: "/images/prambanan/2.jpeg",
});

const sceneProposal = new Scene("proposal", {
  background: "/images/prambanan/3.jpeg",
});

const sceneForce = new Scene("force", {
  background: "/images/prambanan/4.jpeg",
});

const sceneChallenge = new Scene("challenge", {
  background: "/images/prambanan/5.jpeg",
});

const sceneBuild = new Scene("build", {
  background: "/images/prambanan/6.jpeg",
});

// Story flow
sceneIntro.action([
  narrator.say`Di sebuah zaman dahulu kala, terdapat dua kerajaan yang saling bermusuhan, yaitu Pengging dan Boko.`,
  narrator.say`Kerajaan Pengging dipimpin oleh seorang raja yang memiliki putra perkasa bernama Bandung Bondowoso.`,
  narrator.say`Sementara itu, Kerajaan Boko memiliki seorang putri yang sangat cantik jelita bernama Roro Jonggrang.`,
  sceneIntro.jumpTo(sceneChoice1),
]);

sceneChoice1.action([
  bandung1.show({ ease: "easeInOut", duration: 1000 }),
  bandung.say`Kamu adalah Bandung Bondowoso yang baru saja memenangkan perang setelah menaklukkan Kerajaan Boko.`,
  bandung.say`Kamu melihat putri kerajaan musuh, Roro Jonggrang yang sedang berduka, namun kamu justru jatuh hati kepadanya.`,
  Menu.prompt("Apa yang kamu lakukan?")
    .choose("Lamar dia dengan sopan", [
      Script.execute(({ storable }) => addScore(storable, 30)),
      sceneChoice1.jumpTo(sceneProposal),
    ])
    .choose("Gunakan kekuatan untuk memaksanya", [
      sceneChoice1.jumpTo(sceneForce),
    ]),
]);

sceneProposal.action([
  bandung2.show({ ease: "easeInOut", duration: 1000 }),
  bandung.say`Roro Jonggrang, aku ingin mempersuntingmu. Maukah kau menjadi permaisuriku?`,
  bandung2.hide({ ease: "easeInOut", duration: 1000 }),
  roro1.show({ ease: "easeInOut", duration: 1000 }),
  roro.say`Aku... aku tidak bisa begitu saja menerimamu, Bondowoso.`,
  roro1.hide({ ease: "easeInOut", duration: 1000 }),
  roro2.show({ ease: "easeInOut", duration: 1000 }),
  roro.say`Jika kau benar-benar ingin mempersuntingku, kau harus memenuhi syaratku.`,
  roro2.hide({ ease: "easeInOut", duration: 1000 }),
  bandung3.show({ ease: "easeInOut", duration: 1000 }),
  bandung.say`Apa syaratnya? Aku akan memenuhinya!`,
  bandung3.hide({ ease: "easeInOut", duration: 1000 }),
  roro2.show({ ease: "easeInOut", duration: 1000 }),
  roro.say`Bangunkan 1000 candi untukku dalam waktu satu malam saja.`,
  roro2.hide({ ease: "easeInOut", duration: 1000 }),
  narrator.say`Syarat yang mustahil, namun Bandung Bondowoso tidak gentar.`,
  bandung3.show({ ease: "easeInOut", duration: 1000 }),
  Menu.prompt("Apa yang akan kamu lakukan?")
    .choose("Terima syaratnya", [
      Script.execute(({ storable }) => addScore(storable, 30)),
      sceneProposal.jumpTo(sceneBuild),
    ])
    .choose("Tolak syarat itu", [
      Script.execute(({ storable }) => addScore(storable, 10)),
      sceneProposal.jumpTo(sceneChallenge),
    ]),
]);

sceneForce.action([
  bandung5.show({ ease: "easeInOut", duration: 1000 }),
  bandung.say`Kau tidak punya pilihan, Roro Jonggrang! Kau akan menjadi istriku!`,
  bandung5.hide({ ease: "easeInOut", duration: 1000 }),
  roro4.show({ ease: "easeInOut", duration: 1000 }),
  roro.say`Tidak! Aku tidak akan pernah mau menjadi istrimu, Bondowoso!`,
  roro4.hide({ ease: "easeInOut", duration: 1000 }),
  narrator.say`Roro Jonggrang marah besar dan menolak dengan keras.`,
  narrator.say`Bandung Bondowoso kehilangan kesabarannya dan murka.`,
  bandung6.show({ ease: "easeInOut", duration: 1000 }),
  narrator.say`Karena amarahnya, ia mengutuk Roro Jonggrang menjadi batu.`,
  narrator.say`Dan demikianlah kisah tragis berakhir. Tamat (Bad Ending).`,
  Script.execute(({ storable }) => setEnding(storable, "bad")),
]);

sceneChallenge.action([
  bandung7.show({ ease: "easeInOut", duration: 1000 }),
  bandung.say`Syarat itu terlalu berlebihan, Roro Jonggrang!`,
  bandung7.hide({ ease: "easeInOut", duration: 1000 }),
  roro7.show({ ease: "easeInOut", duration: 1000 }),
  roro.say`Jika kau tidak bisa memenuhinya, berarti kau tidak layak untukku.`,
  roro7.hide({ ease: "easeInOut", duration: 1000 }),
  bandung7.show({ ease: "easeInOut", duration: 1000 }),
  bandung.say`Kau akan menyesal telah menolakku!`,
  bandung7.hide({ ease: "easeInOut", duration: 1000 }),
  narrator.say`Bandung Bondowoso meninggalkan Roro Jonggrang dengan kekecewaan besar.`,
  narrator.say`Dan kisah ini berakhir tanpa kebahagiaan. Tamat (Neutral Ending).`,
  Script.execute(({ storable }) => setEnding(storable, "neutral")),
]);

sceneBuild.action([
  bandung8.show({ ease: "easeInOut", duration: 1000 }),
  bandung.say`Baiklah! Aku terima syaratmu! Aku akan membangun 1000 candi dalam satu malam!`,
  bandung8.hide({ ease: "easeInOut", duration: 1000 }),
  narrator.say`Bandung Bondowoso memanggil pasukan jin untuk membantunya membangun candi.`,
  narrator.say`Satu per satu candi mulai berdiri megah di bawah sinar bulan.`,
  narrator.say`Roro Jonggrang panik melihat candi-candi hampir selesai.`,
  roro5.show({ ease: "easeInOut", duration: 1000 }),
  roro.say`Tidak... hampir 1000! Aku harus melakukan sesuatu!`,
  roro5.hide({ ease: "easeInOut", duration: 1000 }),
  roro6.show({ ease: "easeInOut", duration: 1000 }),
  narrator.say`Roro Jonggrang membakar jerami dan membangunkan ayam-ayam agar berkokok seolah fajar telah tiba.`,
  narrator.say`Pasukan jin yang mendengar ayam berkokok langsung pergi, mengira pagi telah tiba.`,
  roro6.hide({ ease: "easeInOut", duration: 1000 }),
  bandung9.show({ ease: "easeInOut", duration: 1000 }),
  bandung.say`Tidak! Candi baru 999! Kau curang, Roro Jonggrang!`,
  bandung9.hide({ ease: "easeInOut", duration: 1000 }),
  bandung10.show({ ease: "easeInOut", duration: 1000 }),
  bandung.say`Kau telah mengkhianatiku! Terimalah kutukanmu!`,
  bandung10.hide({ ease: "easeInOut", duration: 1000 }),
  narrator.say`Bandung Bondowoso marah besar dan mengutuk Roro Jonggrang menjadi candi yang ke-1000.`,
  roro8.show({ ease: "easeInOut", duration: 1000 }),
  narrator.say`Begitulah Legenda Candi Prambanan tercipta. Roro Jonggrang menjadi candi, dan Bandung Bondowoso kehilangan cintanya selamanya. Tamat (Best Ending).`,
  Script.execute(({ storable }) => setEnding(storable, "best")),
]);

// Create and export story
const story = new Story("Legenda Candi Prambanan");
story.entry(sceneIntro);

export default story;
export const storyMeta = {
  title: "Legenda Candi Prambanan",
  region: "Jawa Tengah",
  description:
    "Kisah cinta dan pengkhianatan Bandung Bondowoso dan Roro Jonggrang.",
  difficulty: "Pemula",
  coverImage: "/images/jawa-tengah.jpg",
};
