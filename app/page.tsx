"use client";

import CategoryGrid from "@/components/Categories";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />

      {/* Fashion Section */}
      <section id="fashion" className=" bg-white">
        <CategoryGrid />
      </section>

      {/* Handicraft Section */}
      <section id="handicraft" className=" bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          ></motion.div>

          <ProductGrid category="handicraft" />
        </div>
      </section>

      <section id="bestsellers" className=" bg-white">
        <Footer />
      </section>
    </main>
  );
}
