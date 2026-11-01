import { create } from "zustand";

interface AppState {
  isLoaded: boolean;
  setLoaded: (loaded: boolean) => void;
  isContactOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  headerColor: string;
  setHeaderColor: (color: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoaded: false,
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  isContactOpen: false,
  openContact: () => set({ isContactOpen: true, isMobileMenuOpen: false }),
  closeContact: () => set({ isContactOpen: false }),
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  headerColor: "#000000",
  setHeaderColor: (color) => set({ headerColor: color }),
}));

