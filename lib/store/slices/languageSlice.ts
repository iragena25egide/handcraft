import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface LanguageState {
  currentLang: string;
}

// Initial state, optionally try to read from cookies
const getInitialLang = (): string => {
  if (typeof window !== "undefined") {
    const saved = Cookies.get("app_lang");
    if (saved === 'en' || saved === 'rw') {
      return saved;
    }
  }
  return 'en'; // default
};

const initialState: LanguageState = {
  currentLang: getInitialLang(),
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLang = action.payload;
      if (typeof window !== "undefined") {
        Cookies.set("app_lang", action.payload, { expires: 365, secure: true, sameSite: 'strict' });
      }
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
