import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import StoreProvider from "@/lib/StoreProvider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Elite Vertex — Institute of Communication",
  description: "Premier institute for Spoken English, Public Speaking, and Career Communication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${manrope.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface font-body-md text-on-surface antialiased">
        <StoreProvider>
          <Navbar />
          <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
