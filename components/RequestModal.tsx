"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { Product } from "@/data/product";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function RequestModal({ isOpen, onClose, product }: RequestModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }

    setLoading(true);
    try {
      await api.post("/requests", {
        customerName: name,
        customerPhone: phone,
        productId: product.id,
        productName: product.name,
      });

      // Also trigger Click-To-Chat so you get notified on WhatsApp
      const encodedMessage = encodeURIComponent(`Hello! I'm ${name} (Phone: ${phone}). I would like to request information about this product: ${product.name}`);
      // Open in a new tab to avoid breaking the current site state
      window.open(`https://wa.me/250798555420?text=${encodedMessage}`, "_blank");

      toast.success("Request submitted successfully!");
      onClose();
      setName("");
      setPhone("");
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-[#0f172a]">Request Product</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex gap-4 p-4 bg-[#fdf5ed] dark:bg-gray-800/50 rounded-2xl mb-8 border border-[#c89f72]/20">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-xl shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-sm text-[#0f172a] dark:text-white line-clamp-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#c89f72] mt-1">Direct via WhatsApp</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wider uppercase">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-0 focus:border-[#c89f72] text-sm text-[#0f172a] dark:text-white transition-all shadow-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wider uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0788 123 456"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-0 focus:border-[#c89f72] text-sm text-[#0f172a] dark:text-white transition-all shadow-sm font-medium"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0f172a] dark:bg-[#c89f72] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-8 hover:opacity-90 transition-opacity disabled:opacity-70 shadow-lg shadow-[#0f172a]/20"
                >
                  {loading ? (
                    "Preparing..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send via WhatsApp
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
