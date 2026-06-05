"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { removeWishlistItem, clearWishlist } from "@/lib/store/slices/wishlistSlice";
import { addItem as addCartItem } from "@/lib/store/slices/cartSlice";
import { Trash2, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const wishlistItems = useAppSelector(state => state.wishlist.items);
  const dispatch = useAppDispatch();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6 text-center bg-gray-50">
        <div className="w-24 h-24 bg-white shadow-xl shadow-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-100">
          <Heart className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Save your favorite handcrafted items here to review them later.</p>
        <Link href="/shop" className="px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold hover:bg-black transition-colors shadow-lg">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh]">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">My Wishlist</h1>
          <p className="text-gray-500 mt-2">{wishlistItems.length} items saved</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              wishlistItems.forEach(item => dispatch(addCartItem(item)));
              dispatch(clearWishlist());
              toast.success("All items moved to bag!");
            }}
            className="text-sm font-bold text-[#0f172a] bg-[#fefce8] px-4 py-2 rounded-xl hover:bg-[#0f172a] hover:text-white transition-colors"
          >
            Move All to Cart
          </button>
          <button 
            onClick={() => { dispatch(clearWishlist()); toast.success("Wishlist cleared"); }}
            className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors uppercase tracking-widest px-4 py-2"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {wishlistItems.map((item) => (
          <div key={item.id} className="group flex flex-col bg-white border border-gray-100 rounded-[24px] overflow-hidden hover:shadow-xl transition-all">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Link href={`/product/${item.id}`}>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
              <button 
                onClick={() => dispatch(removeWishlistItem(item.id))}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{item.category}</p>
                <Link href={`/product/${item.id}`}>
                  <h3 className="font-bold text-[#0f172a] text-lg mb-2 truncate hover:text-gray-600 transition-colors">{item.name}</h3>
                </Link>
                <p className="text-xl font-black text-[#0f172a] mb-4">RWF {item.price.toLocaleString()}</p>
              </div>
              
              <button 
                onClick={() => {
                  dispatch(addCartItem(item));
                  dispatch(removeWishlistItem(item.id));
                  toast.success("Moved to cart!");
                }}
                className="w-full py-3 bg-[#0f172a] text-white rounded-xl font-bold text-xs uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-black transition-colors"
              >
                Add to Cart <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
