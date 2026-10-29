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
  description: "Premier institute for Spoken English, Public Speaking, and Career Communication in Mairwa, Siwan, Bihar.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitevertex.in"),
  verification: {
    google: "FjH0Aahah1JwDNkQDaaWNUnInECJ2dQzV7OXACHE6t0",
  },
  openGraph: {
    title: "Elite Vertex — Institute of Communication",
    description: "Premier institute for Spoken English, Public Speaking, and Career Communication in Mairwa, Siwan, Bihar.",
    url: "https://elitevertex-web.vercel.app",
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
  twitter: {
    card: "summary_large_image",
    title: "Elite Vertex — Institute of Communication",
    description: "Premier institute for Spoken English, Public Speaking, and Career Communication in Mairwa, Siwan, Bihar.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
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
        <meta name="google-site-verification" content="FjH0Aahah1JwDNkQDaaWNUnInECJ2dQzV7OXACHE6t0" />
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
