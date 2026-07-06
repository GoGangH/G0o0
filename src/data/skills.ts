export interface SkillCategory {
  category: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    category: "Backend",
    items: ["Python", "FastAPI", "TypeScript", "Node.js", "NestJS", "REST API", "BullMQ"],
  },
  {
    category: "Data",
    items: ["PostgreSQL", "MongoDB", "Redis", "SQLAlchemy", "Alembic"],
  },
  {
    category: "Frontend",
    items: ["Next.js", "React", "React Native", "Telegram Mini App"],
  },
  {
    category: "Infrastructure",
    items: ["AWS EC2", "AWS S3", "AWS Lambda", "Docker", "Docker Compose", "GitHub Actions", "Caddy", "Sentry"],
  },
  {
    category: "Testing",
    items: ["pytest", "pytest-asyncio", "FastAPI TestClient"],
  },
];
