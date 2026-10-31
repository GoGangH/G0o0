import { DeskArt } from "@/components/desk-hero/DeskArt";
import { P, sortedParts } from "@/components/desk-hero/geometry";
import "@/components/iso/iso.css";
import { boxCorners, iso } from "@/components/iso/iso-kit";
import "@/components/desk-hero/desk-hero.css";

// The same object you clicked in the room, cropped out of the room's own geometry.
export function RoomObject({ group }: { group: string }) {
  const parts = sortedParts.filter((part) => part.group === group);
  const flat = parts.flatMap((part) => boxCorners(part.plan, part.z, part.z + part.h).map((point) => iso(point, P)));
  const xs = flat.map(([x]) => x);
  const ys = flat.map(([, y]) => y);
  const [left, top] = [Math.min(...xs) - 3, Math.min(...ys) - 3];
  const [width, height] = [Math.max(...xs) + 3 - left, Math.max(...ys) + 3 - top];
  return <div aria-hidden="true" className="desk-hero iso room-object" data-theme="light">
    <svg viewBox={`${left} ${top} ${width} ${height}`} className="iso-svg"><DeskArt parts={parts} /></svg>
  </div>;
}
