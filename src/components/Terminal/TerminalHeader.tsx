"use client";

interface TerminalHeaderProps {
  title?: string;
}

export default function TerminalHeader({ title = "ganghyun@portfolio ~ " }: TerminalHeaderProps) {
  return (
    <div className="flex items-center px-4 py-3 bg-[#3d3d3d] rounded-t-lg border-b border-[#4a4a4a]">
      {/* Traffic light buttons */}
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 cursor-pointer" />
      </div>

      {/* Title */}
      <div className="flex-1 text-center text-sm text-gray-400 font-mono">
        {title}
      </div>

      {/* Spacer for symmetry */}
      <div className="w-14" />
    </div>
  );
}
