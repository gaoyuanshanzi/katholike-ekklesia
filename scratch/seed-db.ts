import prisma from "../src/lib/db";

async function seed() {
  console.log("Seeding Vol.1 with 5 articles into Neon DB...");

  const issueId = crypto.randomUUID();
  const now = new Date();

  // Remove any existing Vol.1 to avoid duplicates
  await prisma.issue.deleteMany({
    where: { volume: 1 },
  });

  const issue = await prisma.issue.create({
    data: {
      id: issueId,
      volume: 1,
      title: "제1호 - 보편교회의 시작과 비전",
      publishDate: new Date("2026-07-25"),
      status: "PUBLISHED",
      createdAt: now,
      updatedAt: now,
      articles: {
        create: [
          {
            id: crypto.randomUUID(),
            order: 1,
            title: "보편교회란 무엇인가?",
            description: "사도신경의 거룩한 공회를 믿사오며 할 때의 공회가 바로 이 보편교회를 의미합니다.",
            content: `<p>사도신경의 "거룩한 공회(공교회)를 믿사오며" 할 때의 '공회'가 바로 이 보편교회(카톨리케 에클레시아)를 의미하는 것이며, 이 땅의 그리스도인들을 차별없이 받는 보편적인 교회를 말합니다.</p><p>우리는 하나님의 은혜로 구원받고 거듭난 믿는이들과 함께 보편교회를 건축하며, 이 땅에 하나님의 움직이심에 동참하기를 원하는 성도들의 모임입니다.</p>`,
            coverImageUrl: "/images/pastoral_village.jpg",
            author: "편집부",
            readTime: 5,
            isFeatured: true,
            createdAt: now,
            updatedAt: now,
          },
          {
            id: crypto.randomUUID(),
            order: 2,
            title: "기사 2 - 그리스도의 몸으로서의 보편성",
            description: "그리스도의 몸 안에서 교파와 담을 넘어 하나 되는 보편적 교통의 가치",
            content: `<p>교회의 보편성은 교파나 외형적 형식을 뛰어넘어 교회의 머리이신 그리스도 안에서 전 세계 성도들이 한 몸을 이루는 진정한 교제를 가리킵니다.</p>`,
            coverImageUrl: "/images/pastoral_village.jpg",
            author: "편집부",
            readTime: 5,
            isFeatured: false,
            createdAt: now,
            updatedAt: now,
          },
          {
            id: crypto.randomUUID(),
            order: 3,
            title: "기사 3 - 은혜와 진리의 건축",
            description: "하나님의 은혜로 구원받은 믿는 이들이 한마음으로 보편교회를 건축하는 삶",
            content: `<p>우리는 각자의 은사를 따라 교회를 봉사하고 성도 간의 사랑으로 조화롭게 어우러져 그리스도의 형상을 이루어 가고 있습니다.</p>`,
            coverImageUrl: "/images/pastoral_village.jpg",
            author: "편집부",
            readTime: 5,
            isFeatured: false,
            createdAt: now,
            updatedAt: now,
          },
          {
            id: crypto.randomUUID(),
            order: 4,
            title: "기사 4 - 시대 속의 파수꾼과 동참",
            description: "이 땅에서 하나님의 살아계신 움직이심에 동참하는 성도들의 사명과 증언",
            content: `<p>보편교회 성도들은 어두운 세상 속에서 하나님의 사랑과 빛을 비추는 일에 동참하며 이 땅 위에 하나님 나라의 은혜를 전파합니다.</p>`,
            coverImageUrl: "/images/pastoral_village.jpg",
            author: "편집부",
            readTime: 5,
            isFeatured: false,
            createdAt: now,
            updatedAt: now,
          },
          {
            id: crypto.randomUUID(),
            order: 5,
            title: "기사 5 - 신앙의 거룩한 유산과 순례",
            description: "사도들의 가르침과 신앙의 전통을 이어받아 걸어가는 은혜로운 순례길",
            content: `<p>역사 속에서 이어져 온 거룩한 교회의 믿음을 지키며, 다가올 영광스러운 날을 소망 가운데 준비하는 순례자의 삶을 다짐합니다.</p>`,
            coverImageUrl: "/images/pastoral_village.jpg",
            author: "편집부",
            readTime: 5,
            isFeatured: false,
            createdAt: now,
            updatedAt: now,
          },
        ],
      },
    },
  });

  console.log("Successfully seeded Vol.1 into Neon DB:", issue.id);
}

seed()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
