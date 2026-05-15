"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  ListFilter,
  ChevronDown,
  SlidersHorizontal,
  Check,
  ShoppingCart,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { products, type Product } from "@/data/product";

interface ProductGridProps {
  category?: "fashion" | "handicraft";
}

type SortOption = "default" | "price-low" | "price-high" | "category" | "name";

const SORT_LABELS: Record<SortOption, string> = {
  default: "Default Sorting",
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
  category: "Sort by Category",
  name: "Product Name (A-Z)",
};

export default function ProductGrid({ category }: ProductGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // FIX: Ensure result is initialized as the Products array, not the category string
  const processedProducts = useMemo(() => {
    const result: Product[] = category
      ? products.filter((p) => p.category === category)
      : [...products];

    switch (sortBy) {
      case "price-low":
        return result.sort((a, b) => a.price - b.price);
      case "price-high":
        return result.sort((a, b) => b.price - a.price);
      case "category":
        return result.sort((a, b) => a.category.localeCompare(b.category));
      case "name":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return result;
    }
  }, [category, sortBy]);

  // Chunking logic for Imigongo dividers
  const rows: Product[][] = [];
  for (let i = 0; i < processedProducts.length; i += 4) {
    rows.push(processedProducts.slice(i, i + 4));
  }

  return (
    <section className="relative py-4 bg-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            {/* Left accent bar */}
            <div className="h-16 w-2 bg-[#0f172a] shadow-[4px_0_0_0_#fefce8] hidden md:block" />

            {/* FIXED FLOW ANIMATION HEADER */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative h-20 w-48 flex items-end justify-center overflow-hidden bg-gray-50/50 rounded-2xl border border-gray-100"
            >
              {/* Stationary Cart Icon */}
              <div className="z-20 mb-2 text-[#0f172a]">
                <ShoppingCart className="w-8 h-8" />
              </div>

              {/* One-by-one Flowing Icons */}
              {[
                { Icon: "🧺", d: 0 },
                { Icon: "👕", d: 0.8 },
                { Icon: "🎨", d: 1.6 },
                { Icon: "🏺", d: 2.4 },
                { Icon: "📿", d: 3.2 },
                { Icon: "☕", d: 4.0 },
                { Icon: "👞", d: 4.8 },
                { Icon: "👜", d: 5.6 },
                { Icon: "🪑", d: 6.4 },
                { Icon: "🕯️", d: 7.2 },
              ].map((item, i) => (
                <motion.span
                  key={i}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{
                    y: [-50, 25],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: item.d,
                    ease: "easeIn",
                  }}
                  className="absolute top-2 text-xl z-10 filter grayscale brightness-0"
                >
                  {item.Icon}
                </motion.span>
              ))}

              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#0f172a]">
                  Shopping.
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: Custom Sort & Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-4 bg-white border border-gray-100 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#0f172a] shadow-sm hover:shadow-md transition-all cursor-pointer min-w-[240px] justify-between z-50 relative"
              >
                <span className="flex items-center gap-3">
                  <ListFilter
                    className={`w-4 h-4 transition-colors ${
                      isSortOpen ? "text-[#0f172a]" : "text-gray-300"
                    }`}
                  />
                  {SORT_LABELS[sortBy]}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-500 ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSortOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 8, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full w-full bg-white border border-gray-50 rounded-[28px] shadow-2xl p-2 z-50 overflow-hidden"
                    >
                      <div className="flex flex-col gap-1">
                        {(Object.keys(SORT_LABELS) as SortOption[]).map(
                          (option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setSortBy(option);
                                setIsSortOpen(false);
                              }}
                              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                                sortBy === option
                                  ? "bg-[#fefce8] text-[#0f172a]"
                                  : "text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {SORT_LABELS[option]}
                              {sortBy === option && (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button className="p-3.5 bg-[#0f172a] text-white rounded-2xl shadow-xl hover:bg-black transition-all cursor-pointer group">
              <SlidersHorizontal className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>

        {/* --- PRODUCT GRID ROWS --- */}
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`}>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
            >
              {row.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>

            {rowIndex < rows.length - 1 && (
              <div className="w-full overflow-hidden leading-[0] mb-20">
                <svg
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                  className="relative block w-full h-[80px] md:h-[120px] opacity-[0.08]"
                >
                  <path
                    d="M0,120 L0,40 L60,100 L120,40 L180,100 L240,40 L300,100 L360,40 L420,100 L480,40 L540,100 L600,40 L660,100 L720,40 L780,100 L840,40 L900,100 L960,40 L1020,100 L1080,40 L1140,100 L1200,40 L1200,120 Z"
                    fill="#0f172a"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
