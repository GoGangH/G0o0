import { getPosts } from "@/lib/blog/posts";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const escapeXml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getPosts().slice(0, 30).map((post) => {
    const url = `${SITE_URL}/blog/${post.slug}`;
    return `<item><title>${escapeXml(post.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(`${post.date}T00:00:00+09:00`).toUTCString()}</pubDate><description>${escapeXml(post.summary)}</description></item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${SITE_NAME} 블로그</title><link>${SITE_URL}/blog</link><description>운영 중 마주친 문제와 기술 선택의 이유를 기록합니다.</description><language>ko</language>${items.join("")}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
