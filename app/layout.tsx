import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import StoreProvider from "@/components/StoreProvider";
import GlobalSocketProvider from "@/components/GlobalSocketProvider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway", // Keeping the variable name so we don't have to change tailwind.config.ts
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "All African Handcraft | Made in Rwanda Fashion & Handicrafts",
  description:
    "Discover authentic Rwandan fashion and handicrafts. Support local artisans with our curated collection of Made in Rwanda products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${playfair.variable} font-sans text-sm bg-white dark:bg-gray-900 transition-colors duration-300`}
      >
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var hour = new Date().getHours();
                  var isNightTime = hour >= 22 || hour < 6;
                  var theme = stored || (isNightTime ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <StoreProvider>
          <GlobalSocketProvider>
            <ThemeProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster position="bottom-right" />
            </ThemeProvider>
          </GlobalSocketProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
