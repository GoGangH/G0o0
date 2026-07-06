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
    name: "Grapic - 커뮤니티 콘텐츠 수집/운영 어드민",
    description: "커뮤니티 콘텐츠 수집 서버와 정산·회원 권한·포스팅 관리 어드민 개발",
    tech: ["TypeScript", "Node.js", "React", "Docker"],
    period: "2025.07 ~ 2025.09",
    details: [
      "커뮤니티별 페이지 구조를 분석해 제목, 본문, 이미지를 추출하는 수집 서버 개발",
      "운영자가 URL만 입력하면 수집 결과를 기존 서비스 포스팅 형식으로 변환해 등록하도록 API 연동",
      "정산 내역 확인, 회원 권한 변경, 포스팅 상태 수정이 가능한 관리 API와 어드민 화면 개발",
      "정산, 회원 권한, 포스팅 상태 등 3개 운영 영역을 개발자의 DB 직접 수정 없이 관리할 수 있도록 개선",
    ],
  },
  {
    id: 2,
    name: "Hashscape · Salt Hub",
    description: "Telegram 미니앱 기반 포인트 파밍, 퀘스트, 친구 초대, 게임, 토큰 드롭 이벤트 서비스",
    tech: ["TypeScript", "NestJS", "Next.js", "MongoDB", "Redis", "Telegram Bot API", "AWS"],
    period: "2024.07 ~ 2025.02",
    details: [
      "인증, 사용자, 포인트, 퀘스트, 초대, 게임 API와 웹 화면 개발",
      "누적 사용자 40만 명 이상, MAU 2,000~3,000명을 기록해 후속 거래 서비스의 시장성과 초기 사용자 기반 검증",
      "게임 점수를 Redis에 임시 누적하고 종료 요청에서 최종 점수만 MongoDB에 저장해 반복 DB 쓰기 감소",
      "MongoDB Atlas 복제 지연으로 발생한 가입 직후 조회 실패를 writeConcern majority 적용으로 제거",
      "초대, 가입, 게임 이용 등 3개 핵심 마케팅 지표를 실시간 조회하고 PDF로 공유하는 어드민 개발",
      "이벤트, 배너, 알림 등 운영 기능을 배포 없이 비개발자가 직접 변경할 수 있도록 구축",
    ],
  },
  {
    id: 3,
    name: "Hashscape · Solthumb",
    description: "Solana, Hedera, BSC, Ethereum 밈 토큰 거래와 자산·거래 내역·추천 보상 관리 서비스",
    tech: ["TypeScript", "NestJS", "React Native", "MongoDB", "Redis", "BullMQ", "Decimal.js"],
    period: "2025.02 ~ 2025.07",
    details: [
      "백엔드 전반과 아키텍처 의사결정을 주도하고 체인별 거래, 송금, 수신, 보상 처리 API 개발",
      "4개 네트워크의 서로 다른 거래 기록을 분석해 매수, 매도, 송금, 수신, 보상 여부를 판별하고 하나의 이력 스키마로 통합",
      "거래 식별값과 사용자 정보를 BullMQ 영속 작업으로 먼저 등록해 서버 재시작 후에도 후속 분석을 복구하도록 설계",
      "외부 데이터 지연에 최대 10회 재시도하고 최종 실패 작업을 별도로 남겨 오프체인 이력 누락 가능성 감소",
      "가격 수집 서버를 서비스 API와 분리하고 Redis로 작업 실행 상태를 관리해 중복 수집 제한",
      "거래 식별값과 사용자 ID 기준 upsert, Decimal.js 계산으로 보유 수량·평균 매수가·평가 금액·수익률 제공",
      "Salt Hub 사용자 성과와 Solthumb 멀티체인 제품 로드맵을 기반으로 Hedera 재단 개발 그랜트 계약 체결에 기여",
    ],
  },
  {
    id: 4,
    name: "Nexters · Logit",
    description: "취업 준비생의 경험 구조화, 자기소개서 문항별 경험 추천, MCP 연동 서비스",
    tech: ["Python", "FastAPI", "PostgreSQL", "Redis", "Qdrant", "OpenAI API", "FastMCP", "Next.js", "Prisma", "Docker", "Caddy"],
    period: "2026.01 ~ 2026.03",
    details: [
      "BE 리드로 백엔드 아키텍처와 API 규칙을 정하고 인증, 경험, 지원 프로젝트, 문항, 채팅 서버 개발",
      "문항 60%, 직무 25%, 회사 15% 점수 결합과 경험 태그 Jaccard 유사도, 역량 카테고리 보정을 적용한 RAG 추천 로직 개발",
      "SQLAlchemy 비동기 세션과 asyncpg로 DB 접근 방식을 통일하고 Alembic으로 스키마 변경 관리",
      "테스트 DB 의존성 주입과 외부 API mock을 구성해 4개 테스트 모듈에 59개 자동화 테스트 구축",
      "경험 검색·저장, 문항별 경험 선택, 지원 프로젝트 조회 등 MCP 도구 10개 구현",
      "dev/prod 환경과 사용자, 프로젝트, 문항, 경험, 채팅 5개 운영 영역을 하나의 어드민에서 관리하도록 개발",
    ],
  },
];
