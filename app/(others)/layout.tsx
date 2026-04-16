import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "sonner";
import "../globals.css";

// Load the Inter font with the 'swap' display strategy
const inter = Inter({subsets: ["latin"], display: "swap"});

export default function CompareLayout({
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
                        <main className="w-full h-full mx-auto">{children}</main>
                        <Toaster richColors expand />                
                </ThemeProvider>                
            </body>
        </html>
    );
}