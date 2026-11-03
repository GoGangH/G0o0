export type Hotspot = { id: string; label: string; hint: string; place?: "below"; href?: string; action?: "terminal" | "phone" | "mode" };

export const hotspots: Hotspot[] = [
  { id: "turntable", label: "블로그", hint: "턴테이블 · G0O0 Records", href: "/blog" },
  { id: "albums", label: "모든 앨범", hint: "벽과 수납장의 LP · 주제별 글", href: "/blog/albums" },
  { id: "shelf", label: "소개", hint: "책장 · 나에 대해", href: "/about" },
  { id: "monitor", label: "터미널", hint: "명령어로 둘러보기", action: "terminal" },
  { id: "phone", label: "휴대폰", hint: "경력과 프로젝트 앱", action: "phone" },
  { id: "drawer", label: "프로젝트", hint: "서랍", href: "/projects", place: "below" },
  { id: "frame", label: "경험", hint: "액자", href: "/career" },
  { id: "lamp", label: "조명", hint: "다크 모드 켜고 끄기", action: "mode" },
];
