'use client';

import { useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  Skeleton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { CalendarToday, Delete } from '@mui/icons-material';
import Image from 'next/image';
import { useSongs, useDeleteSong } from '@/api/hooks/useMusic';

export default function SongsTable() {
  const { data: songs = [], isLoading, error, refetch } = useSongs();
  const { mutate: deleteSong } = useDeleteSong({
    optionalCallback: () => refetch(),
  });

  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteClick = (songId: string) => {
    setSelectedSong(songId);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSong) {
      deleteSong(selectedSong);
      setIsDialogOpen(false);
      setSelectedSong(null);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedSong(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Typography color="text.secondary">Loading songs...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Typography color="error">
          {error instanceof Error ? error.message : 'Error loading songs'}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ '&:hover': { bgcolor: '#18181b' } }}>
              <TableCell sx={{ width: 50 }}></TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {songs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                    No songs found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              songs.map((song) => (
                <TableRow key={song._id} sx={{ '&:hover': { bgcolor: '#18181b' } }}>
                  <TableCell>
                    <Image
                      src={song.imageUrl}
                      alt={song.title}
                      width={40}
                      height={40}
                      style={{ borderRadius: 4, objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{song.title}</TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <CalendarToday fontSize="small" />
                      {song.createdAt?.split('T')[0]}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleDeleteClick(song._id)}
                      sx={{
                        color: '#f87171',
                        '&:hover': { color: '#ef4444', bgcolor: 'rgba(248,113,113,0.1)' },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCancel}
        PaperProps={{
          sx: {
            bgcolor: '#18181b',
            color: 'white',
            border: '1px solid #27272a',
          },
        }}
      >
        <DialogTitle>Delete Song</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this song? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} sx={{ color: 'gray' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{ color: '#f87171', '&:hover': { bgcolor: 'rgba(248,113,113,0.1)' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
