import { readIssues } from "./data";
import type { Issue, Article } from "./types";

// ──────────────────────────────────────────────
// 첨부된 목가적 시골 마을 수채화 이미지
// ──────────────────────────────────────────────
export const PASTORAL_HERO_IMAGE = "/images/pastoral_village.jpg";

export const ARTICLE_COVERS = [
  "/images/pastoral_village.jpg",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
];

// ──────────────────────────────────────────────
// 공식 제1호 회차 데이터 (Vol. 1)
// ──────────────────────────────────────────────
export const SAMPLE_ISSUE: Issue = {
  id: "issue-vol1",
  volume: 1,
  title: "제1호 - 평화와 은총의 산골 마을",
  publishDate: "2026-08-23",
  status: "PUBLISHED",
  createdAt: "2026-08-23T00:00:00.000Z",
  updatedAt: "2026-08-23T00:00:00.000Z",
  articles: [
    {
      id: "art-hero-1",
      issueId: "issue-vol1",
      order: 1,
      title: "산기슭 아래 작은 성당과 목가적 삶의 침묵",
      description:
        "초록빛 들판과 소박한 오두막집 사이로 들려오는 저녁 종소리. 자연의 섭리 속에서 보편된 교회의 은총과 내면의 평화를 묵상합니다.",
      content: `
<p className="lead">아침 안개가 푸른 산기슭을 감싸 안을 때, 작은 산골 마을의 오두막집 지붕 위로 따스한 햇살이 번져갑니다. 아이들의 웃음소리와 성당의 새벽 종소리가 맑은 공기 속을 유연하게 흘러가는 이곳은 잊고 지냈던 내면의 평화와 만나는 침묵의 공간입니다.</p>

<h3>1. 자연과 묵상: 섭리의 신비</h3>
<p>가톨릭 전통에서 자연은 '제2의 성경'으로 불려왔습니다. 성 보나벤투라는 창조물 하나하나가 창조주의 신비를 담아내는 거울이라고 말했습니다. 푸른 들판을 가로지르는 맑은 시냇물과 대지를 일구는 노동자들의 소박한 땀방울 속에서 우리는 하느님의 숨결을 느낍니다.</p>

<blockquote className="my-6 border-l-4 border-amber-600 pl-4 font-serif italic text-amber-900 bg-amber-50/60 py-2">
"하늘은 하느님의 영광을 선포하고, 손수 만드신 하느님의 일들을 푸른 창공이 알리도다." — 시편 19장 2절
</blockquote>

<h3>2. 이웃과의 나눔과 일상의 거룩함</h3>
<p>마을 사람들은 아침 식탁을 나누며 하루를 시작합니다. 소박한 빵 한 조각과 따스한 차 한 잔 속에서 성체성사의 정신이 묵묵히 실천됩니다. 거창한 말이나 신학적 논쟁 대신, 이웃의 짐을 나누어 지는 작은 친절 속에 그리스도의 사랑이 피어납니다.</p>

<p>이 웹진은 바쁜 현대 사회를 살아가는 모든 이들에게 영혼의 쉼터가 되고자 합니다. 잠시 소음을 내려놓고, 우리 마음에 조용히 일어나는 신앙의 깊은 울림에 귀를 기울여 보시기 바랍니다.</p>
      `,
      coverImageUrl: PASTORAL_HERO_IMAGE,
      author: "베드로 신부",
      readTime: 6,
      isFeatured: true,
      createdAt: "2026-08-23T00:00:00.000Z",
      updatedAt: "2026-08-23T00:00:00.000Z",
    },
    {
      id: "art-sub-2",
      issueId: "issue-vol1",
      order: 2,
      title: "기억과 성찰: 교회사 속 침묵의 기도자들",
      description:
        "사막의 교부들로부터 산골짝에서 침묵의 기도를 드리던 수도자들의 영성과 조용한 성찰 이야기.",
      content: `
<p>소음이 가득한 세상 속에서 침묵은 더 이상 빈 공간이 아닌 하느님의 현존입니다. 4세기 사막의 교부들은 세상의 소음을 뒤로하고 사막으로 향했습니다.</p>
<p>오늘날 우리에게 침묵은 거룩한 소통입니다. 내면의 소음을 내려놓을 때 하느님의 부드러운 속삭임이 들려옵니다.</p>
      `,
      coverImageUrl: ARTICLE_COVERS[1],
      author: "클라라 수녀",
      readTime: 4,
      isFeatured: false,
      createdAt: "2026-08-23T00:00:00.000Z",
      updatedAt: "2026-08-23T00:00:00.000Z",
    },
    {
      id: "art-sub-3",
      issueId: "issue-vol1",
      order: 3,
      title: "일상 속 작은 성체성사: 빵을 나누는 감사",
      description:
        "식탁 위의 소박한 감사 기도와 나눔 속에 담긴 그리스도의 성체성사적 사랑을 묵상합니다.",
      content: `
<p>우리가 매일 마주하는 식탁은 작은 성전입니다. 가족과 함께 빵을 나누고 이야기를 나누는 순간마다 그리스도께서 함께 계십니다.</p>
<p>감사하는 마음으로 드리는 한 끼 식사는 영혼을 살찌우는 신앙의 자리가 됩니다.</p>
      `,
      coverImageUrl: ARTICLE_COVERS[2],
      author: "요한 형제",
      readTime: 3,
      isFeatured: false,
      createdAt: "2026-08-23T00:00:00.000Z",
      updatedAt: "2026-08-23T00:00:00.000Z",
    },
    {
      id: "art-sub-4",
      issueId: "issue-vol1",
      order: 4,
      title: "시골 마을의 노을 아래서 드리는 저녁 기도",
      description:
        "하루를 마무리하며 노을빛 들판에서 드리워지는 평화로운 기도와 은혜로운 안식의 시간.",
      content: `
<p>해 질 녘 산그림자가 마을을 덮을 때, 하루의 수고를 내려놓고 저녁 기도를 바칩니다. 감사와 회개의 기도가 노을빛에 물듭니다.</p>
<p>하느님 안에서 누리는 참된 안식이야말로 내일을 살아갈 힘이 됩니다.</p>
      `,
      coverImageUrl: ARTICLE_COVERS[3],
      author: "마리아 자매",
      readTime: 5,
      isFeatured: false,
      createdAt: "2026-08-23T00:00:00.000Z",
      updatedAt: "2026-08-23T00:00:00.000Z",
    },
    {
      id: "art-sub-5",
      issueId: "issue-vol1",
      order: 5,
      title: "아이들의 웃음소리와 희망: 미래 교회의 빛",
      description:
        "푸른 들판을 뛰놀며 자라나는 아이들의 순수한 신앙과 순례하는 교회의 희망찬 미래 이야기.",
      content: `
<p>어린이들의 맑은 웃음소리는 교회의 미래이자 희망입니다. 순수한 마음으로 하느님을 신뢰하는 아이들에게서 하늘나라를 봅니다.</p>
<p>우리가 아이들에게 전해줄 최고의 유산은 하느님을 사랑하는 참된 신앙의 삶입니다.</p>
      `,
      coverImageUrl: ARTICLE_COVERS[4],
      author: "스테파노 연구원",
      readTime: 4,
      isFeatured: false,
      createdAt: "2026-08-23T00:00:00.000Z",
      updatedAt: "2026-08-23T00:00:00.000Z",
    },
  ],
};

// ──────────────────────────────────────────────
// 공개 액션 함수들
// ──────────────────────────────────────────────
export async function getLatestPublishedIssue(): Promise<Issue> {
  const allIssues = readIssues();
  const published = allIssues
    .filter((i) => i.status === "PUBLISHED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (published.length > 0) {
    return published[0];
  }

  return SAMPLE_ISSUE;
}

export async function getPublishedIssues(): Promise<Issue[]> {
  const allIssues = readIssues();
  const published = allIssues
    .filter((i) => i.status === "PUBLISHED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (published.length > 0) {
    return published;
  }

  return [SAMPLE_ISSUE];
}

export async function getArticleById(id: string): Promise<{ article: Article; issue: Issue } | null> {
  const allIssues = readIssues();
  const all = [...allIssues, SAMPLE_ISSUE];

  for (const issue of all) {
    const found = issue.articles.find((a) => a.id === id);
    if (found) {
      return { article: found, issue };
    }
  }

  return null;
}
