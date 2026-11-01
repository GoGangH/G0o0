import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { Toaster } from "sonner";
import { SITE_URL } from "@/lib/site";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "고강현",
  description: "백엔드 개발자 고강현의 방",
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
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
      <body className={geistMono.variable}>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
