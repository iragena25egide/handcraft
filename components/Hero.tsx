"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Maintains the premium slow-motion feel
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <section className="relative bg-white min-h-[530px] flex items-center overflow-hidden font-sans">
      {/* NEW: Left Side Decorative Wave (Behind Text) */}
      <div className="absolute left-0 top-1/4 w-1/3 h-2/3 pointer-events-none opacity-80 z-0">
        <svg
          viewBox="0 0 500 800"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,200 100,400 250,600 C350,750 200,800 0,800 Z"
            fill="#fefce8"
          />
        </svg>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 z-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-20"
          >
            {/* Buttons - Matching Screenshot 2026-05-12 at 19.21.52.jpg */}
            <div className="flex items-center gap-4 mb-10">
              <button className="bg-[#011137] text-white px-7 py-3 rounded-2xl cursor-pointer font-medium text-sm flex items-center gap-2  transition-all">
                Start Shopping
                <span className="text-lg">
                  <ShoppingBag size={16} />
                </span>
              </button>

              {/* <button className="bg-white border border-gray-200 text-gray-700 px-7 py-3 rounded-full font-medium text-sm hover:bg-gray-50 transition-all">
                Watch demo
              </button> */}
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-4xl font-bold text-[#011137] leading-[1.1] tracking-tight mb-8">
              All African Handcrafts.with us.
            </h1>
          </motion.div>

          <div className="relative h-[300px] md:h-[500px] w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 md:-right-20 w-[100%] md:w-[130%] h-full pointer-events-none"
            >
              {/* Mask to blend video into the white background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent z-10" />

              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover grayscale-[0.1]"
              >
                <source src="image/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute mt-20 bottom-0 left-0 w-full overflow-hidden leading-[0] z-10">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[150px] md:h-[200px]"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="#0f172a"
            opacity="0.05"
          ></path>

          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V0c63.59,3.07,131,23.17,194.67,41.17,50.13,14.17,102.83,26.5,156.72,21.34V56.44Z"
            fill="#fefce8"
            opacity="0.8"
          ></path>
        </svg>
      </div>
    </section>
  );
}
