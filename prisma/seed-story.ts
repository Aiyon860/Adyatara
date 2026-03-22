import { db as prisma } from '../src/lib/db';

async function main() {
  // 1. STORY
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

  // 2. CHARACTERS
  const ibu = await prisma.character.create({
    data: {
      name: "Mbok Srini",
      avatar: "/characters/mbok-srini.png"
    }
  });

  const timunMas = await prisma.character.create({
    data: {
      name: "Timun Mas",
      avatar: "/characters/timun-mas.png"
    }
  });

  const butoIjo = await prisma.character.create({
    data: {
      name: "Buto Ijo",
      avatar: "/characters/buto-ijo.png"
    }
  });

  const narator = await prisma.character.create({
    data: {
      name: "Narator",
      avatar: "/characters/narator.png"
    }
  });

  // 3. KNOWLEDGE
  const k1 = await prisma.knowledge.create({
    data: {
      title: "Asal Usul Timun Mas",
      content: "Timun Mas lahir dari sebuah mentimun ajaib yang diberikan oleh Buto Ijo.",
      category: "Sejarah",
      storyId: story.id
    }
  });

  // 4. NODES

  // INTRO
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

  // NODE 1
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

  // NODE 2
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

  // NODE 3 (BAD END)
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
        scoreDelta: 10,
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

  // NODE 4
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

  // NODE 5 (FINAL)
  const node5 = await prisma.node.create({
    data: {
      storyId: story.id,
      content: "Timun Mas melempar biji ajaib yang berubah menjadi lautan lumpur dan menelan Buto Ijo. Kamu selamat!",
      type: "ending",
      speakerId: timunMas.id,
      backgroundImage: "/bg/victory.jpg",
      backgroundMusic: "/audio/bgm-victory.mp3",
      expression: "happy",
      position: "center"
    }
  });

  await prisma.choice.create({
    data: {
      nodeId: node4.id,
      text: "Gunakan benda ajaib",
      nextNodeId: node5.id,
      scoreDelta: 50
    }
  });

  console.log("✅ Timun Mas VN Seed Complete:", story.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());