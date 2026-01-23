"use client";

import Image from "next/image";

export interface TerminalLineProps {
  content: string;
  type?: "command" | "output" | "error" | "success" | "info" | "dim" | "image";
  prompt?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function TerminalLine({
  content,
  type = "output",
  prompt,
  imageSrc,
  imageAlt = "image",
}: TerminalLineProps) {
  const getColor = () => {
    switch (type) {
      case "command":
        return "text-white";
      case "error":
        return "text-red-400";
      case "success":
        return "text-green-400";
      case "info":
        return "text-cyan-400";
      case "dim":
        return "text-gray-500";
      case "image":
        return "";
      default:
        return "text-green-400";
    }
  };

  if (type === "image" && imageSrc) {
    return (
      <div className="my-2">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={80}
          height={80}
          className="rounded-lg border border-gray-600"
          style={{ width: 80, height: 80, objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div className={`font-mono text-xs sm:text-sm leading-relaxed ${getColor()}`}>
      {prompt && (
        <span className="text-purple-400">{prompt}</span>
      )}
      <span
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
}
