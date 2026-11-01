"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toggleMode } from "@/lib/theme";

const navItems = [
  { label: "소개", href: "/about" },
  { label: "프로젝트", href: "/projects" },
  { label: "경험", href: "/career" },
  { label: "블로그", href: "/blog" },
];

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function ThemeButton() {
  return <button type="button" onClick={toggleMode} aria-label="라이트 모드와 다크 모드 전환" className="nav-icon-button theme-toggle">
    <svg aria-hidden="true" viewBox="0 0 24 24" className="theme-sun" {...stroke}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></svg>
    <svg aria-hidden="true" viewBox="0 0 24 24" className="theme-moon" {...stroke}><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></svg>
  </button>;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  return <header className="site-nav">
    <div className="site-nav-inner">
      <Link href="/" className="nav-brand" title="방으로 돌아가기">
        <span className="nav-brand-mark" aria-hidden="true">G</span>
        고강현
      </Link>

      <nav aria-label="주 메뉴" className="nav-links">
        {navItems.map((item) => <Link key={item.href} href={item.href} className="nav-link" aria-current={isCurrent(item.href) ? "page" : undefined}>{item.label}</Link>)}
        <span className="nav-divider" aria-hidden="true" />
        <a href="/resume/goganghyun_resume.pdf" target="_blank" rel="noreferrer" className="nav-link">이력서 <span aria-hidden="true" className="nav-arrow">↗</span></a>
      </nav>

      <div className="nav-actions">
        <ThemeButton />
        <button type="button" className="nav-icon-button nav-menu-button" aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>
          <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}><path d={menuOpen ? "m6 6 12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
        </button>
      </div>
    </div>

    {menuOpen && <nav id="mobile-menu" aria-label="모바일 메뉴" className="nav-mobile">
      {navItems.map((item) => <Link key={item.href} href={item.href} className="nav-mobile-link" aria-current={isCurrent(item.href) ? "page" : undefined} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
      <a href="/resume/goganghyun_resume.pdf" target="_blank" rel="noreferrer" className="nav-mobile-link">이력서 <span aria-hidden="true" className="nav-arrow">↗</span></a>
    </nav>}
  </header>;
}
