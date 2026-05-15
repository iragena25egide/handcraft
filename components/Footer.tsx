"use client";

import { FaInstagram, FaFacebook, FaYoutube, FaTwitter } from "react-icons/fa";
import { ShoppingCart } from "lucide-react";

import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-[#fefce8] relative pt-24 pb-12 overflow-hidden">
      {/* BIG IMIGONGO ZIGZAG DIVIDER - Top of Footer */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] md:h-[100px] opacity-10"
        >
          <path
            d="M0,120 L0,40 L60,100 L120,40 L180,100 L240,40 L300,100 L360,40 L420,100 L480,40 L540,100 L600,40 L660,100 L720,40 L780,100 L840,40 L900,100 L960,40 L1020,100 L1080,40 L1140,100 L1200,40 L1200,120 Z"
            fill="#fefce8"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* TOP SECTION: Newsletter - Inspired by Screenshot 2026-05-13 at 01.00.42.png */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-16 border-b border-[#fefce8]/10">
          <div className="max-w-md">
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter">
              All African Handcrafts
            </h3>
            <p className="text-sm opacity-70 mt-2">
              Get 15% off your first order, plus early access to new handicraft
              drops.
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent border border-[#fefce8]/20 px-6 py-3 rounded-2xl flex-grow md:w-80 outline-none focus:border-[#fefce8] transition-all text-sm"
            />
            <button className="bg-[#fefce8] text-[#0f172a] px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16">
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className="col-span-2 md:col-span-1 space-y-6">
              {/* LOGO & ANIMATED FLOW */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-1.5 bg-[#fefce8] shadow-[2px_0_0_0_#0f172a]" />
                </div>

                <div className="relative h-12 w-20 flex items-end justify-center overflow-hidden bg-white/5 rounded-xl border border-[#fefce8]/10">
                  {/* Target Cart */}
                  <div className="z-20 mb-1 text-[#fefce8]/40">
                    <ShoppingCart className="w-4 h-4" />
                  </div>

                  {/* Vertical Flowing Icons (Faster, subtle version for footer) */}
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
                Premium handicrafts and fashion from the heart of Rwanda. Every
                piece tells a story of heritage and mastery.
              </p>
            </div>
            <p className="text-sm opacity-60 leading-relaxed max-w-xs">
              Premium handicrafts and fashion from the heart of Rwanda. Every
              piece tells a story of heritage and mastery.
            </p>
            <div className="flex gap-4 opacity-60">
              <FaInstagram className="w-5 h-5 cursor-pointer hover:opacity-100" />
              <FaFacebook className="w-5 h-5 cursor-pointer hover:opacity-100" />
              <FaTwitter className="w-5 h-5 cursor-pointer hover:opacity-100" />
              <FaYoutube className="w-5 h-5 cursor-pointer hover:opacity-100" />
            </div>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-6 opacity-40">
              Shop
            </h4>
            <ul className="space-y-4 text-sm font-medium opacity-70">
              <li className="hover:text-white cursor-pointer transition-colors">
                Fashion
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Handicraft
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Bestsellers
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                New Arrivals
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-6 opacity-40">
              Help
            </h4>
            <ul className="space-y-4 text-sm font-medium opacity-70">
              <li className="hover:text-white cursor-pointer transition-colors">
                Shipping & Returns
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Size Guide
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Contact Us
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Track Order
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-6 opacity-40">
              About
            </h4>
            <ul className="space-y-4 text-sm font-medium opacity-70">
              <li className="hover:text-white cursor-pointer transition-colors">
                Our Story
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Sustainability
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Artisans
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Careers
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION: Copyright & Legal */}
        <div className="pt-8 border-t border-[#fefce8]/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase font-bold opacity-40 tracking-widest">
            © {currentYear} All rights reserved. Made in Rwanda.
          </p>

          <div className="flex gap-8 text-[10px] uppercase font-bold opacity-40 tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Terms
            </span>
          </div>

          {/* Payment Icons Placeholder */}
          <div className="flex items-center gap-3  transition-all duration-500">
            <div
              className="h-7 w-11 bg-[#ffcc00] rounded-md flex items-center justify-center p-1 shadow-sm overflow-hidden"
              title="MTN MoMo"
            >
              <span className="text-[8px] font-black text-[#004f91] leading-none">
                momo
              </span>
            </div>
            {/* Airtel Money */}
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
            {/* Mastercard */}
            <div
              className="h-7 w-11 bg-[#231f20] rounded-md flex items-center justify-center gap-0.5 p-1 shadow-sm"
              title="Mastercard"
            >
              <div className="w-3 h-3 bg-[#eb001b] rounded-full opacity-90" />
              <div className="w-3 h-3 bg-[#f79e1b] rounded-full -ml-1.5 opacity-90" />
            </div>
            {/* Visa (Optional, added for global parity like the screenshot) */}
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

      {/* Decorative Imigongo Watermark in Background */}
      <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 opacity-[0.03] pointer-events-none rotate-12">
        <svg viewBox="0 0 100 100" fill="#fefce8">
          <path d="M0 100 L50 0 L100 100 Z" />
        </svg>
      </div>
    </footer>
  );
}
