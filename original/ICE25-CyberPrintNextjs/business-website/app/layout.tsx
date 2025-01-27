import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Footer from "./components/footer";
import Header from "./components/header";
import "./globals.css";
import { Providers } from "./Providers";
import SessionGuard from "./SessionGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CyberPrint",
  description: "A cybernetic exercise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SessionGuard>
            <Suspense>
              <Header />
              {children}
              <Footer />
            </Suspense>
          </SessionGuard>
        </Providers>
      </body>
    </html>
  );
}
