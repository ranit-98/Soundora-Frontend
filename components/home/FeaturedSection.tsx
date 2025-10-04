"use client";

import { useFeaturedSongs } from "@/api/hooks/useMusic";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { Box, Typography, Card, CardContent, Skeleton } from "@mui/material";
import Image from "next/image";
import PlayButton from "./PlayButton";
import { Song } from "@/types/types";

// Skeleton loader for featured tracks
const FeaturedGridSkeleton = () => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
      Featured Tracks
    </Typography>
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            flex: "1 1 calc(33.333% - 16px)",
            minWidth: 250,
          }}
        >
          <Box
            sx={{
              display: "flex",
              bgcolor: "#18181b",
              borderRadius: 1,
              p: 1,
            }}
          >
            <Skeleton
              variant="rectangular"
              width={80}
              height={80}
              sx={{ borderRadius: 1 }}
            />
            <Box sx={{ flex: 1, p: 2 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

export default function FeaturedSection() {
  const { data: featuredSongs = [], isLoading, error } = useFeaturedSongs();
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

  if (isLoading) return <FeaturedGridSkeleton />;

  if (error)
    return (
      <Typography color="error" variant="h6" sx={{ mb: 2 }}>
        {error.message}
      </Typography>
    );

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Featured Tracks
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {featuredSongs.map((song) => (
          <Box
            key={song._id}
            sx={{
              flex: "1 1 calc(33.333% - 16px)",
              minWidth: 250,
            }}
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
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5 }}
              >
                <Image
                  src={song.imageUrl}
                  alt={song.title}
                  width={80}
                  height={80}
                  style={{ borderRadius: 4, objectFit: "cover" }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
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
                <PlayButton
                  isPlaying={isPlaying && currentSong?._id === song._id}
                  onClick={() => handlePlaySong(song)}
                />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
