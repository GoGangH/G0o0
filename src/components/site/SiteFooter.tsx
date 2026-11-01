import Link from "next/link";
import { profile } from "@/data/profile";
import { categories } from "@/lib/blog/categories";

const siteLinks = [
  { label: "방으로 돌아가기", href: "/" },
  { label: "소개", href: "/about" },
  { label: "프로젝트", href: "/projects" },
  { label: "경험", href: "/career" },
  { label: "블로그", href: "/blog" },
];
const outLinks = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "이력서 PDF", href: "/resume/goganghyun_resume.pdf" },
];

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="site-width">
      <div className="grid gap-10 sm:grid-cols-3">
        <div>
          <p className="footer-title">사이트</p>
          <ul className="footer-list">{siteLinks.map((link) => <li key={link.href}><Link href={link.href} className="site-link">{link.label}</Link></li>)}</ul>
        </div>
        <div>
          <p className="footer-title">블로그 주제</p>
          <ul className="footer-list">
            {categories.slice(0, 3).map(({ key, label }) => <li key={key}><Link href={`/blog/category/${key}`} className="site-link">{label}</Link></li>)}
            <li><Link href="/blog/albums" className="site-link">모든 앨범</Link></li>
            <li><a href="/rss.xml" className="site-link">RSS</a></li>
          </ul>
        </div>
        <div>
          <p className="footer-title">연결</p>
          <ul className="footer-list">
            {outLinks.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer" className="site-link">{link.label} <span aria-hidden="true" className="nav-arrow">↗</span></a></li>)}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {profile.nameKr}</span>
        <a href={`mailto:${profile.email}`} className="site-link">{profile.email}</a>
      </div>
    </div>
  </footer>;
}
