"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cover } from "./Cover";
import { playClick, playDrop, playFlip, playNeedle, playPull, setSoundEnabled, soundEnabled, startCrackle, stopCrackle } from "./sound";
import "./records.css";

type Track = { slug: string; title: string; date: string; readTime: number; summary: string };
export type Album = { key: string; label: string; catalog: string; kind: string; count: number; tracks: Track[] };
type Matrix = number[];
type Playing = { track: Track; album: Album };
type Flight = Playing & { phase: "start" | "pull" | "fly" };

const DISC = 132;
const ARM_REST = 0, ARM_PLAY = 34;
const PULL_MS = 280, FLY_MS = 480, NEEDLE_MS = 420;

// Everything is placed in a fixed design size and the whole stage is scaled to fit.
const PER_VIEW = 3;
const LAYOUTS = {
  wide: {
    w: 1120, h: 560, hOpen: 560, deck: { x: 2, y: 26, s: 0.94 }, pull: [-175, 0], nowPlaying: [44, 512], sound: [982, 526], shelf: { idle: [656, 300, 456], open: [692, 514, 250] },
    shelfRow: { x: 664, y: 149, s: 0.42, step: 154 }, pager: [664, 322],
    open: { x: 700, y: 34, s: 1 }, rest: { x: 700, y: 412, s: 0.28, step: 112 },
  },
  narrow: {
    w: 430, h: 540, hOpen: 690, deck: { x: 24, y: 0, s: 0.58 }, pull: [0, -150], nowPlaying: [18, 306], sound: [18, 262], shelf: { idle: [6, 480, 418], open: [25, 676, 380] },
    shelfRow: { x: 16, y: 350, s: 0.36, step: 134 }, pager: [18, 492],
    open: { x: 35, y: 216, s: 1 }, rest: { x: 35, y: 590, s: 0.24, step: 96 },
  },
};
type LayoutName = keyof typeof LAYOUTS;

// Grooves with a wider band between tracks, and a paper label with its small print running round the rim, like a pressed LP.
function Vinyl({ album, side = "A" }: { album: Album; side?: string }) {
  const id = useId();
  const count = album.tracks.length;
  const bands = Array.from({ length: Math.max(0, count - 1) }, (_, index) => 128 - ((index + 1) * 72) / count);
  return <svg viewBox="-132 -132 264 264" className="rt-vinyl" aria-hidden="true">
    <defs><path id={id} d="M0-37.5a37.5 37.5 0 1 1-.01 0" /></defs>
    <circle r="132" fill="#0e0e10" />
    <circle r="131" fill="none" stroke="#2c2c30" strokeWidth="1.5" />
    {Array.from({ length: 19 }, (_, index) => 128 - index * 4).map((r) => <circle key={r} r={r} fill="none" stroke="#fff" strokeOpacity={r % 12 === 0 ? 0.11 : 0.05} strokeWidth=".7" />)}
    {bands.map((r) => <circle key={r} r={r} fill="none" stroke="#000" strokeWidth="2.6" />)}
    <circle r="50" fill="#141416" />
    <circle r="45" className="rt-label" data-album={album.key} />
    <circle r="45" fill="none" stroke="#000" strokeOpacity=".22" />
    <text className="rt-label-rim"><textPath href={`#${id}`}>G0O0 RECORDS · {album.catalog} · STEREO · 33⅓ RPM · ALL RIGHTS RESERVED ·</textPath></text>
    <text y="-15" className="rt-label-title">{album.label}</text>
    <text x="-23" y="4" className="rt-label-sub">SIDE {side}</text>
    <text x="23" y="4" className="rt-label-sub">33⅓</text>
    <text y="20" className="rt-label-sub">GO KANGHYUN</text>
    <circle r="3.2" fill="#0a0a0b" />
  </svg>;
}

function Disc({ album, matrix, className, style }: { album: Album; matrix: Matrix; className?: string; style?: CSSProperties }) {
  return <div className={`rt-disc ${className ?? ""}`} style={{ transform: `matrix(${matrix.join(",")})`, ...style }}>
    <div className="rt-disc-inner rt-spin"><Vinyl album={album} /></div>
    <div className="rt-disc-sheen" />
  </div>;
}

const NOTE = "M9 0v15.3A4.2 4.2 0 1 0 11 19V6c3 1.5 6 3 6 8 2-7-3-9-8-14z";

// Staves curving across the wall, faint, with a few notes sitting on them.
function WallScore() {
  const staff = (y: number, bend: number) => [0, 12, 24, 36, 48].map((offset) => `M-40 ${y + offset}C260 ${y + offset - bend} 560 ${y + offset + bend} 860 ${y + offset}S1240 ${y + offset - bend} 1400 ${y + offset}`).join("");
  return <svg className="rt-score" viewBox="0 0 1360 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d={staff(80, 60)} fill="none" stroke="#f3ece0" strokeWidth="1" />
    <path d={staff(430, -50)} fill="none" stroke="#f3ece0" strokeWidth="1" />
    {[[860, 60, 1.5], [960, 92, 1.3], [1090, 40, 1.6], [1210, 96, 1.2], [700, 74, 1.2], [1130, 420, 1.4], [1250, 462, 1.2]].map(([x, y, k]) => <path key={`${x}${y}`} d={NOTE} fill="#f3ece0" transform={`translate(${x} ${y}) scale(${k})`} />)}
  </svg>;
}

// A tube, gimbal and counterweight seen from above; the deck's own matrix lays them on the plate.
function Tonearm({ down }: { down: boolean }) {
  const tube = "M0 0V60C0 105 20 110 20 150C20 190-6 196-10 226";
  return <svg viewBox="-60 -100 120 390" width="120" height="390" className="rt-arm-svg" aria-hidden="true">
    <defs>
      <linearGradient id="rt-steel" x1="0" x2="1"><stop offset="0" stopColor="#8d8f93" /><stop offset=".45" stopColor="#f2f3f4" /><stop offset="1" stopColor="#7c7e82" /></linearGradient>
      <linearGradient id="rt-weight" x1="0" x2="1"><stop offset="0" stopColor="#1b1b1d" /><stop offset=".4" stopColor="#55565a" /><stop offset="1" stopColor="#141416" /></linearGradient>
    </defs>
    <g className="rt-arm-shadow" data-down={down ? "" : undefined}>
      <path d={tube} fill="none" stroke="#000" strokeWidth="8" strokeLinecap="round" />
      <rect x="-11" y="2" width="22" height="44" rx="3" fill="#000" transform="translate(-10 226) rotate(8)" />
    </g>
    <rect x="-4" y="-46" width="8" height="46" fill="url(#rt-steel)" />
    <rect x="-18" y="-86" width="36" height="32" rx="3" fill="url(#rt-weight)" />
    {[-82, -78, -74].map((y) => <rect key={y} x="-18" y={y} width="36" height="1" fill="#000" opacity=".5" />)}
    <rect x="-18" y="-58" width="36" height="9" fill="#f0f0ec" />
    {[-14, -9, -4, 1, 6, 11].map((x) => <rect key={x} x={x} y="-58" width=".9" height="5" fill="#111" />)}
    <path d={tube} fill="none" stroke="#55575b" strokeWidth="7" strokeLinecap="round" />
    <path d={tube} fill="none" stroke="#d9dadc" strokeWidth="5" strokeLinecap="round" />
    <path d={tube} fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    <rect x="-21" y="-15" width="42" height="30" rx="5" fill="url(#rt-steel)" stroke="#55575b" strokeWidth=".7" />
    <circle r="9" fill="#2a2b2e" /><circle r="4" fill="#9a9c9f" />
    <g transform="translate(-10 226) rotate(8)">
      <rect x="-4.5" y="-7" width="9" height="10" rx="1.5" fill="#b9babc" stroke="#55575b" strokeWidth=".6" />
      <path d="M-11 22h-12q-5 0-5 4" fill="none" stroke="#c9cacc" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="-11" y="2" width="22" height="36" rx="2.5" fill="url(#rt-steel)" stroke="#55575b" strokeWidth=".6" />
      {[8, 15, 22].flatMap((y) => [-6, 3.5].map((x) => <rect key={`${x}${y}`} x={x} y={y} width="3" height="4.2" rx=".6" fill="#333" />))}
      <circle cx="-5" cy="32" r="1.7" fill="#d7a93a" /><circle cx="5" cy="32" r="1.7" fill="#d7a93a" />
      <rect x="-8" y="36" width="16" height="9" rx="1" fill="#17171a" />
      <rect x="-8" y="36" width="16" height="1.8" fill="#d7a93a" />
      <rect x="-1" y="44" width="2" height="3" fill="#7a7c80" />
    </g>
  </svg>;
}

// The platter's rim: rows of strobe dots, which turn with it. A dash of zero length with round caps draws a dot.
function StrobeRim() {
  return <svg viewBox="-156 -156 312 312" className="rt-rim-svg" aria-hidden="true">
    {[{ r: 142, dash: 7.435 }, { r: 145, dash: 7.592 }, { r: 148, dash: 7.749 }].map(({ r, dash }) => <circle key={r} r={r} fill="none" stroke="#d9d9d5" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={`0 ${dash}`} />)}
  </svg>;
}

const sidesOf = (tracks: Track[]) => {
  const split = Math.ceil(tracks.length / 2);
  return [{ name: "A", tracks: tracks.slice(0, split) }, { name: "B", tracks: tracks.slice(split) }].filter((side) => side.tracks.length > 0);
};

export function RecordDeck({ albums, title, description, platter, rim, arm, startHit, startKey, art }: { albums: Album[]; title: string; description: string; platter: Matrix; rim: Matrix; arm: Matrix; startHit: string; startKey: string; art: ReactNode }) {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const needleTimer = useRef(0);
  const pendingHref = useRef<string | null>(null);
  const [layoutName, setLayoutName] = useState<LayoutName>("wide");
  const [scale, setScale] = useState<number | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [flight, setFlight] = useState<Flight | null>(null);
  // Nothing plays on arrival: the record sits still until someone presses start or picks a track.
  const [running, setRunning] = useState(false);
  const [armOn, setArmOn] = useState(false);
  const [needleDown, setNeedleDown] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(true);
  const latest = albums.flatMap((album) => album.tracks.map((track) => ({ track, album }))).sort((a, b) => b.track.date.localeCompare(a.track.date))[0];
  const [playing, setPlaying] = useState<Playing | null>(latest ?? null);
  const layout = LAYOUTS[layoutName];

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const measure = () => {
      const width = element.clientWidth;
      const name: LayoutName = width < 760 ? "narrow" : "wide";
      setLayoutName(name);
      setScale(Math.min(width / LAYOUTS[name].w, name === "wide" ? 1.15 : 1.4));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setSound(soundEnabled());
    return () => stopCrackle(0.5);
  }, []);

  useEffect(() => {
    const element = root.current;
    const scheduled = timers.current;
    const observer = new IntersectionObserver((entries) => {
      // Several changes can arrive at once; only the newest says where the stage is now.
      const entry = entries.at(-1);
      if (entry) setPaused(!entry.isIntersecting);
    });
    if (element) observer.observe(element);
    return () => {
      observer.disconnect();
      scheduled.forEach(clearTimeout);
    };
  }, []);

  // The hiss is tied to the needle being in the groove, so it can never start on its own.
  useEffect(() => {
    if (needleDown && !paused && sound) startCrackle();
    else stopCrackle();
  }, [needleDown, paused, sound]);

  // Platter and record run up to speed and coast down, rather than starting and stopping dead.
  const spinning = running && !paused && !flight;
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = [...(root.current?.querySelectorAll(".rt-spin") ?? [])];
    const spins = elements.map((element) => {
      const existing = element.getAnimations().find((animation) => animation.id === "spin");
      if (existing) return existing;
      const created = element.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 1800, iterations: Infinity });
      created.id = "spin";
      created.pause();
      return created;
    });
    const seconds = spinning ? 0.5 : 0.9;
    const start = performance.now();
    const from = spins.map((animation) => (animation.playState === "running" ? animation.playbackRate : 0));
    // An animation left at rate 0 won't resume from play(), so give it a nudge first.
    if (spinning) spins.forEach((animation) => {
      if (animation.playState !== "running") animation.playbackRate = 0.01;
      animation.play();
    });
    let frame = requestAnimationFrame(function ramp(now) {
      const t = Math.min(1, (now - start) / (seconds * 1000));
      spins.forEach((animation, index) => { animation.playbackRate = from[index] + ((spinning ? 1 : 0) - from[index]) * t; });
      if (t < 1) frame = requestAnimationFrame(ramp);
      else if (!spinning) spins.forEach((animation) => animation.pause());
    });
    return () => cancelAnimationFrame(frame);
  }, [spinning, playing]);

  useEffect(() => {
    if (!open) return;
    // The cover that had focus just went inert, so hand focus to the back of the sleeve.
    root.current?.querySelector<HTMLElement>(".rt-album[data-open] .rt-track, .rt-album[data-open] .rt-close")?.focus({ preventScroll: true });
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  const onDeck = (matrix: Matrix): Matrix => {
    const { x, y, s } = layout.deck;
    return [matrix[0] * s, matrix[1] * s, matrix[2] * s, matrix[3] * s, matrix[4] * s + x, matrix[5] * s + y];
  };
  const pages = Math.max(1, Math.ceil(albums.length / PER_VIEW));
  const first = page * PER_VIEW;
  const openIndex = albums.findIndex((item) => item.key === open);
  // While one album is out, the next few wait small beside it.
  const waiting = open ? Array.from({ length: Math.min(PER_VIEW, albums.length - 1) }, (_, at) => albums[(openIndex + 1 + at) % albums.length].key) : [];
  const place = (index: number, album: Album) => {
    if (open === album.key) return { ...layout.open, hidden: false };
    const row = layout.shelfRow;
    const shelved = { x: row.x + (index - first) * row.step, y: row.y, s: row.s };
    const at = waiting.indexOf(album.key);
    if (at >= 0) return { x: layout.rest.x + at * layout.rest.step, y: layout.rest.y, s: layout.rest.s, hidden: false };
    return { ...shelved, hidden: Boolean(open) || index < first || index >= first + PER_VIEW };
  };
  // Records far from the current page aren't in the DOM at all; neighbours stay so they can slide in.
  const isNear = (index: number, album: Album) => album.key === open || waiting.includes(album.key) || Math.abs(index - first) <= PER_VIEW * 2 - 1;

  const toggleSound = () => {
    const next = !sound;
    setSoundEnabled(next);
    setSound(next);
  };
  const dropNeedle = () => {
    clearTimeout(needleTimer.current);
    setArmOn(true);
    needleTimer.current = window.setTimeout(() => {
      playNeedle();
      setNeedleDown(true);
    }, NEEDLE_MS - 60);
  };
  const liftNeedle = () => {
    clearTimeout(needleTimer.current);
    setArmOn(false);
    setNeedleDown(false);
  };
  const toggleDeck = () => {
    if (flight) return;
    playClick();
    if (running) {
      setRunning(false);
      liftNeedle();
    } else {
      setRunning(true);
      if (playing) dropNeedle();
    }
  };
  const openAlbum = (key: string) => {
    playFlip();
    setOpen(key);
  };

  const go = () => {
    const href = pendingHref.current;
    if (!href) return;
    pendingHref.current = null;
    timers.current.forEach(clearTimeout);
    router.push(href);
  };

  const playTrack = (event: MouseEvent, album: Album, track: Track) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    if (flight) return go();
    const href = `/blog/${track.slug}`;
    pendingHref.current = href;
    router.prefetch(href);
    playPull();
    setRunning(false);
    liftNeedle();
    setFlight({ track, album, phase: "start" });
    requestAnimationFrame(() => requestAnimationFrame(() => setFlight((current) => current && { ...current, phase: "pull" })));
    const at = (ms: number, run: () => void) => timers.current.push(window.setTimeout(run, ms));
    at(PULL_MS, () => setFlight((current) => current && { ...current, phase: "fly" }));
    at(PULL_MS + FLY_MS, () => {
      playDrop();
      setPlaying({ track, album });
      setFlight(null);
      setRunning(true);
      dropNeedle();
    });
    at(PULL_MS + FLY_MS + NEEDLE_MS, go);
  };

  const sleeve = flight && (() => {
    const { x, y, s } = layout.open;
    const k = (340 * s) / (DISC * 2);
    const cx = x + 180 * s, cy = y + 180 * s;
    const pulled = flight.phase !== "start";
    return [k, 0, 0, k, cx + (pulled ? layout.pull[0] : 0), cy + (pulled ? layout.pull[1] : 0)];
  })();

  return <section ref={root} className="rt-band" data-running={running ? "" : undefined} data-paused={paused ? "" : undefined} data-primed={playing && !running ? "" : undefined} onClickCapture={(event) => {
    // A second click while the record is moving skips straight to the post.
    if (pendingHref.current && !(event.target as Element).closest?.(".rt-track")) {
      event.preventDefault();
      event.stopPropagation();
      go();
    }
  }}>
    <div className="rt-wall" aria-hidden="true"><WallScore /></div>
    <div className="site-width rt-heading">
      <div>
        <h1 className="rt-title">{title}</h1>
        <p className="rt-desc">{description}</p>
      </div>
      <p className="rt-hint-top" aria-hidden="true">앨범을 고르고, 트랙을 눌러 재생하세요</p>
    </div>

    <div className="rt-frame" style={{ height: scale ? (open ? layout.hOpen : layout.h) * scale : undefined, visibility: scale ? "visible" : "hidden" }}>
      <div className="rt-stage" style={{ width: layout.w, height: layout.h, transform: `translateX(-50%) scale(${scale ?? 1})` }}>
        <div className="rt-art" style={{ transform: `translate(${layout.deck.x}px, ${layout.deck.y}px) scale(${layout.deck.s})` }}>{art}</div>

        <div className="rt-layer rt-rim" style={{ transform: `matrix(${onDeck(rim).join(",")})` }}><div className="rt-rim-inner rt-spin"><StrobeRim /></div></div>
        <div className="rt-layer rt-glow" style={{ transform: `matrix(${onDeck(rim).join(",")})` }}><span className="rt-glow-a" /><span className="rt-glow-b" /></div>

        {playing && !flight && <Disc album={playing.album} matrix={onDeck(platter)} />}
        {playing && flight && <Disc album={playing.album} matrix={onDeck(platter)} className="rt-disc-off" />}
        {flight && sleeve && <Disc album={flight.album} matrix={flight.phase === "fly" ? onDeck(platter) : sleeve} className={`rt-flight rt-flight-${flight.phase}`} />}

        <div className="rt-arm" style={{ transform: `matrix(${onDeck(arm).join(",")})` }}>
          <div className="rt-arm-swing" style={{ transform: `rotate(${armOn ? ARM_PLAY : ARM_REST}deg)` }}>
            <Tonearm down={needleDown} />
          </div>
        </div>

        <div className="rt-art rt-controls" style={{ transform: `translate(${layout.deck.x}px, ${layout.deck.y}px) scale(${layout.deck.s})` }}>
          <svg viewBox="0 0 660 540" className="iso-svg">
            <path className="rt-start-prompt" d={startKey} />
            <path className="rt-start" d={startHit} role="button" tabIndex={0} aria-label={running ? "정지" : "재생"} aria-pressed={running} onClick={toggleDeck}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                toggleDeck();
              }} />
          </svg>
        </div>

        {playing && <div className="rt-fly" aria-hidden="true" style={{ left: onDeck(platter)[4], top: onDeck(platter)[5] }}>
          {[0, 1, 2, 3, 4].map((index) => <svg key={index} viewBox="0 0 20 24" className="rt-fly-note" data-album={playing.album.key}><path d={NOTE} fill="currentColor" /></svg>)}
        </div>}

        <div className="rt-shelf" aria-hidden="true" style={{ transform: `translate(${(open ? layout.shelf.open : layout.shelf.idle)[0]}px, ${(open ? layout.shelf.open : layout.shelf.idle)[1]}px)`, width: (open ? layout.shelf.open : layout.shelf.idle)[2] }} />

        {albums.map((album, index) => {
          if (!isNear(index, album)) return null;
          const slot = place(index, album);
          const isOpen = open === album.key;
          return <div key={album.key} className="rt-album" data-open={isOpen ? "" : undefined} data-small={open && !isOpen ? "" : undefined} data-hidden={slot.hidden ? "" : undefined} {...(slot.hidden ? { inert: true } : {})} style={{ transform: `translate(${slot.x}px, ${slot.y}px) scale(${slot.s})`, zIndex: isOpen ? 5 : 3 }}>
            <div className="rt-tilt">
              <div className="rt-peek"><Vinyl album={album} /></div>
              <div className="rt-flip" data-flipped={isOpen ? "" : undefined}>
                <button type="button" className="rt-face rt-front" aria-expanded={isOpen} aria-label={`${album.label} 앨범, 트랙 ${album.count}개`} onClick={() => openAlbum(album.key)} {...(isOpen ? { inert: true } : {})}>
                  <Cover album={album.key} label={album.label} kind={album.kind} />
                </button>
                <div className="rt-face rt-back" data-album={album.key} {...(isOpen ? {} : { inert: true })}>
                  <div className="rt-sleeve-top">
                    <span className="rt-mark" aria-hidden="true">G</span>
                    <span className="rt-sleeve-brand">G0O0<br />RECORDS</span>
                    <span className="rt-sleeve-cat">{album.catalog}<br />STEREO · 33⅓ RPM</span>
                  </div>
                  <div className="rt-sleeve-frame">
                    <h2 className="rt-sleeve-title">{album.label}</h2>
                    {album.tracks.length === 0
                      ? <p className="rt-empty">아직 수록된 트랙이 없습니다.</p>
                      : <div className="rt-sides">{sidesOf(album.tracks).map((side) => <div key={side.name}>
                          <p className="rt-side">SIDE {side.name}</p>
                          <ol>{side.tracks.map((track, at) => <li key={track.slug}>
                            <Link href={`/blog/${track.slug}`} className="rt-track" onClick={(event) => playTrack(event, album, track)}>
                              <span className="rt-track-code">{side.name}{at + 1}</span>
                              <span className="rt-track-name">{track.title}</span>
                              <span className="rt-track-time">{track.readTime}:00</span>
                            </Link>
                          </li>)}</ol>
                        </div>)}</div>}
                  </div>
                  {album.tracks[0] && <p className="rt-notes"><strong>LINER NOTES</strong> {album.tracks[0].summary}</p>}
                  <div className="rt-sleeve-foot">
                    <button type="button" className="rt-close" aria-label="앞면으로 뒤집기" onClick={() => setOpen(null)}>← 앞면</button>
                    <Link href={`/blog/category/${album.key}`} className="rt-sleeve-album">{album.count > album.tracks.length ? `트랙 ${album.count}개 전체 보기 →` : "앨범 페이지 →"}</Link>
                  </div>
                  <span className="rt-wear" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>;
        })}

        {!open && <div className="rt-pager" style={{ left: layout.pager[0], top: layout.pager[1] }}>
          {pages > 1 && <>
            <button type="button" aria-label="이전 앨범" disabled={page === 0} onClick={() => setPage(page - 1)}>‹</button>
            <span className="rt-pager-count">{page + 1} / {pages}</span>
            <button type="button" aria-label="다음 앨범" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>›</button>
          </>}
          <Link href="/blog/albums">모든 앨범 {albums.length}장 →</Link>
        </div>}
        <button type="button" className="rt-sound" style={{ left: layout.sound[0], top: layout.sound[1] }} aria-pressed={sound} aria-label={sound ? "소리 끄기" : "소리 켜기"} onClick={toggleSound}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor" />
            {sound ? <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" /> : <path d="m16 9.5 5 5M21 9.5l-5 5" />}
          </svg>
          {sound ? "소리 켜짐" : "소리 꺼짐"}
        </button>
        <div className="rt-now" style={{ left: layout.nowPlaying[0], top: layout.nowPlaying[1], maxWidth: Math.min(560, layout.w - layout.nowPlaying[0] * 2) }}>
          <button type="button" className="rt-play" aria-pressed={running} disabled={!playing} onClick={toggleDeck}>
            <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="currentColor">{running ? <path d="M3 2h4v12H3zM9 2h4v12H9z" /> : <path d="M4 2l10 6-10 6z" />}</svg>
            {running ? "정지" : "재생"}
          </button>
          <span className="rt-eq" aria-hidden="true"><i /><i /><i /></span>
          {playing
            ? <><span className="rt-now-label">{running ? "NOW PLAYING" : "READY"}</span><Link href={`/blog/${playing.track.slug}`} className="rt-now-title">{playing.track.title}</Link></>
            : <span className="rt-now-label">NO RECORD</span>}
        </div>
      </div>
    </div>
  </section>;
}
