export interface Project {
  id: number;
  name: string;
  description: string;
  tech: string[];
  period: string;
  links?: { label: string; url: string }[];
  details: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    name: "Salt Hub - Telegram 미니앱",
    description: "텔레그램 내에서 동작하는 미니앱, 누적 사용자 40만 명, MAU 2,000명 돌파",
    tech: ["NestJS", "Next.js", "Telegram Bot", "MongoDB", "Redis", "Docker", "AWS"],
    period: "2024.07 ~ 2025.02",
    links: [
      { label: "Mini App", url: "#" },
      { label: "Announcement", url: "#" },
      { label: "Blog", url: "#" },
    ],
    details: [
      "Redis 기반 세션 관리 및 사용자 상태 추적 시스템 구현",
      "MongoDB + Redis 혼합 아키텍처로 데이터 접근 최적화",
      "흔들기 게임의 동작 및 포인트 서비스 개발 (토큰 기반 세션 관리)",
      "친구 초대 및 초대한 친구가 벌어드린 포인트 받기 기능 개발",
      "파밍을 통해 포인트 얻는 기능 개발",
      "외부 기업들의 서비스 접근 시 포인트를 얻는 기능 개발 (다수 파트너 계약 체결)",
    ],
  },
  {
    id: 2,
    name: "토큰 거래 알림 및 자동화 봇",
    description: "신규 토큰 상장 정보 자동 감지 및 실시간 알림 시스템 (구독자 3,000명+)",
    tech: ["Nest.js", "Telegram Bot", "WebSocket", "MongoDB"],
    period: "2024.08 ~ 2025.01",
    links: [
      { label: "Solana Pool Bot", url: "#" },
      { label: "Blog", url: "#" },
    ],
    details: [
      "WebSocket 기반 실시간 상장 추적 및 채널 알림",
      "빠른 응답성과 확장성을 위한 큐 및 비동기 처리 구조 설계",
      "가장 유명한 UniSwap Bot보다 1~2초 더 빠른 알림 속도 달성",
    ],
  },
  {
    id: 3,
    name: "욕설 감지 봇",
    description: "욕설 음성 인식으로 욕, 억양, 감정으로 점수를 매기고 포인트 지급",
    tech: ["Python", "Hugging Face", "Whisper", "Telegram Bot", "MongoDB", "Docker"],
    period: "2024.08 ~ 2025.01",
    details: [
      "Whisper, Hugging Face 등 AI 모델을 활용한 음성 분석 및 점수 산정",
      "봇의 분석 작업 동시수행 가능하게 개발 및 배포",
      "Telegram Bot 비동기 한계 극복: 여러 봇을 번갈아가며 비동기처럼 동작하게 개발",
    ],
  },
  {
    id: 4,
    name: "Salt - Web3 기반 토큰 거래",
    description: "외부 지갑 서비스 연결 및 토큰 입출금, 거래 플랫폼",
    tech: ["Nest.js", "Next.js", "React Native", "AWS", "Expo", "MongoDB", "S3"],
    period: "2024.10 ~ 2025.02",
    links: [
      { label: "Trade Web", url: "#" },
      { label: "Main Web", url: "#" },
    ],
    details: [
      "외부 API 사용량을 고려하며 실시간 토큰 가격/정보를 받아오는 서버 개발",
      "데이터 누락 방지를 위한 큐, Redis 저장, 비동기 처리 구조 설계",
      "토큰 상장, 공지, 통계를 위한 어드민 웹 개발",
      "사용자 트랜잭션 분석 및 감지를 통해 입금, 거래, PNL 기능 개발",
      "BullMQ를 활용하여 모든 거래 누락 없이 저장 및 PNL 누계",
      "Smart Contract 제작 및 배포를 통한 레퍼럴 시스템 개발",
      "각국 유저를 위한 다국어 지원 기능 (i18n) 구현",
    ],
  },
];
