"use client";

import ProductGrid from "@/components/ProductGrid";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ShopContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <main className="min-h-screen pt-4 pb-24 bg-white">
      <ProductGrid showSidebar={true} category={category || undefined} />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen pt-4 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64 shrink-0">
              <div className="w-full h-[600px] bg-gray-50 animate-pulse rounded-2xl"></div>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
        </div>
      </main>
    }>
      <ShopContent />
    </Suspense>
  );
}
 