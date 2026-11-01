import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { RecordStage } from "@/components/records/RecordStage";
import { getPosts } from "@/lib/blog/posts";

const description = "운영 중 마주친 문제와 기술 선택의 이유를 기록합니다.";

export const metadata: Metadata = { title: "블로그 · 고강현", description, alternates: { canonical: "/blog" } };

export default function BlogPage() {
  return <>
    <RecordStage title="G0O0 Records" description={description} />
    <BlogIndex title="최신 트랙" posts={getPosts()} shelf compactTop />
  </>;
}
