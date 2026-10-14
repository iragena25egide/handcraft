import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import StoreProvider from "@/components/StoreProvider";
import GlobalSocketProvider from "@/components/GlobalSocketProvider";
import { Toaster } from "react-hot-toast";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-raleway",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
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
        className={`${sans.variable} ${playfair.variable} font-sans text-sm bg-white dark:bg-gray-900 transition-colors duration-300`}
      >
        <Preloader />
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
 