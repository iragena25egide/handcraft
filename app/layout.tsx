import type { Metadata } from "next";
import { Montserrat, Merriweather } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import StoreProvider from "@/components/StoreProvider";
import GlobalSocketProvider from "@/components/GlobalSocketProvider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const outfit = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway", // Keeping the variable name so we don't have to change tailwind.config.ts
  display: "swap",
});

const playfair = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "All African Handcraft | Made in Rwanda Fashion & Handicrafts",
  description:
    "Discover authentic Rwandan fashion and handicrafts. Support local artisans with our curated collection of Made in Rwanda products.",
};

import Preloader from "@/components/Preloader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cause:wght@100..900&family=Edu+VIC+WA+NT+Hand:wght@400..700&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${outfit.variable} ${playfair.variable} font-sans text-sm bg-white dark:bg-gray-900 transition-colors duration-300`}
      >
        <Preloader />
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
                <main className="flex-grow">{children}</main>
              </div>
              <Toaster position="bottom-right" />
            </ThemeProvider>
          </GlobalSocketProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
 