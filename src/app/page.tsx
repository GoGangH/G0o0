import { DeskHero } from "@/components/desk-hero/DeskHero";
import { categoryLabel } from "@/lib/blog/categories";
import { getPosts } from "@/lib/blog/posts";

export default function Home() {
  const latest = getPosts()[0];
  return (
    <main className="desk-room h-svh w-full overflow-hidden">
      <h1 className="sr-only">고강현의 방</h1>
      <DeskHero latestPost={latest && { slug: latest.slug, title: latest.title, category: categoryLabel(latest.category) }} />
    </main>
  );
}
