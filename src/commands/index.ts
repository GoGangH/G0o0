import { helpCommand } from "./help";
import { startCommand } from "./start";
import { profileCommand } from "./profile";
import { careerCommand } from "./career";
import { skillsCommand } from "./skills";
import { awardsCommand } from "./awards";
import { projectsCommand, projectDetailCommand } from "./projects";

export interface CommandOutput {
  content: string;
  type?: "command" | "output" | "error" | "success" | "info" | "dim" | "image";
  prompt?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function executeCommand(input: string): CommandOutput[] {
  const trimmed = input.trim().toLowerCase();
  const parts = trimmed.split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  switch (command) {
    case "/help":
      return helpCommand();

    case "/start":
      return startCommand();

    case "/profile":
      return profileCommand();

    case "/career":
      return careerCommand();

    case "/skills":
      return skillsCommand();

    case "/awards":
      return awardsCommand();

    case "/projects":
      return projectsCommand();

    case "/project":
      if (args.length === 0) {
        return [
          { content: "", type: "output" },
          { content: "Usage: /project [id]", type: "error" },
          { content: "Example: /project 1", type: "dim" },
          { content: "", type: "output" },
        ];
      }
      const projectId = parseInt(args[0], 10);
      if (isNaN(projectId)) {
        return [
          { content: "", type: "output" },
          { content: `Invalid project id: '${args[0]}'`, type: "error" },
          { content: "Project id must be a number.", type: "dim" },
          { content: "", type: "output" },
        ];
      }
      return projectDetailCommand(projectId);

    case "/clear":
      return [];

    case "/resume":
      return [];

    default:
      return [
        { content: "", type: "output" },
        { content: `Command not found: ${input}`, type: "error" },
        { content: "Type <span class='text-yellow-400'>/help</span> to see available commands.", type: "dim" },
        { content: "", type: "output" },
      ];
  }
}
