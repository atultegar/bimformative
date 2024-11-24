import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Inter, Inter_Tight } from "next/font/google";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./components/theme-provider";
import { Analytics } from '@vercel/analytics/react'
import NotificationBar from "./components/NotificationBar";

// Load the Inter font with the 'swap' display strategy
const inter = Inter({subsets: ["latin"], display: "swap"});

export const metadata: Metadata = {
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
    url: "https://bimformative.vercel.app/",
    siteName: "BIMformative",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
          <NotificationBar />
          <Navbar />
          <main className="max-w-7xl mx-auto px-4">{children}</main>
          <Footer />
          <Analytics />        
        </ThemeProvider>        
      </body>
    </html>
  );
}
