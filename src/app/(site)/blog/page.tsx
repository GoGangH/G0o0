import type { Metadata } from "next";
import { CategoryNav } from "@/components/blog/CategoryNav";
import { PostList } from "@/components/blog/PostList";
import { PageHeading } from "@/components/site/PageHeading";
import { getPosts } from "@/lib/blog/posts";

export const metadata: Metadata = { title: "블로그 · 고강현", description: "운영 중 마주친 문제와 기술 선택의 이유를 기록합니다." };

export default function BlogPage() {
  return (
    <section className="site-width site-page">
      <div className="max-w-[780px]">
        <PageHeading title="블로그" object="books">
          <p className="mt-4 text-sm leading-7 text-muted">운영 중 마주친 문제와 기술 선택의 이유를 기록합니다.</p>
          <CategoryNav />
        </PageHeading>
        <PostList posts={getPosts()} />
      </div>
    </section>
  );
}
