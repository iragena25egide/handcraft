import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import StoreProvider from "@/components/StoreProvider";
import GlobalSocketProvider from "@/components/GlobalSocketProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "All African Handcraft | Made in Rwanda Fashion & Handicrafts",
  description:
    "Discover authentic Rwandan fashion and handicrafts. Support local artisans with our curated collection of Made in Rwanda products.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo_mark.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo_mark.png" },
    ],
  },
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
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Edu+VIC+WA+NT+Hand:wght@400..700&display=swap" rel="stylesheet" />
      </head>
      <body
        className="font-sans text-sm bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-300"
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
 