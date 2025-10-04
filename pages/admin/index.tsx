// 'use client';

// import { useEffect } from 'react';
// import { useAuthStore } from '../../stores/useAuthStore';
// import { useMusicStore } from '../../stores/useMusicStore';
// import { Box, Tabs, Tab, Typography } from '@mui/material';
// import { LibraryMusicOutlined, MusicNoteOutlined } from '@mui/icons-material';
// import Header from '@/components/admin/Header';
// import DashboardStats from '@/components/admin/DashboardStats';
// import SongsTabContent from '@/components/admin/SongsTabContent';
// import AlbumsTabContent from '@/components/admin/AlbumsTabContent';



// export default function AdminPage() {
//   const { isAdmin, isLoading: authLoading } = useAuthStore();
//   const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

//   useEffect(() => {
//     fetchAlbums();
//     fetchSongs();
//     fetchStats();
//   }, [fetchAlbums, fetchSongs, fetchStats]);

//   if (authLoading) return <Box>Loading...</Box>;
//   if (!isAdmin) return <Typography color="error">Unauthorized</Typography>;

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(to bottom, #09090b, #09090b, #000)', p: 4, color: 'white' }}>
//       <Header />
//       <DashboardStats />
//       <Tabs defaultValue="songs" sx={{ mb: 3, bgcolor: '#18181b', borderRadius: 1 }}>
//         <Tab
//           value="songs"
//           label={
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <MusicNoteOutlined fontSize="small" />
//               Songs
//             </Box>
//           }
//           sx={{ '&.Mui-selected': { bgcolor: '#27272a' } }}
//         />
//         <Tab
//           value="albums"
//           label={
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <LibraryMusicOutlined fontSize="small" />
//               Albums
//             </Box>
//           }
//           sx={{ '&.Mui-selected': { bgcolor: '#27272a' } }}
//         />
//       </Tabs>
//       <Box>
//         <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
//           <SongsTabContent />
//         </Box>
//         <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
//           <AlbumsTabContent />
//         </Box>
//       </Box>
//     </Box>
//   );
// }



'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { LibraryMusicOutlined, MusicNoteOutlined } from '@mui/icons-material';
import Topbar from '../../components/Topbar';
import Header from '../../components/admin/Header';
import DashboardStats from '../../components/admin/DashboardStats';
import SongsTabContent from '../../components/admin/SongsTabContent';
import AlbumsTabContent from '../../components/admin/AlbumsTabContent';
import { useAuthStore } from '../../stores/useAuthStore';
import { useAlbums, useSongs, useStats } from '@/api/hooks/useMusic';

export default function AdminPage() {
  const { isAdmin, isLoading: authLoading } = useAuthStore();
  console.log(isAdmin,'isadmin');
  const router = useRouter();
  const [tabValue, setTabValue] = useState('songs');

  const { isLoading: albumsLoading } = useAlbums();
  const { isLoading: songsLoading } = useSongs();
  const { isLoading: statsLoading } = useStats();

  if (authLoading || albumsLoading || songsLoading || statsLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
        <Topbar />
        <Box sx={{ pt: 8 }}>
          <Typography color="text.primary">Loading...</Typography>
        </Box>
      </Box>
    );
  }

  // if (!isAdmin) {
  //   router.push('/');
  //   return null;
  // }

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
      <Topbar />
      <Box sx={{ pt: 8 }}>
        <Header />
        <DashboardStats />
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            bgcolor: 'background.paper',
            borderRadius: 1,
            '& .MuiTab-root': { color: 'text.secondary' },
            '& .Mui-selected': { color: 'secondary.main', bgcolor: '#27272a' },
            '& .MuiTabs-indicator': { backgroundColor: 'secondary.main' },
          }}
        >
          <Tab
            value="songs"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MusicNoteOutlined fontSize="small" />
                Songs
              </Box>
            }
          />
          <Tab
            value="albums"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LibraryMusicOutlined fontSize="small" />
                Albums
              </Box>
            }
          />
        </Tabs>
        <Box>
          {tabValue === 'songs' && <SongsTabContent />}
          {tabValue === 'albums' && <AlbumsTabContent />}
        </Box>
      </Box>
    </Box>
  );
}