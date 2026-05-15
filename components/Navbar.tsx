"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Heart,
  Sun,
  Moon,
  Tag,
  ChevronDown,
} from "lucide-react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useWishlistStore, useCartStore, type Product } from "@/data/store";
import { useTheme } from "./ThemeProvider";

const allProducts: Product[] = [
  {
    id: 1,
    name: "Umushanana Traditional Dress",
    price: 89.99,
    image: "image/umukenyero.jpeg",
  },
  {
    id: 2,
    name: "Kitenge Maxi Skirt",
    price: 54.99,
    image: "image/2.jpeg",
  },
  {
    id: 3,
    name: "Modern Agaseke Tote Bag",
    price: 45.99,
    image: "image/akebo.jpeg",
  },
  {
    id: 4,
    name: "Cowrie Shell Necklace",
    price: 34.99,
    image: "image/4.jpeg",
  },
  {
    id: 5,
    name: "Agaseke Peace Basket",
    price: 39.99,
    image: "image/amata.jpeg",
  },
  {
    id: 6,
    name: "Imigongo Art Panel",
    price: 75.99,
    image: "image/1.jpeg",
  },
];

const languages = [
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

// Drawer component (Unchanged)
function Drawer({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Bottom Sheet (Unchanged)
function BottomSheet({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl z-50 max-h-[80vh] overflow-y-auto"
          >
            <div className="p-4">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLang, setCurrentLang] = useState(languages[1]);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();
  const { items: wishlistItems, removeItem: removeWishlistItem } =
    useWishlistStore();
  const { items: cartItems, removeItem: removeCartItem } = useCartStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ... [Content variables like wishlistContent, cartContent, searchContent remain unchanged]

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const wishlistContent =
    wishlistItems.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-[#0f172a] font-bold uppercase tracking-widest text-xs">
          Your wishlist is empty
        </p>
        <p className="text-gray-400 text-xs mt-2 max-w-[200px]">
          Add some handcrafted pieces to your collection.
        </p>
      </div>
    ) : (
      <div className="space-y-3 p-1">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Saved Items ({wishlistItems.length})
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {wishlistItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="group relative flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl hover:border-[#0f172a]/20 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Details Section */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0f172a] truncate text-sm">
                  {item.name}
                </p>
                <p className="text-base font-black text-[#0f172a] mt-1">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => removeWishlistItem(item.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  className="p-2 bg-[#0f172a] text-white rounded-lg hover:bg-black transition-all shadow-lg shadow-gray-200"
                  title="Add to Cart"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Subtle Imigongo geometric accent on hover */}
              <div className="absolute right-0 bottom-0 w-8 h-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                <svg viewBox="0 0 100 100" fill="#0f172a">
                  <path d="M0 100 L50 0 L100 100 Z" />
                </svg>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Quick Checkout Link */}
        <button className="w-full mt-6 py-4 bg-[#fefce8] border border-[#0f172a]/5 text-[#0f172a] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#0f172a] hover:text-white transition-all duration-500">
          Move All to Bag
        </button>
      </div>
    );

  const cartContent =
    cartItems.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
        <div className="w-24 h-24 bg-white shadow-xl shadow-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-100">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <p className="text-[#0f172a] font-bold uppercase tracking-[0.2em] text-xs">
          Your bag is empty
        </p>
        <p className="text-gray-400 text-xs mt-2 max-w-[220px]">
          Discover handcrafted excellence and start adding unique pieces.
        </p>
      </div>
    ) : (
      <div className="space-y-6 p-1">
        {/* 1. CART ITEMS LIST */}
        <div className="flex items-center justify-between mb-5 px-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Your Selection ({cartItems.length} items)
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {cartItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="group relative flex items-center gap-5 p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#0f172a]/10 hover:shadow-lg hover:shadow-gray-200/40 transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Details Section */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0f172a] truncate text-base tracking-tight">
                  {item.name}
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center gap-1.5 mt-3 bg-gray-50 border border-gray-100 rounded-full w-fit p-0.5">
                  <button className="p-1.5 text-gray-400 hover:text-[#0f172a] rounded-full hover:bg-white">
                    <Minus className="w-3 h-3" />
                  </button>

                  <button className="p-1.5 text-gray-400 hover:text-[#0f172a] rounded-full hover:bg-white">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Price & Remove Section */}
              <div className="flex flex-col items-end gap-5">
                <button
                  onClick={() => removeCartItem(item.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 2. ORDER SUMMARY */}
        <div className="mt-10 p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Subtotal</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Shipping (Rwanda)</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-base font-black text-[#0f172a] uppercase tracking-wider">
              Total
            </span>
          </div>
        </div>

        {/* 3. CHECKOUT BUTTON */}
        <button className="w-full mt-6 py-4.5 bg-[#0f172a] text-white rounded-2xl font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-xl shadow-[#0f172a]/20 hover:bg-black transition-all duration-300 group active:scale-[0.98]">
          Proceed to Checkout
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    );

  const searchContent = (
    <div className="flex flex-col h-full max-h-[70vh]">
      {/* 1. SEARCH INPUT CONTAINER */}
      <div className="relative group px-1">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f172a] transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search for handicraft, fashion..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-5 bg-gray-50 border-none rounded-[20px] text-sm font-medium focus:ring-2 focus:ring-[#0f172a]/5 focus:bg-white transition-all outline-none text-[#0f172a] placeholder:text-gray-400 shadow-inner"
          autoFocus
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* 2. RESULTS AREA */}
      <div className="mt-6 flex-1 overflow-y-auto px-1 custom-scrollbar">
        <AnimatePresence mode="wait">
          {searchQuery === "" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <div className="flex flex-wrap justify-center gap-2">
                {["Imigongo", "Agaseke", "Kitenge", "Coffee"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-[#0f172a] hover:border-[#0f172a] hover:shadow-sm transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <p className="text-[#0f172a] font-bold uppercase tracking-widest text-xs">
                No matches found
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Try searching for broader terms like
              </p>
            </motion.div>
          ) : (
            /* RESULTS LIST */
            <div className="space-y-2 pb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-2">
                Results for {searchQuery}
              </p>
              {filteredProducts.map((product, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={product.id}
                  className="group flex items-center gap-4 p-3 hover:bg-[#fefce8]/50 rounded-2xl cursor-pointer border border-transparent hover:border-[#fefce8] transition-all"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#0f172a] text-sm group-hover:text-black transition-colors">
                      {product.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-[#0f172a] text-sm">
                      ${product.price}
                    </span>
                    <div className="p-2 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                      <ArrowRight className="w-4 h-4 text-[#0f172a]" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#0f172a] text-white text-[10px] py-1.5 px-4 text-center tracking-widest uppercase font-semibold relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Tag className="w-3 h-3" />
          <span>
            Free shipping on orders over $75 | Use code{" "}
            <strong>MADE IN RWANDA</strong> for 20% off
          </span>
        </div>
      </div>

      {/* Main Navbar – Enhanced Glass Effect */}
      <nav className="sticky top-0 z-40 w-full transition-all duration-300   bg-white/70 backdrop-blur-xl dark:bg-gray-950/70 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo + Name */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#0f172a] rounded-md flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">RC</span>
              </div>
              <h1 className="text-lg font-bold text-[#0f172a] dark:text-white tracking-tight">
                All African Handcraft
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {["Shop", "Categories", "New Arrivals", "Sale", "About"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-[#0f172a]/70 dark:text-gray-400 hover:text-[#0f172a] dark:hover:text-white transition-colors text-sm font-semibold tracking-tight"
                  >
                    {item}
                  </a>
                )
              )}
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-[#0f172a] dark:text-gray-200 hover:opacity-60 transition-opacity"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsWishlistOpen(true)}
                  className="relative text-[#0f172a] dark:text-gray-200 hover:opacity-60 transition-opacity"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#0f172a] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center border border-white font-bold">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative text-[#0f172a] dark:text-gray-200 hover:opacity-60 transition-opacity"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#0f172a] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center border border-white font-bold">
                      {cartItems.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={toggleTheme}
                  className="text-gray-400 hover:text-[#0f172a] transition-colors"
                >
                  {theme === "light" ? (
                    <Moon className="w-4.5 h-4.5" />
                  ) : (
                    <Sun className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>

              {/* Language Selector */}
              <div className="relative hidden md:block" ref={langDropdownRef}>
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-1.5 text-[#0f172a] dark:text-gray-200 hover:opacity-70 text-xs font-bold"
                >
                  <span>{currentLang.code.toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-36 bg-white/90 backdrop-blur-xl dark:bg-gray-800/90 rounded-lg shadow-xl z-50 border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setCurrentLang(lang);
                            setIsLangOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-[#0f172a] hover:text-white transition-colors text-sm"
                        >
                          <span className="text-sm">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden text-[#0f172a] dark:text-gray-200"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <BottomSheet isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <div className="flex flex-col space-y-4 py-2">
          {["Shop", "Categories", "New Arrivals", "Sale", "About"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-[#0f172a] dark:text-white text-lg font-bold py-2 border-b border-gray-100 dark:border-gray-800"
              >
                {item}
              </a>
            )
          )}
          {/* Language selector inside bottom sheet */}
          <div className="pt-2">
            <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-widest">
              Language
            </p>
            <div className="flex gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold ${
                    currentLang.code === lang.code
                      ? "bg-[#0f172a] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </BottomSheet>

      <Drawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title="Shopping Cart"
      >
        {cartContent}
      </Drawer>
      <Drawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        title="My Wishlist"
      >
        {wishlistContent}
      </Drawer>
      <Drawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Search Products"
      >
        {searchContent}
      </Drawer>
    </>
  );
}
