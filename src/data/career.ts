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
    company: "HASHSCAPE",
    position: "Founding Team – Fullstack Engineer (Contract)",
    period: "2025.02 ~ 2025.06 (5개월)",
    description: [
      "회사 재정 상황으로 인해 계약 기반 엔지니어로 전환하여 기여",
      "기존 백엔드 시스템 유지보수 및 개선",
      "프론트엔드 통합 및 백엔드/프론트엔드/스마트 컨트랙트 전반 데이터 동기화 지원",
      "제한된 리소스 환경에서 서비스 안정성 및 점진적 개선에 집중",
    ],
  },
  {
    id: 2,
    company: "HASHSCAPE",
    position: "Founding Team – Fullstack Engineer",
    period: "2024.07 ~ 2025.02 (8개월)",
    description: [
      "초기 팀 멤버로 합류, 백엔드 시스템 중심의 풀스택 엔지니어로 근무",
      "라이브 Web3 서비스를 위한 백엔드 API, 데이터베이스 모델, 캐싱 전략 설계 및 구현",
      "필요시 프론트엔드 기능 개발에도 기여",
      "초기 스타트업 환경에서 개발 속도와 운영 안정성 간의 트레이드오프를 평가하여 기술적 의사결정 수행",
    ],
  },
  {
    id: 3,
    company: "NWCOMMS",
    position: "Software Engineer",
    period: "2023.07 ~ 2024.06 (1년)",
    description: [
      "내부 비즈니스 자동화 및 플랫폼 서비스를 위한 백엔드 시스템 개발",
      "Python 기반 AI 콘텐츠 생성 기능 구축 - 프롬프트 처리, 비동기 실행, 결과 영속화를 담당하는 서비스 레이어 설계",
      "모델 개발 자체보다는 기존 플랫폼에 AI 기능을 안정성과 유지보수성을 고려하여 통합하는 데 집중",
    ],
  },
  {
    id: 4,
    company: "Inspien",
    position: "Technology Research Institute (산학협력 인턴)",
    period: "2023.03 ~ 2023.06 (4개월)",
    description: [
      "국민대학교와 협력한 산학연계 인턴십 프로그램 참여",
      "기술연구소에서 백엔드 서비스 개발에 기여",
    ],
  },
  {
    id: 5,
    company: "SW마에스트로 13기",
    position: "서버 & AI 개발자, 팀장 (연수생)",
    period: "2022.03 ~ 2022.12 (7개월)",
    description: [
      "네이버 Music Auto Tagging NLP AI Model 개발",
      "음악의 태그 정보가 들어있는 앱 서비스 개발",
    ],
  },
];
