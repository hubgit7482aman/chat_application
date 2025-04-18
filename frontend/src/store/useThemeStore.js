// store the theme in the local storage, so that everytime we referesh the page we still have the theme
import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee",   // get the theme from the local storage if it is null then set it to coffee
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    },
  }));

