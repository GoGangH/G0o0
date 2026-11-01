import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type TocItem = { id: string; text: string; level: 2 | 3 };

type HastNode = { type: string; tagName?: string; value?: string; properties?: { id?: string }; children?: HastNode[] };

const textOf = (node: HastNode): string => node.value ?? (node.children ?? []).map(textOf).join("");

// Raw HTML in a post is dropped: remark-rehype runs without allowDangerousHtml.
export async function renderPost(markdown: string) {
  const toc: TocItem[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(() => (tree: HastNode) => {
      for (const node of tree.children ?? []) {
        if ((node.tagName === "h2" || node.tagName === "h3") && node.properties?.id) {
          toc.push({ id: node.properties.id, text: textOf(node), level: node.tagName === "h2" ? 2 : 3 });
        }
      }
    })
    .use(rehypeShiki, {
      themes: { light: "github-light", dark: "github-dark" }, defaultColor: false,
      transformers: [{ pre(node) { node.properties["data-language"] = this.options.lang; } }],
    })
    .use(rehypeStringify)
    .process(markdown);
  return { html: String(file), toc };
}
