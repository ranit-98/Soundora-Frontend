'use client';

import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar } from '@mui/material';
import { useUserDetails } from '@/api/hooks/useUsers';

export default function Header() {
  const { data: user } = useUserDetails(localStorage.getItem('userId') || '');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Link href="/">
          <Image src="/spotify.png" alt="Logo" width={40} height={40} />
        </Link>
        <Box>
          <Typography variant="h5" fontWeight="bold">Music Manager</Typography>
          <Typography variant="body2" color="text.secondary">Manage your music catalog</Typography>
        </Box>
      </Box>
      <Avatar src={user?.imageUrl} alt={user?.fullName}>{user?.fullName[0]}</Avatar>
    </Box>
  );
}