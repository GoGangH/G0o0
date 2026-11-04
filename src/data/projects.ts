// Mirrors the 개인 프로젝트 section of the resume. Work projects live in career.ts.

export interface Project {
  id: number;
  name: string;
  /** What kind of thing it is, as the resume labels it: 웹 앱, 모바일 앱 … */
  type: string;
  description: string;
  tech: string[];
  links?: { label: string; url: string }[];
  details: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    name: "투디니",
    type: "웹 앱",
    description: "게임형 투자 학습",
    tech: ["Kotlin", "Spring Boot", "Kafka", "Kubernetes", "React", "Docker"],
    details: ["투자 학습의 진입장벽을 낮추고 실제 거래 구조·대규모 데이터 처리를 학습하기 위해 개발 중인 모의투자 서비스. Kubernetes 파드별로 성향이 다른 가상 투자자를 구성하고 수를 조절해 초기 거래 부족에 대응하며, 뉴스에 반응하는 투자와 가격 변화를 간접 체험하도록 구현 중. 토스 인앱 출시 목표."],
  },
  {
    id: 2,
    name: "Jobgil",
    type: "웹 서비스",
    description: "취업 준비 통합",
    tech: ["TypeScript", "NestJS", "Next.js", "PostgreSQL(Supabase)", "Docker"],
    links: [{ label: "jobgil.com", url: "https://jobgil.com" }],
    details: ["취업 준비가 여러 도구에 흩어지는 불편을 줄이고자 공고 수집·기업/직무 분석·이력서 피드백·전형 관리·아침 알림을 연결한 서비스. 약 6개월간 직접 사용, 배포 후 약 10명의 사용자 피드백을 반영해 개선 중."],
  },
  {
    id: 3,
    name: "DevMate",
    type: "macOS 데스크톱 앱",
    description: "AI 개발 환경 통합",
    tech: ["TypeScript", "Bun", "Tauri", "Rust"],
    details: ["AI마다 작업 맥락과 진행 상황을 따로 관리하는 번거로움을 줄이는 도구. 한 세션에서 여러 AI를 사용하며 토큰·컨텍스트·병렬 작업·Git·Issue·할 일 통합 관리."],
  },
  {
    id: 4,
    name: "하루 한 개 면접 질문",
    type: "모바일 앱",
    description: "맞춤 면접 학습",
    tech: ["React Native", "Python", "FastAPI", "Supabase", "pgvector", "Docker", "Caddy", "RAG"],
    details: ["이력서·직무·경험을 RAG로 참조해 매일의 맞춤 질문과 음성·텍스트 답변 피드백을 연결하는 모바일 면접 학습 서비스."],
  },
  {
    id: 5,
    name: "일단옴",
    type: "웹 서비스",
    description: "모임 관리",
    tech: ["TypeScript", "Next.js", "Supabase", "PostgreSQL", "Tailwind CSS"],
    links: [{ label: "jsu.g0o0.com", url: "https://jsu.g0o0.com" }],
    details: ["스터디 기록·일정·피드백이 흩어지는 문제를 줄이고자 모임 전 주간 기록·일정 조율과 모임 후 익명 피드백을 모은 서비스."],
  },
  {
    id: 6,
    name: "트리 학습 사이트",
    type: "웹 학습 도구",
    description: "트리 학습 시각화",
    tech: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Canvas API", "Vercel"],
    links: [{ label: "tree.g0o0.com", url: "https://tree.g0o0.com" }],
    details: ["수업 중 트리를 직접 그려 연습하고 정답을 확인하는 어려움을 줄이고자 트리 구성·결과 확인·연습을 지원하는 웹 도구 개발·공유. 현재도 교수님이 수업에서 소개·활용 중. 활용 학기에 80점 이상 학생 수가 기존 대비 30% 이상 증가했다는 피드백 수신."],
  },
  {
    id: 7,
    name: "자격증 CBT",
    type: "문제풀이 서비스",
    description: "자격증 학습",
    tech: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Vercel"],
    links: [{ label: "eip.g0o0.com", url: "https://eip.g0o0.com" }],
    details: ["자격증 공부 중 직접 개발한 CBT 문제풀이 서비스. 커뮤니티에 공유해 다른 사람도 사용하고 피드백을 남길 수 있도록 공개."],
  },
];
