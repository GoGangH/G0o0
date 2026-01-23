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
  github: "https://github.com/ganghyun",
  linkedin: "https://linkedin.com/in/kanghyun-ko-271a57230",
  location: "경기도",
  education: "국민대학교 Computer Science (2019.03 ~ 2025.02 졸업)",
  bio: [
    "Backend-focused software engineer with hands-on experience in building and operating real-world services.",
    "My background includes fullstack development in early-stage products, where I primarily focused on backend system design, data modeling, and operational stability.",
    "I have experience integrating Python-based services and AI components into production systems, including asynchronous pipelines for content generation and data processing.",
    "Although my formal full-time experience is relatively short, I have worked on live systems where data consistency, system reliability, and technical trade-offs directly impacted users.",
    "I am particularly interested in backend engineering roles that value clear system design decisions and long-term operational reliability.",
  ],
};
