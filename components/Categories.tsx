"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Agaseke Baskets",
    count: 48,
    description: "Traditional hand-woven peace baskets",
    image: "image/akebo.jpeg",
  },
  {
    id: 2,
    name: "Imigongo Art",
    count: 86,
    description: "Authentic geometric cow dung art",
    image: "image/imigongo.jpeg",
  },
  {
    id: 3,
    name: "Kitenge Fashion",
    count: 32,
    description: "Modern clothes in vibrant African prints",
    image: "image/2.jpeg",
  },
  {
    id: 4,
    name: "Umushanana",
    count: 64,
    description: "Elegant traditional ceremonial wear",
    image: "image/boss.jpeg",
  },
  {
    id: 5,
    name: "Wood Carvings",
    count: 28,
    description: "Hand-sculpted masks and figurines",
    image: "image/amata.jpeg",
  },
  {
    id: 6,
    name: "Handmade Pottery",
    count: 24,
    description: "Earthy ceramics inspired by tradition",
    image: "image/inyambo.jpeg",
  },
];

export default function CategoryGrid() {
  return (
    <section className="relative pt-12 pb-24 bg-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
        {/* Header - More Compact for Mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] tracking-tight">
              Shop by Category
            </h2>
            <div className="h-1 w-12 bg-[#0f172a] mt-1.5 mb-3" />
            <p className="text-sm text-gray-500 font-medium">
              Curated Rwandan craftsmanship for the modern home.
            </p>
          </div>
          <button className="text-[#0f172a] font-bold text-xs tracking-widest cursor-pointer flex items-center gap-2 hover:opacity-70 transition-opacity uppercase">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative h-[280px] md:h-[320px] rounded-2xl overflow-hidden cursor-pointer shadow-md"
            >
              {/* Category Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.1] group-hover:scale-105 transition-transform duration-700"
              />

              {/* Sophisticated Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/30 to-transparent" />

              {/* Content Container - Compact padding */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="transform transition-transform duration-500">
                  <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter mb-2">
                    {cat.count} ITEMS
                  </span>

                  <h3 className="text-xl font-bold mb-1 tracking-tight">
                    {cat.name}
                  </h3>

                  {/* Small description only visible on hover to save space */}
                  <p className="text-[11px] text-gray-300 leading-tight mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cat.description}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/90">
                    Shop Now
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] md:h-[100px] opacity-60"
        >
          {/* Main Zigzag path */}
          <path
            d="M0,120 L0,40 L60,100 L120,40 L180,100 L240,40 L300,100 L360,40 L420,100 L480,40 L540,100 L600,40 L660,100 L720,40 L780,100 L840,40 L900,100 L960,40 L1020,100 L1080,40 L1140,100 L1200,40 L1200,120 Z"
            fill="#0f172a"
          />
        </svg>
      </div>
    </section>
  );
}
