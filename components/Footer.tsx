"use client";

import { FaInstagram, FaFacebook, FaYoutube, FaTwitter } from "react-icons/fa";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0f172a] text-[#fefce8] relative pt-16 pb-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[30px] md:h-[60px] opacity-10"
        >
          <path
            d="M0,120 L0,40 L60,100 L120,40 L180,100 L240,40 L300,100 L360,40 L420,100 L480,40 L540,100 L600,40 L660,100 L720,40 L780,100 L840,40 L900,100 L960,40 L1020,100 L1080,40 L1140,100 L1200,40 L1200,120 Z"
            fill="#fefce8"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-[#fefce8]/10">
          <div className="max-w-md">
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter">
              All African Handcrafts
            </h3>
            <p className="text-sm opacity-70 mt-2">
              {t.footer.newsletterDesc}
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder={t.footer.placeholder}
              className="bg-transparent border border-[#fefce8]/20 px-6 py-3 rounded-2xl flex-grow md:w-80 outline-none focus:border-[#fefce8] transition-all text-sm"
            />
            <button className="bg-[#fefce8] text-[#0f172a] px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors">
              {t.footer.subscribe}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className="col-span-2 md:col-span-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-1.5 bg-[#fefce8] shadow-[2px_0_0_0_#0f172a]" />
                </div>

                <div className="relative h-12 w-20 flex items-end justify-center overflow-hidden bg-white/5 rounded-xl border border-[#fefce8]/10">
                  <div className="z-20 mb-1 text-[#fefce8]/40">
                    <ShoppingCart className="w-4 h-4" />
                  </div>

                  {[
                    { Icon: "🧺", d: 0 },
                    { Icon: "👕", d: 1 },
                    { Icon: "🎨", d: 2 },
                    { Icon: "🏺", d: 3 },
                  ].map((item, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: -30, opacity: 0 }}
                      animate={{
                        y: [-30, 15],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: item.d,
                        ease: "easeIn",
                      }}
                      className="absolute top-0 text-sm z-10 filter grayscale brightness-200"
                    >
                      {item.Icon}
                    </motion.span>
                  ))}
                </div>
              </div>

              <p className="text-sm opacity-60 leading-relaxed max-w-xs">
                {t.footer.description}
              </p>
            </div>
            <a 
              href="https://maps.google.com/maps?vet=10CAAQoqAOahcKEwjoy-nmn_CVAxUAAAAAHQAAAAAQDA..i&rlz=1C5CHFA_enRW1056RW1056&sca_esv=2f53b8b5415a751f&pvq=Cg0vZy8xMXl5ZGI1ZHhqIhsKFWFsbCBhZnJpY2FuIGhhbmRjcmFmdBACGAM&lqi=ChxhbGwgYWZyaWNhbiBoYW5kY3JhZnQgcndhbmRhWh4iHGFsbCBhZnJpY2FuIGhhbmRjcmFmdCByd2FuZGGSARdjb3Jwb3JhdGVfZ2lmdF9zdXBwbGllcg&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=rw&sa=X&ftid=0x19dca599234783df:0x45cdf7cb075f3657"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1 text-sm opacity-70 hover:opacity-100 transition-opacity max-w-xs cursor-pointer"
            >
              <span className="font-bold">All African Handcraft</span>
              <span>Yyussa City Plaza (Kwa Makuza)</span>
              <span>KN 48 ST, Kigali, Rwanda</span>
              <span className="text-xs opacity-70 group-hover:underline mt-1">View on Google Maps</span>
            </a>

            <div className="flex gap-4 opacity-60 mt-6">
              <FaInstagram className="w-5 h-5 cursor-pointer hover:opacity-100" />
              <FaFacebook className="w-5 h-5 cursor-pointer hover:opacity-100" />
              <FaTwitter className="w-5 h-5 cursor-pointer hover:opacity-100" />
              <FaYoutube className="w-5 h-5 cursor-pointer hover:opacity-100" />
            </div>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-6 opacity-40">
              {t.footer.shop}
            </h4>
            <ul className="space-y-4 text-sm font-medium opacity-70">
              <li className="hover:text-white cursor-pointer transition-colors">
                {t.footer.fashion}
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                {t.footer.handicraft}
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                {t.footer.bestsellers}
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                {t.footer.newArrivals}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-6 opacity-40">
              {t.footer.help}
            </h4>
            <ul className="space-y-4 text-sm font-medium opacity-70">
              <li className="hover:text-white cursor-pointer transition-colors">
                {t.footer.shippingReturns}
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                {t.footer.sizeGuide}
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                {t.footer.contactUs}
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                {t.footer.trackOrder}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-6 opacity-40">
              {t.footer.about}
            </h4>
            <ul className="space-y-4 text-sm font-medium opacity-70">
              <li className="hover:text-white cursor-pointer transition-colors">
                {t.footer.ourStory}
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                {t.footer.sustainability}
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                {t.footer.artisans}
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                {t.footer.careers}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#fefce8]/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase font-bold opacity-40 tracking-widest">
            © {currentYear} {t.footer.rights}
          </p>

          <div className="flex gap-8 text-[10px] uppercase font-bold opacity-40 tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors">
              {t.footer.privacy}
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              {t.footer.terms}
            </span>
          </div>

          <div className="flex items-center gap-3  transition-all duration-500">
            <div
              className="h-7 w-11 bg-[#ffcc00] rounded-md flex items-center justify-center p-1 shadow-sm overflow-hidden"
              title="MTN MoMo"
            >
              <span className="text-[8px] font-black text-[#004f91] leading-none">
                momo
              </span>
            </div>

            <div
              className="h-7 w-11 bg-[#ff0000] rounded-md flex items-center justify-center p-1 shadow-sm overflow-hidden"
              title="Airtel Money"
            >
              <div className="flex flex-col items-center">
                <span className="text-[6px] font-bold text-white uppercase leading-none italic">
                  airtel
                </span>
                <span className="text-[6px] font-light text-white leading-none">
                  money
                </span>
              </div>
            </div>

            <div
              className="h-7 w-11 bg-[#231f20] rounded-md flex items-center justify-center gap-0.5 p-1 shadow-sm"
              title="Mastercard"
            >
              <div className="w-3 h-3 bg-[#eb001b] rounded-full opacity-90" />
              <div className="w-3 h-3 bg-[#f79e1b] rounded-full -ml-1.5 opacity-90" />
            </div>

            <div
              className="h-7 w-11 bg-[#1a1f71] rounded-md flex items-center justify-center p-1 shadow-sm"
              title="Visa"
            >
              <span className="text-[8px] font-black italic text-white tracking-tighter">
                VISA
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 opacity-[0.03] pointer-events-none rotate-12">
        <svg viewBox="0 0 100 100" fill="#fefce8">
          <path d="M0 100 L50 0 L100 100 Z" />
        </svg>
      </div>
    </footer>
  );
}
