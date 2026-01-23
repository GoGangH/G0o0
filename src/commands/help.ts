import { CommandOutput } from "./index";

export function helpCommand(): CommandOutput[] {
  return [
    { content: "", type: "output" },
    { content: "<span class='text-cyan-400 font-bold'>━━━ COMMANDS ━━━</span>", type: "output" },
    { content: "", type: "output" },
    { content: "<span class='text-yellow-400'>/help</span>          <span class='text-gray-400'>Show this help</span>", type: "output" },
    { content: "<span class='text-yellow-400'>/start</span>         <span class='text-gray-400'>Welcome message</span>", type: "output" },
    { content: "<span class='text-yellow-400'>/profile</span>       <span class='text-gray-400'>My profile</span>", type: "output" },
    { content: "<span class='text-yellow-400'>/career</span>        <span class='text-gray-400'>Work experience</span>", type: "output" },
    { content: "<span class='text-yellow-400'>/skills</span>        <span class='text-gray-400'>Tech skills</span>", type: "output" },
    { content: "<span class='text-yellow-400'>/awards</span>        <span class='text-gray-400'>Awards</span>", type: "output" },
    { content: "<span class='text-yellow-400'>/projects</span>      <span class='text-gray-400'>Project list</span>", type: "output" },
    { content: "<span class='text-yellow-400'>/project [id]</span>  <span class='text-gray-400'>Project details</span>", type: "output" },
    { content: "<span class='text-yellow-400'>/resume</span>        <span class='text-gray-400'>Full resume (PDF)</span>", type: "output" },
    { content: "<span class='text-yellow-400'>/clear</span>         <span class='text-gray-400'>Clear screen</span>", type: "output" },
    { content: "", type: "output" },
    { content: "<span class='text-gray-500'>Tip: ↑/↓ arrows for command history</span>", type: "dim" },
    { content: "", type: "output" },
  ];
}
