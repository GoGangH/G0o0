import { CommandOutput } from "./index";
import { skills } from "@/data/skills";

export function skillsCommand(): CommandOutput[] {
  const output: CommandOutput[] = [
    { content: "", type: "output" },
    { content: "<span class='text-cyan-400 font-bold'>━━━ SKILLS ━━━</span>", type: "output" },
    { content: "", type: "output" },
  ];

  skills.forEach((category) => {
    output.push({
      content: `<span class='text-yellow-400 font-bold'>${category.category}</span>`,
      type: "output",
    });
    output.push({
      content: `  ${category.items.map((item) => `<span class='text-green-400'>${item}</span>`).join(" · ")}`,
      type: "output",
    });
    output.push({ content: "", type: "output" });
  });

  return output;
}
