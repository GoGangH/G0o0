import { boxCorners, depthOf, fitProjection, iso, slabOf, sideMatrix, topMatrix, type Plan, type Tone } from "../iso/iso-kit";

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
layer = 8;
add("rug", "room", -130, -40, 262, 170, 0, 1.2, "rug", "mid", 4);
layer = 9;
add("plant-pot", "plant", -143, -82, 24, 24, 0, 24, "accent", "mid", 4);
add("plant-stem", "plant", -133, -72, 4, 4, 24, 26, "ink", "lo");
layer = 10;
add("plant-leaf-low", "plant", -146, -85, 30, 30, 50, 22, "leaf", "mid", 10);
layer = 11;
add("plant-leaf-mid", "plant", -142, -81, 22, 22, 72, 20, "leaf", "mid", 8);
layer = 12;
add("plant-leaf-top", "plant", -138, -77, 14, 14, 92, 16, "leaf", "mid", 5);
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
for(let i=0;i<3;i++) {
  const x=44-i*2, y=-24+i*2, z=85+i*9;
  add(`book-${i}-bottom`,"books",x,y,44,32,z,1.2,"ink");
  add(`book-${i}-pages`,"books",x+1,y+1,42,30,z+1.2,6.6,"paper","lo");
  add(`book-${i}-cover`,"books",x,y,44,32,z+7.8,1.2,"ink","hi");
}
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
// Where each clickable thing's blinking marker sits.
export const beacons = Object.entries({
  monitor: [-28, -31, 186],
  books: [66, -8, 122],
  drawer: [84, 79, 67],
  frame: [100, -87, 212],
  phone: [63, 62, 96],
  lamp: [90, -47, 156],
} satisfies Record<string, [number, number, number]>).map(([id, point]) => ({ id, at: iso(point, P) }));
