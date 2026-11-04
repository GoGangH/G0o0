// Mirrors the 경력 and 활동 sections of the resume (public/resume). Keep the wording in step with it.

export interface CareerSection {
  title: string;
  items: string[];
}

export interface CareerItem {
  id: string;
  kind: "work" | "activity";
  org: string;
  /** A product inside the organisation, e.g. Hashscape's Solthumb. */
  name?: string;
  summary?: string;
  position: string;
  period: string;
  tech: string[];
  link?: { label: string; url: string };
  sections: CareerSection[];
  highlight?: string;
}

export const careerSummary = "실 경력 1년 · 개발 경력 2년 2개월";

/** Organisations that hold more than one product, shown as one block. */
export const careerGroups: Record<string, { period: string }> = {
  Hashscape: { period: "2024.07 ~ 2025.07" },
};

export const career: CareerItem[] = [
  {
    id: "grapic",
    kind: "work",
    org: "Grapic",
    summary: "환불 반영 정산과 커뮤니티 크롤링",
    position: "파트타임 · 풀스택 개발자",
    period: "2025.08 ~ 2025.09",
    tech: ["Python", "FastAPI", "AWS Lambda", "TypeScript", "Next.js", "React", "Docker"],
    sections: [
      { title: "환불 반영 수익금 정산", items: ["월별 조회·환불 반영 미비로 수익금 수작업 계산 → 운영자·디자이너와 개선 사항 논의 및 PG사 환불 내역 연결 → 환불을 반영한 실제 수익 통계 산출·조회"] },
      { title: "커뮤니티별 크롤링", items: ["공통 크롤링 로직을 중심으로 클래스 구조를 구성하고, 커뮤니티별 수집 로직을 적용·재사용할 수 있도록 구현"] },
      { title: "요청 기반 크롤링 실행", items: ["FastAPI 기반 크롤링 서버·API 서버 구성 및 수집 요청 시 AWS Lambda에서 크롤링 로직을 실행하는 구조 구현으로 운영 비용 절감"] },
    ],
  },
  {
    id: "solthumb",
    kind: "work",
    org: "Hashscape",
    name: "Solthumb",
    summary: "멀티체인 토큰 거래·자산 관리 서비스",
    position: "정규직 · Founding Team / 풀스택 개발자",
    period: "2025.02 ~ 2025.07",
    tech: ["TypeScript", "NestJS", "MongoDB", "Redis", "BullMQ", "React Native"],
    sections: [
      {
        title: "외부 API 비용 절감",
        items: [
          "정제된 거래 데이터를 제공하는 여러 API에 의존해 비용 120만 원 초과 → 기존 구독 해지 후 트랜잭션 ID로 원시 데이터를 조회하는 API만 유지 → 직접 파싱·정제 후 DB에 저장하는 구조로 전환",
          "체인별 거래 데이터 수집·파싱·저장 과정 분리 및 공통 데이터 구조 구성으로 체인 추가 시 확장 가능한 처리 흐름 구현",
        ],
      },
      {
        title: "거래 처리·잔액 정합성",
        items: [
          "온체인 거래 반영 후에도 외부 API의 반영 지연으로 조회 실패 발생 → API 요청 방식 변경 및 BullMQ 재처리 적용 → 지연된 거래 결과를 다시 조회·처리하는 흐름 구성",
          "거래 시작 전 사용자 잔액 사전 반영 및 DB 이력 생성, 처리 단계별 상태·기록 유지로 거래 유실 축소. 최종 실패 시 가스비를 제외한 금액 복원",
          "PnL 계산 오류와 체인별 수수료·가스비에 따른 잔액 불일치 발생 → 어드민에 큐 상태·오류 기록을 제공해 처리 상황 추적 → 온체인 실제 잔액을 조회해 서비스 DB에 동기화하는 복구 기능 구현",
        ],
      },
      {
        title: "거래 수수료·레퍼럴",
        items: [
          "EVM: 외부 서비스의 높은 수수료·수수료 변경 불가로 저수수료 서비스 제공에 제약 → 여러 EVM 체인에 적용할 컨트랙트 직접 개발·배포 및 수수료 수취·전달 로직 구현 → 외부 거래 API 대체 및 비용 절감",
          "EVM 이벤트: 직접 개발한 컨트랙트 이벤트에 필요한 거래 데이터를 포함해 파싱 단순화·데이터 일관화 및 외부 API 의존 축소",
          "Solana: 거래 실행 시 지정 수취인에게 수수료 일부를 배분하는 외부 서비스 기능 연동으로 레퍼럴 금액 수취",
        ],
      },
      {
        title: "실시간 차트",
        items: [
          "초기 거래 데이터 조회·실시간 연결에 대기 발생 → 최근 1분 내 조회한 데이터가 Redis에 있으면 재사용 → 초기 데이터의 반복 조회 부담 완화",
          "1분 주기 API 조회로 실시간성 부족 → WebSocket 체결 데이터 수신 및 비정상 가격 필터링 → 유효 체결 데이터로 차트 실시간 갱신, 거래 내역 기반 호가형 화면 구성",
        ],
      },
      { title: "Hedera 데이터 연동", items: ["필요한 거래 조회 API 부재 → 재단 지원 요청 및 외부 기업 협업을 통해 API 확보·연동"] },
    ],
    highlight: "Hedera 재단의 Solthumb 개발 Grant 수혜",
  },
  {
    id: "salthub",
    kind: "work",
    org: "Hashscape",
    name: "Salt Hub",
    summary: "초기 사용자 확보를 위한 Telegram 미니앱",
    position: "정규직 · Founding Team / 풀스택 개발자",
    period: "2024.07 ~ 2025.02",
    tech: ["TypeScript", "NestJS", "Next.js", "MongoDB", "Redis", "Cloudflare", "AWS", "Telegram Mini App"],
    sections: [
      {
        title: "흔들기 게임·티켓 정산",
        items: [
          "스마트폰 자이로스코프로 흔든 횟수를 측정해 포인트를 지급하는 게임 전 범위 구현. 사용자별 일일 5회 참여 및 부스터를 통한 여러 티켓 일괄 사용 지원",
          "티켓 선차감 후 게임 이탈 시 티켓 유실, 동시 접속 시 한 티켓으로 여러 게임 실행 → 게임별 식별자·토큰 검증 및 갱신, Redis 사전 차감·DB 최종 차감 분리 → 완료 시에만 DB 티켓 차감·포인트 반영, 중복 정산 방지",
          "백그라운드 전환·네트워크 지연에 따른 토큰 만료 발생 → 비정상 종료 시 Redis 사전 차감분 복원 → 미완료 게임의 DB 티켓 미차감",
        ],
      },
      { title: "멀티 리전 조회 오류", items: ["국내·글로벌 서비스 운영 중 복제 지연으로 신규 사용자 조회 실패 → DB 로그·쓰기 시각 비교로 원인 확인 → 복제 세트 과반수의 쓰기 확인 후 후속 조회하도록 변경"] },
      { title: "요청 지연 개선", items: ["Cloudflare 엣지 경유 시 요청 지연 발생 → AWS 기반 구성으로 전환해 지연 개선"] },
    ],
    highlight: "누적 사용자 40만 명 이상 · MAU 2,000~3,000명",
  },
  {
    id: "newweb",
    kind: "work",
    org: "뉴웹커뮤니케이션",
    summary: "마케팅 자동화와 플랫폼 MVP",
    position: "프리랜서 · 자동화·웹 서버 개발자",
    period: "2023.07 ~ 2024.06",
    tech: ["Next.js", "NestJS", "Vercel", "Python"],
    sections: [
      {
        title: "마케팅 준비·포스팅 자동화",
        items: [
          "분리된 프로그램을 매일 수동 실행하며 마케팅 준비에 2시간 초과 소요",
          "이미지 수집·영상·썸네일 제작·글 생성·포스팅 도구 통합 및 병렬 실행으로 반복 준비 작업 단축",
          "이미지 색상 변경·영상 제작 기능 통합 및 수집 이미지 슬라이스·재사용으로 콘텐츠 제작 흐름 구성",
          "지정 형식의 Excel에 제목·내용을 작성해 폴더에 넣으면 포스팅하는 입력 방식 구성. Windows·Bash 환경 설정으로 매일 수동 실행하던 과정 자동화",
        ],
      },
      { title: "플랫폼 기획·개발", items: ["변호사 선임 연결 플랫폼 기획 및 MVP 개발"] },
    ],
    highlight: "마케팅 준비 시간 2시간 초과 → 30분 미만 · 75% 이상 단축",
  },
  {
    id: "inspien",
    kind: "work",
    org: "Inspien",
    position: "인턴 · 백엔드 개발자",
    period: "2023.03 ~ 2023.06",
    tech: ["Java", "Spring Boot", "Thymeleaf", "MariaDB"],
    sections: [
      { title: "데이터 통합", items: ["분산된 레거시 DB·신규 서비스 DB의 데이터 취합 및 통합"] },
      { title: "청구 업무", items: ["사용자 비용 청구를 위한 내부 관리 화면 및 청구서 메일 발송 기능 개발"] },
      { title: "서비스 조사", items: ["신규 EDI 서비스 조사"] },
    ],
  },
  {
    id: "cloudclub",
    kind: "activity",
    org: "Cloud Club",
    summary: "클라우드 동아리",
    position: "동아리 활동",
    period: "2026.09 ~ 현재",
    tech: [],
    sections: [{ title: "기술 학습", items: ["DDIA 독서 스터디와 Flink를 활용한 대규모 데이터 처리 학습"] }],
  },
  {
    id: "techblog-study",
    kind: "activity",
    org: "기술블로그 스터디",
    summary: "기업 기술 사례 학습·공유",
    position: "스터디",
    period: "2026.01 ~ 현재",
    tech: [],
    sections: [{ title: "학습·공유", items: ["토스·당근·올리브영 등 기업 기술블로그의 글을 학습하고 공유하는 스터디"] }],
  },
  {
    id: "logit",
    kind: "activity",
    org: "Nexters",
    name: "Logit",
    summary: "경험 기반 AI 자기소개서 서비스",
    position: "IT 연합 동아리 · BE 리드 및 서버 개발자 · 현재 운영 중",
    period: "2026.01 ~ 2026.03",
    tech: ["Python", "FastAPI", "PostgreSQL", "Redis", "Qdrant", "FastMCP", "Next.js", "Docker", "Caddy"],
    link: { label: "logit.ai.kr", url: "https://logit.ai.kr" },
    sections: [
      { title: "MCP", items: ["사용자 인터뷰에서 추가 AI 구독 비용 부담 확인 → 저장된 경험·자기소개서 데이터를 활용하는 MCP 도구 10개 제안·개발 → 기존 ChatGPT·Claude에서 Logit 데이터 활용 지원"] },
      { title: "RAG", items: ["문항·직무·회사 맥락에 맞는 경험 선별 필요 → RAG 추천에 태그 유사도·역량 일치도 결합 → 자기소개서에 활용할 경험의 맥락 기반 추천 구현"] },
      {
        title: "Admin",
        items: [
          "dev/prod DB·벡터 저장소를 각각 조회해야 하는 운영 부담 → 2개 환경의 사용자·프로젝트·문항·경험·채팅 데이터를 통합 관리하는 어드민 개발 → 환경별 데이터 조회·관리 일원화",
          "PG 등록 후 BM 측정·조정을 위한 토큰 사용량 수집·관리 및 지속 운영",
        ],
      },
      { title: "배포·오류 추적", items: ["dev/prod 배포 환경·자동화 테스트 59개·Sentry 오류 추적 구축. PG 등록 및 현재 서비스 운영"] },
    ],
  },
  {
    id: "soma",
    kind: "activity",
    org: "소프트웨어 마에스트로 13기",
    name: "Never",
    summary: "네이버 뮤직 데이터 기반 자동 태깅·음악 검색 iOS 앱",
    position: "SW 인재 양성 프로그램 · 팀장 및 서버·AI 개발자",
    period: "2022.06 ~ 2022.12",
    tech: ["Python", "Django", "TensorFlow", "pandas", "Elasticsearch", "iOS"],
    sections: [
      { title: "태그 자동 생성", items: ["음성을 시계열 이미지로 시각화해 기준 분위기 태그의 이미지와 비교. 텍스트의 글자 수 비교와 감정·상황 태그의 유사도 검증을 활용해 태그 생성"] },
      { title: "태그·음악 검색", items: ["Elasticsearch 유사도 검색을 적용해 태그와 음악의 유사도 기반 검색 구현. 네이버에서 프로젝트 최종 발표"] },
    ],
  },
];

export const careerTitle = (item: CareerItem) => (item.name ? `${item.org} · ${item.name}` : item.org);
