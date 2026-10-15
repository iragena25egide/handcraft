"use client";

import { FaInstagram, FaFacebook, FaYoutube, FaTwitter } from "react-icons/fa";
import { ShoppingCart, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/hooks/useTranslation";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0f172a] text-[#fefce8] relative pt-11 sm:pt-14 md:pt-16 pb-6 overflow-hidden">
      {/* Top Zigzag Wave Accent */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[28px] sm:h-[38px] md:h-[50px] opacity-20"
        >
          <path
            d="M0,120 L0,40 L60,100 L120,40 L180,100 L240,40 L300,100 L360,40 L420,100 L480,40 L540,100 L600,40 L660,100 L720,40 L780,100 L840,40 L900,100 L960,40 L1020,100 L1080,40 L1140,100 L1200,40 L1200,120 Z"
            fill="#fefce8"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-[#fefce8]/10">
          <div className="max-w-md">
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
              All African Handcrafts
            </h3>
            <p className="text-xs sm:text-sm opacity-70 mt-1">
              {t.footer.newsletterDesc}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-2">
            <input
              type="email"
              placeholder={t.footer.placeholder}
              className="bg-white/5 border border-[#fefce8]/20 px-4 py-2.5 rounded-xl flex-grow lg:w-72 outline-none focus:border-[#fefce8] transition-all text-xs sm:text-sm text-white placeholder:text-[#fefce8]/40"
            />
            <button className="bg-[#fefce8] text-[#0f172a] px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors shrink-0">
              {t.footer.subscribe}
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-6 md:py-8">
          {/* Brand Info & Address */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-[#c89f72] shadow-[2px_0_0_0_#0f172a]" />
              <div className="relative h-10 w-16 flex items-end justify-center overflow-hidden bg-white/5 rounded-lg border border-[#fefce8]/10">
                <div className="z-20 mb-1 text-[#fefce8]/40">
                  <ShoppingCart className="w-3.5 h-3.5" />
                </div>
                {[
                  { Icon: "🧺", d: 0 },
                  { Icon: "👕", d: 1 },
                  { Icon: "🎨", d: 2 },
                  { Icon: "🏺", d: 3 },
                ].map((item, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: -24, opacity: 0 }}
                    animate={{
                      y: [-24, 12],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: item.d,
                      ease: "easeIn",
                    }}
                    className="absolute top-0 text-xs z-10 filter grayscale brightness-200"
                  >
                    {item.Icon}
                  </motion.span>
                ))}
              </div>
              <span 
                className="text-lg font-bold italic tracking-tight text-[#c89f72]"
                style={{ fontFamily: '"Edu VIC WA NT Hand", cursive' }}
              >
                All African Handcraft
              </span>
            </div>

            <p className="text-xs sm:text-sm opacity-60 leading-relaxed max-w-sm">
              {t.footer.description}
            </p>

            <a 
              href="https://maps.google.com/maps?vet=10CAAQoqAOahcKEwjoy-nmn_CVAxUAAAAAHQAAAAAQDA..i&rlz=1C5CHFA_enRW1056RW1056&sca_esv=2f53b8b5415a751f&pvq=Cg0vZy8xMXl5ZGI1ZHhqIhsKFWFsbCBhZnJpY2FuIGhhbmRjcmFmdBACGAM&lqi=ChxhbGwgYWZyaWNhbiBoYW5kY3JhZnQgcndhbmRhWh4iHGFsbCBhZnJpY2FuIGhhbmRjcmFmdCByd2FuZGGSARdjb3Jwb3JhdGVfZ2lmdF9zdXBwbGllcg&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=rw&sa=X&ftid=0x19dca599234783df:0x45cdf7cb075f3657"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 text-xs opacity-70 hover:opacity-100 transition-opacity max-w-sm cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#c89f72]" />
              <div>
                <span className="font-semibold block text-[#fefce8]">Yyussa City Plaza (Kwa Makuza)</span>
                <span>KN 48 ST, Kigali, Rwanda · <span className="group-hover:underline text-[#c89f72]">Map</span></span>
              </div>
            </a>

            <div className="flex gap-4 opacity-60 pt-1">
              <FaInstagram className="w-4 h-4 cursor-pointer hover:opacity-100 hover:text-[#c89f72] transition-colors" />
              <FaFacebook className="w-4 h-4 cursor-pointer hover:opacity-100 hover:text-[#c89f72] transition-colors" />
              <FaTwitter className="w-4 h-4 cursor-pointer hover:opacity-100 hover:text-[#c89f72] transition-colors" />
              <FaYoutube className="w-4 h-4 cursor-pointer hover:opacity-100 hover:text-[#c89f72] transition-colors" />
            </div>
          </div>

          {/* Links: Clean 3-column layout on mobile, 3 columns on desktop */}
          <div className="grid grid-cols-3 md:col-span-3 gap-4 sm:gap-6">
            <div>
              <h4 className="font-black uppercase tracking-wider text-[11px] sm:text-xs mb-3 opacity-40">
                {t.footer.shop}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm font-medium opacity-70">
                <li className="hover:text-white cursor-pointer transition-colors">
                  <Link href="/shop">{t.footer.fashion}</Link>
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  <Link href="/shop">{t.footer.handicraft}</Link>
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  <Link href="/shop">{t.footer.bestsellers}</Link>
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  <Link href="/new-arrivals">{t.footer.newArrivals}</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black uppercase tracking-wider text-[11px] sm:text-xs mb-3 opacity-40">
                {t.footer.help}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm font-medium opacity-70">
                <li className="hover:text-white cursor-pointer transition-colors">
                  <Link href="/about">{t.footer.shippingReturns}</Link>
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  <Link href="/about">{t.footer.sizeGuide}</Link>
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  <Link href="/about">{t.footer.contactUs}</Link>
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  <Link href="/profile">{t.footer.trackOrder}</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black uppercase tracking-wider text-[11px] sm:text-xs mb-3 opacity-40">
                {t.footer.about}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm font-medium opacity-70">
                <li className="hover:text-white cursor-pointer transition-colors">
                  <Link href="/about">{t.footer.ourStory}</Link>
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  <Link href="/about">{t.footer.sustainability}</Link>
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  <Link href="/about">{t.footer.artisans}</Link>
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  <Link href="/about">{t.footer.careers}</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal & Payment Badges */}
        <div className="pt-4 border-t border-[#fefce8]/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="text-[10px] uppercase font-bold opacity-40 tracking-wider">
            © {currentYear} {t.footer.rights}
          </p>

          <div className="flex gap-6 text-[10px] uppercase font-bold opacity-40 tracking-wider">
            <span className="hover:text-white cursor-pointer transition-colors">
              {t.footer.privacy}
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              {t.footer.terms}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="h-6 w-9 bg-[#ffcc00] rounded flex items-center justify-center p-0.5 shadow-xs overflow-hidden"
              title="MTN MoMo"
            >
              <span className="text-[7px] font-black text-[#004f91] leading-none">
                momo
              </span>
            </div>

            <div
              className="h-6 w-9 bg-[#ff0000] rounded flex items-center justify-center p-0.5 shadow-xs overflow-hidden"
              title="Airtel Money"
            >
              <div className="flex flex-col items-center">
                <span className="text-[5px] font-bold text-white uppercase leading-none italic">
                  airtel
                </span>
                <span className="text-[5px] font-light text-white leading-none">
                  money
                </span>
              </div>
            </div>

            <div
              className="h-6 w-9 bg-[#231f20] rounded flex items-center justify-center gap-0.5 p-0.5 shadow-xs"
              title="Mastercard"
            >
              <div className="w-2.5 h-2.5 bg-[#eb001b] rounded-full opacity-90" />
              <div className="w-2.5 h-2.5 bg-[#f79e1b] rounded-full -ml-1 opacity-90" />
            </div>

            <div
              className="h-6 w-9 bg-[#1a1f71] rounded flex items-center justify-center p-0.5 shadow-xs"
              title="Visa"
            >
              <span className="text-[7px] font-black italic text-white tracking-tighter">
                VISA
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
