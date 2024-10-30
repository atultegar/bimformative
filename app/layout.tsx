import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Inter } from "next/font/google";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./components/theme-provider";

// Load the Inter font with the 'swap' display strategy
const inter = Inter({subsets: ["latin"], display: "swap"});

export const metadata: Metadata = {
  title: "BIMformative",
  description: "Shaping and developing knowledge in the field of BIM for infrastructure",
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
          <Navbar />
          <main className="max-w-7xl mx-auto px-4">{children}</main>
          <Footer />        
        </ThemeProvider>        
      </body>
    </html>
  );
}
