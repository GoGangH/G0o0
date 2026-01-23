"use client";

import { useState, useCallback } from "react";
import LogoIntro from "@/components/LogoIntro";
import Terminal from "@/components/Terminal";
import StarryBackground from "@/components/LogoIntro/StarryBackground";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center p-2 sm:p-4 z-50">
      <StarryBackground isActive={true} />

      <div className="relative z-10 w-full max-w-4xl mx-auto h-[85vh] sm:h-[80vh] flex flex-col rounded-lg shadow-2xl overflow-hidden border border-[#4a4a4a]">
        {/* Terminal Header */}
        <div className="flex-shrink-0 flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-[#3d3d3d] rounded-t-lg border-b border-[#4a4a4a]">
          <div className="flex gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 text-center text-xs sm:text-sm text-gray-400 font-mono">
            ganghyun@portfolio ~
          </div>
          <div className="w-10 sm:w-14" />
        </div>

        {/* Terminal Body */}
        <div className="flex-1 bg-[#1e1e1e] overflow-hidden">
          {showIntro ? (
            <div className="w-full h-full flex items-center justify-center">
              <LogoIntro onComplete={handleIntroComplete} />
            </div>
          ) : (
            <Terminal showIntro={false} />
          )}
        </div>
      </div>
    </div>
  );
}
