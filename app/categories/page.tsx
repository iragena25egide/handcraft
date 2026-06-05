import CategoryGrid from "@/components/Categories";

export default function CategoriesPage() {
  return (
    <main className="min-h-screen pt-12 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-4">Categories</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Browse our exquisite collections by category.</p>
      </div>
      <CategoryGrid />
    </main>
  );
}
