import { cylinder, iso, pathOf, slabOf, type Plan, type Projection, type Tone } from "../iso/iso-kit";

// The turntable's fixed geometry, after a silver direct-drive deck: +x is the deck's right, +y its front.
// Only the disc, the platter's strobe rim and the tonearm move, and they live in the DOM above this drawing.
export const DECK_W = 660, DECK_H = 540;
export const DISC_RADIUS = 132;

const P: Projection = { origin: [DECK_W / 2 + 6, DECK_H * 0.53], scale: 1, azimuth: 40, elevation: 36 };
const BASE_H = 24, TRIM_H = 6, PLATE_H = 4;
const TOP = BASE_H + TRIM_H + PLATE_H;
const PLATTER: [number, number] = [-52, 2];
const PIVOT: [number, number] = [176, -122];
const PLATTER_H = 14;

export type DeckPart = { name: string; material: string; tone: Tone; paths: ReturnType<typeof slabOf> };
const part = (name: string, material: string, paths: DeckPart["paths"], tone: Tone = "hi"): DeckPart => ({ name, material, tone, paths });
const round = (name: string, material: string, x: number, y: number, r: number, z: number, h: number, steps = 32) => part(name, material, cylinder(x, y, r, z, h, P, steps, 0.6));
const slab = (name: string, material: string, plan: Plan, z: number, h: number) => part(name, material, slabOf(plan, z, h, P, 4, Math.min(0.6, h / 4)));

const feet = [[-192, 138], [192, 138], [-192, -138], [192, -138]];
const START: Plan = { x: -222, y: 122, w: 54, d: 36, r: 3 };

// The walnut table the deck stands on; it runs off the stage to the left and front.
export const tablePart = slab("table", "wood", { x: -760, y: -250, w: 1090, d: 1100, r: 10 }, -44, 26);
export const tableMatrix = planeAt([0, 0], -18);

export const bodyParts: DeckPart[] = [
  ...feet.flatMap(([x, y], index) => [round(`foot-${index}`, "rubber", x, y, 28, -18, 18), round(`foot-ring-${index}`, "metal", x, y, 28, -3, 3)]),
  slab("base", "rubber", { x: -236, y: -176, w: 472, d: 352, r: 8 }, 0, BASE_H),
  slab("trim", "metal", { x: -236, y: -176, w: 472, d: 352, r: 8 }, BASE_H, TRIM_H),
  slab("plate", "plate", { x: -236, y: -176, w: 472, d: 352, r: 8 }, BASE_H + TRIM_H, PLATE_H),
];

export const fittings: DeckPart[] = [
  round("adapter", "metal", -204, -144, 23, TOP, 2),
  round("adapter-hole", "rubber", -204, -144, 7, TOP + 2, 0.4, 16),
  round("well", "rubber", PIVOT[0], PIVOT[1], 47, TOP, 1, 48),
  round("arm-base", "metal", PIVOT[0], PIVOT[1], 31, TOP + 1, 8, 40),
  round("arm-post", "dark", PIVOT[0], PIVOT[1], 13, TOP + 9, 25),
  round("skate", "rubber", 210, -94, 11, TOP + 1, 12, 20),
  round("skate-cap", "metal", 210, -94, 6, TOP + 13, 1, 14),
  slab("cue-lever", "dark", { x: 142, y: -92, w: 6, d: 22, r: 2 }, TOP + 1, 10),
  round("cue-knob", "dark", 145, -68, 5, TOP + 1, 14, 12),
  round("rest-post", "dark", 176, 46, 4, TOP, 26, 12),
  slab("rest-cradle", "metal", { x: 166, y: 42, w: 20, d: 8, r: 2 }, TOP + 26, 3),
  round("platter", "rubber", PLATTER[0], PLATTER[1], 152, TOP, PLATTER_H, 96),
];
export const fittingsAbove: DeckPart[] = [
  round("mat", "rubber", PLATTER[0], PLATTER[1], 138, TOP + PLATTER_H, 1, 96),
  round("spindle", "metal", PLATTER[0], PLATTER[1], 3, TOP + PLATTER_H + 1, 7, 12),
  round("dial-collar", "metal", -205, 88, 16, TOP, 14),
  round("dial", "rubber", -205, 88, 13, TOP + 14, 7),
  slab("start-well", "rubber", START, TOP, 1),
  slab("start", "metal", { x: START.x + 3, y: START.y + 3, w: START.w - 6, d: START.d - 6, r: 2 }, TOP + 1, 5),
  slab("speed-33", "metal", { x: -160, y: 148, w: 25, d: 11, r: 2 }, TOP, 3),
  slab("speed-45", "dark", { x: -133, y: 148, w: 25, d: 11, r: 2 }, TOP, 3),
  round("light-socket", "rubber", 92, 150, 11, TOP, 1, 18),
  round("light", "metal", 92, 150, 7.5, TOP + 1, 26, 18),
  slab("fader-knob", "metal", { x: 203, y: 83, w: 20, d: 15, r: 2 }, TOP, 7),
];

// Maps a flat layer lying on the deck at height z into the drawing, as matrix() numbers.
function planeAt([x, y]: [number, number], z: number) {
  const origin = iso([x, y, z], P);
  const along = (dx: number, dy: number) => {
    const point = iso([x + dx, y + dy, z], P);
    return [point[0] - origin[0], point[1] - origin[1]];
  };
  return [...along(1, 0), ...along(0, 1), ...origin];
}

export const plateMatrix = planeAt([0, 0], TOP);
export const pivotPlate = PIVOT;
export const platterCenter = PLATTER;
export const platterTopMatrix = planeAt(PLATTER, TOP + PLATTER_H);
export const platterMatrix = planeAt(PLATTER, TOP + PLATTER_H + 2);
export const armMatrix = planeAt(PIVOT, TOP + 34);
export const startKeyMatrix = planeAt([START.x + 27, START.y + 18], TOP + 6);

const footprint = (plan: Plan, z: number) => pathOf([[plan.x, plan.y], [plan.x + plan.w, plan.y], [plan.x + plan.w, plan.y + plan.d], [plan.x, plan.y + plan.d]].map(([x, y]) => iso([x, y, z], P)), true);
export const startHit = footprint({ ...START, x: START.x - 6, y: START.y - 6, w: START.w + 12, d: START.d + 12 }, TOP + 6);
export const startKey = footprint({ ...START, x: START.x + 3, y: START.y + 3, w: START.w - 6, d: START.d - 6 }, TOP + 6);
