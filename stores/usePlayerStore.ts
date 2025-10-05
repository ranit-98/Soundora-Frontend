import { create } from "zustand";

interface Song {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  albumId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  // Actions
  initializeSongs: (songs: Song[]) => void;
  playSong: (song: Song) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setQueue: (songs: Song[]) => void;
  pause: () => void;
  resume: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  initializeSongs: (songs) => {
    set({
      queue: songs,
      currentSong: songs[0] || null,
      currentIndex: 0,
      isPlaying: false, // Don't autoplay
    });
  },

  playSong: (song) => {
    const { queue } = get();
    const index = queue.findIndex((s) => s._id === song._id);

    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: index !== -1 ? index : 0,
    });
  },
  playAlbum: (songs, startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  playNext: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;

    const nextIndex = (currentIndex + 1) % queue.length;
    set({
      currentSong: queue[nextIndex],
      currentIndex: nextIndex,
      isPlaying: true,
    });
  },

  playPrevious: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;

    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    set({
      currentSong: queue[prevIndex],
      currentIndex: prevIndex,
      isPlaying: true,
    });
  },

  setQueue: (songs) => {
    set({
      queue: songs,
      currentIndex: 0,
    });
  },
}));
