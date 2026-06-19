"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { products } from "@/data/product";

const HERO_IMAGES = [
  "/image/2.jpeg",
  "/image/3.jpeg",
  "/image/4.jpeg",
  "/image/africa.jpeg",
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const featuredProduct = products.find(p => p.id === 1) || products[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[80vh] lg:min-h-[90vh] flex items-center font-sans overflow-hidden bg-black">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: `url('${HERO_IMAGES[currentImageIndex]}')`,
          }}
        />
      </AnimatePresence>

      {/* Shadow / Gradient Overlays for readability */}
      {/* Dark vignette effect around the edges */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-10" />
      {/* Heavy gradient from left to right so text is super clear */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
      {/* Bottom gradient for smooth transition */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 flex flex-col lg:flex-row justify-between items-center gap-12 mt-12">
        
        {/* Left Column - Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 max-w-2xl flex flex-col items-start"
        >
          {/* Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-white tracking-wide uppercase">
              100% Authentic Rwandan Handcrafts
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 font-serif drop-shadow-2xl">
            African <span className="text-[#d4a373] italic">Artistry,</span><br/>
            Delivered.
          </h1>

          {/* Subheadline */}
          <p className="text-lg lg:text-xl text-white/90 mb-10 max-w-lg leading-relaxed drop-shadow-lg font-light">
            Discover a curated marketplace of premium, handmade fashion and decor directly from Rwandan artisans. Fair trade, sustainable, and undeniably beautiful.
          </p>

          {/* Call to Action Group */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 w-full sm:w-auto">
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-2xl w-full sm:w-auto"
            >
              <span className="relative z-10">Shop the Collection</span>
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-black group-hover:rotate-[-45deg] transition-transform">
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
            
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-white/80 drop-shadow-md">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span>Secure Checkout</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/20 w-full">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-700 overflow-hidden shadow-lg">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Customer" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-black bg-[#d4a373] flex items-center justify-center text-xs font-bold text-black z-10 shadow-lg">
                5k+
              </div>
            </div>
            <div className="flex flex-col drop-shadow-md">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-sm font-medium text-white/90 mt-1">
                Trusted by artisans & buyers
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Floating Card (Featured Product) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block w-full max-w-sm"
        >
          <Link
            href={`/product/${featuredProduct.id}`}
            className="block group relative p-6 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-500"
          >
            {/* Glossy highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />

            {/* Image Box */}
            <div className="relative w-full aspect-[4/5] bg-black/20 rounded-2xl mb-6 overflow-hidden shadow-inner">
              <img
                src={featuredProduct.image.startsWith('http') ? featuredProduct.image : `/${featuredProduct.image.replace(/^\//, '')}`}
                alt={featuredProduct.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                Featured
              </div>
            </div>

            {/* Text Content */}
            <div className="relative z-10 flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white tracking-tight line-clamp-1 pr-2">
                {featuredProduct.name}
              </h3>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:bg-[#d4a373] transition-colors">
                <ArrowRight className="w-5 h-5 text-black" />
              </div>
            </div>
            <p className="relative z-10 text-sm font-medium text-white/80 leading-relaxed line-clamp-2 mb-4">
              {featuredProduct.description}
            </p>
            <div className="text-lg font-bold text-[#d4a373]">
              ${featuredProduct.price.toFixed(2)}
            </div>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
