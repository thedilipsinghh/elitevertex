import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import StoreProvider from "@/lib/StoreProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import {
  BRAND_NAME,
  DEFAULT_OG_IMAGE_PATH,
  HOMEPAGE_DESCRIPTION,
  HOMEPAGE_OG_TITLE,
  HOMEPAGE_TITLE,
  HOMEPAGE_URL,
  SITE_URL,
  canonicalUrl,
} from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: HOMEPAGE_TITLE,
    template: "%s",
  },
  description: HOMEPAGE_DESCRIPTION,
  applicationName: BRAND_NAME,
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "FjH0Aahah1JwDNkQDaaWNUnInECJ2dQzV7OXACHE6t0",
  },
  openGraph: {
    title: HOMEPAGE_OG_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    url: HOMEPAGE_URL,
    siteName: BRAND_NAME,
    images: [
      {
        url: canonicalUrl(DEFAULT_OG_IMAGE_PATH),
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} — English Classes in Mairwa, Siwan, Bihar`,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOMEPAGE_OG_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    images: [canonicalUrl(DEFAULT_OG_IMAGE_PATH)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${inter.variable} ${plusJakartaSans.variable}`}>
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
