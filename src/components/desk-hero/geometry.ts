import { boxCorners, cylinder, depthOf, fitProjection, iso, slabOf, sideMatrix, topMatrix, type Plan, type Tone } from "../iso/iso-kit";

// Figure concept: one room, and the things in it are the navigation.
export const W = 1000, H = 860;
export const deskPlan: Plan = { x: -110, y: -64, w: 220, d: 146, r: 5 };
const room: Plan = { x: -156, y: -96, w: 316, d: 246, r: 0 };
export const P = fitProjection([
  ...boxCorners(room, -6, 0),
  ...boxCorners({ x: -156, y: -96, w: 316, d: 6, r: 0 }, 0, 250),
  ...boxCorners({ x: -156, y: -96, w: 6, d: 246, r: 0 }, 0, 250),
], W, H, { pad: 24, azimuth: 48, elevation: 30 });
export type DeskPart = { layer: number; name: string; group: string; plan: Plan; z: number; h: number; tone: Tone; material: string; paths: ReturnType<typeof slabOf>; key: number };
export const parts: DeskPart[] = [];
// Painted lowest layer first, by depth within a layer: walls, what hangs on them, the floor, what stands on it.
let layer = 0;
function add(name: string, group: string, x: number, y: number, w: number, d: number, z: number, h: number, material = "paper", tone: Tone = "mid", r = 0.7) {
  const plan = { x, y, w, d, r };
  parts.push({ layer, name, group, plan, z, h, material, tone, paths: slabOf(plan, z, h, P, 5, Math.min(0.6, h / 4)), key: depthOf([x + w/2, y + d/2, z + h/2], P) });
}
function addRound(name: string, group: string, cx: number, cy: number, r: number, z: number, h: number, material = "ink", tone: Tone = "mid") {
  const plan = { x: cx - r, y: cy - r, w: r * 2, d: r * 2, r };
  parts.push({ layer, name, group, plan, z, h, material, tone, paths: cylinder(cx, cy, r, z, h, P, 32, Math.min(0.6, h / 4)), key: depthOf([cx, cy, z + h / 2], P) });
}
add("floor", "room", room.x, room.y, room.w, room.d, -6, 6, "floor", "mid", 0);
add("wall-back", "room", -156, -96, 316, 6, 0, 250, "wall", "mid", 0);
add("wall-left", "room", -156, -90, 6, 240, 0, 250, "wall", "mid", 0);
layer = 1;
add("window-frame", "window", -150, 20, 2, 90, 110, 100, "ink");
layer = 2;
add("window-glass", "window", -148, 26, 0.5, 78, 116, 88, "glass", "mid", 0);
layer = 3;
add("window-mullion-v", "window", -147.5, 63.5, 0.4, 3, 116, 88, "ink", "lo", 0);
add("window-mullion-h", "window", -147.5, 26, 0.4, 78, 158, 3, "ink", "lo", 0);
layer = 5;
add("frame-back", "frame", 72, -90, 56, 3, 130, 72, "ink");
layer = 6;
add("frame-paper", "frame", 76, -87, 48, 0.4, 134, 64, "paper", "hi");
layer = 7;
for(let i=0;i<3;i++) add(`certificate-rule-${i}`, "frame", 82, -86.6, 36-i*6, 0.2, 185-i*9, 1.2, "ink", "lo", 0);
add("certificate-seal", "frame", 96, -86.6, 8, 0.3, 142, 8, "ink", "lo", 1);
layer = 7.5;
// Three sleeves framed on the wall: a way into the album shelf.
for (const [i, x] of [-118, -78, -38].entries()) add(`wall-lp-${i}`, "albums", x, -90, 34, 2, 190, 34, `lp-${i}`, "hi", 0.5);
layer = 8;
add("rug", "room", -130, -40, 262, 170, 0, 1.2, "rug", "mid", 4);
// A tall bookshelf against the left wall: the way to the about page.
const SHELF = { x: -150, y: -52, w: 22, d: 64 }, BOARDS = [0, 42, 84, 126, 168];
layer = 12.1;
add("shelf-back", "shelf", SHELF.x, SHELF.y, 2, SHELF.d, 0, 171, "ink", "mid", 0);
add("shelf-side-far", "shelf", SHELF.x, SHELF.y, SHELF.w, 3, 0, 171, "ink", "hi", 0.5);
let seed = 7;
const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
for (const [row, z] of BOARDS.entries()) {
  layer = 12.2 + row * 0.1;
  add(`shelf-board-${row}`, "shelf", SHELF.x, SHELF.y + 3, SHELF.w, SHELF.d - 6, z, row ? 3 : 6, "ink", "hi", 0.3);
  if (row === BOARDS.length - 1) break;
  layer += 0.05;
  const floor = z + (row ? 3 : 6);
  // The second shelf keeps a few records lying flat and a small object, so the rows don't read as a barcode.
  let y = SHELF.y + 4.5;
  while (y < SHELF.y + SHELF.d - 8) {
    if (row === 1 && y > SHELF.y + 36) { for (let k = 0; k < 3; k++) add(`shelf-lp-${k}`, "shelf", SHELF.x + 2.5, y + 1 + k * 0.4, 18, 18, floor + k * 1.4, 1.3, `book-${k * 2}`, "mid", 0.3); break; }
    const w = 2.6 + Math.round(rand() * 3), h = 24 + Math.round(rand() * 12), depth = 14 + Math.round(rand() * 4);
    add(`shelf-book-${row}-${Math.round(y)}`, "shelf", SHELF.x + 2.5, y, depth, w, floor, Math.min(h, 38 - (row ? 3 : 6) + 3), `book-${Math.floor(rand() * 6)}`, "mid", 0.3);
    y += w + 0.4 + (rand() < 0.15 ? 4 : 0);
  }
  if (row === 3) addRound("shelf-vase", "shelf", SHELF.x + 11, SHELF.y + SHELF.d - 9, 3.6, floor, 14, "accent");
}
layer = 12.8;
add("shelf-side-near", "shelf", SHELF.x, SHELF.y + SHELF.d - 3, SHELF.w, 3, 0, 171, "ink", "hi", 0.5);
layer = 13;
for (const x of [-102, 94]) for (const y of [-56, 66]) {
  add(`foot-${x}-${y}`, "base", x-1, y-1, 10, 10, 0, 3, "ink", "lo");
  add(`leg-${x}-${y}`, "base", x, y, 8, 8, 3, 73, "ink", "lo");
}
for (const x of [-102, 94]) add(`stretcher-${x}`, "base", x, -48, 8, 114, 25, 5, "ink", "lo");
// Open-sided drawer: flush contacts; no hidden solid box intersecting the tray.
add("drawer-back", "drawer", 30, 25, 64, 3, 56, 17, "ink");
add("drawer-floor", "drawer", 30,28,64,47,56,3,"ink");
add("drawer-left", "drawer", 30,28,3,47,59,14,"ink");
add("drawer-right", "drawer", 91,28,3,47,59,14,"ink");
add("drawer-front", "drawer", 30,75,64,4,56,20,"paper","hi");
add("drawer-pull", "drawer", 53,79,19,3,64,3,"ink");
layer = 14;
add("desktop", "desk", -110,-64,220,146,76,9,"paper","hi",5);
layer = 15;
// The neck stands directly under the case, on a foot centred beneath it.
add("monitor-foot", "monitor", -55,-46,54,30,85,3,"ink");
add("monitor-neck", "monitor", -32,-35,8,7,88,22,"ink");
add("monitor-case", "monitor", -82,-35,108,7,110,68,"ink","hi",2);
add("monitor-bezel", "monitor", -78,-28,100,1,114,60,"paper","hi",1);
add("monitor-screen", "monitor", -74,-27,92,0.5,120,50,"screen","hi",0.5);
add("keyboard-tray", "keyboard", -68,23,88,34,85,3,"ink");
for(let row=0;row<3;row++) for(let col=0;col<7;col++) add(`key-${row}-${col}`,"keyboard",-64+col*11.3,27+row*7.5,9.1,5.5,88,2,"paper","lo");
add("spacebar", "keyboard", -48,50,39,4,88,2,"paper","lo");
add("enter", "keyboard", 0,50,13,4,88,2,"ink","lo");
add("phone-body","phone",44,18,38,60,85,2.6,"ink","hi",3);
add("phone-glass","phone",46,20,34,56,87.6,0.4,"screen","hi",2);
layer = 16;
add("phone-island","phone",56,22,14,2,88,0.3,"ink","lo",1);
for(const [i, material] of ["accent","accent-soft","paper"].entries()) add(`folder-${i}`,"phone",47.5+i*11,30,10,10,88,0.35,material,"lo",1.5);
layer = 16.5;
add("phone-home","phone",54,72,16,1,88,0.2,"paper","lo",0.3);
layer = 15;
add("lamp-base","lamp",84,-58,22,20,85,3,"ink");
add("lamp-stem","lamp",93,-49,3,3,88,54,"ink");
add("lamp-arm","lamp",86,-49,10,3,142,3,"ink");
add("lamp-shade","lamp",82,-53,16,12,133,9,"paper","hi",3);
// A study desk: a stack of books, a notebook and a mug where the turntable used to sit.
for (const [i, [x, y, w, d, m]] of ([[38, -44, 30, 20, "book-3"], [40, -42, 27, 17, "book-1"], [37, -45, 29, 21, "book-5"]] as const).entries()) add(`desk-book-${i}`, "decor", x, y, w, d, 85 + i * 4.5, 4.5, m, "mid", 0.6);
add("notebook", "decor", 34, -14, 28, 20, 85, 1.2, "paper", "hi", 1);
add("pen", "decor", 64, -12, 2, 16, 85, 1.4, "ink", "lo", 0.6);
addRound("mug", "decor", 82, -12, 4.6, 85, 10, "accent");
// The turntable gets a low record cabinet of its own, its LPs filed on the open side.
layer = 16.6;
add("speaker-foot", "speaker", 118, -88, 32, 30, 0, 2, "metal", "lo", 1);
add("speaker-cabinet", "speaker", 120, -86, 28, 26, 2, 112, "ink", "hi", 2);
layer = 16.7;
for (const x of [114, 150]) for (const y of [-46, 34]) add(`console-leg-${x}-${y}`, "turntable", x, y, 4, 4, 0, 12, "metal", "lo");
add("console-body", "turntable", 112, -48, 44, 88, 12, 34, "ink", "hi", 1.5);
layer = 16.75;
// Spines face the room from the cabinet's open side.
for (let i = 0; i < 24; i++) add(`console-lp-${i}`, "albums", 155.6, -44 + i * 3.4, 1.4, 2.6, 15 + (i % 3), 27 - (i % 3), `book-${(i * 5) % 6}`, "mid", 0);
layer = 16.8;
add("turntable-plinth", "turntable", 116, -42, 36, 42, 46, 6, "metal", "hi", 2.5);
addRound("turntable-platter", "turntable", 131, -21, 14.2, 52, 2.4, "ink");
addRound("turntable-arm-base", "turntable", 146.5, -35, 3.2, 52, 2.6, "metal");
add("turntable-speed", "turntable", 119, -5, 8, 3, 52, 0.8, "ink", "lo", 1);
layer = 16.9;
// A plant in the corner by the window.
add("plant-pot", "plant", -146, 116, 24, 24, 0, 24, "accent", "mid", 4);
add("plant-stem", "plant", -136, 126, 4, 4, 24, 26, "ink", "lo");
layer = 16.91;
add("plant-leaf-low", "plant", -149, 113, 30, 30, 50, 22, "leaf", "mid", 10);
layer = 16.92;
add("plant-leaf-mid", "plant", -145, 117, 22, 22, 72, 20, "leaf", "mid", 8);
layer = 16.93;
add("plant-leaf-top", "plant", -141, 121, 14, 14, 92, 16, "leaf", "mid", 5);
layer = 17;
add("stool-base", "stool", -46, 98, 30, 30, 1.2, 3, "ink", "lo", 12);
add("stool-post", "stool", -33, 111, 4, 4, 4.2, 40, "ink", "lo");
add("stool-seat", "stool", -49, 95, 36, 36, 44, 6, "accent", "mid", 14);
export const sortedParts = [...parts].sort((a,b)=>a.layer-b.layer||a.key-b.key);
export const screenPlane = sideMatrix([0,-26.4],0,P,"left");
export const phonePlane = topMatrix([0,0],88.6,P);
export const framePivot = iso([100,-87,204],P);
export const drawerShift = (() => { const a=iso([0,0,0],P), b=iso([0,18,0],P); return [b[0]-a[0],b[1]-a[1]]; })();
const flatPath = (points: [number, number, number][]) => `M${points.map((point) => iso(point, P).map((n) => n.toFixed(1)).join(" ")).join("L")}Z`;
export const lampGlow = flatPath([[82, -41, 133], [98, -53, 133], [120, -30, 85], [70, 10, 85], [45, -10, 85]]);
export const lampHit = flatPath([[78, -56, 150], [104, -56, 150], [110, -34, 83], [82, -34, 83]]);
export const moon = flatPath(Array.from({ length: 24 }, (_, i): [number, number, number] => {
  const angle = (i / 24) * Math.PI * 2;
  return [-147.4, 86 + 8 * Math.cos(angle), 184 + 8 * Math.sin(angle)];
}));
// Night: moonlight falls from the window across the floor, panes and all.
const RUG_TOP = 1.3, FALL = 1.1, DRIFT = 0.25;
const onFloor = (y: number, z: number): [number, number, number] => { const t = (z - RUG_TOP) / FALL; return [-148 + t, y + DRIFT * t, RUG_TOP]; };
const PANES_Y = [[26, 63.5], [66.5, 104]], PANES_Z = [[116, 158], [161, 204]];
export const moonPanes = PANES_Y.flatMap(([y0, y1]) => PANES_Z.map(([z0, z1]) => flatPath([onFloor(y0, z0), onFloor(y1, z0), onFloor(y1, z1), onFloor(y0, z1)])));
const hull = (points: number[][]) => {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: number[][]) => list.reduce<number[][]>((out, point) => { while (out.length > 1 && cross(out[out.length - 2], out[out.length - 1], point) <= 0) out.pop(); out.push(point); return out; }, []);
  const lower = half(sorted), upper = half([...sorted].reverse());
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
const windowCorners: [number, number][] = [[26, 116], [104, 116], [104, 204], [26, 204]];
const beamPoints = hull(windowCorners.flatMap(([y, z]) => [iso([-148, y, z], P), iso(onFloor(y, z), P)]));
export const moonBeam = `M${beamPoints.map((point) => point.map((n) => n.toFixed(1)).join(" ")).join("L")}Z`;
export const moonBeamAxis = { from: iso([-148, 65, 160], P), to: iso(onFloor(65, 160), P) };
export const stars = ([[34, 196], [48, 178], [92, 198], [100, 170], [56, 128], [30, 140]] as const).map(([y, z]) => iso([-147.4, y, z], P));
// The monitor's light on the desk in front of it.
export const screenSpill = flatPath([[-76, -26, 85.1], [20, -26, 85.1], [36, 22, 85.1], [-92, 22, 85.1]]);
export const screenSpillAxis = { from: iso([-28, -26, 85], P), to: iso([-28, 22, 85], P) };
// Where each clickable thing's blinking marker sits.
export const beacons = Object.entries({
  monitor: [-28, -31, 186],
  turntable: [131, -21, 66],
  shelf: [-139, -20, 182],
  albums: [-62, -88, 234],
  drawer: [84, 79, 67],
  frame: [100, -87, 212],
  phone: [63, 62, 96],
  lamp: [90, -47, 156],
} satisfies Record<string, [number, number, number]>).map(([id, point]) => ({ id, at: iso(point, P) }));

// Moving parts, drawn in their own layer: the record, the tonearm, the speaker cones and the deck's light.
export const motion = {
  record: topMatrix([131, -21], 54.6, P),
  arm: topMatrix([146.5, -35], 55.2, P),
  speaker: sideMatrix([0, -59.8], 0, P, "left"),
  led: topMatrix([0, 0], 52.9, P),
  notesFrom: iso([131, -21, 64], P),
};
export const wallFace = sideMatrix([0, -87.9], 0, P, "left");
