import "@/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Flow Desk",
  description:
    "A fast, modern workspace for managing tasks, issues, and team workflows with clarity and precision.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      data-theme="dark"
      lang="en"
      className={`dark h-full text-white ${inter.variable}`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Flow Desk" />
      </head>
      <body
        cz-shortcut-listen="true"
        className="flex h-full flex-col overflow-hidden"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
