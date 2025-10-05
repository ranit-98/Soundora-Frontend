import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MusicState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
}

export const useMusicStore = create<MusicState>()(
  devtools(
    (set) => ({
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    { name: 'musicStore' }
  )
);