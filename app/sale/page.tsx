"use client";

import { useEffect, useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import { api } from "@/lib/api";

export default function SalePage() {
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const response = await api.get("/products?filter=sale");
        setSaleProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch sale products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSaleProducts();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen pt-12 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#0f172a] mb-4">Special Offers</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Shop handcrafted items at special prices.</p>
        </div>
        <div className="text-center py-20">Loading products...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-12 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-4">Special Offers</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Shop handcrafted items at special prices.</p>
      </div>
      {saleProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No sale items available at the moment.</div>
      ) : (
        <ProductGrid initialProducts={saleProducts} />
      )}
    </main>
  );
}
