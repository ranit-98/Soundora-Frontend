'use client';

import { Button } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

export default function PlayButton({ isPlaying, onClick }: PlayButtonProps) {
  return (
    <Button
      onClick={onClick}
      sx={{
        minWidth: 0,
        width: 36,
        height: 36,
        borderRadius: '50%',
        bgcolor: '#22c55e',
        color: 'black',
        '&:hover': { bgcolor: '#16a34a', transform: 'scale(1.05)' },
        transition: 'all 0.2s',
      }}
    >
      {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
    </Button>
  );
}