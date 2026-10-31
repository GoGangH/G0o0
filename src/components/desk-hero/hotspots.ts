export type Hotspot = { id: string; label: string; href?: string; action?: "terminal" | "phone" | "mode" };

export const hotspots: Hotspot[] = [
  { id: "monitor", label: "터미널 열기", action: "terminal" },
  { id: "books", label: "블로그", href: "/blog" },
  { id: "drawer", label: "프로젝트", href: "/projects" },
  { id: "frame", label: "경험", href: "/career" },
  { id: "phone", label: "휴대폰 열기", action: "phone" },
  { id: "lamp", label: "다크 모드 전환", action: "mode" },
];
