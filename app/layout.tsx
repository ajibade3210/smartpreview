import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import Script from "next/script";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartPreview - Live HTML/Pug/Handlebars Editor",
  description:
    "A real-time code preview editor supporting HTML, Pug, and Handlebars templates",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "SmartPreview – Live Code Preview",
    description:
      "Instantly see how your template renders while you type. Supports HTML, Pug, Handlebars & JSX.",
    url: "https://smartpreview.vercel.app",
    siteName: "SmartPreview",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SmartPreview editor screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartPreview – Live Code Preview",
    description:
      "Instant visual feedback while editing HTML, Pug, Handlebars & JSX.",
    images: ["/og-image.png"],
    creator: "@ajibadde",
  },
  alternates: {
    canonical: "https://smartpreview.vercel.app/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
          <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "SmartPreview",
                url: "https://smartpreview.vercel.app",
                description:
                  "Real‑time template previewer for HTML, Pug, Handlebars & JSX.",
                author: {
                  "@type": "Person",
                  name: "Olaoluwa Ajibade",
                  url: "https://ajibadde.space",
                },
                image: "https://smartpreview.vercel.app/og-image.png",
                applicationCategory: "DeveloperTools",
                operatingSystem: "Web",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
              }),
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
