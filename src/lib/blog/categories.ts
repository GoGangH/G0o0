export type CoverMotif = "stack" | "bars" | "spark" | "rings" | "windows" | "checks" | "wave" | "steps";

// To add an album, add one line here and use its key as `category` in a post. Nothing else needs to change.
// `catalog` is fixed per album so a record keeps its number however the list is ordered.
// bg: jacket colour. ink: artwork on the jacket. text: type on the jacket. disc: the record's paper label. paper: the album's colour on the cream back of the sleeve.
export const categories = [
  { key: "database", label: "Database", catalog: "GK-101", motif: "stack", bg: "#2146b4", ink: "#bcd2ff", text: "#ffffff", disc: "#6d9bff", paper: "#1d3f9f" },
  { key: "backend", label: "Backend", catalog: "GK-102", motif: "bars", bg: "#4fd6b6", ink: "#0a4a3d", text: "#06231d", disc: "#4fd6b6", paper: "#0a6a57" },
  { key: "ai-product", label: "AI Product", catalog: "GK-103", motif: "spark", bg: "#3a1f8f", ink: "#f7d36b", text: "#ffffff", disc: "#a98bff", paper: "#4a27a8" },
  { key: "infrastructure", label: "Infrastructure", catalog: "GK-104", motif: "rings", bg: "#e8552f", ink: "#ffd9b8", text: "#ffffff", disc: "#ff8a5c", paper: "#b53a17" },
  { key: "frontend", label: "Frontend", catalog: "GK-105", motif: "windows", bg: "#f2c230", ink: "#3a2a00", text: "#241a00", disc: "#f2c230", paper: "#8a6500" },
  { key: "testing", label: "Testing", catalog: "GK-106", motif: "checks", bg: "#10383a", ink: "#7fe3d0", text: "#ffffff", disc: "#58c7b4", paper: "#0f5a5e" },
  { key: "product", label: "Product", catalog: "GK-107", motif: "steps", bg: "#d93f76", ink: "#ffd0e0", text: "#ffffff", disc: "#ff86ae", paper: "#a8245a" },
  { key: "retrospective", label: "Retrospective", catalog: "GK-108", motif: "wave", bg: "#e9e2d0", ink: "#2b2a26", text: "#1b1a17", disc: "#e9e2d0", paper: "#4c483f" },
] as const satisfies readonly { key: string; label: string; catalog: string; motif: CoverMotif; bg: string; ink: string; text: string; disc: string; paper: string }[];

export type CategoryKey = (typeof categories)[number]["key"];

export const categoryLabel = (key: string) => categories.find((category) => category.key === key)?.label ?? key;
export const categoryMotif = (key: string): CoverMotif => categories.find((category) => category.key === key)?.motif ?? "bars";

// Every album colour lives here, so the rest of the CSS only refers to these variables.
export const albumPaletteCss = categories.map(({ key, bg, ink, text, disc, paper }) => `[data-album="${key}"]{--a-bg:${bg};--a-ink:${ink};--a-text:${text};--a-disc:${disc};--a-paper:${paper}}`).join("");
