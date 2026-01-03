import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./components/theme-provider";
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";

// Load the Inter font with the 'swap' display strategy
const inter = Inter({subsets: ["latin"], display: "swap"});

export const metadata: Metadata = {
  applicationName: "BIMformative",
  title: {
    default: "BIMformative",
    template: "%s - BIMformative"
  },
  description: "Shaping and developing knowledge in the field of BIM for infrastructure",
  twitter: {
    card: "summary_large_image"
  },
  openGraph: {
    title: "BIMformative - Where infrastructure innovation takes shape",
    description: "Shaping and developing knowledge in the field of BIM for infrastructure",
    type: "website",
    locale: "en-US",
    url: "https://www.bimformative.com/",
    siteName: "BIMformative",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
          {/* <NotificationBar /> */}
          <Navbar />
          <main className="w-full h-full mx-auto">{children}</main>
          <Toaster richColors expand={true} />
          <Footer />
          <Analytics />
          <SpeedInsights />        
        </ThemeProvider>        
      </body>
    </html>
    </ClerkProvider>
  );
}
