"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearSession } from "@/lib/store/slices/userSlice";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Store, LogOut, PackagePlus, Trash2, Edit, Download } from "lucide-react";
import { type Product } from "@/data/product";

export default function SellerDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn } = useAppSelector(state => state.user);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "imyenda",
    artisan: user?.name || "Local Artisan",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80",
    stockQuantity: "10"
  });
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [filterStatus, setFilterStatus] = useState("active");
  const [sortBy, setSortBy] = useState("newest");

  const fetchMyProducts = async () => {
    if (user?.id) {
      try {
        const res = await api.get(`/products/seller/${user.id}?status=${filterStatus}`);
        setMyProducts(res.data);
      } catch (err) {
        console.error("Failed to load products");
      }
    }
  };

  useEffect(() => {
    if (!isLoggedIn || (user?.role !== "SELLER" && user?.role !== "SUPER_ADMIN")) {
      router.push("/");
    } else {
      fetchMyProducts();
    }
  }, [isLoggedIn, user, router, filterStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/products", {
        ...formData,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity)
      });
      toast.success("Product added successfully!");
      setFormData({ ...formData, name: "", description: "", price: "" }); // Reset some fields
      fetchMyProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted");
        setMyProducts(myProducts.filter(p => p.id !== id));
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await api.get("/reports/pdf", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `seller-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Report downloaded!");
    } catch (error) {
      toast.error("Failed to generate report");
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Seller Dashboard</h1>
              <p className="text-gray-500 text-sm">Manage your artisan store</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white hover:bg-black rounded-lg font-bold transition"
            >
              <Download className="w-4 h-4" /> Download Report
            </button>
            <button
              onClick={() => { dispatch(clearSession()); router.push("/"); }}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-bold transition"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
            <PackagePlus className="w-5 h-5 text-[#0f172a]" />
            <h2 className="text-lg font-bold text-gray-900">Add New Product (Stock In)</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172a] outline-none"
                    placeholder="e.g. Woven Basket"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172a] outline-none"
                    placeholder="45.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172a] outline-none"
                  >
                    <option value="imyenda">Imyenda</option>
                    <option value="imitako">Imitako</option>
                    <option value="ibyo mubukwe">Ibyo mubukwe</option>
                    <option value="ibyo murugo">Ibyo murugo</option>
                    <option value="nibindi">Nibindi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Initial Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.stockQuantity}
                    onChange={e => setFormData({...formData, stockQuantity: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172a] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172a] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172a] outline-none"
                    placeholder="Describe the handcrafted item..."
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 w-full py-4 bg-[#0f172a] text-white font-bold rounded-xl shadow-lg hover:bg-black transition"
              >
                Publish Product
              </button>
            </form>
          </div>
        </div>

        {/* My Products List */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-[#0f172a]" />
              <h2 className="text-lg font-bold text-gray-900">My Products</h2>
            </div>
            <div className="flex items-center gap-4">
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0f172a]" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="trash">In Trash</option>
                <option value="all">All Products</option>
              </select>
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0f172a]" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="stock_asc">Stock (Low to High)</option>
                <option value="stock_desc">Stock (High to Low)</option>
              </select>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {(() => {
              let sorted = [...myProducts];
              switch (sortBy) {
                case "price_asc": sorted.sort((a, b) => a.price - b.price); break;
                case "price_desc": sorted.sort((a, b) => b.price - a.price); break;
                case "stock_asc": sorted.sort((a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0)); break;
                case "stock_desc": sorted.sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0)); break;
              }
              
              if (sorted.length === 0) {
                return <p className="p-6 text-gray-500 text-center">No products found.</p>;
              }
              
              return sorted.map((product: any) => (
                <div key={product.id} className={`p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 hover:bg-gray-50 transition ${product.deletedAt ? 'opacity-60' : ''}`}>
                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={product.image?.startsWith("http") || product.image?.startsWith("blob:") ? product.image : `http://localhost:5000${product.image}`} alt={product.name} className={`w-full h-full object-cover ${product.deletedAt ? 'grayscale' : ''}`} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className={`font-bold text-gray-900 ${product.deletedAt ? 'line-through text-gray-500' : ''}`}>{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category} • Stock: {product.stockQuantity ?? 0}</p>
                    {product.deletedAt && <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] uppercase font-bold rounded">Trashed</span>}
                  </div>
                  <div className="font-bold text-gray-900 px-4">
                    RWF {product.price.toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    {product.deletedAt ? (
                      <button 
                        onClick={async () => {
                          try {
                            await api.post(`/products/${product.id}/restore`);
                            toast.success("Product restored");
                            fetchMyProducts();
                          } catch { toast.error("Failed to restore product"); }
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg text-sm font-bold transition"
                      >
                        Restore
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
