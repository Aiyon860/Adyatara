import { Scene, Character, Story, Menu, Script } from "narraleaf-react";
import { addScore, setEnding } from "@/lib/game-utils";

const narrator = new Character("Narator", { color: "#D96B4A" });
const mbokSrini = new Character("Mbok Srini", { color: "#EAA87E" });
const timunMas = new Character("Timun Mas", { color: "#F5C542" });
const butoIjo = new Character("Buto Ijo", { color: "#4ADE80" });

// Scenes
const sceneIntro = new Scene("intro", {
  background: "/images/jawa-tengah.jpg",
});

const sceneRefuse = new Scene("refuse", {
  background: "/images/jawa-tengah.jpg",
});

const sceneBorn = new Scene("born", {
  background: "/images/jawa-tengah.jpg",
});

const sceneChase = new Scene("chase", {
  background: "/images/jawa-tengah.jpg",
});

const sceneDeal = new Scene("deal", {
  background: "/images/jawa-tengah.jpg",
});

// Story flow
sceneIntro.action([
  narrator.say`Di sebuah desa yang sunyi, hiduplah seorang janda tua bernama Mbok Srini.`,
  mbokSrini.say`Andaikan aku memiliki seorang anak... Hidupku terasa sangat sepi.`,
  narrator.say`Suatu hari, datanglah raksasa Buto Ijo ke rumah Mbok Srini.`,
  butoIjo.say`Hei, janda tua! Aku bisa memberimu seorang anak yang cantik jelita.`,
  butoIjo.say`Tapi ada syaratnya. Ketika anak itu dewasa, kau harus menyerahkannya kepadaku!`,
  Menu.prompt("Apa yang harus dilakukan Mbok Srini?")
    .choose("Terima perjanjian Buto Ijo", [
      Script.execute(({ storable }) => addScore(storable, 30)),
      sceneIntro.jumpTo(sceneBorn),
    ])
    .choose("Tolak tawaran Buto Ijo", [
      sceneIntro.jumpTo(sceneRefuse),
    ]),
]);

sceneRefuse.action([
  mbokSrini.say`Tidak! Aku tidak akan menjual anak kepada makhluk sepertimu!`,
  butoIjo.say`Baiklah... Kau akan menyesal, janda tua!`,
  narrator.say`Buto Ijo pergi dengan marah. Mbok Srini tetap hidup sendirian dalam kesepian.`,
  narrator.say`Dan kisah ini berakhir tanpa kebahagiaan. Tamat (Bad Ending).`,
  Script.execute(({ storable }) => setEnding(storable, "bad")),
]);

sceneBorn.action([
  narrator.say`Buto Ijo memberikan biji mentimun ajaib kepada Mbok Srini.`,
  narrator.say`Mbok Srini menanam biji tersebut, dan dari sana lahirlah seorang bayi perempuan yang cantik.`,
  mbokSrini.say`Namamu Timun Mas, anakku. Kau adalah buah hatiku.`,
  narrator.say`Tahun demi tahun berlalu. Timun Mas tumbuh menjadi gadis yang cantik dan pemberani.`,
  timunMas.say`Ibu, kenapa Ibu sering terlihat sedih?`,
  mbokSrini.say`Tidak ada apa-apa, Nak. Ibu hanya... sangat mencintaimu.`,
  narrator.say`Namun, saat Timun Mas menginjak dewasa, Buto Ijo datang menagih janji.`,
  butoIjo.say`Waktunya telah tiba! Serahkan Timun Mas kepadaku!`,
  Menu.prompt("Apa yang harus Timun Mas lakukan?")
    .choose("Larilah, Timun Mas!", [
      Script.execute(({ storable }) => addScore(storable, 30)),
      sceneBorn.jumpTo(sceneChase),
    ])
    .choose("Hadapi Buto Ijo", [
      Script.execute(({ storable }) => addScore(storable, 15)),
      sceneBorn.jumpTo(sceneDeal),
    ]),
]);

sceneChase.action([
  narrator.say`Timun Mas berlari secepat mungkin dikejar oleh Buto Ijo yang raksasa!`,
  timunMas.say`Ibu memberiku lima benda ajaib untuk melawan Buto Ijo!`,
  narrator.say`Timun Mas melemparkan biji cabe, yang berubah menjadi hutan cabe pedas!`,
  butoIjo.say`Aduh! Mataku pedas! Tapi aku tidak akan menyerah!`,
  narrator.say`Timun Mas melemparkan terasi, yang berubah menjadi lautan lumpur!`,
  butoIjo.say`Aku bisa berenang! Kau tidak bisa lari selamanya!`,
  narrator.say`Terakhir, Timun Mas melemparkan biji mentimun, yang berubah menjadi ladang mentimun raksasa!`,
  butoIjo.say`Tidak! Aku terjebak! Aku... aku menyerah!`,
  narrator.say`Buto Ijo terjebak di ladang mentimun dan tidak bisa mengejar Timun Mas lagi.`,
  narrator.say`Timun Mas dan Mbok Srini hidup bahagia selamanya. Tamat (Best Ending).`,
  Script.execute(({ storable }) => setEnding(storable, "best")),
]);

sceneDeal.action([
  timunMas.say`Aku tidak akan lari. Aku akan menghadapimu, Buto Ijo!`,
  butoIjo.say`Berani sekali kau, gadis kecil!`,
  narrator.say`Timun Mas menggunakan semua benda ajaib pemberian ibunya untuk melawan Buto Ijo.`,
  narrator.say`Pertarungan sengit terjadi, namun akhirnya Timun Mas berhasil mengalahkan Buto Ijo.`,
  narrator.say`Kemenangan Timun Mas menjadi legenda yang diceritakan turun-temurun. Tamat (Good Ending).`,
  Script.execute(({ storable }) => setEnding(storable, "good")),
]);

// Create and export story
const story = new Story("Legenda Timun Mas");
story.entry(sceneIntro);

export default story;
export const storyMeta = {
  title: "Legenda Timun Mas",
  region: "Jawa Tengah",
  description: "Kisah seorang gadis pemberani yang melawan raksasa jahat.",
  difficulty: "Pemula",
  coverImage: "/images/jawa-tengah.jpg",
};
