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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
 