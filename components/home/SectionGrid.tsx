"use client";

import { usePlayerStore } from "../../stores/usePlayerStore";
import { Box, Typography, Card, CardContent, Skeleton } from "@mui/material";
import Image from "next/image";
import PlayButton from "./PlayButton";
import { Song } from "@/types/types";

interface SectionGridProps {
  title: string;
  songs: Song[];
  isLoading: boolean;
}

// Skeleton loader using flexbox
const SectionGridSkeleton = () => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
    {[...Array(6)].map((_, i) => (
      <Box key={i} sx={{ flex: "1 1 calc(33.333% - 16px)", minWidth: 150 }}>
        <Box sx={{ bgcolor: "#18181b", borderRadius: 1, p: 1 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={120}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Box>
    ))}
  </Box>
);

export default function SectionGrid({
  title,
  songs,
  isLoading,
}: SectionGridProps) {
  const { playAlbum, currentSong, isPlaying, pause, resume } = usePlayerStore();

  const handlePlaySong = (song: Song) => {
    if (currentSong?._id === song._id) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      // play a new song
      playAlbum([song], 0);
    }
  };

  if (isLoading)
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <SectionGridSkeleton />
      </Box>
    );

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {songs.map((song, index) => (
          <Box
            key={song._id}
            sx={{ flex: "1 1 calc(16.666% - 16px)", minWidth: 120 }}
          >
            <Card
              sx={{
                bgcolor: "#18181b",
                borderRadius: 1,
                border: "1px solid #27272a",
                "&:hover": { bgcolor: "#27272a", transform: "scale(1.02)" },
                transition: "all 0.2s",
              }}
            >
              <CardContent sx={{ p: 1.5, position: "relative" }}>
                <Image
                  src={song.imageUrl}
                  alt={song.title}
                  width={150}
                  height={150}
                  style={{
                    borderRadius: 4,
                    objectFit: "cover",
                    width: "100%",
                    height: "auto",
                  }}
                />
                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    noWrap
                    sx={{
                      color:
                        currentSong?._id === song._id ? "#22c55e" : "white",
                    }}
                  >
                    {song.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {song.artist}
                  </Typography>
                </Box>
                <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                  <PlayButton
                    isPlaying={isPlaying && currentSong?._id === song._id}
                    onClick={() => handlePlaySong(song)}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
