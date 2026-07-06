export interface CareerItem {
  id: number;
  company: string;
  position: string;
  period: string;
  description: string[];
}

export const career: CareerItem[] = [
  {
    id: 1,
    company: "Grapic",
    position: "파트타임 · 풀스택 개발자",
    period: "2025.07 ~ 2025.09",
    description: [
      "커뮤니티별 페이지 구조를 분석해 제목, 본문, 이미지를 추출하는 콘텐츠 수집 서버 개발",
      "URL 입력만으로 수집 결과를 기존 서비스 포스팅 형식으로 변환해 등록하도록 API 연동 및 Docker 배포",
      "정산 조회, 회원 권한 변경, 포스팅 상태 수정을 운영자가 직접 수행할 수 있는 어드민 화면과 관리 API 개발",
    ],
  },
  {
    id: 2,
    company: "Hashscape · Solthumb",
    position: "계약직 · 풀스택 개발자",
    period: "2025.02 ~ 2025.07",
    description: [
      "React Native 기반 Solthumb 멀티체인 거래 서비스의 백엔드 아키텍처, 거래·자산 API와 앱 화면 일부 개발",
      "Solana, Hedera, BSC, Ethereum 4개 네트워크의 거래를 하나의 이력 스키마와 API로 통합",
      "BullMQ 기반 영속 작업과 재시도 구조로 온체인 거래의 오프체인 이력 누락 가능성 감소",
      "Hedera 재단의 Solthumb 개발 그랜트 계약 체결에 기여",
    ],
  },
  {
    id: 3,
    company: "Hashscape · Salt Hub",
    position: "정규직 Founding Team · 풀스택 개발자",
    period: "2024.07 ~ 2025.02",
    description: [
      "Telegram 미니앱의 인증, 사용자, 포인트, 게임, 초대, 퀘스트, 드롭 API와 웹 화면 개발",
      "누적 사용자 40만 명 이상, MAU 2,000~3,000명 규모의 서비스 개발 및 운영",
      "게임 점수는 Redis에 임시 누적하고 종료 시 MongoDB에 최종 점수만 저장해 DB 쓰기 부하와 운영 비용 개선",
      "MongoDB Atlas 복제 지연으로 발생한 가입 직후 조회 실패를 writeConcern majority 적용으로 해결",
      "마케팅 지표, 이벤트, 배너, 알림을 비개발자가 직접 운영할 수 있는 어드민 구축",
    ],
  },
  {
    id: 4,
    company: "뉴웹커뮤니케이션",
    position: "프리랜서 · 자동화/웹 서버 개발자",
    period: "2023.07 ~ 2024.06",
    description: [
      "콘텐츠 분석, 생성, 게시 과정을 연결한 마케팅 자동화 시스템 개발",
      "Python 기반 AI 콘텐츠 생성 기능의 프롬프트 처리, 비동기 실행, 결과 영속화 서비스 레이어 설계",
      "변호사 플랫폼 MVP 개발에 참여",
    ],
  },
  {
    id: 5,
    company: "Inspien",
    position: "인턴 · 백엔드 개발자",
    period: "2023.03 ~ 2023.06",
    description: [
      "분산된 B2B 서비스와 DB 통합 업무 참여",
      "내부 관리 시스템 및 사용자 메일 발송 기능 개발",
      "국민대학교와 협력한 산학연계 인턴십 프로그램 참여",
    ],
  },
  {
    id: 6,
    company: "Nexters · Logit",
    position: "IT 연합 동아리 · BE 리드/서버 개발자",
    period: "2026.01 ~ 2026.03",
    description: [
      "FastAPI 기반 비동기 API, PostgreSQL·Redis 연동, 운영 어드민과 dev/prod 배포 환경 개발",
      "문항, 직무, 회사 맥락과 태그/역량 보정 기준을 함께 사용하는 RAG 경험 추천 로직 개발",
      "4개 테스트 모듈에 59개 자동화 테스트를 구축해 주요 사용자 흐름 회귀를 배포 전 검증",
      "MCP 도구 10개를 제공해 사용자가 기존 AI에서 자신의 경험을 검색하고 자기소개서 작성까지 이어갈 수 있게 구현",
    ],
  },
  {
    id: 7,
    company: "소프트웨어 마에스트로 13기",
    position: "연수생 · 팀장/서버/AI 개발자",
    period: "2022.06 ~ 2022.12",
    description: [
      "NLP 기반 음악 자동 태깅 모델 개발",
      "음악 태그 정보를 탐색하고 활용하는 애플리케이션 개발",
    ],
  },
];
