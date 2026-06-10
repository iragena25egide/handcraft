"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const baseCategories = [
  {
    id: 1,
    name: "Imyenda",
    slug: "imyenda",
    description: "Imyenda n'ibikoresho by'ubwiza (Clothing & Fashion)",
    image: "image/2.jpeg",
  },
  {
    id: 2,
    name: "Imitako",
    slug: "imitako",
    description: "Imitako n'ubugeni nyarwanda (Decorations & Art)",
    image: "image/imigongo.jpeg",
  },
  {
    id: 3,
    name: "Ibyo Mubukwe",
    slug: "ibyo mubukwe",
    description: "Agaseke n'ibindi by'ibirori (Wedding & Ceremonial)",
    image: "image/4.jpeg",
  },
  {
    id: 4,
    name: "Ibyo Murugo",
    slug: "ibyo murugo",
    description: "Ibikoresho byo mu nzu (Home Goods & Pottery)",
    image: "image/akebo.jpeg",
  },
  {
    id: 5,
    name: "Nibindi",
    slug: "nibindi",
    description: "Ibindi bikoresho gakondo (Other Traditional Items)",
    image: "image/ingoma.jpeg",
  },
];

export default function CategoryGrid() {
  const router = useRouter();
  const [categories, setCategories] = useState(baseCategories.map(c => ({ ...c, count: 0 })));

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await api.get("/products");
        const products = response.data || [];
        setCategories(baseCategories.map((cat) => {
          const count = products.filter((p: any) => p.category === cat.slug).length;
          return { ...cat, count };
        }));
      } catch (error) {
        console.error("Failed to fetch products for categories");
      }
    };
    fetchCounts();
  }, []);

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
          <button onClick={() => router.push('/shop')} className="text-[#0f172a] font-bold text-xs tracking-widest cursor-pointer flex items-center gap-2 hover:opacity-70 transition-opacity uppercase">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              onClick={() => router.push(`/shop?category=${cat.slug}`)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative h-[280px] md:h-[320px] rounded-2xl overflow-hidden cursor-pointer shadow-md"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.1] group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/30 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="transform transition-transform duration-500">
                  <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter mb-2">
                    {cat.count} ITEMS
                  </span>

                  <h3 className="text-xl font-bold mb-1 tracking-tight">
                    {cat.name}
                  </h3>

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
          <path
            d="M0,120 L0,40 L60,100 L120,40 L180,100 L240,40 L300,100 L360,40 L420,100 L480,40 L540,100 L600,40 L660,100 L720,40 L780,100 L840,40 L900,100 L960,40 L1020,100 L1080,40 L1140,100 L1200,40 L1200,120 Z"
            fill="#0f172a"
          />
        </svg>
      </div>
    </section>
  );
}
