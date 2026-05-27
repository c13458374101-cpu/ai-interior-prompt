import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 室内设计 Prompt 生成器",
  description: "生成、优化并分享 AI 室内设计图像提示词。",
  openGraph: {
    title: "AI 室内设计 Prompt 生成器",
    description: "选择空间、风格、材质和关键词，生成可分享的室内设计 Prompt。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
