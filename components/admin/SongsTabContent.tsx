'use client';

import { Card, CardHeader, CardContent, Typography, Box } from '@mui/material';
import { MusicNoteOutlined } from '@mui/icons-material';

import AddSongDialog from './AddSongDialog';
import SongsTable from './SongsTable';

export default function SongsTabContent() {
  return (
    <Card sx={{ bgcolor: '#18181b', border: '1px solid #27272a' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MusicNoteOutlined sx={{ color: '#22c55e' }} />
            <Typography variant="h6">Songs Library</Typography>
          </Box>
        }
        subheader="Manage your music tracks"
        action={<AddSongDialog />}
      />
      <CardContent>
        <SongsTable />
      </CardContent>
    </Card>
  );
}