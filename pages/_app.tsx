import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, 
    },
  },
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#22c55e' }, 
    secondary: { main: '#a855f7' }, 
    background: { default: '#09090b', paper: '#18181b' },
    divider: '#27272a',
    text: { primary: '#ffffff', secondary: '#9ca3af' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' },
        containedPrimary: { color: '#000000' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#27272a' },
            '&:hover fieldset': { borderColor: '#22c55e' },
          },
        },
      },
    },
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
 
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster position="top-right" />
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
   
  );
}