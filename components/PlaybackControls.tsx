'use client';

import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { Box, Button, Slider, Typography } from '@mui/material';
import {
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
  Shuffle,
  Repeat,
  VolumeUp,
  Mic,
  QueueMusic,
  Laptop
} from '@mui/icons-material';
import Image from 'next/image';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function PlaybackControls() {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInitialized = useRef(false);

  // Update audio element when song changes (NO AUTOPLAY)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentSong?.audioUrl) {
      audio.src = currentSong.audioUrl;
      audio.currentTime = 0;

      // Only play if isPlaying is true AND it's not the initial load
      if (isPlaying && hasInitialized.current) {
        audio.play().catch(err => console.log('Audio play error:', err));
      }
      
      // Mark as initialized after first song load
      if (!hasInitialized.current) {
        hasInitialized.current = true;
      }
    }
  }, [currentSong]);

  // Handle play/pause state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasInitialized.current) return;

    if (isPlaying) {
      audio.play().catch(err => console.log('Audio play error:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Track progress and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
      playNext(); // Auto play next song
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, playNext]);

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Seek in audio
  const handleSeek = (_: Event, value: number | number[]) => {
    if (audioRef.current && typeof value === 'number') {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        height: { xs: 'auto', sm: 96 },
        bgcolor: '#09090b',
        borderTop: '1px solid #27272a',
        px: { xs: 1, sm: 2 },
        py: { xs: 1, sm: 0 },
      }}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Mobile Progress Bar - Top of footer */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          alignItems: 'center',
          gap: 1,
          pb: 1,
          px: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 35 }}>
          {formatTime(currentTime)}
        </Typography>
        <Slider
          value={currentTime}
          max={duration || 100}
          step={1}
          onChange={handleSeek}
          disabled={!currentSong}
          sx={{
            flex: 1,
            '& .MuiSlider-thumb': {
              width: 10,
              height: 10,
            },
            '& .MuiSlider-track': {
              height: 3,
            },
            '& .MuiSlider-rail': {
              height: 3,
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 35 }}>
          {formatTime(duration)}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: { xs: 'auto', sm: '100%' },
          maxWidth: 1800,
          mx: 'auto',
        }}
      >
        {/* Left: Song Info */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 2,
            minWidth: 180,
            width: '30%',
          }}
        >
          {currentSong && (
            <>
              <Image
                src={currentSong.imageUrl}
                alt={currentSong.title}
                width={56}
                height={56}
                style={{ borderRadius: 4, objectFit: 'cover' }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: 'medium',
                    '&:hover': { textDecoration: 'underline', cursor: 'pointer' },
                  }}
                >
                  {currentSong.title}
                </Typography>
                <Typography
                  variant="caption"
                  noWrap
                  color="text.secondary"
                  sx={{
                    '&:hover': { textDecoration: 'underline', cursor: 'pointer' },
                  }}
                >
                  {currentSong.artist}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {/* Center: Controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            flex: 1,
            maxWidth: { xs: '100%', sm: '45%' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
            <Button
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                color: 'text.secondary',
                '&:hover': { color: 'white' },
                minWidth: 0,
              }}
            >
              <Shuffle fontSize="small" />
            </Button>
            <Button
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'white' },
                minWidth: 0,
              }}
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipPrevious fontSize="small" />
            </Button>
            <Button
              onClick={togglePlay}
              disabled={!currentSong}
              sx={{
                bgcolor: 'white',
                color: 'black',
                borderRadius: '50%',
                width: { xs: 36, sm: 32 },
                height: { xs: 36, sm: 32 },
                minWidth: 0,
                '&:hover': { bgcolor: '#e5e5e5', transform: 'scale(1.05)' },
                '&:disabled': { bgcolor: '#4b5563', color: '#9ca3af' },
                transition: 'all 0.2s',
              }}
            >
              {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
            </Button>
            <Button
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'white' },
                minWidth: 0,
              }}
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipNext fontSize="small" />
            </Button>
            <Button
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                color: 'text.secondary',
                '&:hover': { color: 'white' },
                minWidth: 0,
              }}
            >
              <Repeat fontSize="small" />
            </Button>
          </Box>

          {/* Progress */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1,
              width: '100%',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {formatTime(currentTime)}
            </Typography>
            <Slider
              value={currentTime}
              max={duration || 100}
              step={1}
              onChange={handleSeek}
              disabled={!currentSong}
              sx={{
                '&:hover': { cursor: 'pointer' },
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  '&:hover': { boxShadow: '0 0 0 8px rgba(34, 197, 94, 0.16)' },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {formatTime(duration)}
            </Typography>
          </Box>
        </Box>

        {/* Right: Volume & extras */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 2,
            minWidth: 180,
            width: '30%',
            justifyContent: 'flex-end',
          }}
        >
          
          {/* <Button
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'white' },
              minWidth: 0,
            }}
          >
            <QueueMusic fontSize="small" />
          </Button> */}
          {/* <Button
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'white' },
              minWidth: 0,
            }}
          >
            <Laptop fontSize="small" />
          </Button> */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'white' },
                minWidth: 0,
              }}
            >
              <VolumeUp fontSize="small" />
            </Button>
            <Slider
              value={volume}
              max={100}
              step={1}
              onChange={(_, value) => {
                setVolume(value as number);
                if (audioRef.current) audioRef.current.volume = (value as number) / 100;
              }}
              sx={{
                width: 100,
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  '&:hover': { boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)' },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}