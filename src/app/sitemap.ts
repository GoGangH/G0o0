import type { MetadataRoute } from "next";
import { categories } from "@/lib/blog/categories";
import { getAlbums } from "@/lib/blog/albums";
import { getPosts } from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/projects", "/career", "/blog", "/blog/albums", ...getAlbums().map(({ slug }) => `/blog/album/${slug}`), ...categories.map(({ key }) => `/blog/category/${key}`)].map((path) => ({ url: `${SITE_URL}${path}` }));
  const posts = getPosts().map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: post.date }));
  return [...pages, ...posts];
}
