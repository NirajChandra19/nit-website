import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider"; // Import the provider
import "./globals.css";
// 1. Import your font configuration
import { playfair } from "./fonts"; 

export const metadata: Metadata = {
  title: "Nainital Institute of Technology",
  description: "Achieving Excellence Together",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 2. Applied playfair.className here next to your smooth scrolling attributes
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={playfair.className}>
      <body className="bg-gray-50 text-gray-900 antialiased flex flex-col min-h-screen dark:bg-[#0A142F] dark:text-white transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          <main className="pt-20 flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}