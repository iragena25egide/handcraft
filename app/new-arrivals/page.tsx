import ProductGrid from "@/components/ProductGrid";

export default function NewArrivalsPage() {
  return (
    <main className="min-h-screen pt-12 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-4">New Arrivals</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">The latest additions to our curated collection.</p>
      </div>
      <ProductGrid />
    </main>
  );
}
