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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { CalendarToday, MusicNote, Delete } from '@mui/icons-material';
import Image from 'next/image';
import { useAlbums, useDeleteAlbum } from '@/api/hooks/useMusic';

export default function AlbumsTable() {
  const { data: albums = [], isLoading, refetch } = useAlbums();
  const { mutate: deleteAlbum } = useDeleteAlbum({
    optionalCallback: () => refetch(),
  });

  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteClick = (albumId: string) => {
    setSelectedAlbum(albumId);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAlbum) {
      deleteAlbum(selectedAlbum);
      setIsDialogOpen(false);
      setSelectedAlbum(null);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedAlbum(null);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ '&:hover': { bgcolor: '#18181b' } }}>
              <TableCell sx={{ width: 50 }}></TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Release Year</TableCell>
              <TableCell>Songs</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton variant="rectangular" width={40} height={40} />
                  </TableCell>
                  <TableCell colSpan={5}>
                    <Skeleton variant="text" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              albums.map((album) => (
                <TableRow key={album._id} sx={{ '&:hover': { bgcolor: '#18181b' } }}>
                  <TableCell>
                    <Image
                      src={album.imageUrl}
                      alt={album.title}
                      width={40}
                      height={40}
                      style={{ borderRadius: 4, objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{album.title}</TableCell>
                  <TableCell>{album.artist}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <CalendarToday fontSize="small" />
                      {album.releaseYear}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <MusicNote fontSize="small" />
                      {album.songs.length} songs
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleDeleteClick(album._id)}
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
        <DialogTitle>Delete Album</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this album?</Typography>
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
