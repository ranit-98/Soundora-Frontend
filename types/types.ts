import { Document } from 'mongoose';

export interface Song extends Document {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  albumId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Album extends Document {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}

export interface User extends Document {
  _id: string;
  fullName: string;
  imageUrl: string;
  googleId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message extends Document {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  totalAlbums: number;
  totalSongs: number;
  totalUsers: number;
  totalArtists: number;
}