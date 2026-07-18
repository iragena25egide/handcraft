"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { type Product } from "@/data/product";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addItem as addCartItem } from "@/lib/store/slices/cartSlice";
import { toggleWishlist } from "@/lib/store/slices/wishlistSlice";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const productId = Number(params?.id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-[#0f172a] mb-4">
          Product Not Found
        </h1>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-sm"
        >
          Return Home
        </button>
      </div>
    );
  }

  const inWishlist = wishlistItems.some((item) => item.id === product.id);
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addCartItem(product));
    }
    toast.success(`${quantity}x ${product.name} added to cart`);
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
    if (inWishlist) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb / Top Bar */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-[#0f172a] transition-colors font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 relative group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <button
                onClick={handleToggleWishlist}
                className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-[#0f172a] hover:bg-[#0f172a] hover:text-white transition-all duration-300"
              >
                <Heart
                  className={`w-5 h-5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`}
                />
              </button>
            </motion.div>
          </div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col py-4"
          >
            <div className="mb-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] tracking-tight mt-4 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-bold text-yellow-700">
                  {product.rating || "4.8"}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-400">
                By <strong className="text-[#0f172a]">{product.artisan}</strong>
              </span>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-black text-[#0f172a]">
                RWF {product.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through font-medium mb-1">
                  RWF {product.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-500 leading-relaxed mb-10 text-lg">
              {product.description}
            </p>

            <div className="border-t border-gray-100 pt-8 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl p-2 w-full sm:w-40">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-400 hover:text-[#0f172a] hover:bg-white rounded-xl transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-[#0f172a] text-lg w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-400 hover:text-[#0f172a] hover:bg-white rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#0f172a] text-white py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-[#0f172a]/20 hover:bg-black transition-all duration-300 group active:scale-[0.98]"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-50 rounded-[32px] p-6 border border-gray-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-[#0f172a]" />
                <span className="text-xs font-bold text-gray-600">
                  Free Delivery
                  <br />
                  in Kigali
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="w-6 h-6 text-[#0f172a]" />
                <span className="text-xs font-bold text-gray-600">
                  Authentic
                  <br />
                  Handcrafted
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="w-6 h-6 text-[#0f172a]" />
                <span className="text-xs font-bold text-gray-600">
                  7-Day
                  <br />
                  Returns
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
 