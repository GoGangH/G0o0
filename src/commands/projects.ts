import { CommandOutput } from "./index";
import { projects } from "@/data/projects";

export function projectsCommand(): CommandOutput[] {
  const output: CommandOutput[] = [
    { content: "", type: "output" },
    { content: "<span class='text-cyan-400 font-bold'>━━━ PROJECTS ━━━</span>", type: "output" },
    { content: "", type: "output" },
  ];

  projects.forEach((project) => {
    output.push({
      content: `<span class='text-yellow-400'>[${project.id}]</span> <span class='text-white font-bold'>${project.name}</span>`,
      type: "output",
    });
    output.push({
      content: `    <span class='text-gray-300'>${project.description}</span>`,
      type: "output",
    });
    output.push({
      content: `    <span class='text-gray-500'>${project.period}</span>`,
      type: "dim",
    });
    output.push({ content: "", type: "output" });
  });

  output.push({
    content: "Type <span class='text-yellow-400'>/project [id]</span> for details (e.g., /project 1)",
    type: "dim",
  });
  output.push({ content: "", type: "output" });

  return output;
}

export function projectDetailCommand(id: number): CommandOutput[] {
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return [
      { content: "", type: "output" },
      { content: `Project with id '${id}' not found.`, type: "error" },
      { content: "Use <span class='text-yellow-400'>/projects</span> to see available projects.", type: "dim" },
      { content: "", type: "output" },
    ];
  }

  const output: CommandOutput[] = [
    { content: "", type: "output" },
    { content: `<span class='text-cyan-400 font-bold'>━━━ ${project.name} ━━━</span>`, type: "output" },
    { content: "", type: "output" },
    { content: `<span class='text-gray-300'>${project.description}</span>`, type: "output" },
    { content: "", type: "output" },
    { content: `<span class='text-gray-500'>Period:</span> <span class='text-white'>${project.period}</span>`, type: "output" },
    { content: "", type: "output" },
    { content: `<span class='text-gray-500'>Tech Stack:</span>`, type: "output" },
    { content: `  ${project.tech.map((t) => `<span class='text-green-400'>${t}</span>`).join(" · ")}`, type: "output" },
    { content: "", type: "output" },
  ];

  if (project.links && project.links.length > 0) {
    output.push({ content: `<span class='text-gray-500'>Links:</span>`, type: "output" });
    project.links.forEach((link) => {
      output.push({
        content: `  🔗 <a href='${link.url}' target='_blank' class='text-blue-400 hover:underline'>${link.label}</a>`,
        type: "output",
      });
    });
    output.push({ content: "", type: "output" });
  }

  output.push({ content: `<span class='text-gray-500'>Details:</span>`, type: "output" });
  project.details.forEach((detail) => {
    output.push({ content: `  • <span class='text-gray-300'>${detail}</span>`, type: "output" });
  });

  output.push({ content: "", type: "output" });

  return output;
}
