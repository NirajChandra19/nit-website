import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider"; // Import the provider
import "./globals.css";

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
    // Add suppressHydrationWarning to the html tag (required by next-themes)
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
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