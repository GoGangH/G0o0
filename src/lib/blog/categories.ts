export type VinylKind = "solid" | "translucent";
export type CoverMotif = "stack" | "bars" | "spark" | "rings" | "windows" | "checks" | "wave" | "steps";

// To add an album, add one line here and use its key as `category` in a post. Nothing else needs to change.
// `catalog` is fixed per album so a record keeps its number however the list is ordered.
// vinyl: the record itself, either an opaque colour or see-through so the platter shows under it.
// bg: jacket colour. ink: artwork on the jacket. text: type on the jacket. disc: the record's paper label. paper: the album's colour on the cream back of the sleeve.
export const categories = [
  { key: "database", label: "Database", catalog: "GK-101", motif: "stack", bg: "#1634a8", ink: "#cfe0ff", text: "#ffffff", disc: "#dbe7ff", paper: "#1d3f9f", vinyl: { kind: "translucent", base: "#4a86ff" } },
  { key: "backend", label: "Backend", catalog: "GK-102", motif: "bars", bg: "#0c0d0f", ink: "#4fe0bd", text: "#ffffff", disc: "#4fe0bd", paper: "#0a4a3d", vinyl: { kind: "solid", base: "#0f1012" } },
  { key: "ai-product", label: "AI Product", catalog: "GK-103", motif: "spark", bg: "#140a2e", ink: "#f7d36b", text: "#ffffff", disc: "#f4d9ff", paper: "#4a27a8", vinyl: { kind: "translucent", base: "#8a5cff" } },
  { key: "infrastructure", label: "Infrastructure", catalog: "GK-104", motif: "rings", bg: "#ee5a24", ink: "#141414", text: "#141414", disc: "#ffe1cf", paper: "#b53a17", vinyl: { kind: "solid", base: "#e8552f" } },
  { key: "frontend", label: "Frontend", catalog: "GK-105", motif: "windows", bg: "#f4c21f", ink: "#141414", text: "#141414", disc: "#fff4c9", paper: "#8a6500", vinyl: { kind: "translucent", base: "#f0b92c" } },
  { key: "testing", label: "Testing", catalog: "GK-106", motif: "checks", bg: "#e9eaec", ink: "#141414", text: "#141414", disc: "#e5352b", paper: "#3b3e43", vinyl: { kind: "solid", base: "#c9ced4" } },
  { key: "product", label: "Product", catalog: "GK-107", motif: "steps", bg: "#f25a92", ink: "#3a0a20", text: "#ffffff", disc: "#ffe3ee", paper: "#a8245a", vinyl: { kind: "translucent", base: "#ff6fa3" } },
  { key: "retrospective", label: "Retrospective", catalog: "GK-108", motif: "wave", bg: "#efe8d8", ink: "#222222", text: "#1b1a17", disc: "#2a2a2c", paper: "#4c483f", vinyl: { kind: "solid", base: "#efe9db" } },
] as const satisfies readonly { key: string; label: string; catalog: string; motif: CoverMotif; bg: string; ink: string; text: string; disc: string; paper: string; vinyl: { kind: VinylKind; base: string } }[];

export type CategoryKey = (typeof categories)[number]["key"];

export const categoryLabel = (key: string) => categories.find((category) => category.key === key)?.label ?? key;
export const categoryVinyl = (key: string) => categories.find((category) => category.key === key)?.vinyl ?? categories[0].vinyl;
export const categoryMotif = (key: string): CoverMotif => categories.find((category) => category.key === key)?.motif ?? "bars";

// Every album colour lives here, so the rest of the CSS only refers to these variables.
export const albumPaletteCss = categories.map(({ key, bg, ink, text, disc, paper, vinyl }) => `[data-album="${key}"]{--a-bg:${bg};--a-ink:${ink};--a-text:${text};--a-disc:${disc};--a-paper:${paper};--a-vinyl:${vinyl.base}}`).join("");
