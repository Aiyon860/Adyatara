import { db as prisma } from '../src/lib/db';

async function main() {
  // 1. Create a Story
  const story = await prisma.story.create({
    data: {
      title: "Legenda Candi Prambanan",
      region: "Jawa Tengah",
      description: "Kisah cinta dan pengkhianatan Bandung Bondowoso dan Roro Jonggrang.",
      difficulty: "Pemula",
      levelReq: 1,
    }
  });

  // 2. Create Knowledge Base
  const k1 = await prisma.knowledge.create({
    data: {
      title: "Bandung Bondowoso",
      content: "Seorang ksatria sakti yang menguasai pasukan jin.",
      category: "Tokoh",
      storyId: story.id
    }
  });

  // 3. Create Nodes
  const nodeIntro = await prisma.node.create({
      data: {
          storyId: story.id,
          content: "Di sebuah zaman dahulu kala, terdapat dua kerajaan yang saling bermusuhan, yaitu Pengging dan Boko. Kerajaan Pengging dipimpin oleh seorang raja yang memiliki putra perkasa bernama Bandung Bondowoso. Sementara itu, Kerajaan Boko memiliki seorang putri yang sangat cantik jelita bernama Roro Jonggrang.",
          type: "narration",
          isAutoPlay: false
      }
  })

  const node1 = await prisma.node.create({
    data: {
      storyId: story.id,
      content: "Kamu adalah Bandung Bondowoso yang baru saja memenangkan perang setelah menaklukkan Kerajaan Boko. Kamu melihat putri kerajaan musuh, Roro Jonggrang yang sedang berduka, namun kamu justru jatuh hati kepadanya. Apa yang kamu lakukan?",
      type: "choice"
    }
  });

  // Hubungkan Intro ke Node 1
  await prisma.choice.create({
      data: {
          nodeId: nodeIntro.id,
          text: "Lanjutkan",
          nextNodeId: node1.id,
      }
  })

  const node2 = await prisma.node.create({
    data: {
      storyId: story.id,
      content: "Roro Jonggrang menolak secara halus dengan memberikan syarat mustahil: membangun 1000 candi dalam satu malam.",
      type: "choice"
    }
  });

  const node3 = await prisma.node.create({
      data: {
        storyId: story.id,
        content: "Kamu memaksa dan Roro Jonggrang marah besar. Tamat.",
        type: "ending"
      }
    });

  const node4 = await prisma.node.create({
    data: {
        storyId: story.id,
        content: "Kamu memanggil pasukan jin. Namun Roro Jonggrang curang, membakar jerami hingga ayam berkokok sebelum pagi. Candi kurang satu.",
        type: "choice"
    }
  })

  const node5 = await prisma.node.create({
      data: {
          storyId: story.id,
          content: "Kamu marah karena dicurangi, dan mengutuk Roro Jonggrang menjadi candi yang ke-1000. Tamat (Best Ending).",
          type: "ending"
      }
  })

  // 4. Create Choices
  await prisma.choice.create({
    data: {
      nodeId: node1.id,
      text: "Lamar dia dengan sopan.",
      nextNodeId: node2.id,
      scoreDelta: 10,
      knowledgeId: k1.id
    }
  });

  await prisma.choice.create({
    data: {
      nodeId: node1.id,
      text: "Gunakan kekuatan untuk memaksanya.",
      nextNodeId: node3.id,
      scoreDelta: 0
    }
  });

  await prisma.choice.create({
    data: {
      nodeId: node2.id,
      text: "Terima syaratnya.",
      nextNodeId: node4.id,
      scoreDelta: 20
    }
  });

  await prisma.choice.create({
      data: {
          nodeId: node4.id,
          text: "Kutuk dia jadi candi",
          nextNodeId: node5.id,
          scoreDelta: 50
      }
  })

  console.log("Seed complete. Story ID:", story.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
