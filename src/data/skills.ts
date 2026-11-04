export interface SkillCategory {
  category: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  { category: "Backend", items: ["TypeScript", "Node.js", "NestJS", "Python", "FastAPI", "BullMQ", "WebSocket"] },
  { category: "Data", items: ["PostgreSQL", "MongoDB", "Redis", "Qdrant"] },
  { category: "Frontend", items: ["React", "Next.js"] },
  { category: "Infrastructure", items: ["AWS EC2", "AWS S3", "AWS Lambda", "Docker", "GitHub Actions", "Sentry"] },
];
