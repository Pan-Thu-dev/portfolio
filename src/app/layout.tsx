import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pan Thu - Portfolio",
  description: "Full-stack developer portfolio showcasing projects and skills",
  keywords: ["portfolio", "developer", "full-stack", "web development"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
        <body className={inter.className}>{children}</body>
    </html>
  );
}
