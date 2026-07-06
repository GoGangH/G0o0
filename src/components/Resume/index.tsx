"use client";

interface ResumeProps {
  onClose: () => void;
}

export default function Resume({ onClose }: ResumeProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col">
      <div className="sticky top-0 bg-[#2d2d2d] border-b border-[#4a4a4a] p-4 flex justify-between items-center z-10">
        <h2 className="text-white font-mono">Resume Preview</h2>
        <div className="flex gap-3">
          <a
            href="/resume/goganghyun_resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-mono text-sm transition-colors"
          >
            Download PDF
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-mono text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <iframe
        title="Resume Preview"
        src="/resume/ably-backend-resume.html"
        className="flex-1 w-full border-0 bg-white"
      />
    </div>
  );
}
