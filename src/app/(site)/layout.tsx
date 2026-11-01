import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="site-shell">
    <SiteHeader />
    <main>{children}</main>
    <SiteFooter />
  </div>;
}
