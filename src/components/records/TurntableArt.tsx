import { Solid } from "../iso/react/draw";
import { bodyParts, DECK_H, DECK_W, fittings, fittingsAbove, plateMatrix, tableMatrix, tablePart, platterCenter, platterTopMatrix, pivotPlate, startKeyMatrix, type DeckPart } from "./deck";

const matrix = (values: number[]) => `matrix(${values.join(" ")})`;
const Parts = ({ parts }: { parts: DeckPart[] }) => <>{parts.map((part) => <g key={part.name} data-m={part.material}><Solid paths={part.paths} tone={part.tone} crease="none" /></g>)}</>;
const tilt = [...plateMatrix.slice(0, 4), 0, 0].join(" ");
const PITCH = [-8, -6, -4, -2, 0, 2, 4, 6, 8];

export function TurntableArt() {
  return <svg viewBox={`0 0 ${DECK_W} ${DECK_H}`} className="iso-svg" aria-hidden="true">
    <defs>
      <linearGradient id="rt-plate-tone" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#dedfdb" /><stop offset=".38" stopColor="#c4c5c1" /><stop offset=".55" stopColor="#d6d7d3" /><stop offset="1" stopColor="#b2b3af" />
      </linearGradient>
      {/* Fine streaks stretched along the deck's own axis read as brushed aluminium. */}
      <filter id="rt-brush" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".004 .7" numOctaves="2" seed="4" stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 .1 0 0 0 0 .1 0 0 0 0 .1 .9 0 0 0 -.36" /></filter>
      <pattern id="rt-plate" patternUnits="userSpaceOnUse" width="520" height="400" patternTransform={`matrix(${tilt})`}>
        <rect width="520" height="400" fill="#cbccc8" /><rect width="520" height="400" filter="url(#rt-brush)" />
      </pattern>
      {/* Long, wandering grain for the walnut table, and darker cathedral streaks over it. */}
      <filter id="rt-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".0035 .085" numOctaves="4" seed="11" stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 .07 0 0 0 0 .035 0 0 0 0 .01 1.5 0 0 0 -.5" /></filter>
      <filter id="rt-pores" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".02 .8" numOctaves="2" seed="7" stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 .05 0 0 0 0 .02 0 0 0 0 0 1.2 0 0 0 -.55" /></filter>
      <pattern id="rt-wood" patternUnits="userSpaceOnUse" width="1100" height="500" patternTransform={`matrix(${tilt})`}>
        <rect width="1100" height="500" fill="#6a412a" /><rect width="1100" height="500" filter="url(#rt-grain)" /><rect width="1100" height="500" filter="url(#rt-pores)" />
      </pattern>
      <filter id="rt-contact" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
    </defs>
    <Parts parts={[tablePart]} />
    <g className="rt-flat" transform={matrix(tableMatrix)}>
      <rect x="-246" y="-176" width="492" height="372" rx="20" fill="#000" opacity=".6" filter="url(#rt-contact)" />
    </g>
    <Parts parts={bodyParts} />
    <g className="rt-flat" transform={matrix(plateMatrix)}>
      <circle cx={platterCenter[0]} cy={platterCenter[1]} r="156" fill="#1a1a1c" />
      <circle cx={platterCenter[0]} cy={platterCenter[1]} r="156" fill="none" stroke="#f1f1ee" strokeOpacity=".7" strokeWidth="1" />
      <circle cx={pivotPlate[0]} cy={pivotPlate[1]} r="50" fill="#141416" />
      {/* Pitch fader */}
      <rect x="199" y="26" width="28" height="128" rx="2" fill="#e4e4e0" stroke="#8d8e8a" strokeWidth=".7" />
      <rect x="211" y="32" width="4" height="116" rx="1" fill="#17171a" />
      {PITCH.map((value, index) => <g key={value}>
        <rect x="201" y={37.5 + index * 13} width={value % 4 === 0 ? 8 : 5} height="1.3" fill="#2a2a2c" />
        <text x="208" y={40 + index * 13} className="rt-print" fontSize="4.6" textAnchor="start" dx="-.5" dy="-.5" opacity={value === 0 ? 0 : 1}>{Math.abs(value)}</text>
      </g>)}
      <rect x="201" y="87" width="7" height="3" rx=".6" fill="#47e06c" />
      <text x="213" y="161" className="rt-print" fontSize="5.4" textAnchor="middle">pitch adj.</text>
      {/* Maker's plate */}
      <text x="104" y="166" className="rt-brand" fontSize="11">G0O0</text>
      <text x="136" y="166" className="rt-print" fontSize="4.8">Direct Drive</text>
      <text x="104" y="172.5" className="rt-print" fontSize="4.2">Turntable System GK-1200</text>
      {/* Speed and power marks */}
      <text x="-147.5" y="146" className="rt-print" fontSize="4.6" textAnchor="middle">33</text>
      <text x="-120.5" y="146" className="rt-print" fontSize="4.6" textAnchor="middle">45</text>
      <circle cx="-226" cy="108" r="1.3" fill="#c33" /><circle cx="-220" cy="108" r="1.3" fill="#c33" /><circle cx="-214" cy="108" r="1.3" fill="#c33" />
    </g>
    <Parts parts={fittings} />
    <g className="rt-flat" transform={matrix(platterTopMatrix)}>
      <circle r="150.5" fill="none" stroke="#dcdcd8" strokeWidth="2.2" />
      <circle r="139.5" fill="none" stroke="#b9b9b5" strokeWidth="1.2" />
    </g>
    <Parts parts={fittingsAbove} />
    <g className="rt-flat" transform={matrix(startKeyMatrix)}>
      <text y="1.8" className="rt-print" fontSize="6.6" textAnchor="middle">start · stop</text>
    </g>
  </svg>;
}
