import { career, type CareerItem } from "./career";

// The phone's view of the portfolio. All wording stays in career.ts, which mirrors the resume;
// this file only decides how it is grouped into apps.

type ProjectConfig = {
  id: string;
  name: string;
  letter: string;
  tint: string;
  image?: string;
  inset?: boolean;
  careerId: string;
  metrics: { value: string; label: string }[];
  postSlug?: string;
};

const projectConfigs: ProjectConfig[] = [
  {
    id: "solthumb", name: "Solthumb", letter: "S", tint: "tint-teal", careerId: "solthumb",
    metrics: [{ value: "120만 원+", label: "대체한 외부 API 비용" }],
    postSlug: "bullmq-durable-jobs",
  },
  {
    id: "salthub", name: "Salt Hub", letter: "S", tint: "tint-blue", careerId: "salthub",
    metrics: [{ value: "40만+", label: "누적 사용자" }, { value: "2,000~3,000", label: "MAU" }],
    postSlug: "mongodb-writeconcern-majority",
  },
  {
    id: "logit", name: "Logit", letter: "L", tint: "tint-white", image: "/apps/logit.jpg", careerId: "logit",
    metrics: [{ value: "59개", label: "자동화 테스트" }, { value: "10개", label: "MCP 도구" }, { value: "2개", label: "통합 관리 환경" }],
    postSlug: "rag-scoring-context",
  },
  {
    id: "grapic", name: "Grapic", letter: "G", tint: "tint-amber", careerId: "grapic",
    metrics: [{ value: "Lambda", label: "요청 기반 크롤링" }],
  },
];

const findCareer = (id: string) => career.find((item) => item.id === id)!;
const asLines = (item: CareerItem) => item.sections.flatMap(({ title, items }) => items.map((text) => `${title} · ${text}`));

export const phoneProjects = projectConfigs.map(({ careerId, ...config }) => {
  const item = findCareer(careerId);
  return {
    ...config,
    position: item.position,
    period: item.period,
    description: item.summary ?? "",
    tech: item.tech,
    sections: item.sections,
    highlight: item.highlight,
  };
});
export type PhoneProject = (typeof phoneProjects)[number];

export const phoneProject = (id: string) => phoneProjects.find((project) => project.id === id)!;

// Hashscape holds two products, so its app opens on a list first.
export const hashscape = { id: "hashscape", name: "Hashscape", letter: "#", tint: "tint-hashscape", image: "/apps/hashscape.svg", projects: ["solthumb", "salthub"] };

type ExperienceConfig = { id: string; name: string; label: string; letter: string; tint: string; image?: string; inset?: boolean; careerId: string };

const experienceConfigs: ExperienceConfig[] = [
  { id: "newweb", name: "뉴웹커뮤니케이션", label: "뉴웹", letter: "N", tint: "tint-rose", careerId: "newweb" },
  { id: "inspien", name: "Inspien", label: "Inspien", letter: "I", tint: "tint-white", image: "/apps/inspien.png", inset: true, careerId: "inspien" },
  { id: "soma", name: "소프트웨어 마에스트로 13기", label: "SW 마에스트로", letter: "M", tint: "tint-white", image: "/apps/soma.png", inset: true, careerId: "soma" },
];

export const phoneExperiences = experienceConfigs.map(({ careerId, ...config }) => {
  const item = findCareer(careerId);
  return { ...config, position: item.position, period: item.period, items: asLines(item), highlight: item.highlight };
});
export type PhoneExperience = (typeof phoneExperiences)[number];

export const projectsUsing = (skill: string) =>
  phoneProjects.filter((project) => project.tech.some((tech) => tech.toLowerCase() === skill.toLowerCase()));
