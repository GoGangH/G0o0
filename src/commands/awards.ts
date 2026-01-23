import { CommandOutput } from "./index";
import { awards } from "@/data/awards";

export function awardsCommand(): CommandOutput[] {
  const output: CommandOutput[] = [
    { content: "", type: "output" },
    { content: "<span class='text-cyan-400 font-bold'>━━━ AWARDS ━━━</span>", type: "output" },
    { content: "", type: "output" },
  ];

  awards.forEach((award) => {
    output.push({
      content: `🏆 <span class='text-yellow-400 font-bold'>${award.title}</span>`,
      type: "output",
    });
    output.push({
      content: `   <span class='text-cyan-400'>${award.prize}</span> · <span class='text-gray-400'>${award.organization}</span>`,
      type: "output",
    });
    output.push({ content: "", type: "output" });
  });

  return output;
}
