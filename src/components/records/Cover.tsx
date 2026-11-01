import { categoryMotif, type CoverMotif } from "@/lib/blog/categories";

const motifs: Record<CoverMotif, React.ReactNode> = {
  stack: [0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx="180" cy={102 + i * 38} rx="118" ry="38" fill="none" stroke="currentColor" strokeWidth="11" />),
  bars: [0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="60" y={66 + i * 40} width={[240, 150, 200, 96, 240, 130][i]} height="24" rx="12" fill="currentColor" />),
  spark: <>
    <path d="M170 46c10 78 44 112 122 122-78 10-112 44-122 122-10-78-44-112-122-122 78-10 112-44 122-122z" fill="currentColor" />
    <path d="M284 226c4 30 17 43 47 47-30 4-43 17-47 47-4-30-17-43-47-47 30-4 43-17 47-47z" fill="currentColor" />
  </>,
  rings: [130, 98, 66, 34].map((r, i) => <path key={r} d={`M${180 - r} 300a${r} ${r} 0 0 1 ${r * 2} 0`} fill="none" stroke="currentColor" strokeWidth={i === 3 ? 34 : 16} transform="translate(0 -60)" />),
  windows: [0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${64 + (i % 2) * 124} ${58 + Math.floor(i / 2) * 124})`}><rect width="108" height="108" rx="10" fill="none" stroke="currentColor" strokeWidth="11" /><rect width="108" height="26" rx="10" fill="currentColor" /></g>),
  checks: [0, 1, 2].map((i) => <g key={i} transform={`translate(62 ${62 + i * 86})`}><path d="M6 32l22 22L66 8" fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" /><rect x="92" y="24" width={[150, 110, 140][i]} height="16" rx="8" fill="currentColor" /></g>),
  steps: [0, 1, 2, 3].map((i) => <rect key={i} x={62 + i * 60} y={230 - i * 54} width="50" height={64 + i * 54} rx="6" fill="currentColor" />),
  wave: [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M40 ${90 + i * 44}c46-58 94-58 140 0s94 58 140 0`} fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />),
};

// Album art for a topic. It only uses CSS and SVG, so it works at any size from a 40px row to the big jacket.
export function CoverArt({ album }: { album: string }) {
  return <svg viewBox="0 0 360 360" className="rt-cover-art" aria-hidden="true">
    <g transform="translate(36 8) scale(.8)">{motifs[categoryMotif(album)]}</g>
  </svg>;
}

export function Cover({ album, label, kind }: { album: string; label?: string; kind?: string }) {
  return <span className="rt-cover" data-album={album}>
    <CoverArt album={album} />
    {kind && <span className="rt-cover-kind">{kind}</span>}
    {label && <span className="rt-cover-title">{label}</span>}
    <span className="rt-wear" aria-hidden="true" />
  </span>;
}
