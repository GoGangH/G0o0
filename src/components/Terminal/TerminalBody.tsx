"use client";

import { useRef, useEffect, ReactNode } from "react";
import TerminalLine, { TerminalLineProps } from "./TerminalLine";
import TerminalInput from "./TerminalInput";

export interface OutputLine extends TerminalLineProps {
  id: string;
}

interface TerminalBodyProps {
  lines: OutputLine[];
  onCommand: (command: string) => void;
  inputDisabled?: boolean;
  commandHistory: string[];
  children?: ReactNode;
}

export default function TerminalBody({
  lines,
  onCommand,
  inputDisabled = false,
  commandHistory,
  children,
}: TerminalBodyProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#1e1e1e] font-mono text-sm"
      style={{ minHeight: 0 }}
    >
      {children}

      {lines.map((line) => (
        <TerminalLine
          key={line.id}
          content={line.content}
          type={line.type}
          prompt={line.prompt}
          imageSrc={line.imageSrc}
          imageAlt={line.imageAlt}
        />
      ))}

      <TerminalInput
        onSubmit={onCommand}
        disabled={inputDisabled}
        commandHistory={commandHistory}
      />
    </div>
  );
}
