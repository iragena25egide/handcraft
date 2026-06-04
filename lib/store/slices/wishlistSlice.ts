import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Product } from '@/data/product';

interface WishlistState {
  items: Product[];
}

const loadWishlistFromStorage = (): Product[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("wishlist_storage");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
  }
  return [];
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

const syncToStorage = (items: Product[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("wishlist_storage", JSON.stringify(items));
  }
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
      syncToStorage(state.items);
    },
    removeWishlistItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      syncToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      syncToStorage(state.items);
    }
  },
});

export const { toggleWishlist, removeWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
