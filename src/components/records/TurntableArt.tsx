import { Solid } from "../iso/react/draw";
import { bodyParts, DECK_H, DECK_W, fittings, fittingsAbove, planeAt, plateMatrix, TOP, tableMatrix, tablePart, platterCenter, platterTopMatrix, pivotPlate, startKeyMatrix, type DeckPart } from "./deck";

const matrix = (values: number[]) => `matrix(${values.join(" ")})`;

// Spun metal: light gathers in two opposing fans around the centre, the way it does on a turned aluminium cap.
function fan(from: number, to: number, outer: number, inner: number) {
  const point = (radius: number, degrees: number) => `${(radius * Math.cos((degrees * Math.PI) / 180)).toFixed(2)} ${(radius * Math.sin((degrees * Math.PI) / 180)).toFixed(2)}`;
  return `M${point(inner, from)}L${point(outer, from)}A${outer} ${outer} 0 0 1 ${point(outer, to)}L${point(inner, to)}A${inner} ${inner} 0 0 0 ${point(inner, from)}Z`;
}
function Spun({ at, z, outer, inner = 0 }: { at: [number, number]; z: number; outer: number; inner?: number }) {
  const fans = [[-62, -32, "#fff", 0.82], [-32, -14, "#fff", 0.32], [118, 148, "#fff", 0.7], [148, 168, "#fff", 0.26], [20, 62, "#000", 0.2], [200, 244, "#000", 0.2]] as const;
  const rings = Math.min(7, Math.max(2, Math.floor((outer - inner) / 4)));
  return <g className="rt-flat" transform={matrix(planeAt(at, z))}>
    {fans.map(([from, to, color, opacity]) => <path key={from} d={fan(from, to, outer - 0.4, inner)} fill={color} opacity={opacity} />)}
    {Array.from({ length: rings }, (_, i) => <circle key={i} r={inner + ((outer - inner) * (i + 1)) / (rings + 1)} fill="none" stroke="#000" strokeOpacity=".08" strokeWidth=".5" />)}
  </g>;
}
const SPUN: Record<string, { at: [number, number]; z: number; outer: number; inner?: number }> = {
  adapter: { at: [-204, -144], z: TOP + 2, outer: 23, inner: 7 },
  "arm-base": { at: [176, -122], z: TOP + 9, outer: 31, inner: 13 },
  "skate-cap": { at: [210, -94], z: TOP + 14, outer: 6 },
  light: { at: [92, 150], z: TOP + 27, outer: 7.5 },
};
const Parts = ({ parts }: { parts: DeckPart[] }) => <>{parts.map((part) => <g key={part.name} data-m={part.material}>
  <Solid paths={part.paths} tone={part.tone} crease="none" />
  {SPUN[part.name] && <Spun {...SPUN[part.name]} />}
</g>)}</>;
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
      {/* Black lacquer: a long, soft highlight across the table. */}
      <linearGradient id="rt-table" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#0b0c0e" /><stop offset=".3" stopColor="#1a1c21" /><stop offset=".42" stopColor="#2c2f35" /><stop offset=".55" stopColor="#15171a" /><stop offset="1" stopColor="#090a0c" />
      </linearGradient>
      {/* Polished metal: hard bands of light and dark instead of one flat grey. */}
      <linearGradient id="rt-metal" x1="0" y1="0" x2="1" y2=".45">
        <stop offset="0" stopColor="#ffffff" /><stop offset=".2" stopColor="#bfc2c7" /><stop offset=".42" stopColor="#f5f6f7" /><stop offset=".62" stopColor="#8f9298" /><stop offset=".82" stopColor="#dcdfe3" /><stop offset="1" stopColor="#ffffff" />
      </linearGradient>
      <linearGradient id="rt-metal-side" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#55585e" /><stop offset=".22" stopColor="#f4f5f6" /><stop offset=".4" stopColor="#8e9197" /><stop offset=".68" stopColor="#d6d9dd" /><stop offset="1" stopColor="#4d5056" />
      </linearGradient>
      {/* A broad reflection travelling across the brushed top plate. */}
      <linearGradient id="rt-sweep" gradientUnits="userSpaceOnUse" x1="-236" y1="-176" x2="236" y2="176">
        <stop offset="0" stopColor="#fff" stopOpacity=".05" /><stop offset=".26" stopColor="#fff" stopOpacity=".5" /><stop offset=".36" stopColor="#fff" stopOpacity="0" /><stop offset=".6" stopColor="#000" stopOpacity=".16" /><stop offset=".78" stopColor="#fff" stopOpacity=".26" /><stop offset="1" stopColor="#000" stopOpacity=".1" />
      </linearGradient>
      <radialGradient id="rt-pool"><stop offset="0" stopColor="#dfe6ef" stopOpacity=".2" /><stop offset="1" stopColor="#dfe6ef" stopOpacity="0" /></radialGradient>
      <filter id="rt-contact" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
    </defs>
    <Parts parts={[tablePart]} />
    <g className="rt-flat" transform={matrix(tableMatrix)}>
      <circle cx="10" cy="10" r="430" fill="url(#rt-pool)" />
      <rect x="-246" y="-176" width="492" height="372" rx="20" fill="#000" opacity=".85" filter="url(#rt-contact)" />
    </g>
    <Parts parts={bodyParts} />
    <g className="rt-flat" transform={matrix(plateMatrix)}>
      <rect x="-236" y="-176" width="472" height="352" rx="8" fill="url(#rt-sweep)" />
      <rect x="-234.5" y="-174.5" width="469" height="349" rx="7" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth=".9" />
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
