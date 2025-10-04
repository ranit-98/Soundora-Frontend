'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '../stores/useChatStore';
import { Box, Avatar, Typography, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Headphones, MusicNote, People } from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import { useUserDetails } from '@/api/hooks/useUsers';
import { useUsers } from '@/api/hooks/useChat';
import { parseCookies } from 'nookies';
import { fetchUsers } from '@/api/functions/users';

const LoginPrompt = () => (
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, textAlign: 'center' }}>
    <Box sx={{ position: 'relative', mb: 2 }}>
      <Box sx={{ position: 'absolute', top: -4, left: -4, right: -4, bottom: -4, bgcolor: 'linear-gradient(to right, #22c55e, #0ea5e9)', borderRadius: '50%', opacity: 0.75, animation: 'pulse 2s infinite' }} />
      <Box sx={{ bgcolor: '#09090b', borderRadius: '50%', p: 2 }}>
        <Headphones sx={{ fontSize: 32, color: '#22c55e' }} />
      </Box>
    </Box>
    <Typography variant="h6" color="white">See What Friends Are Playing</Typography>
    <Typography variant="body2" color="text.secondary">Login to discover what music your friends are enjoying right now</Typography>
    <style jsx>{`
      @keyframes pulse {
        0% { opacity: 0.75; }
        50% { opacity: 0.5; }
        100% { opacity: 0.75; }
      }
    `}</style>
  </Box>
);

export default function FriendsActivity() {
  const {  onlineUsers, userActivities } = useChatStore();

  const { data: users = [], isLoading } = useUsers();

  const cookies = parseCookies();


  const { data: user } = useUserDetails(cookies?.userId || '');

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  return (
    <Box sx={{ height: '100%', bgcolor: '#09090b', borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #27272a' }}>
        <People sx={{ mr: 1, fontSize: 20 }} />
        <Typography variant="subtitle1" fontWeight="medium">What they are listening to</Typography>
      </Box>
      {!user && <LoginPrompt />}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <List>
          {users.map((user) => {
            const activity = userActivities.get(user.googleId);
            const isPlaying = activity && activity !== 'Idle';
            return (
              <ListItem
                key={user._id}
                sx={{
                  borderRadius: 1,
                  '&:hover': { bgcolor: '#18181b' },
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  p: 1.5,
                }}
              >
                <ListItemAvatar sx={{ position: 'relative' }}>
                  <Avatar src={user.imageUrl} alt={user.fullName} sx={{ width: 40, height: 40, border: '1px solid #27272a' }}>
                    {user.fullName[0]}
                  </Avatar>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      border: '2px solid #09090b',
                      bgcolor: onlineUsers.has(user.googleId) ? '#22c55e' : '#6b7280',
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium" color="white">{user.fullName}</Typography>
                      {isPlaying && <MusicNote sx={{ fontSize: 14, color: '#22c55e' }} />}
                    </Box>
                  }
                  secondary={
                    isPlaying ? (
                      <Box>
                        <Typography variant="body2" color="white">{activity.replace('Playing ', '').split(' by ')[0]}</Typography>
                        <Typography variant="caption" color="text.secondary">{activity.split(' by ')[1]}</Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">Idle</Typography>
                    )
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}