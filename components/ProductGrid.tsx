"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "./ProductCard";
import { api } from "@/lib/api";
import { type Product } from "@/data/product";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface ProductGridProps {
  category?: string;
  showSidebar?: boolean;
  initialProducts?: Product[];
}

type SortOption = "featured" | "price-low" | "price-high" | "top-rated" | "newest";

export default function ProductGrid({ category, showSidebar = false, initialProducts }: ProductGridProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);

  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(category ? [category.toLowerCase()] : []);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    if (!initialProducts) {
      const fetchProducts = async () => {
        try {
          const response = await api.get("/products");
          setProducts(response.data);
        } catch (error) {
          console.error("Failed to fetch products", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [initialProducts]);

  const processedProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes((p.category || "").toLowerCase()));
    }

    result = result.filter((p) => Number(p.price) >= minPrice && Number(p.price) <= maxPrice);

    switch (sortBy) {
      case "price-low":
        return result.sort((a, b) => Number(a.price) - Number(b.price));
      case "price-high":
        return result.sort((a, b) => Number(b.price) - Number(a.price));
      case "newest":
        return result.reverse(); // Mocking newest
      default:
        return result;
    }
  }, [selectedCategories, minPrice, maxPrice, sortBy, products]);

  const totalPages = Math.max(1, Math.ceil(processedProducts.length / itemsPerPage));
  const paginatedProducts = processedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <section className="py-4 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {showSidebar && (
              <aside className="w-full lg:w-[280px] flex-shrink-0 space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-100 rounded-[32px] p-6 border border-gray-100 shadow-sm animate-pulse h-40"></div>
                ))}
              </aside>
            )}
            <div className="flex-1 w-full min-w-0">
              <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-48 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-[2rem] border border-gray-100 p-4 h-[400px] animate-pulse flex flex-col gap-4">
                    <div className="w-full h-48 bg-gray-200 rounded-[1.5rem]"></div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded-full mt-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded-full"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-full mt-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const allCategories = Array.from(new Set(products.map(p => (p.category || "").toLowerCase()))).filter(Boolean);

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(1000000);
    setSortBy("featured");
    setCurrentPage(1);
  };

  return (
    <section className="py-4 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb (Only show if sidebar is shown, mimicking Shop page layout) */}
        {showSidebar && (
          <div className="mb-6 flex items-center text-sm text-gray-500 font-medium">
            <span>{t.productGrid.home}</span>
            <span className="mx-2">»</span>
            <span className="text-black font-bold">{t.productGrid.shop}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* --- SIDEBAR --- */}
          {showSidebar && (
            <aside className="w-full lg:w-[280px] flex-shrink-0 space-y-6">
              
              {/* Filter Options */}
              <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-1">{t.productGrid.filterOptions}</h2>
                <p className="text-xs text-gray-500 mb-6">{t.productGrid.chooseOptions}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                    {t.productGrid.previousSaves}
                  </button>
                  <button className="flex-1 py-2 rounded-full bg-[#faeddf] text-[#b56e39] text-xs font-bold hover:bg-[#f3dfcb] transition-colors">
                    {t.productGrid.saveSearch}
                  </button>
                </div>
              </div>

              {/* Filter By Type (Mock) */}
              <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-black">{t.productGrid.filterByType}</h3>
                  <span className="text-[#f97316] text-xs font-bold cursor-pointer">{t.productGrid.showLess}</span>
                </div>
                <div className="space-y-3">
                  {["All Deals", "Nearby", "Best African Deals", "Seasonal Discount", "Featured", "New Releases", "Trending"].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center bg-white group-hover:border-gray-400 transition-colors">
                        <div className="w-3 h-3 bg-transparent rounded-sm" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter By Category */}
              <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-black">{t.productGrid.filterByCategory}</h3>
                  <span className="text-[#f97316] text-xs font-bold cursor-pointer">{t.productGrid.seeAll}</span>
                </div>
                <div className="relative mb-4">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder={t.productGrid.searchCategory}
                    className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-[#46270e]"
                  />
                </div>
                <div className="space-y-3">
                  {allCategories.slice(0, 5).map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, cat]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== cat));
                          }
                          setCurrentPage(1);
                        }}
                        className="w-5 h-5 rounded border-gray-300 text-[#46270e] focus:ring-[#46270e]"
                      />
                      <span className="text-sm font-bold text-gray-700 capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter By Price */}
              <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-sm text-black mb-4">{t.productGrid.filterByPrice}</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 border border-gray-200 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{t.productGrid.from}</span>
                    <input 
                      type="number" 
                      value={minPrice}
                      onChange={e => { setMinPrice(Number(e.target.value)); setCurrentPage(1); }}
                      className="w-full text-sm font-bold text-gray-600 outline-none"
                    />
                  </div>
                  <div className="flex-1 border border-gray-200 rounded-2xl p-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{t.productGrid.to}</span>
                    <input 
                      type="number" 
                      value={maxPrice}
                      onChange={e => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
                      className="w-full text-sm font-bold text-gray-600 outline-none"
                    />
                  </div>
                </div>
                {/* Mock Slider */}
                <div className="relative w-full h-2 bg-gray-200 rounded-full">
                  <div className="absolute top-0 left-0 h-full w-full bg-[#46270e] rounded-full" />
                  <div className="absolute top-1/2 left-0 w-4 h-4 bg-[#46270e] rounded-full -translate-y-1/2 -translate-x-1/2 ring-4 ring-white" />
                  <div className="absolute top-1/2 right-0 w-4 h-4 bg-[#46270e] rounded-full -translate-y-1/2 translate-x-1/2 ring-4 ring-white" />
                </div>
              </div>

              {/* More Filters */}
              <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer group">
                <span className="font-bold text-sm text-black group-hover:text-[#46270e] transition-colors">{t.productGrid.moreFilters}</span>
                <span className="text-[#f97316] text-xs font-bold">{t.productGrid.seeAll}</span>
              </div>
            </aside>
          )}

          {/* --- MAIN CONTENT --- */}
          <div className="flex-1 w-full min-w-0">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h1 className="text-2xl font-black text-black">{t.productGrid.productsList}</h1>
              <button onClick={handleClearFilters} className="text-[#f97316] text-sm font-bold mt-2 sm:mt-0 hover:underline">
                {t.productGrid.clearAll}
              </button>
            </div>

            {/* Horizontal Sort Pills */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              {[
                { id: "featured", label: t.productGrid.sort.featured },
                { id: "price-low", label: t.productGrid.sort.priceLow },
                { id: "price-high", label: t.productGrid.sort.priceHigh },
                { id: "top-rated", label: t.productGrid.sort.topRated },
                { id: "newest", label: t.productGrid.sort.newest }
              ].map(sort => (
                <button
                  key={sort.id}
                  onClick={() => setSortBy(sort.id as SortOption)}
                  className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                    sortBy === sort.id 
                      ? "border-transparent bg-[#fdf5ed] text-[#b36936]" 
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-1 opacity-50">☶</span> {sort.label}
                </button>
              ))}
            </div>

            {/* Grid */}
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">{t.productGrid.noProducts}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-10">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black disabled:opacity-50 transition-colors bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(Math.min(3, totalPages))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      currentPage === i + 1 ? "bg-[#46270e] text-white" : "border border-gray-200 text-black hover:bg-gray-50 bg-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                {totalPages > 3 && (
                  <>
                    <span className="px-2 text-gray-400">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        currentPage === totalPages ? "bg-[#46270e] text-white" : "border border-gray-200 text-black hover:bg-gray-50 bg-white"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black disabled:opacity-50 transition-colors bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
