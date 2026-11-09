"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Link from "next/link";
import { shelves } from "@/lib/blog/shelves";
import { Cover } from "./Cover";
import { playFlip } from "./sound";
import type { Album } from "./RecordDeck";

// Records are dug through front to back, like a shop crate: one cover in full, the rest as a staircase of top edges.
const BEHIND = 6;
const HINT_KEY = "g0o0-crate-hint";
const newest = (album: Album) => album.tracks.reduce((latest, track) => (track.date > latest ? track.date : latest), "");

export function RecordCrate({ albums, narrow, dimmed, onOpen, onPlaySingle }: {
  albums: Album[]; narrow: boolean; dimmed: boolean;
  onOpen: (key: string) => void; onPlaySingle: (event: MouseEvent, album: Album) => void;
}) {
  // Shelf order, then albums by their latest track, then singles by date; empty albums go last in their group.
  const records = useMemo(() => shelves.flatMap((shelf) => {
    const inShelf = albums.filter((album) => album.shelf === shelf.key);
    const byDate = (a: Album, b: Album) => newest(b).localeCompare(newest(a));
    return [...inShelf.filter((album) => !album.single).sort(byDate), ...inShelf.filter((album) => album.single).sort(byDate)];
  }), [albums]);
  const groups = useMemo(() => shelves
    .map((shelf) => ({ ...shelf, first: records.findIndex((album) => album.shelf === shelf.key) }))
    .filter((group) => group.first >= 0), [records]);
  const [index, setIndex] = useState(0);
  const [hint, setHint] = useState(false);
  const crate = useRef<HTMLDivElement>(null);
  const latest = useRef({ index, count: records.length });
  latest.current = { index, count: records.length };

  useEffect(() => {
    try { setHint(!localStorage.getItem(HINT_KEY)); } catch { /* Storage may be blocked; skip the hint. */ }
  }, []);

  const go = (next: number) => {
    const target = Math.max(0, Math.min(records.length - 1, next));
    if (target === latest.current.index) return;
    playFlip();
    setIndex(target);
    if (hint) {
      setHint(false);
      try { localStorage.setItem(HINT_KEY, "1"); } catch { /* Not remembered then. */ }
    }
  };
  const goRef = useRef(go);
  goRef.current = go;

  // The wheel flips records only while there is somewhere to flip to; at either end it scrolls the page again.
  useEffect(() => {
    const element = crate.current;
    if (!element) return;
    let travel = 0, last = 0;
    const wheel = (event: WheelEvent) => {
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      const { index: at, count } = latest.current;
      if ((delta < 0 && at === 0) || (delta > 0 && at === count - 1)) { travel = 0; return; }
      event.preventDefault();
      travel += delta;
      const now = performance.now();
      if (Math.abs(travel) < 45 || now - last < 240) return;
      last = now;
      goRef.current(at + Math.sign(travel));
      travel = 0;
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, []);

  // Sideways swipes flip; anything mostly vertical is left to the page (touch-action: pan-y).
  const swipe = useRef<{ x: number; y: number; id: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const front = records[index];
  const group = groups.findLast((item) => item.first <= index);
  if (!front) return null;

  return <div className={`rc-wrap${narrow ? " rc-narrow" : ""}`} data-dimmed={dimmed ? "" : undefined}>
    <nav className="rc-tabs" aria-label="그룹">
      {groups.map((item) => <button key={item.key} type="button" aria-current={item.key === group?.key ? "true" : undefined} onClick={() => go(item.first)}>{item.label}</button>)}
    </nav>
    <div ref={crate} className="rc-crate" role="group" aria-roledescription="레코드 상자" aria-label="레코드 상자, 넘겨서 고르기" tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); go(index + 1); }
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); go(index - 1); }
      }}
      onPointerDown={(event) => { if (event.button === 0) swipe.current = { x: event.clientX, y: event.clientY, id: event.pointerId, moved: false }; }}
      onPointerMove={(event) => {
        const start = swipe.current;
        if (!start || start.id !== event.pointerId) return;
        const dx = event.clientX - start.x, dy = event.clientY - start.y;
        if (!start.moved && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { swipe.current = null; return; }
        if (Math.abs(dx) > 10) start.moved = true;
      }}
      onPointerUp={(event) => {
        const start = swipe.current;
        swipe.current = null;
        if (!start?.moved) return;
        const dx = event.clientX - start.x;
        if (Math.abs(dx) > 36) { suppressClick.current = true; go(index + (dx < 0 ? 1 : -1)); }
      }}
      onPointerCancel={() => { swipe.current = null; }}
      onClickCapture={(event) => {
        if (!suppressClick.current) return;
        suppressClick.current = false;
        event.preventDefault();
        event.stopPropagation();
      }}>
      <div className="rc-stack">
        {records.map((album, at) => {
          const depth = at - index;
          if (depth < -1 || depth > BEHIND) return null;
          const style = { "--d": Math.max(depth, 0), "--a-bg": album.bg, "--a-ink": album.ink, "--a-text": album.ink, zIndex: 20 - depth } as CSSProperties;
          const startsGroup = groups.find((item) => item.first === at);
          const groupIndex = groups.findIndex((item) => item.key === album.shelf);
          const label = `${album.label}, ${album.single ? "싱글" : `${album.kind}, 트랙 ${album.count}개`}`;
          const state = depth < 0 ? "gone" : depth === 0 ? "front" : "back";
          const content = <>
            {startsGroup && <span className="rc-divider" style={{ "--tab-x": `${18 + (groupIndex % 3) * 104}px` } as CSSProperties} aria-hidden="true"><span>{startsGroup.label}</span></span>}
            <span className="rc-sleeve"><Cover album={album.key} label={album.label} kind={album.single ? "Single" : album.kind} cover={album.cover} /></span>
            {state === "back" && <span className="rc-peek" aria-hidden="true">{album.label}</span>}
          </>;
          const shared = { className: "rc-record", "data-state": state, style, tabIndex: state === "front" ? 0 : -1, "aria-hidden": state === "gone" ? true : undefined };
          if (state !== "front") return <button key={album.key} type="button" {...shared} aria-label={`${label}로 넘기기`} onClick={() => go(at)}>{content}</button>;
          return album.single
            ? <Link key={album.key} href={`/blog/${album.tracks[0].slug}`} {...shared} aria-label={`${label} 재생`} onClick={(event) => onPlaySingle(event, album)}>{content}</Link>
            : <button key={album.key} type="button" {...shared} aria-label={`${label} 열기`} onClick={() => onOpen(album.key)}>{content}</button>;
        })}
      </div>
      <span className="rc-box" aria-hidden="true"><span className="rc-box-label">G0O0 RECORDS</span></span>
      {hint && <span className="rc-hint" aria-hidden="true">{narrow ? "옆으로 넘겨 보세요" : "스크롤하거나 ← → 로 넘겨 보세요"}</span>}
    </div>
    <div className="rc-caption">
      <div className="rc-meta">
        <p className="rc-kicker">{group?.label} · {front.single ? "Single" : front.kind}{front.single ? "" : ` · ${front.count} tracks`}</p>
        <p className="rc-title">{front.label}</p>
      </div>
      <div className="rc-nav">
        <button type="button" aria-label="이전 레코드" disabled={index === 0} onClick={() => go(index - 1)}>‹</button>
        <span aria-live="polite">{index + 1} / {records.length}</span>
        <button type="button" aria-label="다음 레코드" disabled={index === records.length - 1} onClick={() => go(index + 1)}>›</button>
      </div>
    </div>
    <Link href="/blog/albums" className="rc-all">전체 목록 보기 →</Link>
  </div>;
}
