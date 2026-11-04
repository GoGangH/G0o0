export interface Profile {
  name: string;
  nameKr: string;
  title: string;
  phone: string;
  email: string;
  github: string;
  linkedin: string;
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
  education: "국민대학교 소프트웨어학과 (2019 ~ 2026.02 졸업)",
  bio: [
    "넓은 시야를 가진 개발자 고강현입니다.",
    "스타트업에서 기획부터 출시·운영까지 참여하며 비즈니스·마케팅·기획 등 여러 분야의 일을 직접 경험했습니다. 그 과정에서 개발에만 한정하지 않고, 다른 사람과 분야의 시야에서 문제를 살피고 해결 방법을 찾는 법을 배웠습니다. 기술블로그를 학습하고 공유하며 시니어 개발자가 문제를 바라보고 기술적 판단을 내리는 과정도 익혀왔습니다.",
    "이렇게 넓힌 시야를 바탕으로 일상생활과 서비스 안에서 문제를 직접 발견하고, 여러 경험에서 배운 해결 방법을 상황에 맞게 적용할 수 있습니다. 지금도 기술블로그 스터디와 클라우드·IT 연합 동아리에서 다양한 경험을 나누며 시야를 넓히고 있습니다. 배운 내용은 일상의 불편을 해결하는 개인 프로젝트에 적용하고, 직접 사용하거나 다른 사람의 피드백을 받으며 더 나은 해결 방법을 찾아가고 있습니다.",
  ],
};
