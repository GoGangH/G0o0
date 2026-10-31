import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="site-shell">
    <SiteHeader />
    <main>{children}</main>
    <footer className="site-width">
      <div className="border-t border-rule py-8 text-sm"><Link href="/" className="site-link text-muted">← 방으로 돌아가기</Link></div>
    </footer>
  </div>;
}
