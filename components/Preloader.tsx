"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Shorter, simpler loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second total loading time

    return () => clearTimeout(timer);
  }, []);

  if (pathname.startsWith("/admin") || !isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f172a] overflow-hidden">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 md:w-40 md:h-40 mb-6 drop-shadow-2xl">
          <img src="/logo_mark.png" alt="Logo" className="w-full h-full object-contain invert brightness-0" />
        </div>
        
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#c89f72] flex flex-wrap justify-center text-center px-4"
          style={{ fontFamily: '"Edu VIC WA NT Hand", cursive', gap: '0.1em' }}
        >
          All African Handcraft
        </h1>
      </div>
    </div>
  );
}
