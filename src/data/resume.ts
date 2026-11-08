// The PDFs the site links to. Replace the files in public/resume to update them.
export const resumeFiles = {
  ko: { label: "한국어", href: "/resume/goganghyun_resume.pdf", download: "고강현_이력서.pdf" },
  en: { label: "English", href: "/resume/goganghyun_resume_en.pdf", download: "Kanghyun_Ko_Resume.pdf" },
} as const;
export type ResumeLang = keyof typeof resumeFiles;
