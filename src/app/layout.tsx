import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
        <SpeedInsights sampleRate={1.0} />
      </body>
    </html>
  );
}
