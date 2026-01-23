"use client";

import { useState, useCallback, useEffect } from "react";
import TerminalBody, { OutputLine } from "./TerminalBody";
import { executeCommand } from "@/commands";
import Resume from "@/components/Resume";

interface TerminalProps {
  showIntro?: boolean;
  onIntroComplete?: () => void;
  introContent?: React.ReactNode;
}

export default function Terminal({
  showIntro = false,
  onIntroComplete,
  introContent,
}: TerminalProps) {
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [inputDisabled, setInputDisabled] = useState(showIntro);
  const [introVisible, setIntroVisible] = useState(showIntro);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    if (!showIntro && !introVisible) {
      // Auto-execute /start command when terminal is ready
      const startOutput = executeCommand("/start");
      const newLines = startOutput.map((line, index) => ({
        ...line,
        id: `start-${index}-${Date.now()}`,
      }));
      setLines(newLines);
    }
  }, [showIntro, introVisible]);

  // Handle ESC key to close resume
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showResume) {
        setShowResume(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showResume]);

  const handleIntroComplete = useCallback(() => {
    setIntroVisible(false);
    setInputDisabled(false);
    onIntroComplete?.();

    // Execute /start command after intro
    const startOutput = executeCommand("/start");
    const newLines = startOutput.map((line, index) => ({
      ...line,
      id: `start-${index}-${Date.now()}`,
    }));
    setLines(newLines);
  }, [onIntroComplete]);

  const handleCommand = useCallback((command: string) => {
    // Add command to history
    setCommandHistory((prev) => [...prev, command]);

    // Add command line to output
    const commandLine: OutputLine = {
      id: `cmd-${Date.now()}`,
      content: command,
      type: "command",
      prompt: "ganghyun@portfolio:~$ ",
    };

    // Handle /clear command specially
    if (command.toLowerCase() === "/clear") {
      setLines([]);
      return;
    }

    // Handle /resume command specially
    if (command.toLowerCase() === "/resume") {
      const outputLines: OutputLine[] = [
        { id: `output-${Date.now()}-0`, content: "", type: "output" },
        { id: `output-${Date.now()}-1`, content: "Opening resume view...", type: "success" },
        { id: `output-${Date.now()}-2`, content: "", type: "output" },
      ];
      setLines((prev) => [...prev, commandLine, ...outputLines]);
      setTimeout(() => setShowResume(true), 300);
      return;
    }

    // Execute command and get output
    const output = executeCommand(command);
    const outputLines: OutputLine[] = output.map((line, index) => ({
      ...line,
      id: `output-${Date.now()}-${index}`,
    }));

    setLines((prev) => [...prev, commandLine, ...outputLines]);
  }, []);

  return (
    <>
      <div className="w-full h-full flex flex-col overflow-hidden">
        <TerminalBody
          lines={introVisible ? [] : lines}
          onCommand={handleCommand}
          inputDisabled={inputDisabled || introVisible}
          commandHistory={commandHistory}
        >
          {introVisible && introContent && (
            <div
              className="flex items-center justify-center h-full cursor-pointer"
              onClick={handleIntroComplete}
            >
              {introContent}
            </div>
          )}
        </TerminalBody>
      </div>

      {showResume && <Resume onClose={() => setShowResume(false)} />}
    </>
  );
}
