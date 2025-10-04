import { Album, Song ,Stats} from '@/types/types';
import { axiosInstance } from '../axios';
import { ENDPOINTS } from '../endpoints';

export const fetchAlbums = async () => {
  const response = await axiosInstance.get(ENDPOINTS.albums);
  return response.data as Album[];
};

export const fetchAlbumById = async (id: string) => {
  const response = await axiosInstance.get(ENDPOINTS.albumById(id));
  return response.data as Album;
};

export const fetchSongs = async () => {
  const response = await axiosInstance.get(ENDPOINTS.songs);
  return response.data as Song[];
};

export const fetchFeaturedSongs = async () => {
  const response = await axiosInstance.get(ENDPOINTS.featuredSongs);
  return response.data as Song[];
};

export const fetchMadeForYouSongs = async () => {
  const response = await axiosInstance.get(ENDPOINTS.madeForYouSongs);
  return response.data as Song[];
};

export const fetchTrendingSongs = async () => {
  const response = await axiosInstance.get(ENDPOINTS.trendingSongs);
  return response.data as Song[];
};

export const fetchStats = async () => {
  const response = await axiosInstance.get(ENDPOINTS.stats);
  return response.data as Stats;
};

export const deleteSong = async (id: string) => {
  await axiosInstance.delete(ENDPOINTS.adminSongById(id));
};

export const deleteAlbum = async (id: string) => {
  await axiosInstance.delete(ENDPOINTS.adminAlbumById(id));
};

export const addSong = async (formData: FormData) => {
  const response = await axiosInstance.post(ENDPOINTS.adminSongs, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data as Song;
};

export const addAlbum = async (formData: FormData) => {
  const response = await axiosInstance.post(ENDPOINTS.adminAlbums, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data as Album;
};