import "@/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Flow Desk",
  description: "MINI Jira",
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
      className={`dark text-white ${inter.variable}`}
    >
      <body cz-shortcut-listen="true" className="overflow-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
