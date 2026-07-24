// 공유 타입 정의

export type IssueStatus = "DRAFT" | "PUBLISHED";

export type ArticleInput = {
  id?: string;
  order: number; // 1~5, 1 = Hero 대표기사
  title: string;
  description: string;
  content: string;
  coverImageUrl: string;
  author: string;
  readTime: number;
  isFeatured: boolean;
};

export type IssueInput = {
  volume: number;
  title: string;
  publishDate: string;
};

export type Article = ArticleInput & {
  id: string;
  issueId: string;
  createdAt: string;
  updatedAt: string;
};

export type Issue = {
  id: string;
  volume: number;
  title: string;
  publishDate: string;
  status: IssueStatus;
  articles: Article[];
  createdAt: string;
  updatedAt: string;
};
