import "@/components/records/records.css";
import "@/components/blog/records-theme.css";
import { albumPaletteCss } from "@/lib/blog/categories";

// Everything under /blog is one place, G0O0 Records: always dark, like a listening room with the lights down.
export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="blog-theme">
    <style dangerouslySetInnerHTML={{ __html: albumPaletteCss }} />
    {children}
  </div>;
}
