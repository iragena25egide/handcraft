"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Simulate loading time for the preloader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds total loading time

    return () => clearTimeout(timer);
  }, []);

  const text = "All African Handcraft";
  const typingVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.5,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f172a] shadow-2xl overflow-hidden"
        >
          <motion.div
            exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(5px)", transition: { duration: 0.4, ease: "easeOut" } }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="w-24 h-24 md:w-40 md:h-40 mb-6 drop-shadow-2xl"
            >
              {/* Using invert and brightness-0 to make the black logo pure white */}
              <img src="/logo_mark.png" alt="Logo" className="w-full h-full object-contain invert brightness-0" />
            </motion.div>
            
            <motion.h1
              variants={typingVariants}
              initial="hidden"
              animate="visible"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#c89f72] flex flex-wrap justify-center text-center px-4"
              style={{ fontFamily: '"Edu VIC WA NT Hand", cursive', gap: '0.1em' }}
            >
              {text.split("").map((char, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
