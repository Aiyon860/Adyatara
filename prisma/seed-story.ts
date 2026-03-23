import { db as prisma } from '../src/lib/db';

async function main() {
  // ============================================
  // STORY 1: LEGENDA TIMUN MAS
  // ============================================

  const story = await prisma.story.create({
    data: {
      title: "Legenda Timun Mas",
      region: "Jawa Tengah",
      description: "Kisah seorang gadis pemberani yang melawan raksasa jahat.",
      difficulty: "Pemula",
      levelReq: 1,
      coverImage: "/stories/timun-mas/cover.jpg",
      backgroundMusicDefault: "/audio/bgm-village.mp3"
    }
  });

  // CHARACTERS
  await prisma.character.create({
    data: { name: "Mbok Srini", avatar: "/characters/mbok-srini.png" }
  });

  const timunMasChar = await prisma.character.create({
    data: { name: "Timun Mas", avatar: "/characters/timun-mas.png" }
  });

  const butoIjo = await prisma.character.create({
    data: { name: "Buto Ijo", avatar: "/characters/buto-ijo.png" }
  });

  const narator = await prisma.character.create({
    data: { name: "Narator", avatar: "/characters/narator.png" }
  });

  // KNOWLEDGE
  const k1 = await prisma.knowledge.create({
    data: {
      title: "Asal Usul Timun Mas",
      content: "Timun Mas lahir dari sebuah mentimun ajaib yang diberikan oleh Buto Ijo.",
      category: "Sejarah",
      storyId: story.id
    }
  });

  // NODES
  const intro = await prisma.node.create({
    data: {
      storyId: story.id,
      content: "Di sebuah desa, hiduplah seorang janda bernama Mbok Srini yang sangat merindukan seorang anak.",
      type: "narration",
      speakerId: narator.id,
      backgroundImage: "/bg/village-day.jpg",
      backgroundMusic: "/audio/bgm-village.mp3",
      isAutoPlay: false
    }
  });

  const node1 = await prisma.node.create({
    data: {
      storyId: story.id,
      content: "Suatu hari, raksasa Buto Ijo datang menawarkan bantuan dengan syarat anak itu harus diserahkan saat dewasa.",
      type: "choice",
      speakerId: butoIjo.id,
      backgroundImage: "/bg/forest-dark.jpg",
      backgroundMusic: "/audio/bgm-tense.mp3",
      expression: "angry",
      position: "center"
    }
  });

  await prisma.choice.create({
    data: {
      nodeId: intro.id,
      text: "Lanjutkan",
      nextNodeId: node1.id
    }
  });

  const node2 = await prisma.node.create({
    data: {
      storyId: story.id,
      content: "Mbok Srini menerima biji mentimun tersebut, dan lahirlah Timun Mas.",
      type: "choice",
      speakerId: narator.id,
      backgroundImage: "/bg/village-day.jpg",
      backgroundMusic: "/audio/bgm-happy.mp3"
    }
  });

  // NODE 3 (BAD END - tolak perjanjian)
  const node3 = await prisma.node.create({
    data: {
      storyId: story.id,
      content: "Mbok Srini menolak, dan tetap hidup dalam kesepian. Tamat.",
      type: "ending",
      speakerId: narator.id,
      backgroundImage: "/bg/sad.jpg",
      backgroundMusic: "/audio/bgm-sad.mp3"
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        nodeId: node1.id,
        text: "Terima perjanjian",
        nextNodeId: node2.id,
        scoreDelta: 30,
        knowledgeId: k1.id
      },
      {
        nodeId: node1.id,
        text: "Tolak",
        nextNodeId: node3.id,
        scoreDelta: 0
      }
    ]
  });

  const node4 = await prisma.node.create({
    data: {
      storyId: story.id,
      content: "Buto Ijo datang menagih janji. Timun Mas harus melarikan diri!",
      type: "choice",
      speakerId: narator.id,
      backgroundImage: "/bg/forest-run.jpg",
      backgroundMusic: "/audio/bgm-chase.mp3"
    }
  });

  await prisma.choice.create({
    data: {
      nodeId: node2.id,
      text: "Lanjutkan",
      nextNodeId: node4.id
    }
  });

  // NODE 5 (BEST END - larilah)
  const node5 = await prisma.node.create({
    data: {
      storyId: story.id,
      content: "Timun Mas melempar biji ajaib yang berubah menjadi lautan lumpur dan menelan Buto Ijo. Kamu selamat!",
      type: "ending",
      speakerId: timunMasChar.id,
      backgroundImage: "/bg/victory.jpg",
      backgroundMusic: "/audio/bgm-victory.mp3",
      expression: "happy",
      position: "center"
    }
  });

  // NODE 6 (GOOD END - hadapi Buto Ijo) -- previously missing from DB
  const node6 = await prisma.node.create({
    data: {
      storyId: story.id,
      content: "Timun Mas menghadapi Buto Ijo langsung dan berhasil mengalahkannya dengan benda ajaib. Kemenangannya menjadi legenda. Tamat.",
      type: "ending",
      speakerId: timunMasChar.id,
      backgroundImage: "/bg/victory.jpg",
      backgroundMusic: "/audio/bgm-victory.mp3",
      expression: "happy",
      position: "center"
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        nodeId: node4.id,
        text: "Larilah, Timun Mas!",
        nextNodeId: node5.id,
        scoreDelta: 30
      },
      {
        nodeId: node4.id,
        text: "Hadapi Buto Ijo",
        nextNodeId: node6.id,
        scoreDelta: 15
      }
    ]
  });

  console.log("✅ Timun Mas VN Seed Complete:", story.id);

  // ============================================
  // STORY 2: LEGENDA CANDI PRAMBANAN
  // ============================================

  const storyPrambanan = await prisma.story.create({
    data: {
      title: "Legenda Candi Prambanan",
      region: "Jawa Tengah",
      description: "Kisah cinta dan pengkhianatan Bandung Bondowoso dan Roro Jonggrang.",
      difficulty: "Pemula",
      levelReq: 1,
      coverImage: "/images/jawa-tengah.jpg",
      backgroundMusicDefault: "/audio/bgm-village.mp3"
    }
  });

  // CHARACTERS
  const naratorPr = await prisma.character.create({
    data: { name: "Narator", avatar: "/characters/narator.png" }
  });

  const bandung = await prisma.character.create({
    data: { name: "Bandung Bondowoso", avatar: "/characters/bandung-bondowoso.png" }
  });

  const roro = await prisma.character.create({
    data: { name: "Roro Jonggrang", avatar: "/characters/roro-jonggrang.png" }
  });

  // NODES
  const pIntro = await prisma.node.create({
    data: {
      storyId: storyPrambanan.id,
      content: "Di sebuah zaman dahulu kala, terdapat dua kerajaan yang saling bermusuhan, yaitu Pengging dan Boko.",
      type: "narration",
      speakerId: naratorPr.id,
      backgroundImage: "/bg/temple.jpg",
      backgroundMusic: "/audio/bgm-village.mp3",
      isAutoPlay: false
    }
  });

  const pChoice1 = await prisma.node.create({
    data: {
      storyId: storyPrambanan.id,
      content: "Bandung Bondowoso melihat Roro Jonggrang yang sedang berduka. Apa yang akan dia lakukan?",
      type: "choice",
      speakerId: bandung.id,
      backgroundImage: "/bg/temple.jpg",
      backgroundMusic: "/audio/bgm-tense.mp3"
    }
  });

  await prisma.choice.create({
    data: { nodeId: pIntro.id, text: "Lanjutkan", nextNodeId: pChoice1.id }
  });

  const pProposal = await prisma.node.create({
    data: {
      storyId: storyPrambanan.id,
      content: "Bandung Bondowoso melamar Roro Jonggrang dengan sopan. Roro memberi syarat: bangun 1000 candi dalam satu malam.",
      type: "choice",
      speakerId: roro.id,
      backgroundImage: "/bg/temple.jpg",
      backgroundMusic: "/audio/bgm-happy.mp3"
    }
  });

  // BAD END - gunakan kekuatan
  const pBadEnd = await prisma.node.create({
    data: {
      storyId: storyPrambanan.id,
      content: "Bandung Bondowoso memaksa Roro Jonggrang. Karena amarahnya, ia mengutuk Roro menjadi batu. Tamat.",
      type: "ending",
      speakerId: naratorPr.id,
      backgroundImage: "/bg/sad.jpg",
      backgroundMusic: "/audio/bgm-sad.mp3"
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        nodeId: pChoice1.id,
        text: "Lamar dia dengan sopan",
        nextNodeId: pProposal.id,
        scoreDelta: 30
      },
      {
        nodeId: pChoice1.id,
        text: "Gunakan kekuatan untuk memaksanya",
        nextNodeId: pBadEnd.id,
        scoreDelta: 0
      }
    ]
  });

  // BEST END - terima syarat dan bangun candi
  const pBestEnd = await prisma.node.create({
    data: {
      storyId: storyPrambanan.id,
      content: "Bandung Bondowoso membangun 999 candi. Roro Jonggrang curang dan dikutuk menjadi candi ke-1000. Tamat.",
      type: "ending",
      speakerId: naratorPr.id,
      backgroundImage: "/bg/victory.jpg",
      backgroundMusic: "/audio/bgm-victory.mp3"
    }
  });

  // NEUTRAL END - tolak syarat
  const pNeutralEnd = await prisma.node.create({
    data: {
      storyId: storyPrambanan.id,
      content: "Bandung Bondowoso menolak syarat Roro dan meninggalkannya dengan kekecewaan. Tamat.",
      type: "ending",
      speakerId: naratorPr.id,
      backgroundImage: "/bg/sad.jpg",
      backgroundMusic: "/audio/bgm-sad.mp3"
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        nodeId: pProposal.id,
        text: "Terima syaratnya",
        nextNodeId: pBestEnd.id,
        scoreDelta: 30
      },
      {
        nodeId: pProposal.id,
        text: "Tolak syarat itu",
        nextNodeId: pNeutralEnd.id,
        scoreDelta: 10
      }
    ]
  });

  console.log("✅ Prambanan VN Seed Complete:", storyPrambanan.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
