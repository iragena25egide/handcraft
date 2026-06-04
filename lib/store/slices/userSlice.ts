import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  savedCard: string | null;
}

// Initial state, optionally try to read user from localStorage (since token is in cookie)
const loadUserFromStorage = (): User | null => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("user_info");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

const initialUser = loadUserFromStorage();
const hasToken = typeof window !== "undefined" ? !!Cookies.get("token") : false;

const initialState: UserState = {
  isLoggedIn: hasToken && !!initialUser,
  user: initialUser,
  savedCard: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<{ user: User, token: string }>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      
      // Save Token to Cookies (Expires in 7 days)
      Cookies.set("token", action.payload.token, { expires: 7, secure: true, sameSite: 'strict' });
      
      // Save User metadata to localStorage for instant hydration on reload
      if (typeof window !== "undefined") {
        localStorage.setItem("user_info", JSON.stringify(action.payload.user));
      }
    },
    clearSession: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      Cookies.remove("token");
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_info");
      }
    },
    saveCard: (state, action: PayloadAction<string>) => {
      state.savedCard = action.payload.slice(-4);
    },
    removeCard: (state) => {
      state.savedCard = null;
    }
  },
});

export const { setSession, clearSession, saveCard, removeCard } = userSlice.actions;
export default userSlice.reducer;
