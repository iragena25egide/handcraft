"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function CheckoutSuccessPage() {
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Generate a random order number
    setOrderNumber(`RC-${Math.floor(100000 + Math.random() * 900000)}`);
    
    // Fire confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#0f172a", "#fefce8", "#fbbf24"]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#0f172a", "#fefce8", "#fbbf24"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 p-10 text-center border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-[#0f172a]" />
        
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
        </div>

        <h1 className="text-3xl font-black text-[#0f172a] mb-4 tracking-tight">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Thank you for your purchase. We're getting your handcrafted items ready for delivery.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
          <p className="text-xl font-mono font-bold text-[#0f172a]">{orderNumber}</p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="w-full py-4.5 bg-[#0f172a] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-[#0f172a]/20 hover:bg-black transition-all duration-300 group"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
