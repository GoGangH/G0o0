"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface TerminalInputProps {
  onSubmit: (command: string) => void;
  prompt?: string;
  disabled?: boolean;
  commandHistory: string[];
}

export default function TerminalInput({
  onSubmit,
  prompt = "ganghyun@portfolio:~$ ",
  disabled = false,
  commandHistory,
}: TerminalInputProps) {
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      onSubmit(input.trim());
      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1
          ? historyIndex + 1
          : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  if (disabled) return null;

  return (
    <div
      className="flex items-center font-mono text-sm"
      onClick={handleContainerClick}
    >
      <span className="text-purple-400 whitespace-pre">{prompt}</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent text-green-400 outline-none caret-green-400"
        autoFocus
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );
}
