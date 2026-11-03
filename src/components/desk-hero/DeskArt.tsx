import { FaceText, Solid } from "../iso/react/draw";
import { lampHit, moon, moonPanes, stars, phonePlane, screenPlane, sortedParts, wallFace, type DeskPart } from "./geometry";

const SCREEN_LINES = [-160, -151, -142, -133];
const LP_X = [-118, -78, -38];

// Art on the framed sleeves, drawn on the wall's own plane like the monitor's screen.
function SleeveArt({ index }: { index: number }) {
  const x = LP_X[index], top = -224;
  return <g transform={wallFace}>
    {index === 0 && [0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={x + 17} cy={top + 10 + i * 3.6} rx="11" ry="3" fill="none" stroke="#cfe0ff" strokeWidth=".7" />)}
    {index === 1 && Array.from({ length: 9 }, (_, i) => <rect key={i} x={x + 4 + i * 3.2} y={top} width="1.4" height={8 + ((i * 7) % 11)} fill="#4fe0bd" />)}
    {index === 2 && <circle cx={x + 18} cy={top + 13} r="10" fill="#ff8fc0" opacity=".8" />}
    {index === 2 && <circle cx={x + 18} cy={top + 13} r="5" fill="#fff1d6" opacity=".9" />}
    <rect x={x + 3} y={top + 27} width="14" height="2" fill="#fff" opacity=".85" />
  </g>;
}

// Contiguous runs preserve painter's order across overlapping assemblies.
export function DeskArt({ parts = sortedParts }: { parts?: DeskPart[] }) {
  return <g data-part={parts[0]?.group}>
    {parts.map((part) => <g key={part.name} data-material={part.material} data-piece={part.name}>
      <Solid paths={part.paths} tone={part.tone} />
      {part.name === "window-glass" && <g className="desk-night">{stars.map(([x, y], i) => <circle key={i} className="desk-star" cx={x} cy={y} r={i % 2 ? 0.9 : 1.3} />)}</g>}
      {part.name === "window-glass" && <path className="desk-moon" d={moon} />}
      {part.name === "wall-back" && <g className="desk-night" transform={wallFace}>
        <defs><radialGradient id="desk-screen-halo"><stop offset="0" stopColor="#5f9bff" stopOpacity=".3" /><stop offset="1" stopColor="#5f9bff" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx="-64" cy="-134" rx="104" ry="60" fill="url(#desk-screen-halo)" />
      </g>}
      {part.name === "rug" && <g className="desk-night desk-moonlight">{moonPanes.map((d) => <path key={d} d={d} />)}</g>}
      {part.name.startsWith("wall-lp-") && <SleeveArt index={Number(part.name.slice(-1))} />}
      {part.name === "lamp-shade" && <path className="desk-hit" d={lampHit} />}
      {part.name === "monitor-screen" && <g transform={screenPlane} className="desk-terminal">
        <g className="desk-prompt"><FaceText transform="translate(-67 -148)" size={10} tone="hi">~/g0o0 $</FaceText></g>
        {SCREEN_LINES.map((y) => <text key={y} className="iso-face-text desk-line" x="-67" y={y} fontSize="6.5" />)}
        <rect className="desk-accent desk-cursor" x="-14" y="-156" width="5.5" height="10" />
        <circle className="desk-accent" cx="12" cy="-124" r="1.5" />
      </g>}
      {part.name === "phone-home" && <g transform={phonePlane} className="desk-lock">
        <defs>
          <linearGradient id="desk-lock-wall" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8fdcff" /><stop offset=".45" stopColor="#3f5fd8" /><stop offset="1" stopColor="#ff8a5c" />
          </linearGradient>
        </defs>
        <rect x="46" y="20" width="34" height="56" rx="3" fill="url(#desk-lock-wall)" />
        <rect x="56" y="22" width="14" height="2.4" rx="1.2" fill="#000" />
        <text className="desk-lock-date" x="63" y="31" textAnchor="middle" fontSize="2.8" />
        <text className="desk-lock-time" x="63" y="41" textAnchor="middle" fontSize="9.5">9:41</text>
        <rect x="49" y="50" width="28" height="9" rx="2" fill="#fff" fillOpacity=".32" />
        <rect x="51" y="52" width="16" height="1.3" rx=".6" fill="#fff" />
        <rect x="51" y="55.2" width="22" height="1.1" rx=".5" fill="#fff" fillOpacity=".75" />
        <rect x="54" y="72" width="18" height="1" rx=".5" fill="#fff" />
      </g>}
    </g>)}
  </g>;
}
