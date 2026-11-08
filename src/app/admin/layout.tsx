import type { Metadata } from "next";
import Link from "next/link";
import "@/components/blog/records-theme.css";
import "@/components/admin/admin.css";
import { albumPaletteCss } from "@/lib/blog/categories";
export const metadata: Metadata = { title: "글 관리 · G0O0", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="blog-theme admin-shell"><style dangerouslySetInnerHTML={{ __html: albumPaletteCss }} /><header className="admin-brand"><Link href="/admin">G0O0 <span>RECORDS / STUDIO</span></Link><Link href="/blog">블로그 보기 ↗</Link></header>{children}</div>;
}
