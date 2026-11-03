import { moonBeam, moonBeamAxis, motion, screenSpill, screenSpillAxis } from "./geometry";

const NOTE = "M9 0v15.3A4.2 4.2 0 1 0 11 19V6c3 1.5 6 3 6 8 2-7-3-9-8-14z";
const cone = (x: number, z: number, r: number, beat: boolean) => <g key={`${x}${z}`} className={beat ? "room-cone" : undefined}>
  <circle cx={x} cy={-z} r={r} fill="#c9ced5" />
  <circle cx={x} cy={-z} r={r * 0.78} fill="#1b1d21" />
  <circle cx={x} cy={-z} r={r * 0.3} fill="#9aa1ab" />
</g>;

// Server-rendered so none of the room's geometry ships to the browser; only CSS moves these.
export function DeskMotion() {
  return <>
    <defs>
      <linearGradient id="room-moonbeam" gradientUnits="userSpaceOnUse" x1={moonBeamAxis.from[0]} y1={moonBeamAxis.from[1]} x2={moonBeamAxis.to[0]} y2={moonBeamAxis.to[1]}>
        <stop offset="0" stopColor="#bcd4ff" stopOpacity=".11" /><stop offset=".7" stopColor="#bcd4ff" stopOpacity=".03" /><stop offset="1" stopColor="#bcd4ff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="room-screenspill" gradientUnits="userSpaceOnUse" x1={screenSpillAxis.from[0]} y1={screenSpillAxis.from[1]} x2={screenSpillAxis.to[0]} y2={screenSpillAxis.to[1]}>
        <stop offset="0" stopColor="#6fa8ff" stopOpacity=".26" /><stop offset=".55" stopColor="#6fa8ff" stopOpacity=".08" /><stop offset="1" stopColor="#6fa8ff" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Night lights: only drawn in dark mode, and never animated. */}
    <path className="room-night" d={moonBeam} fill="url(#room-moonbeam)" />
    <path className="room-night" d={screenSpill} fill="url(#room-screenspill)" />
    <g transform={`${motion.record} scale(.8)`}>
      <g className="room-spin">
        <circle r="17.5" fill="#4a86ff" fillOpacity=".78" />
        {[15.5, 13, 10.5, 8].map((r) => <circle key={r} r={r} fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth=".35" />)}
        <circle r="5.6" fill="#dbe7ff" />
        <rect x="-.6" y="6" width="1.2" height="10" fill="#fff" opacity=".55" />
        <circle r=".9" fill="#0a0a0b" />
      </g>
    </g>
    <g transform={`${motion.arm} scale(.72) rotate(-16)`}>
      <g className="room-arm">
        <circle r="34" fill="none" />
        <rect x="-2.6" y="-9" width="5.2" height="6" rx="1" fill="#2a2c30" />
        <path d="M0 0L1.5 22L-2.5 30" fill="none" stroke="#5c6168" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 0L1.5 22L-2.5 30" fill="none" stroke="#e8ebef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="-5" y="29" width="5" height="3.4" rx=".6" fill="#c9ced5" transform="rotate(25 -2.5 30.7)" />
        <circle r="2.4" fill="#9aa1ab" />
      </g>
    </g>
    <g transform={motion.led}><circle className="room-led" cx="124" cy="-3.5" r="1.1" fill="#ff4d3d" /></g>
    <g transform={motion.speaker}>
      {cone(134, 104, 3.2, false)}
      {cone(134, 87, 7.6, true)}
      {cone(134, 68, 7.6, true)}
    </g>
    <g transform={`translate(${motion.notesFrom[0]} ${motion.notesFrom[1]})`}>
      {[0, 1, 2, 3].map((i) => <path key={i} className="room-note" d={NOTE} transform="translate(-9 -12) scale(.9)" />)}
    </g>
  </>;
}
