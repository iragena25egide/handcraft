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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col bg-white border border-gray-100 rounded-[24px] overflow-hidden">
                <div className="relative aspect-[4/5] bg-gray-100 animate-pulse"></div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="w-16 h-3 bg-gray-100 rounded animate-pulse"></div>
                  <div className="w-3/4 h-5 bg-gray-100 rounded animate-pulse"></div>
                  <div className="w-1/3 h-6 bg-gray-100 rounded animate-pulse"></div>
                  <div className="w-full h-10 bg-gray-100 rounded-xl animate-pulse mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
 