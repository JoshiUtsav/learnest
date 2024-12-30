import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

// Ensure consistent URL handling
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// Enhanced metadata configuration
export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Learnest",
    template: "%s | Next.js and Supabase",
  },
  description: "The fastest way to build apps with Next.js and Supabase",
  keywords: ["Next.js", "Supabase", "React", "Web Development", "Starter Kit"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    title: "Next.js and Supabase Starter Kit",
    description: "The fastest way to build apps with Next.js and Supabase",
    siteName: "Next.js and Supabase Starter Kit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js and Supabase Starter Kit",
    description: "The fastest way to build apps with Next.js and Supabase",
    creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: `${defaultUrl}/manifest.json`,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en"  suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main
            id="main-content"
            className="min-h-screen flex flex-col items-center"
          >
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <div className="flex flex-col gap-20">{children}</div>
            </div>
          </main>

          <Toaster />
        </ThemeProvider>

        {/* Analytics and Performance Monitoring */}
        {/* <Analytics /> */}
        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}
