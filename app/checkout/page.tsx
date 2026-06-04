"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearCart } from "@/lib/store/slices/cartSlice";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { isLoggedIn, savedCard } = useAppSelector((state) => state.user);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartShipping = cartItems.length > 0 ? 5000 : 0;
  const cartTotal = cartSubtotal + cartShipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        guestName: `${formData.firstName} ${formData.lastName}`,
        guestPhone: formData.phone
      };

      await api.post("/orders", orderData);
      
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      router.push("/checkout/success");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process order. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#0f172a] hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-sm">Return to Shop</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some beautiful handcrafted items before checking out.</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Section */}
            <div className="lg:col-span-7 space-y-8">
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleCheckout} 
                className="space-y-8"
              >
                {/* Shipping Details */}
                <section className="bg-white p-6 sm:p-8 rounded-[32px] shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0f172a]">Shipping Details</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">First Name</label>
                      <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Last Name</label>
                      <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all" />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all" />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="e.g. +250 788 000 000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all" />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Street Address</label>
                      <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">City</label>
                      <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Zip Code</label>
                      <input required type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all" />
                    </div>
                  </div>
                </section>

                {/* Payment Information */}
                <section className="bg-white p-6 sm:p-8 rounded-[32px] shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0f172a]">Payment Method</h2>
                  </div>

                  <div className="space-y-5">
                    {savedCard && (
                      <div className="p-4 border-2 border-green-500 rounded-xl bg-green-50 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-bold text-green-800">Saved Card (ending in {savedCard})</p>
                            <p className="text-xs text-green-600">Clicking Pay will use this card</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Card Number</label>
                      <input required type="text" placeholder="0000 0000 0000 0000" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Expiry Date</label>
                        <input required type="text" placeholder="MM/YY" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all font-mono" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">CVV</label>
                        <input required type="text" placeholder="123" name="cvv" value={formData.cvv} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all font-mono" />
                      </div>
                    </div>
                  </div>
                </section>

                <button 
                  type="submit"
                  className="w-full py-5 bg-[#0f172a] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-[#0f172a]/20 hover:bg-black transition-all duration-300 group active:scale-[0.98]"
                >
                  Pay RWF {cartTotal.toLocaleString()}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 sm:p-8 rounded-[32px] shadow-lg shadow-gray-200/50 border border-gray-100 sticky top-24"
              >
                <h2 className="text-xl font-bold text-[#0f172a] mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#0f172a] text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-[#0f172a]">
                        RWF {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-gray-100 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="text-[#0f172a] font-bold">RWF {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Shipping</span>
                    <span className="text-[#0f172a] font-bold">RWF {cartShipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-lg font-black text-[#0f172a] uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-black text-[#0f172a]">RWF {cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
