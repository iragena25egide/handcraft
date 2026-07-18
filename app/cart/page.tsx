"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { removeItem, incrementItem, decrementItem, clearCart } from "@/lib/store/slices/cartSlice";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CartPage() {
  const cartItems = useAppSelector(state => state.cart.items);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartShipping = cartItems.length > 0 ? 5000 : 0;
  const cartTotal = cartSubtotal + cartShipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6 text-center bg-gray-50">
        <div className="w-24 h-24 bg-white shadow-xl shadow-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-100">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Discover our handcrafted products.</p>
        <Link href="/shop" className="px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold hover:bg-black transition-colors shadow-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh]">
      <h1 className="text-3xl font-bold text-[#0f172a] mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="font-semibold text-gray-500">{cartItems.length} Items</span>
            <button 
              onClick={() => { dispatch(clearCart()); toast.success("Cart cleared"); }}
              className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors uppercase tracking-widest"
            >
              Clear Cart
            </button>
          </div>
          
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-6 p-4 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-gray-50 border border-gray-100" />
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold text-[#0f172a] text-lg">{item.name}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
                    </div>
                    <button 
                      onClick={() => dispatch(removeItem(item.id))}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full px-1 py-1">
                      <button onClick={() => dispatch(decrementItem(item.id))} className="p-1 hover:bg-white rounded-full transition-colors">
                        <Minus className="w-4 h-4 text-[#0f172a]" />
                      </button>
                      <span className="font-bold text-[#0f172a] w-6 text-center">{item.quantity}</span>
                      <button onClick={() => dispatch(incrementItem(item.id))} className="p-1 hover:bg-white rounded-full transition-colors">
                        <Plus className="w-4 h-4 text-[#0f172a]" />
                      </button>
                    </div>
                    <span className="font-black text-[#0f172a] text-lg">
                      RWF {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 space-y-6 sticky top-24">
            <h2 className="text-xl font-black text-[#0f172a] pb-4 border-b border-gray-200">Order Summary</h2>
            
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-[#0f172a] font-bold">RWF {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping (Rwanda)</span>
                <span className="text-[#0f172a] font-bold">RWF {cartShipping.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-black text-[#0f172a] uppercase tracking-wider text-sm">Total</span>
              <span className="font-black text-2xl text-[#0f172a]">RWF {cartTotal.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={() => router.push("/checkout")}
              className="w-full mt-6 py-4 bg-[#0f172a] text-white rounded-2xl font-black text-xs uppercase tracking-[0.25em] flex justify-center items-center gap-3 shadow-xl hover:bg-black transition-all group"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 