import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/utils";

const koreanSans = Noto_Sans_KR({
  variable: "--font-korean-sans",
  subsets: ["latin"],
});

const koreanSerif = Noto_Serif_KR({
  variable: "--font-korean-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "G0o0",
  description: "KangHyun's Profile",
};

const applySavedMode = `try{if(localStorage.getItem("mode")==="dark")document.documentElement.dataset.mode="dark"}catch{}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: applySavedMode }} />
      </head>
      <body className={cn(koreanSans.variable, koreanSerif.variable, geistMono.variable)}>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
