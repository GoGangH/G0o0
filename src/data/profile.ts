export interface Profile {
  name: string;
  nameKr: string;
  title: string;
  phone: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  education: string;
  bio: string[];
}

export const profile: Profile = {
  name: "KangHyun Ko",
  nameKr: "고강현",
  title: "Backend Developer",
  phone: "010-3754-9499",
  email: "rhrkdgus1020@naver.com",
  github: "https://github.com/GoGangH",
  linkedin: "https://linkedin.com/in/kanghyun-ko-271a57230",
  location: "경기도 남양주시 다산동",
  education: "국민대학교 소프트웨어학과 (2019.03 ~ 2026.02 졸업)",
  bio: [
    "앞으로 나아가며 성장하는 백엔드 개발자, Go 강현입니다.",
    "기능 구현에서 끝나지 않고 어떤 사용자와 비즈니스 문제를 해결하는지 확인하며 개발하는 것을 중요하게 생각합니다.",
    "초기 스타트업의 Founding Team으로 제품 기획부터 출시와 운영까지 참여했고, 누적 사용자 40만 명 규모의 서비스에서 DB 부하와 데이터 정합성 문제를 직접 해결했습니다.",
    "운영 과정에서는 기획, 디자인, 마케팅 담당자와 문제를 정의하고 반복 업무를 백오피스로 전환해 비개발자가 직접 서비스를 운영할 수 있도록 만들었습니다.",
    "Python과 TypeScript를 모두 활용하며 서비스 규모와 팀 상황에 맞는 기술을 선택하고, 변경이 실제 사용자 경험과 운영 효율에 어떤 영향을 주는지 끝까지 확인하는 개발자로 성장하고 있습니다.",
  ],
};
