'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import { LibraryMusicOutlined, MusicNoteOutlined, GroupOutlined, PlayCircleOutline } from '@mui/icons-material';
import { useStats } from '@/api/hooks/useMusic';

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  bgcolor: string;
  iconColor: string;
}

const StatsCard = ({ icon: Icon, label, value, bgcolor, iconColor }: StatsCardProps) => (
  <Card sx={{ bgcolor: '#18181b', border: '1px solid #27272a', '&:hover': { bgcolor: '#27272a' }, transition: 'background-color 0.2s' }}>
    <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ p: 1.5, borderRadius: 1, bgcolor }}>
        <Icon sx={{ fontSize: 24, color: iconColor }} />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="h6" fontWeight="bold">{value}</Typography>
      </Box>
    </CardContent>
  </Card>
);

export default function DashboardStats() {
  const { data: stats = { totalSongs: 0, totalAlbums: 0, totalArtists: 0, totalUsers: 0 } } = useStats();

  const statsData = [
    { icon: MusicNoteOutlined, label: 'Total Songs', value: stats.totalSongs.toString(), bgcolor: '#22c55e/10', iconColor: '#22c55e' },
    { icon: LibraryMusicOutlined, label: 'Total Albums', value: stats.totalAlbums.toString(), bgcolor: '#a855f7/10', iconColor: '#a855f7' },
    { icon: GroupOutlined, label: 'Total Artists', value: stats.totalArtists.toString(), bgcolor: '#f97316/10', iconColor: '#f97316' },
    { icon: PlayCircleOutline, label: 'Total Users', value: stats.totalUsers.toLocaleString(), bgcolor: '#0ea5e9/10', iconColor: '#0ea5e9' },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
      {statsData.map((stat) => (
        <StatsCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          bgcolor={stat.bgcolor}
          iconColor={stat.iconColor}
        />
      ))}
    </Box>
  );
}