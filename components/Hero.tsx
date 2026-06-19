"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { products } from "@/data/product";

const HERO_IMAGES = [
  "/image/2.jpeg",
  "/image/3.jpeg",
  "/image/4.jpeg",
  "/image/africa.jpeg",
];

export default function Hero() {
  const featuredProduct = products.find(p => p.id === 1) || products[0];

  return (
    <section className="relative w-full pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#faf8f5] dark:bg-gray-950 transition-colors duration-300">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-[#e6ddd4] dark:bg-gray-900 rounded-full blur-[120px] opacity-60 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-[#f0e6da] dark:bg-gray-800 rounded-full blur-[100px] opacity-50 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            {/* Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 tracking-wide uppercase">
                100% Authentic Rwandan Handcrafts
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-6 font-serif">
              African{" "}
              <motion.span 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="inline-block w-16 md:w-24 lg:w-32 h-10 md:h-14 lg:h-16 rounded-full overflow-hidden align-middle mx-1 lg:mx-2 border-[3px] border-white dark:border-gray-800 shadow-lg"
              >
                <img src={HERO_IMAGES[3]} alt="Artistry" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </motion.span>{" "}
              <span className="text-[#8b5a2b] dark:text-[#d4a373] italic">Artistry,</span><br/>
              Delivered.
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-lg leading-relaxed">
              Discover a curated marketplace of premium, handmade fashion and decor directly from Rwandan artisans. Fair trade, sustainable, and undeniably beautiful.
            </p>

            {/* Call to Action Group */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 w-full sm:w-auto">
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center gap-3 bg-[#2c1e16] dark:bg-[#e6ccb2] text-white dark:text-[#2c1e16] px-8 py-4 rounded-full font-bold overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-xl w-full sm:w-auto"
              >
                <span className="relative z-10">Shop the Collection</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#4a3325] to-[#2c1e16] dark:from-[#f0d8c0] dark:to-[#e6ccb2] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>Secure Checkout</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-800 w-full">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-950 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Customer" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-950 bg-[#8b5a2b] flex items-center justify-center text-xs font-bold text-white z-10">
                  5k+
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                  Trusted by artisans & buyers
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Image Collage */}
          <div className="relative h-[600px] w-full hidden lg:block">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute top-[10%] left-[0%] w-64 h-80 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 z-20"
            >
              <img src={HERO_IMAGES[0]} alt="Handcraft" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="absolute top-[25%] right-[5%] w-72 h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 z-10"
            >
              <img src={HERO_IMAGES[1]} alt="Fashion" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: -6 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute bottom-[5%] left-[20%] w-56 h-64 rounded-[1.5rem] overflow-hidden shadow-xl border-4 border-white dark:border-gray-800 z-30"
            >
              <img src={HERO_IMAGES[2]} alt="Decor" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </motion.div>
            
            {/* Featured Product Floating Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute bottom-[15%] -right-[5%] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/40 dark:border-gray-700/50 z-40 flex items-center gap-4 max-w-[260px]"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={featuredProduct.image.startsWith('http') ? featuredProduct.image : `/${featuredProduct.image.replace(/^\//, '')}`} 
                  alt={featuredProduct.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Featured</p>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{featuredProduct.name}</h3>
                <p className="text-sm font-semibold text-[#8b5a2b] dark:text-[#d4a373] mt-1">${featuredProduct.price.toFixed(2)}</p>
              </div>
            </motion.div>
          </div>
          
          {/* Mobile Image (Visible only on small screens) */}
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="block lg:hidden w-full h-[400px] mt-8 rounded-[2rem] overflow-hidden shadow-2xl"
          >
             <img src={HERO_IMAGES[0]} alt="African Handcraft" className="w-full h-full object-cover" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
