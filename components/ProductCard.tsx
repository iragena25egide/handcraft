"use client";

import { motion } from "framer-motion";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Product } from "@/data/product";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addItem as addCartItem } from "@/lib/store/slices/cartSlice";
import { toggleWishlist } from "@/lib/store/slices/wishlistSlice";
import toast from "react-hot-toast";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(state => state.wishlist.items);
  
  const inWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    if (inWishlist) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  const price = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;

  // Logic for dynamic pricing and badges
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-transparent"
    >
      {/* Image Container */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-[24px] bg-gray-50 border border-gray-100">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </Link>

        {/* Badges - Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-[#011137] text-white text-[10px] font-black px-2.5 py-1 rounded-full w-fit shadow-sm">
              -{discountPercent}%
            </span>
          )}
          <span className="bg-[#ccc] text-[#0f172a] text-[10px] font-black px-2.5 py-1 rounded-full w-fit shadow-sm uppercase tracking-tighter">
            Bestseller
          </span>
        </div>

        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#0f172a] hover:text-white z-10 ${inWishlist ? "text-red-500 opacity-100 translate-y-0" : "text-[#0f172a]"}`}>
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addCartItem(product));
              toast.success("Added to cart");
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-[#0f172a] cursor-pointer text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-black"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </motion.button>
        </div>
      </div>

      <div className="px-1 space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#fbbf24] text-[#fbbf24]" />
            <span className="text-xs font-black text-[#0f172a]">
              {product.rating || "4.8"}
            </span>
          </div>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="text-base font-bold text-[#0f172a] tracking-tight truncate group-hover:text-black transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-[#0f172a]">
            RWF{price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through font-medium">
              RWF{originalPrice?.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#0f172a] ring-1 ring-offset-1 ring-gray-200" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#fefce8] border border-gray-200" />
          </div>
          <p className="text-[10px] font-bold text-gray-300 uppercase italic">
            {product.artisan}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
