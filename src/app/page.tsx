import { DeskHero } from "@/components/desk-hero/DeskHero";
import { getPosts } from "@/lib/blog/posts";

export default function Home() {
  const posts = getPosts().map(({ slug, title }) => ({ slug, title }));
  return (
    <main className="desk-room h-svh w-full overflow-hidden">
      <h1 className="sr-only">고강현의 방</h1>
      <DeskHero posts={posts} />
    </main>
  );
}
