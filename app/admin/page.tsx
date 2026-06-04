"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearSession } from "@/lib/store/slices/userSlice";
import { api } from "@/lib/api";
import { products as seedProducts } from "@/data/product";
import toast from "react-hot-toast";
import { LayoutDashboard, LogOut, TrendingUp, AlertCircle, Database, Download } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn } = useAppSelector(state => state.user);
  
  const [sales, setSales] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "SUPER_ADMIN") {
      dispatch(clearSession());
      router.push("/");
      return;
    }

    const fetchReports = async () => {
      try {
        const [salesRes, lowStockRes] = await Promise.all([
          api.get("/reports/sales"),
          api.get("/reports/low-stock")
        ]);
        setSales(salesRes.data);
        setLowStock(lowStockRes.data);
      } catch (error) {
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isLoggedIn, user, router]);

  const handleSeedDatabase = async () => {
    const toastId = toast.loading("Seeding database...");
    try {
      for (const product of seedProducts) {
        await api.post("/products", {
          name: product.name,
          description: product.description || "A beautiful handcrafted item.",
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          artisan: product.artisan,
          image: product.image,
          category: product.category,
          stockQuantity: 50
        });
      }
      toast.success("Database seeded successfully!", { id: toastId });
    } catch (error) {
      toast.error("Error seeding database", { id: toastId });
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await api.get("/reports/pdf", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `super-admin-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Report downloaded!");
    } catch (error) {
      toast.error("Failed to generate report");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">Manage the entire platform</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-100 text-green-600 rounded-full">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Revenue</p>
              <p className="text-3xl font-black text-gray-900">${sales.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Orders</p>
              <p className="text-3xl font-black text-gray-900">{sales.totalOrders}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <button
              onClick={handleSeedDatabase}
              className="w-full py-4 bg-[#0f172a] text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2"
            >
              <Database className="w-5 h-5" />
              Seed Sample Products
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">Populates DB with frontend mock data</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900">Low Stock Alerts</h2>
          </div>
          <div className="p-6">
            {lowStock.length === 0 ? (
              <p className="text-gray-500">All products are well stocked.</p>
            ) : (
              <ul className="space-y-4">
                {lowStock.map(item => (
                  <li key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <span className="font-bold text-gray-900">{item.name}</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-sm">
                      Only {item.stockQuantity} left!
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
