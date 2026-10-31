import { FaceText, Solid } from "../iso/react/draw";
import { lampHit, moon, phonePlane, screenPlane, sortedParts, type DeskPart } from "./geometry";

const SCREEN_LINES = [-160, -151, -142, -133];

// Contiguous runs preserve painter's order across overlapping assemblies.
export function DeskArt({ parts = sortedParts }: { parts?: DeskPart[] }) {
  return <g data-part={parts[0]?.group}>
    {parts.map((part) => <g key={part.name} data-material={part.material} data-piece={part.name}>
      <Solid paths={part.paths} tone={part.tone} />
      {part.name === "window-glass" && <path className="desk-moon" d={moon} />}
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
