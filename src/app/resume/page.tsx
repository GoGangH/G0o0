"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resumeFiles, type ResumeLang } from "@/data/resume";

export default function ResumePage() {
  const [lang, setLang] = useState<ResumeLang>("ko");
  // ?lang=en opens the English copy, so either version can be linked directly.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("lang") === "en") setLang("en");
  }, []);
  const choose = (next: ResumeLang) => {
    setLang(next);
    window.history.replaceState(null, "", next === "en" ? "?lang=en" : window.location.pathname);
  };
  const file = resumeFiles[lang];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#2a2c30]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#16171a] px-4 py-3 text-sm text-white">
        <div className="flex items-center gap-4">
          <Link href="/" className="rounded-lg px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white">← 방으로</Link>
          <h1 className="hidden font-semibold sm:block">{lang === "ko" ? "고강현 이력서" : "Kanghyun Ko · Resume"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div role="group" aria-label="이력서 언어" className="flex rounded-lg bg-white/10 p-1">
            {(Object.keys(resumeFiles) as ResumeLang[]).map((key) => <button key={key} type="button" aria-pressed={lang === key} onClick={() => choose(key)}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${lang === key ? "bg-white text-black" : "text-white/75 hover:text-white"}`}>{resumeFiles[key].label}</button>)}
          </div>
          <a href={file.href} target="_blank" rel="noreferrer" className="rounded-lg px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white">새 창 ↗</a>
          <a href={file.href} download={file.download} className="rounded-lg bg-white px-3 py-2 font-semibold text-black transition-colors hover:bg-white/85">PDF 받기</a>
        </div>
      </div>
      <iframe key={lang} title={file.label} src={`${file.href}#view=FitH&navpanes=0`} className="w-full flex-1 border-0" />
    </div>
  );
}
