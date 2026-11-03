import { categoryMotif, type CoverMotif } from "@/lib/blog/categories";

const hang = (index: number) => 70 + 92 * (1 + Math.sin(index * 0.42) * Math.cos(index * 0.17 + 1)) + 26 * Math.sin(index * 1.3);
const QUARTERS = [[0, 0, 0], [1, 0, 1], [2, 0, 1], [0, 1, 3], [1, 1, 2], [2, 1, 0]];

// Each cover is a small poster for its topic rather than an icon, and leaves the bottom clear for the title.
const motifs: Record<CoverMotif, React.ReactNode> = {
  // Platters stacked into a cylinder.
  stack: <>
    {Array.from({ length: 27 }, (_, i) => <ellipse key={i} cx="180" cy={262 - i * 8.2} rx="132" ry="36" fill="var(--a-bg)" stroke="currentColor" strokeWidth="1.6" />)}
    <ellipse cx="180" cy="49" rx="132" ry="36" fill="currentColor" />
  </>,
  // A log's worth of request lengths, hanging from the top edge.
  bars: Array.from({ length: 44 }, (_, i) => <rect key={i} x={13 + i * 7.65} y="0" width="4.2" height={hang(i).toFixed(1)} fill="currentColor" />),
  // A soft glow with nothing solid in it.
  spark: <>
    <defs><radialGradient id="cover-orb"><stop offset="0" stopColor="#fff1d6" /><stop offset=".26" stopColor="#ff8fc0" /><stop offset=".58" stopColor="#7d35ff" stopOpacity=".85" /><stop offset="1" stopColor="#7d35ff" stopOpacity="0" /></radialGradient></defs>
    <circle cx="205" cy="128" r="205" fill="url(#cover-orb)" />
  </>,
  // Modules that only make a shape once they are connected.
  rings: QUARTERS.map(([col, row, turn]) => <path key={`${col}${row}`} d="M0 0H120A120 120 0 0 1 0 120Z" fill="currentColor" transform={`translate(${col * 120 + 60} ${row * 120 + 60}) rotate(${turn * 90}) translate(-60 -60)`} />),
  // Layers of interface, stacked and see-through.
  windows: <>
    <rect x="34" y="28" width="196" height="150" fill="currentColor" opacity=".22" />
    <rect x="86" y="70" width="196" height="150" fill="currentColor" opacity=".45" />
    <rect x="138" y="112" width="196" height="150" fill="currentColor" />
  </>,
  // Every check passes but one.
  checks: Array.from({ length: 63 }, (_, i) => <circle key={i} cx={36 + (i % 9) * 36} cy={34 + Math.floor(i / 9) * 36} r="12" fill={i === 25 ? "#e5352b" : "currentColor"} />),
  // Steps up, off the edge of the sleeve.
  steps: [110, 170, 240, 318].map((height, i) => <rect key={height} x={i * 90} y={360 - height} width="90" height={height} fill="currentColor" />),
  // Years, as growth rings.
  wave: Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={232 + i} cy={104 - i * 0.6} rx={16 + i * 16.5} ry={13 + i * 15.5} fill="none" stroke="currentColor" strokeWidth={i % 3 === 0 ? 3.4 : 1.6} />),
};

export function CoverArt({ album }: { album: string }) {
  return <svg viewBox="0 0 360 360" className="rt-cover-art" aria-hidden="true">{motifs[categoryMotif(album)]}</svg>;
}

export function Cover({ album, label, kind }: { album: string; label?: string; kind?: string }) {
  return <span className="rt-cover" data-album={album}>
    <CoverArt album={album} />
    {kind && <span className="rt-cover-kind">{kind}</span>}
    {label && <span className="rt-cover-title">{label}</span>}
    <span className="rt-wear" aria-hidden="true" />
  </span>;
}
