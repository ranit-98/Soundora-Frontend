import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addAlbum, addSong, deleteAlbum, deleteSong, fetchAlbumById, fetchAlbums, fetchFeaturedSongs, fetchMadeForYouSongs, fetchSongs, fetchStats, fetchTrendingSongs } from '../functions/music';

import { QUERY_KEYS } from '@/lib/queryKeys';
import { Album, Song } from '@/types/types';
import { useToast } from './useToast';

export const useAlbums = () => {
  return useQuery({
    queryKey: QUERY_KEYS.albums,
    queryFn: fetchAlbums,
  });
};

export const useAlbumById = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.albumById(id),
    queryFn: () => fetchAlbumById(id),
    enabled: !!id,
  });
};

export const useSongs = () => {
  return useQuery({
    queryKey: QUERY_KEYS.songs,
    queryFn: fetchSongs,
  });
};

export const useFeaturedSongs = () => {
  return useQuery({
    queryKey: QUERY_KEYS.featuredSongs,
    queryFn: fetchFeaturedSongs,
  });
};

export const useMadeForYouSongs = () => {
  return useQuery({
    queryKey: QUERY_KEYS.madeForYouSongs,
    queryFn: fetchMadeForYouSongs,
  });
};

export const useTrendingSongs = () => {
  return useQuery({
    queryKey: QUERY_KEYS.trendingSongs,
    queryFn: fetchTrendingSongs,
  });
};

export const useStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: fetchStats,
  });
};

export const useDeleteSong = ({ optionalCallback }: { optionalCallback?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const toast = useToast(); 

  return useMutation({
    mutationFn: deleteSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.songs] });
      toast({ message: 'Song deleted successfully', severity: 'success' });
      if (optionalCallback) { optionalCallback(); }
    },
    onError: () => {
      toast({ message: 'Error deleting song', severity: 'error' });
    },
  });
};

export const useDeleteAlbum = ({ optionalCallback }: { optionalCallback?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteAlbum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.albums] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.songs] });
      toast({ message: 'Album deleted successfully', severity: 'success' });
     if(optionalCallback){ optionalCallback() }
    },
    onError: () => {
      toast({ message: 'Error deleting album', severity: 'error' });
    },
  });
};

export const useAddSong = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (formData: FormData) => addSong(formData),
    onSuccess: (newSong: Song) => {
      queryClient.setQueryData<Song[]>(QUERY_KEYS.songs, (old) => old ? [...old, newSong] : [newSong]);
      toast({ message: 'Song added successfully', severity: 'success' });
    },
    onError: () => {
      toast({ message: 'Error adding song', severity: 'error' });
    },
  });
};

export const useAddAlbum = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (formData: FormData) => addAlbum(formData),
    onSuccess: (newAlbum: Album) => {
      queryClient.setQueryData<Album[]>(QUERY_KEYS.albums, (old) => old ? [...old, newAlbum] : [newAlbum]);
      toast({ message: 'Album added successfully', severity: 'success' });
    },
    onError: () => {
      toast({ message: 'Error adding album', severity: 'error' });
    },
  });
};