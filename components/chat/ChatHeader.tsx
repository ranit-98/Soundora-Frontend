'use client';

import { useChatStore } from '../../stores/useChatStore';
import { Box, Avatar, Typography } from '@mui/material';

export default function ChatHeader() {
  const { selectedUser, onlineUsers } = useChatStore();

  if (!selectedUser) return null;

  return (
    <Box sx={{ p: 2, borderBottom: '1px solid #27272a' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar src={selectedUser.imageUrl} alt={selectedUser.fullName}>{selectedUser.fullName[0]}</Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="medium">{selectedUser.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {onlineUsers.has(selectedUser.googleId) ? 'Online' : 'Offline'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}