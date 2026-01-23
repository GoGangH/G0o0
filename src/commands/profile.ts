import { CommandOutput } from "./index";
import { profile } from "@/data/profile";

export function profileCommand(): CommandOutput[] {
  const output: CommandOutput[] = [
    { content: "", type: "output" },
    { content: "<span class='text-cyan-400 font-bold'>━━━ PROFILE ━━━</span>", type: "output" },
    { content: "", type: "output" },
    { content: "", type: "image", imageSrc: "/info/profile.jpg", imageAlt: "Profile Photo" },
    { content: "", type: "output" },
    { content: `<span class='text-xl font-bold text-white'>${profile.nameKr}</span> <span class='text-gray-400'>(${profile.name})</span>`, type: "output" },
    { content: `<span class='text-green-400 font-medium'>${profile.title}</span>`, type: "output" },
    { content: "", type: "output" },
    { content: "<span class='text-gray-500'>────────────────────────────────</span>", type: "output" },
    { content: "", type: "output" },
    { content: `📞 <span class='text-white'>${profile.phone}</span>`, type: "output" },
    { content: `📧 <a href='mailto:${profile.email}' class='text-blue-400 hover:underline'>${profile.email}</a>`, type: "output" },
    { content: `📍 <span class='text-white'>${profile.location}</span>`, type: "output" },
    { content: `🎓 <span class='text-white'>${profile.education}</span>`, type: "output" },
    { content: "", type: "output" },
    { content: `🔗 <a href='${profile.github}' target='_blank' class='text-blue-400 hover:underline'>GitHub</a> · <a href='${profile.linkedin}' target='_blank' class='text-blue-400 hover:underline'>LinkedIn</a>`, type: "output" },
    { content: "", type: "output" },
    { content: "<span class='text-gray-500'>────────────────────────────────</span>", type: "output" },
    { content: "", type: "output" },
    { content: "<span class='text-yellow-400 font-bold'>About Me</span>", type: "output" },
    { content: "", type: "output" },
  ];

  profile.bio.forEach((line) => {
    output.push({ content: `<span class='text-gray-300'>${line}</span>`, type: "output" });
  });

  output.push({ content: "", type: "output" });

  return output;
}
