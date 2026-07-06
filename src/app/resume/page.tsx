"use client";

import Link from "next/link";

export default function ResumePage() {
  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
      <div className="print:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
          >
            Back to Home
          </Link>
          <h2 className="text-gray-800 font-semibold hidden sm:block">
            고강현 이력서
          </h2>
        </div>
        <a
          href="/resume/goganghyun_resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
        >
          Download PDF
        </a>
      </div>

      <iframe
        title="고강현 이력서"
        src="/resume/ably-backend-resume.html"
        className="flex-1 w-full border-0 bg-white"
      />
    </div>
  );
}
