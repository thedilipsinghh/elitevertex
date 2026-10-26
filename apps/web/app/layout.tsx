import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import StoreProvider from "@/lib/StoreProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Elite Vertex — Institute of Communication",
  description: "Premier institute for Spoken English, Public Speaking, and Career Communication.",
  openGraph: {
    title: "Elite Vertex — Institute of Communication",
    description: "Premier institute for Spoken English, Public Speaking, and Career Communication.",
    url: "https://elitevertex.com",
    siteName: "Elite Vertex",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Elite Vertex branding",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${montserrat.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('elitevertex-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface font-sans text-on-surface antialiased transition-colors duration-150">
        <StoreProvider>
          <ThemeProvider>
            <AppLayout>{children}</AppLayout>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
