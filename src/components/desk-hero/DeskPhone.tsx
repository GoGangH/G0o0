"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { profile } from "@/data/profile";
import { categories } from "@/lib/blog/categories";
import "./phone.css";

export type LatestPost = { slug: string; title: string; category: string };

const line = (d: string) => <path d={d} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />;
const glyphs: Record<string, React.ReactNode> = {
  person: <><circle cx="12" cy="8" r="3.4" fill="currentColor" /><path d="M5 20c.6-4 3.4-6 7-6s6.4 2 7 6z" fill="currentColor" /></>,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4.2l2 2.4H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" />,
  case: <>{line("M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7")}<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3.5H3zM3 14h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" /></>,
  document: <>{line("M6.5 3h7.5l4 4v14h-11.5zM14 3v4h4M9.5 12.5h5M9.5 16h5")}</>,
  mail: <>{line("M3.5 6.5h17v11h-17zM4 7l8 6.5L20 7")}</>,
  terminal: <>{line("m6 7.5 4.5 4.5L6 16.5M12.5 17h5.5")}</>,
  github: <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />,
  linkedin: <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />,
  database: <>{line("M5 6c0-1.700 3.100-3 7-3s7 1.300 7 3-3.100 3-7 3-7-1.300-7-3zM5 6v12c0 1.700 3.100 3 7 3s7-1.300 7-3V6M5 12c0 1.700 3.100 3 7 3s7-1.300 7-3")}</>,
  backend: <>{line("M4 4.5h16v6H4zM4 13.5h16v6H4zM7.5 7.5h.01M7.5 16.5h.01")}</>,
  "ai-product": <path fill="currentColor" d="M12 3l1.900 5.600L19.5 10.5l-5.600 1.900L12 18l-1.900-5.600L4.5 10.5l5.600-1.900zM18.5 15.5l.8 2.200 2.200.8-2.200.8-.8 2.200-.8-2.200-2.200-.8 2.200-.8z" />,
};

function Glyph({ name }: { name: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="app-glyph">{glyphs[name]}</svg>;
}

const apps = [
  { label: "소개", icon: "person", tint: "tint-blue", href: "/about" },
  { label: "프로젝트", icon: "folder", tint: "tint-amber", href: "/projects" },
  { label: "경험", icon: "case", tint: "tint-violet", href: "/career" },
  { label: "이력서", icon: "document", tint: "tint-paper", href: "/resume" },
];
const dock = [
  { label: "메일", icon: "mail", tint: "tint-sky", href: `mailto:${profile.email}` },
  { label: "GitHub", icon: "github", tint: "tint-ink", href: profile.github },
  { label: "LinkedIn", icon: "linkedin", tint: "tint-linkedin", href: profile.linkedin },
];

function AppBody({ label, icon, tint, hideLabel }: { label: string; icon: string; tint: string; hideLabel?: boolean }) {
  return <>
    <span className={`app-icon ${tint}`}><Glyph name={icon} /></span>
    <span className={hideLabel ? "sr-only" : "app-label"}>{label}</span>
  </>;
}

function PhoneApp({ href, ...body }: (typeof apps)[number] & { hideLabel?: boolean }) {
  return href.startsWith("/")
    ? <Link href={href} className="app"><AppBody {...body} /></Link>
    : <a href={href} target="_blank" rel="noreferrer" className="app"><AppBody {...body} /></a>;
}

function StatusIcons() {
  return <svg aria-hidden="true" viewBox="0 0 66 12" className="status-icons" fill="currentColor">
    <rect x="0" y="8" width="3" height="4" rx=".8" /><rect x="4.5" y="5.5" width="3" height="6.5" rx=".8" /><rect x="9" y="3" width="3" height="9" rx=".8" /><rect x="13.5" y="0" width="3" height="12" rx=".8" />
    <path d="M30 2.200c2.5 0 4.800 1 6.5 2.600l1.200-1.300A11 11 0 0 0 30 .4a11 11 0 0 0-7.700 3.100l1.200 1.300A9.400 9.400 0 0 1 30 2.200zm0 3.800c1.5 0 2.800.6 3.800 1.5l1.200-1.300A7.300 7.300 0 0 0 30 4.200a7.300 7.300 0 0 0-5 2l1.200 1.300c1-.9 2.300-1.5 3.800-1.5zm0 3.700-2.200 2.300H32.200z" />
    <rect x="43.5" y="1" width="20" height="10" rx="3" fill="none" stroke="currentColor" strokeOpacity=".45" /><rect x="45" y="2.5" width="17" height="7" rx="1.800" /><rect x="64.5" y="4.200" width="1.5" height="3.600" rx=".7" opacity=".5" />
  </svg>;
}

export function DeskPhone({ onClose, onOpenTerminal, latestPost }: { onClose: () => void; onOpenTerminal: () => void; latestPost?: LatestPost }) {
  const [folderOpen, setFolderOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: false });
  const weekday = now.toLocaleDateString("ko-KR", { weekday: "long" });

  return <Dialog open onClose={onClose} className="relative z-50">
    <DialogBackdrop className="fixed inset-0 bg-[var(--overlay)]" />
    <button type="button" onClick={onClose} aria-label="휴대폰 닫기" className="phone-close">
      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">{line("m6 6 12 12M18 6 6 18")}</svg>
    </button>
    <div className="fixed inset-0 flex items-center justify-center">
      <DialogPanel className="iphone">
        <span className="iphone-button iphone-action" /><span className="iphone-button iphone-volume-up" /><span className="iphone-button iphone-volume-down" /><span className="iphone-button iphone-power" />
        <div className="iphone-bezel">
          <div className="iphone-screen">
            <div className="iphone-wallpaper" />
            <DialogTitle className="sr-only">고강현의 휴대폰</DialogTitle>

            <div className="status-bar">
              <span className="status-time">{time}</span>
              <span className="dynamic-island" />
              <StatusIcons />
            </div>

            <div className="widgets">
              <div className="glass widget widget-date">
                <span className="widget-weekday">{weekday}</span>
                <span className="widget-day">{now.getDate()}</span>
              </div>
              {latestPost
                ? <Link href={`/blog/${latestPost.slug}`} className="glass widget widget-post">
                    <span className="widget-kicker">최근 글 · {latestPost.category}</span>
                    <span className="widget-title">{latestPost.title}</span>
                  </Link>
                : <Link href="/blog" className="glass widget widget-post">
                    <span className="widget-kicker">블로그</span>
                    <span className="widget-title">아직 공개한 글이 없습니다</span>
                  </Link>}
            </div>

            <div className="app-grid">
              {apps.map((app) => <PhoneApp key={app.label} {...app} />)}
              <button type="button" className="app" aria-expanded={folderOpen} onClick={() => setFolderOpen(true)}>
                <span className="glass app-icon folder-icon">
                  {categories.map(({ key }) => <span key={key} className={`folder-mini mini-${key}`} />)}
                </span>
                <span className="app-label">블로그</span>
              </button>
            </div>

            <div className="page-dots" aria-hidden="true"><span className="is-on" /><span /></div>

            <div className="glass dock">
              {dock.map((app) => <PhoneApp key={app.label} {...app} hideLabel />)}
              <button type="button" className="app" onClick={onOpenTerminal}><AppBody label="터미널" icon="terminal" tint="tint-terminal" hideLabel /></button>
            </div>

            <button type="button" className="home-indicator" aria-label="휴대폰 닫기" onClick={onClose} />

            {folderOpen && <div className="folder-layer" onClick={() => setFolderOpen(false)}>
              <div onClick={(event) => event.stopPropagation()}>
                <p className="folder-title">블로그</p>
                <div className="glass folder-panel">
                  {categories.map(({ key, label }) => <Link key={key} href={`/blog/category/${key}`} className="app">
                    <AppBody label={label} icon={key} tint={`mini-${key}`} />
                  </Link>)}
                  <Link href="/blog" className="app"><AppBody label="전체 글" icon="document" tint="tint-paper" /></Link>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </DialogPanel>
    </div>
  </Dialog>;
}
