"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { hashscape, phoneExperiences, phoneProject } from "@/data/apps";
import { profile } from "@/data/profile";
import { AppLogo, PhoneScreen, screenTitle, type PhonePost, type Screen } from "./PhoneScreens";
import "./phone.css";

const line = (d: string) => <path d={d} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />;
const glyphs: Record<string, React.ReactNode> = {
  person: <><circle cx="12" cy="8" r="3.4" fill="currentColor" /><path d="M5 20c.6-4 3.4-6 7-6s6.4 2 7 6z" fill="currentColor" /></>,
  sliders: line("M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4"),
  document: line("M6.5 3H14l4 4v14H6.5zM14 3v4h4M9.5 12.5h5M9.5 16h5"),
  mail: line("M3.5 6.5h17v11h-17zM4 7l8 6.5L20 7"),
  github: <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />,
  linkedin: <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />,
};

function GlyphIcon({ name, tint }: { name: string; tint: string }) {
  return <span className={`app-icon ${tint}`} aria-hidden="true"><svg viewBox="0 0 24 24" className="app-glyph">{glyphs[name]}</svg></span>;
}

const dock = [
  { label: "메일", icon: "mail", tint: "tint-sky", href: `mailto:${profile.email}` },
  { label: "GitHub", icon: "github", tint: "tint-ink", href: profile.github },
  { label: "LinkedIn", icon: "linkedin", tint: "tint-linkedin", href: profile.linkedin },
  { label: "이력서", icon: "document", tint: "tint-paper", href: "/resume" },
];

function StatusIcons() {
  return <svg aria-hidden="true" viewBox="0 0 66 12" className="status-icons" fill="currentColor">
    <rect x="0" y="8" width="3" height="4" rx=".8" /><rect x="4.5" y="5.5" width="3" height="6.5" rx=".8" /><rect x="9" y="3" width="3" height="9" rx=".8" /><rect x="13.5" y="0" width="3" height="12" rx=".8" />
    <path d="M30 2.2c2.5 0 4.8 1 6.5 2.6l1.2-1.3A11 11 0 0 0 30 .4a11 11 0 0 0-7.7 3.1l1.2 1.3A9.4 9.4 0 0 1 30 2.2zm0 3.8c1.5 0 2.8.6 3.8 1.5L35 6.2a7.3 7.3 0 0 0-5-2 7.3 7.3 0 0 0-5 2l1.2 1.3c1-.9 2.3-1.5 3.8-1.5zm0 3.7-2.2 2.3h4.4z" />
    <rect x="43.5" y="1" width="20" height="10" rx="3" fill="none" stroke="currentColor" strokeOpacity=".45" /><rect x="45" y="2.5" width="17" height="7" rx="1.8" /><rect x="64.5" y="4.2" width="1.5" height="3.6" rx=".7" opacity=".5" />
  </svg>;
}

export function DeskPhone({ onClose, posts }: { onClose: () => void; posts: PhonePost[] }) {
  const [stack, setStack] = useState<Screen[]>([]);
  const [motion, setMotion] = useState<"open" | "push" | "pop">("open");
  const [folderOpen, setFolderOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const view = useRef<HTMLDivElement>(null);
  const top = stack.at(-1);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    view.current?.focus({ preventScroll: true });
  }, [stack]);

  const launch = (screen: Screen) => {
    setFolderOpen(false);
    setMotion("open");
    setStack([screen]);
  };
  const open = (screen: Screen) => {
    setMotion("push");
    setStack((current) => [...current, screen]);
  };
  const back = () => {
    setMotion("pop");
    setStack((current) => current.slice(0, -1));
  };
  const goHome = () => {
    if (stack.length === 0 && !folderOpen) onClose();
    setFolderOpen(false);
    setStack([]);
  };

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
          <div className="iphone-screen" data-in-app={top ? "" : undefined}>
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
              <button type="button" className="glass widget widget-profile" onClick={() => launch({ kind: "about" })}>
                <span className="widget-photo"><Image src="/info/profile.jpg" alt="" fill sizes="64px" className="object-cover" /></span>
                <span className="widget-title">{profile.nameKr}</span>
                <span className="widget-kicker">{profile.title}</span>
              </button>
            </div>

            <div className="app-grid">
              <button type="button" className="app" onClick={() => launch({ kind: "hashscape" })}>
                <AppLogo {...hashscape} /><span className="app-label">{hashscape.name}</span>
              </button>
              {["logit", "grapic"].map(phoneProject).map((project) => <button key={project.id} type="button" className="app" onClick={() => launch({ kind: "project", id: project.id })}>
                <AppLogo {...project} /><span className="app-label">{project.name}</span>
              </button>)}
              <button type="button" className="app" aria-expanded={folderOpen} onClick={() => setFolderOpen(true)}>
                <span className="glass app-icon folder-icon" aria-hidden="true">
                  {phoneExperiences.map((experience) => <span key={experience.id} className="folder-mini"><AppLogo {...experience} /></span>)}
                </span>
                <span className="app-label">경험</span>
              </button>
              <button type="button" className="app" onClick={() => launch({ kind: "skills" })}>
                <GlyphIcon name="sliders" tint="tint-graphite" /><span className="app-label">기술</span>
              </button>
              <button type="button" className="app" onClick={() => launch({ kind: "about" })}>
                <GlyphIcon name="person" tint="tint-orange" /><span className="app-label">소개</span>
              </button>
            </div>

            <div className="page-dots" aria-hidden="true"><span className="is-on" /></div>

            <div className="glass dock">
              {dock.map(({ label, icon, tint, href }) => href.startsWith("/")
                ? <Link key={label} href={href} className="app" aria-label={label}><GlyphIcon name={icon} tint={tint} /></Link>
                : <a key={label} href={href} target="_blank" rel="noreferrer" className="app" aria-label={label}><GlyphIcon name={icon} tint={tint} /></a>)}
            </div>

            {folderOpen && <div className="folder-layer" onClick={() => setFolderOpen(false)}>
              <div onClick={(event) => event.stopPropagation()}>
                <p className="folder-title">경험</p>
                <div className="glass folder-panel">
                  {phoneExperiences.map((experience) => <button key={experience.id} type="button" className="app" onClick={() => launch({ kind: "experience", id: experience.id })}>
                    <AppLogo {...experience} /><span className="app-label">{experience.label}</span>
                  </button>)}
                </div>
              </div>
            </div>}

            {top && <div key={stack.length} ref={view} tabIndex={-1} className={`app-view app-view-${motion}`}>
              <div className="app-nav">
                <button type="button" className="app-back" onClick={back}>
                  <svg aria-hidden="true" viewBox="0 0 8 14" className="app-back-chevron"><path d="M7 1 1 7l6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {stack.length > 1 ? screenTitle(stack[stack.length - 2]) : "홈"}
                </button>
              </div>
              <div className="app-content"><PhoneScreen screen={top} open={open} posts={posts} /></div>
            </div>}

            <button type="button" className="home-indicator" aria-label={top || folderOpen ? "홈으로" : "휴대폰 닫기"} onClick={goHome} />
          </div>
        </div>
      </DialogPanel>
    </div>
  </Dialog>;
}
