"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { parseCookies, destroyCookie } from "nookies";

interface AuthState {
  isAdmin: boolean;
  userId: string | null;
  googleId: string | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  reset: () => void;
  logout: () => void;
  initializeFromCookies: () => void;
  setInitialState: (initialState: {
    isAdmin: boolean;
    userId: string | null;
    googleId: string | null;
  }) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      isAdmin: false,
      userId: null,
      googleId: null,
      isLoading: false,
      error: null,
      isHydrated: false,

      
      reset: () =>
        set({
          isAdmin: false,
          userId: null,
          googleId: null,
          isLoading: false,
          error: null,
          isHydrated: false,
        }),

      /** Logout and clear cookies */
      logout: () => {
        destroyCookie(null, "isAdmin");
        destroyCookie(null, "userId");
        destroyCookie(null, "googleId");
        destroyCookie(null, "token");
        set({
          isAdmin: false,
          userId: null,
          googleId: null,
          error: null,
          isHydrated: true, 
        });
      },

   
      initializeFromCookies: () => {
        // Early return if already hydrated
        if (get().isHydrated) return;

        try {
          const cookies = parseCookies();

          set({
            isAdmin: cookies.isAdmin === "true",
            userId: cookies.userId || null,
            googleId: cookies.googleId || null,
            isHydrated: true,
          });
        } catch (error) {
          console.error("Failed to parse cookies:", error);

          set({ isHydrated: true });
        }
      },

    
      setInitialState: (initialState) => {
        set({
          isAdmin: initialState.isAdmin,
          userId: initialState.userId,
          googleId: initialState.googleId,
          isHydrated: true,
        });
      },
    }),
    { name: "authStore" }
  )
);


if (typeof window !== "undefined") {

  setTimeout(() => {
    const state = useAuthStore.getState();
    if (!state.isHydrated) {
      state.initializeFromCookies();
    }
  }, 0);

 
  setTimeout(() => {
    const state = useAuthStore.getState();
    if (!state.isHydrated) {
      console.warn("Force hydrating auth store");
      useAuthStore.setState({ isHydrated: true });
    }
  }, 100);
}