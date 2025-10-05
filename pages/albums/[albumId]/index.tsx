'use client';

import { useAlbumById } from '@/api/hooks/useMusic';
import LeftSidebar from '@/components/LeftSidebar';
import PlaybackControls from '@/components/PlaybackControls';
import Topbar from '@/components/Topbar';
import { ArrowBack, Pause, PlayArrow } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePlayerStore } from '../../../stores/usePlayerStore';
interface AlbumPageProps {
  albumId: string;
}
export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function AlbumPage({ albumId }: AlbumPageProps) {
  
  const router = useRouter();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const { data: currentAlbum, isLoading } = useAlbumById(
    typeof albumId === 'string' ? albumId : ''
  );

  if (isLoading || !currentAlbum) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Topbar />
        <Box sx={{ display: 'flex', flex: 1, pt: { xs: 7, sm: 8 } }}>
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <LeftSidebar />
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>Loading...</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;
    const isCurrentAlbumPlaying = currentAlbum.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) togglePlay();
    else playAlbum(currentAlbum.songs, 0);
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;
    playAlbum(currentAlbum.songs, index);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Topbar />

      <Box sx={{ display: 'flex', flex: 1, pt: { xs: 7, sm: 8 } }}>
        {/* Desktop Left Sidebar */}
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <LeftSidebar />
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            pb: { xs: 12, sm: 14 },
          }}
        >
          {/* Mobile Back Button */}
          <Box
            sx={{
              display: { xs: 'flex', lg: 'none' },
              alignItems: 'center',
              gap: 2,
              p: 2,
              position: 'sticky',
              top: 0,
              bgcolor: 'rgba(9, 9, 11, 0.95)',
              backdropFilter: 'blur(10px)',
              zIndex: 10,
            }}
          >
            <IconButton onClick={() => router.back()} sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" fontWeight="bold" noWrap>
              {currentAlbum.title}
            </Typography>
          </Box>

          {/* Album Header */}
          <Box
            sx={{
              background:
                'linear-gradient(to bottom, #5038a0 0%, rgba(80, 56, 160, 0.5) 50%, #09090b 100%)',
              p: { xs: 2, sm: 3 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 3 },
                alignItems: { xs: 'center', sm: 'flex-end' },
                pb: 4,
              }}
            >
              <Image
                src={currentAlbum.imageUrl}
                alt={currentAlbum.title}
                width={240}
                height={240}
                style={{
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  width: '100%',
                  maxWidth: 240,
                  height: 'auto',
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                <Typography variant="body2" fontWeight="medium">
                  Album
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    my: 2,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  }}
                >
                  {currentAlbum.title}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.secondary',
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                  }}
                >
                  <Typography variant="body2" fontWeight="medium" color="white">
                    {currentAlbum.artist}
                  </Typography>
                  <Typography variant="body2">
                    • {currentAlbum.songs.length} songs
                  </Typography>
                  <Typography variant="body2">
                    • {currentAlbum.releaseYear}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Play Button */}
            <Box sx={{ px: { xs: 0, sm: 3 }, pb: 2 }}>
              <Button
                onClick={handlePlayAlbum}
                variant="contained"
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: '#22c55e',
                  minWidth: 0,
                  '&:hover': { bgcolor: '#16a34a', transform: 'scale(1.05)' },
                  transition: 'all 0.2s',
                }}
              >
                {isPlaying &&
                currentAlbum.songs.some((song) => song._id === currentSong?._id) ? (
                  <Pause sx={{ fontSize: 28, color: 'black' }} />
                ) : (
                  <PlayArrow sx={{ fontSize: 28, color: 'black' }} />
                )}
              </Button>
            </Box>
          </Box>

          {/* Songs List */}
          <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(4px)' }}>
            {/* Desktop Table Header */}
            <Box
              sx={{
                display: { xs: 'none', md: 'grid' },
                gridTemplateColumns: '16px 4fr 2fr 1fr',
                gap: 2,
                px: 3,
                py: 1,
                color: 'text.secondary',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography>#</Typography>
              <Typography>Title</Typography>
              <Typography>Released Date</Typography>
              <Typography>Duration</Typography>
            </Box>

            {/* Songs */}
            <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: 2 }}>
              {currentAlbum.songs.map((song, index) => {
                const isCurrentSong = currentSong?._id === song._id;
                return (
                  <Box
                    key={song._id}
                    onClick={() => handlePlaySong(index)}
                    sx={{
                      display: { xs: 'flex', md: 'grid' },
                      gridTemplateColumns: { md: '16px 4fr 2fr 1fr' },
                      gap: { xs: 1, md: 2 },
                      px: { xs: 1, md: 2 },
                      py: { xs: 1.5, md: 1 },
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 },
                      cursor: 'pointer',
                      alignItems: 'center',
                    }}
                  >
                    {/* Index/Play Icon */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 24,
                      }}
                    >
                      {isCurrentSong && isPlaying ? (
                        <Typography color="primary" fontSize="1.2rem">
                          ♫
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {index + 1}
                        </Typography>
                      )}
                    </Box>

                    {/* Song Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                      <Image
                        src={song.imageUrl}
                        alt={song.title}
                        width={40}
                        height={40}
                        style={{ borderRadius: 4 }}
                      />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="body2"
                          color={isCurrentSong ? 'white' : 'inherit'}
                          fontWeight="medium"
                          noWrap
                        >
                          {song.title}
                        </Typography>
                        <Typography variant="caption" noWrap>
                          {song.artist}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Release Date - Desktop Only */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                      {song.createdAt.split('T')[0]}
                    </Box>

                    {/* Duration */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'flex-end', md: 'flex-start' },
                        minWidth: { xs: 'auto', md: 60 },
                      }}
                    >
                      <Typography variant="body2">
                        {formatDuration(song.duration)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>

    
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }}>
        <PlaybackControls />
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { albumId } = context.params!;
  try {
    
    return {
      props: { albumId },
    };
  } catch (error) {
    console.error(error);
    return { props: { albumId: null } };
  }
};