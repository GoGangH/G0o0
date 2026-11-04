import { CommandOutput } from "./index";
import { career, careerTitle } from "@/data/career";

export function careerCommand(): CommandOutput[] {
  const output: CommandOutput[] = [
    { content: "", type: "output" },
    { content: "<span class='text-cyan-400 font-bold'>━━━ EXPERIENCE ━━━</span>", type: "output" },
    { content: "", type: "output" },
  ];

  career.forEach((item, index) => {
    output.push({
      content: `<span class='text-white font-bold'>${careerTitle(item)}</span>${item.summary ? ` <span class='text-gray-400'>${item.summary}</span>` : ""}`,
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

    item.sections.forEach((section) => {
      output.push({ content: `  <span class='text-yellow-400'>${section.title}</span>`, type: "output" });
      section.items.forEach((text) => output.push({ content: `    • <span class='text-gray-300'>${text}</span>`, type: "output" }));
    });
    if (item.highlight) output.push({ content: `  ✓ <span class='text-cyan-400'>${item.highlight}</span>`, type: "output" });

    if (index < career.length - 1) {
      output.push({ content: "", type: "output" });
      output.push({ content: "<span class='text-gray-600'>─────────────────────────────</span>", type: "output" });
      output.push({ content: "", type: "output" });
    }
  });

  output.push({ content: "", type: "output" });

  return output;
}
