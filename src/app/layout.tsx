import type { Metadata } from "next";
import { Newsreader, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/layout/SessionProvider";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Orca Jobs — Isle of Wight",
    template: "%s | Orca Jobs",
  },
  description:
    "The Isle of Wight's modern jobs platform. Find local roles or hire island talent across marine, hospitality, care, trades, and more.",
  keywords: ["jobs", "Isle of Wight", "employment", "careers", "recruitment", "IOW"],
  openGraph: {
    siteName: "Orca Jobs",
    locale: "en_GB",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
