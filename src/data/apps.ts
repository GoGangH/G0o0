import { career } from "./career";
import { projects } from "./projects";

// The phone's view of the portfolio. All wording stays in projects.ts and career.ts;
// this file only decides how it is grouped into apps.

type Section = { title: string; items: number[] };
type ProjectConfig = {
  id: string;
  name: string;
  letter: string;
  tint: string;
  image?: string;
  inset?: boolean;
  projectId: number;
  careerId: number;
  metrics: { value: string; label: string }[];
  sections: Section[];
  postSlug?: string;
};

const projectConfigs: ProjectConfig[] = [
  {
    id: "solthumb", name: "Solthumb", letter: "S", tint: "tint-teal", projectId: 3, careerId: 2,
    metrics: [{ value: "4개", label: "통합 네트워크" }, { value: "최대 10회", label: "지연 재시도" }],
    sections: [
      { title: "백엔드 설계", items: [0] },
      { title: "거래 이력 통합", items: [1, 5] },
      { title: "장애 복구", items: [2, 3] },
      { title: "가격 수집", items: [4] },
      { title: "그랜트 계약", items: [6] },
    ],
    postSlug: "bullmq-durable-jobs",
  },
  {
    id: "salthub", name: "Salt Hub", letter: "S", tint: "tint-blue", projectId: 2, careerId: 3,
    metrics: [{ value: "40만+", label: "누적 사용자" }, { value: "2,000~3,000", label: "MAU" }, { value: "3개", label: "실시간 지표" }],
    sections: [
      { title: "서비스 개발과 성과", items: [0, 1] },
      { title: "성능과 데이터 정합성", items: [2, 3] },
      { title: "운영 도구", items: [4, 5] },
    ],
    postSlug: "mongodb-writeconcern-majority",
  },
  {
    id: "logit", name: "Logit", letter: "L", tint: "tint-white", image: "/apps/logit.jpg", projectId: 4, careerId: 6,
    metrics: [{ value: "59개", label: "자동화 테스트" }, { value: "10개", label: "MCP 도구" }, { value: "5개", label: "운영 영역" }],
    sections: [
      { title: "백엔드 리드", items: [0, 2] },
      { title: "경험 추천", items: [1] },
      { title: "MCP 도구", items: [4] },
      { title: "테스트", items: [3] },
      { title: "운영 어드민", items: [5] },
    ],
    postSlug: "rag-scoring-context",
  },
  {
    id: "grapic", name: "Grapic", letter: "G", tint: "tint-amber", projectId: 1, careerId: 1,
    metrics: [{ value: "3개", label: "운영 영역" }],
    sections: [
      { title: "콘텐츠 수집", items: [0, 1] },
      { title: "운영 어드민", items: [2, 3] },
    ],
  },
];

const findProject = (id: number) => projects.find((project) => project.id === id)!;
const findCareer = (id: number) => career.find((item) => item.id === id)!;

export const phoneProjects = projectConfigs.map(({ projectId, careerId, sections, ...config }) => {
  const project = findProject(projectId);
  return {
    ...config,
    position: findCareer(careerId).position,
    period: project.period,
    description: project.description,
    tech: project.tech,
    sections: sections.map(({ title, items }) => ({ title, items: items.map((index) => project.details[index]) })),
  };
});
export type PhoneProject = (typeof phoneProjects)[number];

export const phoneProject = (id: string) => phoneProjects.find((project) => project.id === id)!;

// Hashscape holds two products, so its app opens on a list first.
export const hashscape = { id: "hashscape", name: "Hashscape", letter: "#", tint: "tint-hashscape", image: "/apps/hashscape.svg", projects: ["solthumb", "salthub"] };

type ExperienceConfig = { id: string; name: string; label: string; letter: string; tint: string; image?: string; inset?: boolean; careerId: number };

const experienceConfigs: ExperienceConfig[] = [
  { id: "newweb", name: "뉴웹커뮤니케이션", label: "뉴웹", letter: "N", tint: "tint-rose", careerId: 4 },
  { id: "inspien", name: "Inspien", label: "Inspien", letter: "I", tint: "tint-white", image: "/apps/inspien.png", inset: true, careerId: 5 },
  { id: "soma", name: "소프트웨어 마에스트로 13기", label: "SW 마에스트로", letter: "M", tint: "tint-white", image: "/apps/soma.png", inset: true, careerId: 7 },
];

export const phoneExperiences = experienceConfigs.map(({ careerId, ...config }) => {
  const item = findCareer(careerId);
  return { ...config, position: item.position, period: item.period, items: item.description };
});
export type PhoneExperience = (typeof phoneExperiences)[number];

export const projectsUsing = (skill: string) =>
  phoneProjects.filter((project) => project.tech.some((tech) => tech.toLowerCase() === skill.toLowerCase()));
