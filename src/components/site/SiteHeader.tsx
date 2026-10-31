"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "소개", href: "/about" },
  { label: "프로젝트", href: "/projects" },
  { label: "경험", href: "/career" },
  { label: "블로그", href: "/blog" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="site-width">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-6 border-b border-rule py-6 sm:py-8">
        <Link href="/" className="site-link text-base font-medium tracking-tight">고강현</Link>
        <a href="/resume/goganghyun_resume.pdf" className="site-link text-xs text-muted sm:order-last">Resume PDF</a>
        <nav aria-label="주 메뉴" className="flex w-full gap-7 text-sm sm:w-auto sm:gap-8">
          {navItems.map((item) => <Link key={item.href} href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={`site-link py-1 ${pathname === item.href ? "font-medium underline decoration-1 underline-offset-8" : "text-muted"}`}>{item.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
