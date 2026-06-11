"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { api } from "@/lib/api";
import { Search, Loader2 } from "lucide-react";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get("/products");

        const allProducts = response.data;
        const filtered = allProducts.filter(
          (p: any) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()),
        );
        setProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch search results", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <main className="min-h-screen pt-12 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-4">
          Search Results
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg flex items-center justify-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          {query ? (
            <>
              Showing results for{" "}
              <strong className="text-[#0f172a]">"{query}"</strong>
            </>
          ) : (
            "Enter a search term to find products."
          )}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-[#0f172a] animate-spin mb-4" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Searching...
          </p>
        </div>
      ) : products.length === 0 && query ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-[#0f172a] mb-2">
            No items found
          </h2>
          <p className="text-gray-500">
            We couldn't find anything matching "{query}". Try another term.
          </p>
        </div>
      ) : (
        <ProductGrid showSidebar={true} initialProducts={products} />
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
