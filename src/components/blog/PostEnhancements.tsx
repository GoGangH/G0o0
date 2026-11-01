"use client";

import { useEffect } from "react";

// Everything here only adds to a post that already reads fine without JavaScript.
export function PostEnhancements({ bodyId }: { bodyId: string }) {
  useEffect(() => {
    const body = document.getElementById(bodyId);
    if (!body) return;
    const buttons = [...body.querySelectorAll("pre")].map((pre) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "code-copy";
      button.textContent = "복사";
      button.addEventListener("click", async () => {
        await navigator.clipboard.writeText(pre.querySelector("code")?.innerText ?? "");
        button.textContent = "복사됨";
        window.setTimeout(() => { button.textContent = "복사"; }, 1500);
      });
      pre.append(button);
      return button;
    });
    return () => buttons.forEach((button) => button.remove());
  }, [bodyId]);

  useEffect(() => {
    const body = document.getElementById(bodyId);
    const links = new Map([...document.querySelectorAll<HTMLAnchorElement>(".post-toc a")].map((link) => [decodeURIComponent(link.hash.slice(1)), link]));
    const headings = body ? [...body.querySelectorAll<HTMLElement>("h2[id], h3[id]")].filter((heading) => links.has(heading.id)) : [];
    if (headings.length === 0) return;
    const mark = () => {
      const passed = headings.filter((heading) => heading.getBoundingClientRect().top <= 120);
      const current = passed.at(-1) ?? headings[0];
      links.forEach((link, id) => link.toggleAttribute("data-active", id === current.id));
    };
    mark();
    window.addEventListener("scroll", mark, { passive: true });
    return () => window.removeEventListener("scroll", mark);
  }, [bodyId]);

  return null;
}
