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
import { useState } from "react";
import RequestModal from "./RequestModal";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleWishlist(product));
    if (inWishlist) {
      toast.success(t.common.success);
    } else {
      toast.success(t.common.success);
    }
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
    >
      <Link href={`/product/${generateSlug(product.name)}`} className="block flex-1 p-4">
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
        </div>

        {/* Product Details */}
        <div className="flex items-center justify-between mb-2">
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
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
          className="flex-1 py-3 px-2 bg-[#0f172a] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg shadow-[#0f172a]/20"
        >
          <Store className="w-4 h-4" />
          {t.productCard.viewDetails}
        </button>
      </div>

      <RequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product} 
      />
    </motion.div>
  );
}
