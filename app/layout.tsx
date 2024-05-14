export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibm = IBM_Plex_Sans({ 
  subsets: ["latin"], 
  weight: ["400","700"],
  variable: "--font-ibm" 
});

export const metadata: Metadata = {
  title: "Jahad",
  description: "This is a banking App project.",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibm.variable}`}>{children}</body>
    </html>
  );
}
