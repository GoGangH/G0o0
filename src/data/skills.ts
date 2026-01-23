export interface SkillCategory {
  category: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    category: "Language",
    items: ["Java", "Python", "JavaScript", "TypeScript"],
  },
  {
    category: "Frontend",
    items: ["Next.js", "React Native", "Telegram Miniapp"],
  },
  {
    category: "Backend",
    items: ["Nest.js", "Spring", "FastAPI"],
  },
  {
    category: "Database",
    items: ["MongoDB", "MariaDB", "Redis"],
  },
  {
    category: "DevOps",
    items: ["Docker", "PM2", "AWS EC2", "AWS S3", "AWS Lambda"],
  },
];
