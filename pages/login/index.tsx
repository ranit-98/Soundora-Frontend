
'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/');
    }
  }, [router]);


    const handleLogin = () => {
   const redirectUri = `${process.env.NEXT_APP_FRONTEND_BASE_URL}/api/auth/callback`;

    console.info(redirectUri, 'red');

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=email%20profile`;

    window.location.href = googleAuthUrl;
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Toaster position="top-right" />
      <Box sx={{ textAlign: 'center', bgcolor: 'background.default', p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Welcome to Soundora- Music App</Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>Sign in with Google to continue</Typography>
        <Button variant="contained" color="success" onClick={handleLogin}>
          Login with Google
        </Button>
      </Box>
    </Container>
  );
}
