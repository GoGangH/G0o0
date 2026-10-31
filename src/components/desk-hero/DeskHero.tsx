import "../iso/iso.css";
import "./desk-hero.css";
import { DeskArt } from "./DeskArt";
import { DeskLive } from "./DeskLive";
import type { LatestPost } from "./DeskPhone";
import { beacons, drawerShift, framePivot, H, lampGlow, sortedParts, W, type DeskPart } from "./geometry";

export function DeskHero({ latestPost }: { latestPost?: LatestPost }) {
  const runs: { id: string; group: string; parts: DeskPart[] }[] = [];
  for (const part of sortedParts) {
    const last = runs.at(-1);
    if (last?.group === part.group) last.parts.push(part);
    else runs.push({ id: part.name, group: part.group, parts: [part] });
  }
  return <div className="desk-hero iso h-full" data-theme="light">
    <DeskLive width={W} height={H} shift={drawerShift} glow={lampGlow} beacons={beacons} framePivot={framePivot} latestPost={latestPost} runs={runs.map((run) => ({ id: run.id, group: run.group, art: <DeskArt key={run.id} parts={run.parts} /> }))} />
  </div>;
}
