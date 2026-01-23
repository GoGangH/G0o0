import { CommandOutput } from "./index";
import { career } from "@/data/career";

export function careerCommand(): CommandOutput[] {
  const output: CommandOutput[] = [
    { content: "", type: "output" },
    { content: "<span class='text-cyan-400 font-bold'>━━━ EXPERIENCE ━━━</span>", type: "output" },
    { content: "", type: "output" },
  ];

  career.forEach((item, index) => {
    output.push({
      content: `<span class='text-white font-bold'>${item.company}</span>`,
      type: "output",
    });
    output.push({
      content: `<span class='text-green-400'>${item.position}</span>`,
      type: "output",
    });
    output.push({
      content: `<span class='text-gray-500'>${item.period}</span>`,
      type: "dim",
    });
    output.push({ content: "", type: "output" });

    item.description.forEach((desc) => {
      output.push({ content: `  • <span class='text-gray-300'>${desc}</span>`, type: "output" });
    });

    if (index < career.length - 1) {
      output.push({ content: "", type: "output" });
      output.push({ content: "<span class='text-gray-600'>─────────────────────────────</span>", type: "output" });
      output.push({ content: "", type: "output" });
    }
  });

  output.push({ content: "", type: "output" });

  return output;
}
