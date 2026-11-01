"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { playClick, startCrackle, stopCrackle } from "@/components/records/sound";

type Neighbor = { slug: string; title: string } | undefined;
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

// Reading is the playback: the seek bar follows the scroll position. Sound only starts from the play button.
export function PlayerBar({ title, album, albumLabel, minutes, older, newer }: { title: string; album: string; albumLabel: string; minutes: number; older: Neighbor; newer: Neighbor }) {
  const [playing, setPlaying] = useState(false);
  const fill = useRef<HTMLSpanElement>(null);
  const elapsed = useRef<HTMLSpanElement>(null);
  const total = minutes * 60;

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 1;
      if (fill.current) fill.current.style.transform = `scaleX(${progress})`;
      if (elapsed.current) elapsed.current.textContent = clock(progress * total);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      stopCrackle(0.4);
    };
  }, [total]);

  const toggle = () => {
    playClick();
    if (playing) stopCrackle();
    else startCrackle();
    setPlaying(!playing);
  };
  const seek = (event: MouseEvent<HTMLButtonElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: ((event.clientX - box.left) / box.width) * scrollable });
  };

  return <div className="player-bar" data-playing={playing ? "" : undefined} role="region" aria-label="재생 중인 트랙">
    <span className="player-disc" data-album={album} aria-hidden="true" />
    <div className="player-info">
      <p className="player-title">{title}</p>
      <p className="player-sub">{albumLabel} · 고강현</p>
    </div>
    <div className="player-controls">
      {older ? <Link href={`/blog/${older.slug}`} className="player-skip" aria-label={`이전 트랙: ${older.title}`}><svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2h2v12H3zM14 2 6 8l8 6z" /></svg></Link> : <span className="player-skip" data-off aria-hidden="true"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 2h2v12H3zM14 2 6 8l8 6z" /></svg></span>}
      <button type="button" className="player-play" aria-pressed={playing} aria-label={playing ? "정지" : "재생"} onClick={toggle}>
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">{playing ? <path d="M3 2h4v12H3zM9 2h4v12H9z" /> : <path d="M4 2l10 6-10 6z" />}</svg>
      </button>
      {newer ? <Link href={`/blog/${newer.slug}`} className="player-skip" aria-label={`다음 트랙: ${newer.title}`}><svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M11 2h2v12h-2zM2 2l8 6-8 6z" /></svg></Link> : <span className="player-skip" data-off aria-hidden="true"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M11 2h2v12h-2zM2 2l8 6-8 6z" /></svg></span>}
    </div>
    <div className="player-seek">
      <span ref={elapsed} className="player-time">0:00</span>
      <button type="button" className="player-track" aria-label="글에서 위치 이동" onClick={seek}><span ref={fill} className="player-fill" /></button>
      <span className="player-time">{clock(total)}</span>
    </div>
    <span className="player-eq" aria-hidden="true"><i /><i /><i /><i /></span>
  </div>;
}
