"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

  // Select a featured product from the database
  const featuredProduct = products.find(p => p.id === 1) || products[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center font-sans overflow-hidden rounded-b-[40px] bg-black">
      {/* Background Image Carousel */}
      <AnimatePresence mode="popLayout">
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

      {/* Dark overlays for readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 z-20 flex flex-col md:flex-row justify-between items-center gap-12">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 max-w-2xl text-white"
        >
          {/* Flags Badge */}
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full py-2 pr-6 pl-2 mb-8 shadow-xl">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-blue-600 overflow-hidden text-sm">
                🇷🇼
              </div>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              100% Authentic Rwandan Handcrafts.
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6 drop-shadow-lg">
            All African Handcraft —<br />
            Delivered to Your Doorstep!
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl font-medium text-white/90 mb-10 max-w-xl leading-relaxed drop-shadow-md">
            The premier marketplace connecting curated Rwandan and African
            artisans with buyers looking for authentic, handcrafted products.
          </p>

          {/* Call to Action */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-4 bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform group shadow-2xl"
          >
            <span className="pl-2">Explore Products</span>
            <div className="w-8 h-8 rounded-full bg-[#46270e] flex items-center justify-center text-white group-hover:rotate-[-45deg] transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

        {/* Right Floating Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:block w-full max-w-[320px]"
        >
          <Link
            href={`/product/${featuredProduct.id}`}
            className="block group relative p-6 rounded-[32px] bg-gradient-to-br from-white/20 to-black/40 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden"
          >
            {/* Glossy highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none" />

            {/* Image Box */}
            <div className="relative w-full aspect-square bg-white rounded-2xl mb-5 flex items-center justify-center shadow-inner overflow-hidden">
              {/* Featured Product Image */}
              <img
                src={featuredProduct.image.startsWith('http') ? featuredProduct.image : `/${featuredProduct.image.replace(/^\//, '')}`}
                alt={featuredProduct.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Text Content */}
            <div className="relative z-10 flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1 pr-2">
                {featuredProduct.name}
              </h3>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
            <p className="relative z-10 text-xs font-medium text-white/70 leading-relaxed line-clamp-2">
              {featuredProduct.description}
            </p>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
