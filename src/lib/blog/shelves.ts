import { categories } from "./categories";
export const shelves = [{ key: "hashscape", label: "Hashscape", kicker: "COMPANY" }, ...["database", "backend", "ai-product", "frontend", "infrastructure", "testing", "product", "retrospective"].map((key) => ({ key, label: categories.find((item) => item.key === key)!.label, kicker: "GENRE" }))];
export const shelfLabel = (key: string) => shelves.find((shelf) => shelf.key === key)?.label ?? key;
