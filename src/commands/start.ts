import { CommandOutput } from "./index";

export function startCommand(): CommandOutput[] {
  return [
    { content: "", type: "output" },
    { content: "", type: "image", imageSrc: "/info/profile.jpg", imageAlt: "Profile" },
    { content: "", type: "output" },
    { content: "<span class='text-2xl'>👋 안녕하세요!</span>", type: "output" },
    { content: "<span class='text-cyan-400 text-xl font-bold'>고강현</span> <span class='text-gray-400'>Kanghyun Ko</span>", type: "output" },
    { content: "<span class='text-green-400'>Backend Developer</span>", type: "output" },
    { content: "", type: "output" },
    { content: "<span class='text-gray-400'>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>", type: "output" },
    { content: "", type: "output" },
    { content: "🚀 FastAPI | Telegram Miniapp | React Native", type: "dim" },
    { content: "💼 Startup Founding Team 경험", type: "dim" },
    { content: "📊 라이브 서비스 설계 및 운영", type: "dim" },
    { content: "", type: "output" },
    { content: "<span class='text-gray-400'>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>", type: "output" },
    { content: "", type: "output" },
    { content: "📄 <a href='/resume' target='_blank' class='text-cyan-400 hover:underline'>/resume</a> - 이력서 한눈에 보기 (PDF 다운로드)", type: "output" },
    { content: "", type: "output" },
    { content: "Type <span class='text-yellow-400'>/help</span> to see all commands.", type: "dim" },
    { content: "", type: "output" },
  ];
}
