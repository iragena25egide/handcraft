"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center overflow-hidden bg-[#faf9f6]">
      {/* Wave Background SVG */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[150px] opacity-[0.05]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C51.71,98.66,105.77,88.75,157.48,81.39,212.8,73.5,268.08,66.19,321.39,56.44Z"
            fill="#0f172a"
          ></path>
        </svg>
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Column - Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 max-w-2xl flex flex-col items-start pt-6 lg:pt-0"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#0f172a] leading-[1.1] tracking-tight mb-4 lg:mb-6">
            {t.hero.title} <span className="text-[#c89f72] italic font-medium" style={{ fontFamily: '"Edu VIC WA NT Hand", cursive' }}>{t.hero.titleArtistry}</span><br/>
            {t.hero.titleDelivered}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 lg:mb-10 max-w-lg leading-relaxed font-medium">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-10 lg:mb-12 w-full sm:w-auto">
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-[#0f172a] border-2 border-[#0f172a] px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold overflow-hidden transition-all duration-300 hover:bg-[#0f172a] hover:text-white hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.6)] w-full sm:w-auto"
            >
              <span className="relative z-10 tracking-wide text-xs sm:text-sm uppercase whitespace-nowrap">{t.hero.button}</span>
              <ArrowRight className="relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>

          {/* Full Width Static Imigongo Zigzag */}
          <div className="hidden lg:block w-full pt-6 lg:pt-8 border-t border-gray-200">
            <div className="w-full overflow-hidden relative">
              {/* Stack of 4 Zigzag lines */}
              <div className="flex flex-col gap-2 w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex whitespace-nowrap"
                  >
                    {[...Array(50)].map((_, j) => (
                      <svg key={j} width="40" height="12" viewBox="0 0 40 12" fill="none" className="shrink-0 overflow-visible">
                        <path d="M0 10 L10 2 L20 10 L30 2 L40 10" stroke="#0f172a" strokeWidth="2" strokeLinejoin="miter" opacity={1 - (i * 0.15)} />
                      </svg>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Elegant Image Composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="flex-1 w-full relative mt-8 lg:mt-0"
        >
          <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square flex gap-3 sm:gap-4">
            {/* Left large image */}
            <div className="w-3/5 h-full rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl relative group">
              <img src="/image/4.jpeg" alt="Handcraft" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            
            {/* Right stacked elements */}
            <div className="w-2/5 flex flex-col gap-3 sm:gap-4 h-full">
              <div className="flex-1 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl relative group">
                <img src="/image/3.jpeg" alt="Artisan" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              
              <div className="flex-1 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl relative group flex flex-col justify-end">
                <img src="/image/umukenyero.jpeg" alt="Rwandan Clothes" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative z-10 p-3 sm:p-5 flex flex-col justify-end h-full">
                  <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-[#c89f72] mb-1 sm:mb-2 drop-shadow-lg" />
                  <h3 className="font-bold text-white text-xs sm:text-sm drop-shadow-md">Premium Quality</h3>
                  <p className="text-[10px] text-gray-200 mt-0.5 sm:mt-1 font-medium leading-tight drop-shadow-md hidden sm:block">Authentic Rwandan Clothes.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
