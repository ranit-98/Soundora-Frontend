'use client';

import { Card, CardHeader, CardContent, Typography, Box } from '@mui/material';
import { LibraryMusicOutlined } from '@mui/icons-material';

import AddAlbumDialog from './AddAlbumDialog';
import AlbumsTable from './AlbumsTable';

export default function AlbumsTabContent() {
  return (
    <Card sx={{ bgcolor: '#18181b', border: '1px solid #27272a' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LibraryMusicOutlined sx={{ color: '#a855f7' }} />
            <Typography variant="h6">Albums Library</Typography>
          </Box>
        }
        subheader="Manage your album collection"
        action={<AddAlbumDialog />}
      />
      <CardContent>
        <AlbumsTable />
      </CardContent>
    </Card>
  );
}