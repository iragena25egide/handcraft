"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingCart, Store } from "lucide-react";
import { Product } from "@/data/product";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addItem as addCartItem } from "@/lib/store/slices/cartSlice";
import { toggleWishlist } from "@/lib/store/slices/wishlistSlice";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const inWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleWishlist(product));
    if (inWishlist) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(addCartItem(product));
    toast.success("Added to cart");
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(addCartItem(product));
    router.push("/checkout");
  };

  const price = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
    >
      <Link href={`/product/${product.id}`} className="block flex-1 p-4">
        {/* Image Container with Imigongo Pattern */}
        <div 
          className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-white"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 relative z-10"
          />

          {/* Top Left Flag / Badge */}
          <div className="absolute top-2 left-2 flex gap-1">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center text-xs border border-gray-100">
              🇷🇼
            </div>
          </div>

          {/* Top Right Heart */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors z-10"
          >
            <Heart
              className={`w-4 h-4 ${
                inWishlist ? "fill-[#46270e] text-[#46270e]" : "text-gray-400"
              }`}
            />
          </button>

          {/* Bottom Left Quantity Tag */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 font-bold text-xs rounded-md shadow-sm">
            1
          </div>
        </div>

        {/* Product Details */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-black">
              RWF {price.toFixed(0)}
            </span>
            {hasDiscount && (
              <span className="text-sm font-bold text-red-500 line-through">
                RWF {originalPrice?.toFixed(0)}
              </span>
            )}
          </div>
          <span className="px-3 py-1 bg-[#fdf5ed] text-[#b36936] text-[10px] font-bold rounded-full truncate max-w-[100px]">
            {product.category}
          </span>
        </div>

        <h3 className="text-sm font-bold text-black mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-1">
          {product.description || `Handcrafted ${product.category} by ${product.artisan}`}
        </p>
      </Link>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={handleBuyNow}
          className="flex-1 py-2.5 px-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors"
        >
          <Store className="w-4 h-4" />
          Buy Now
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-1 py-2.5 px-2 bg-[#46270e] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#341d0a] transition-colors shadow-lg shadow-[#46270e]/20"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
