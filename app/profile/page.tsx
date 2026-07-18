"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearSession, removeCard, saveCard } from "@/lib/store/slices/userSlice";
import { motion } from "framer-motion";
import { Package, CreditCard, LogOut, ArrowRight, User } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, savedCard } = useAppSelector((state) => state.user);
  const cartItems = useAppSelector((state) => state.cart.items);

  const [activeTab, setActiveTab] = useState<"orders" | "payment">("orders");
  const [newCard, setNewCard] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (user?.id) {
      api.get(`/orders/user/${user.id}`)
        .then(res => setOrders(res.data))
        .catch(err => console.error("Failed to load orders", err));
    }
  }, [isLoggedIn, router, user]);

  if (!isLoggedIn || !user) return null;

  const handleLogout = () => {
    dispatch(clearSession());
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCard.length < 16) {
      toast.error("Please enter a valid 16-digit card number");
      return;
    }
    dispatch(saveCard(newCard));
    setNewCard("");
    toast.success("Payment method updated");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-[#0f172a]">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-6">{user.email}</p>
            
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 bg-[#fefce8] text-[#0f172a] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#0f172a] hover:text-white transition-all flex items-center justify-center gap-2 mb-2"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 text-red-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <div className="bg-white p-2 rounded-[24px] shadow-sm border border-gray-100 flex flex-col">
            <button
              onClick={() => setActiveTab("orders")}
              className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm transition-all ${
                activeTab === "orders" ? "bg-[#0f172a] text-white" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Package className="w-5 h-5" />
              Order History
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm transition-all ${
                activeTab === "payment" ? "bg-[#0f172a] text-white" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 min-h-[500px]"
          >
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-black text-[#0f172a] mb-8">Your Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium mb-4">You haven't placed any orders yet.</p>
                    <button onClick={() => router.push("/")} className="text-[#0f172a] font-bold underline hover:text-blue-600">
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order {order.id}</p>
                            <p className="text-sm font-medium text-[#0f172a]">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full">
                              {order.status}
                            </span>
                            <span className="text-lg font-black text-[#0f172a]">RWF {order.total.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                              <img src={item.product?.image || "/placeholder.png"} alt={item.product?.name || "Product"} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "payment" && (
              <div>
                <h2 className="text-2xl font-black text-[#0f172a] mb-8">Payment Methods</h2>
                
                {savedCard ? (
                  <div className="bg-[#0f172a] p-6 rounded-2xl text-white relative overflow-hidden max-w-sm mb-8 shadow-xl shadow-gray-200">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                    <CreditCard className="w-8 h-8 mb-6 text-gray-300" />
                    <p className="font-mono text-xl tracking-widest mb-2">**** **** **** {savedCard}</p>
                    <div className="flex justify-between items-end mt-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{user.name}</span>
                      <button 
                        onClick={() => {
                          dispatch(removeCard());
                          toast.success("Card removed");
                        }}
                        className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-dashed border-gray-300 p-8 rounded-2xl text-center max-w-sm mb-8">
                    <p className="text-gray-500 font-medium">No saved payment methods.</p>
                  </div>
                )}

                <div className="max-w-sm">
                  <h3 className="font-bold text-[#0f172a] mb-4">Add New Card</h3>
                  <form onSubmit={handleAddCard} className="space-y-4">
                    <input
                      type="text"
                      placeholder="16-digit Card Number"
                      value={newCard}
                      onChange={(e) => setNewCard(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all font-mono"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#0f172a] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
                    >
                      Save Card
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
 