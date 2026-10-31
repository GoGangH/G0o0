"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import { follow, useInView, useLoop, useStillness } from "../iso/react/live";
import type { LatestPost } from "./DeskPhone";
import { hotspots, type Hotspot } from "./hotspots";

const DeskTerminal = dynamic(() => import("./DeskTerminal").then((mod) => mod.DeskTerminal), { ssr: false });
const DeskPhone = dynamic(() => import("./DeskPhone").then((mod) => mod.DeskPhone), { ssr: false });

const SEEN_KEY = "room-seen";
const SCREEN_TEXT = ["~/g0o0 $ whoami", "kanghyun (backend)", "~/g0o0 $ ls", "blog projects career"];
const TYPE_MS = 38;
const LINE_LEFT = -67;

const readSeen = (): string[] => {
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]");
    return Array.isArray(seen) ? seen : [];
  } catch {
    return [];
  }
};

const toggleMode = () => {
  const root = document.documentElement;
  const next = root.dataset.mode === "dark" ? "light" : "dark";
  root.dataset.mode = next;
  try {
    localStorage.setItem("mode", next);
  } catch {}
};

type Run = { id: string; group: string; art: ReactNode };
export function DeskLive({ runs, width, height, shift, glow, beacons, framePivot, latestPost }: { runs: Run[]; width: number; height: number; shift: number[]; glow: string; beacons: { id: string; at: number[] }[]; framePivot: number[]; latestPost?: LatestPost }) {
  const [overlay, setOverlay] = useState<"terminal" | "phone" | null>(null);
  // null until mounted: what was already clicked lives in localStorage, so nothing blinks before it is read.
  const [seen, setSeen] = useState<string[] | null>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const visible = useInView(anchor);
  const still = useStillness();
  const state = useRef({ hovered: "", focused: "", active: "", drawer: 0 });
  const typing = useRef(0);
  const clearScreen = () => {
    clearInterval(typing.current);
    const screen = anchor.current?.querySelector<SVGGElement>(".desk-terminal");
    if (!screen) return;
    screen.removeAttribute("data-typing");
    screen.querySelectorAll(".desk-line").forEach((line) => { line.textContent = ""; });
    const cursor = screen.querySelector(".desk-cursor");
    cursor?.setAttribute("x", "-14");
    cursor?.setAttribute("y", "-156");
    cursor?.setAttribute("width", "5.5");
    cursor?.setAttribute("height", "10");
  };
  const typeScreen = () => {
    clearScreen();
    const screen = anchor.current?.querySelector<SVGGElement>(".desk-terminal");
    const lines = screen ? [...screen.querySelectorAll<SVGTextElement>(".desk-line")] : [];
    const cursor = screen?.querySelector(".desk-cursor");
    if (!screen || !cursor) return;
    screen.setAttribute("data-typing", "");
    cursor.setAttribute("width", "3.6");
    cursor.setAttribute("height", "6.5");
    const place = (row: number) => {
      cursor.setAttribute("x", String(LINE_LEFT + lines[row].getComputedTextLength() + 1));
      cursor.setAttribute("y", String(Number(lines[row].getAttribute("y")) - 5.5));
    };
    if (still) {
      lines.forEach((line, row) => { line.textContent = SCREEN_TEXT[row]; });
      place(lines.length - 1);
      return;
    }
    let row = 0;
    let typed = 0;
    place(0);
    typing.current = window.setInterval(() => {
      typed += 1;
      lines[row].textContent = SCREEN_TEXT[row].slice(0, typed);
      place(row);
      if (typed < SCREEN_TEXT[row].length) return;
      typed = 0;
      row += 1;
      if (row === lines.length) clearInterval(typing.current);
    }, TYPE_MS);
  };
  const wakePhone = () => {
    const now = new Date();
    const root = anchor.current;
    const time = root?.querySelector(".desk-lock-time");
    const date = root?.querySelector(".desk-lock-date");
    if (time) time.textContent = now.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: false });
    if (date) date.textContent = now.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });
  };
  const paint = (active: string) => {
    if (active === state.current.active) return;
    const wasMonitor = state.current.active === "monitor";
    state.current.active = active;
    anchor.current?.setAttribute("data-active-part", active);
    if (active === "monitor") typeScreen();
    else if (wasMonitor) clearScreen();
    if (active === "phone") wakePhone();
    anchor.current?.querySelectorAll<SVGGElement>("[data-part]").forEach((node) => {
      node.toggleAttribute("data-active", node.dataset.part === active);
    });
  };
  const kick = useLoop((dt, calm) => {
    const s = state.current;
    const active = s.hovered || s.focused;
    if (active !== s.active) paint(active);
    const target = !calm && active === "drawer" ? 1 : 0;
    s.drawer = follow(s.drawer, target, dt, 0.2, calm);
    anchor.current?.querySelectorAll<SVGGElement>('[data-part="drawer"], [data-beacon="drawer"]').forEach((node) => {
      node.setAttribute("transform", `translate(${shift[0] * s.drawer} ${shift[1] * s.drawer})`);
    });
    return !calm && s.drawer !== target;
  }, visible && !still);
  useEffect(() => {
    setSeen(readSeen());
    return () => clearInterval(typing.current);
  }, []);
  useEffect(() => {
    if (still) {
      anchor.current?.querySelectorAll('[data-part="drawer"], [data-beacon="drawer"]').forEach((node) => node.removeAttribute("transform"));
      state.current.drawer = 0;
      paint(state.current.hovered || state.current.focused);
    }
    // The effect only resets imperative DOM changes when motion preferences change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still]);
  const interact = (kind: "hovered" | "focused", id: string) => {
    const s = state.current;
    s[kind] = id;
    paint(s.hovered || s.focused);
    if (visible && !still) kick();
  };
  const markSeen = (id: string) => {
    const next = [...new Set([...readSeen(), id])];
    setSeen(next);
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(next));
    } catch {}
  };
  const act = ({ id, action }: Hotspot) => {
    markSeen(id);
    if (action === "mode") toggleMode();
    else if (action) setOverlay(action);
  };
  const tabbed = new Set<string>();
  return <div ref={anchor} className="desk-live h-full" style={{ "--frame-x": `${framePivot[0]}px`, "--frame-y": `${framePivot[1]}px` } as CSSProperties}>
    <svg viewBox={`0 0 ${width} ${height}`} className="iso-svg" role="group" aria-label="고강현의 방. 물건을 선택해 둘러보세요">
      {runs.map((run) => {
        const hotspot = hotspots.find((item) => item.id === run.group);
        if (!hotspot) return <g key={run.id}>{run.art}</g>;
        const first = !tabbed.has(run.group);
        tabbed.add(run.group);
        const shared = {
          "aria-label": hotspot.label,
          tabIndex: first ? 0 : -1,
          onPointerEnter: () => interact("hovered", hotspot.id),
          onPointerLeave: () => interact("hovered", ""),
          // A mouse click also focuses; only keyboard focus should hold the highlight.
          onFocus: (event: FocusEvent<Element>) => {
            if (event.currentTarget.matches(":focus-visible")) interact("focused", hotspot.id);
          },
          onBlur: () => interact("focused", ""),
        };
        if (hotspot.href) return <Link key={run.id} href={hotspot.href} {...shared} onClick={() => markSeen(hotspot.id)}><title>{hotspot.label}</title>{run.art}</Link>;
        return <g key={run.id} role="button" className="desk-action" {...shared} onClick={() => act(hotspot)}
          onKeyDown={(event: KeyboardEvent) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            act(hotspot);
          }}><title>{hotspot.label}</title>{run.art}</g>;
      })}
      <path className="desk-glow" d={glow} />
      {seen && beacons.filter(({ id }) => !seen.includes(id)).map(({ id, at }, index) => <g key={id} data-beacon={id} className="desk-beacon" style={{ "--beacon-delay": `${index * 0.27}s` } as CSSProperties}>
        <circle className="desk-beacon-ring" cx={at[0]} cy={at[1]} r="7" />
        <circle className="desk-beacon-dot" cx={at[0]} cy={at[1]} r="6" />
      </g>)}
    </svg>
    {overlay === "terminal" && <DeskTerminal onClose={() => setOverlay(null)} />}
    {overlay === "phone" && <DeskPhone onClose={() => setOverlay(null)} onOpenTerminal={() => setOverlay("terminal")} latestPost={latestPost} />}
  </div>;
}
