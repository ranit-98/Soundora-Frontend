
"use client"; 

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { LibraryMusicOutlined, MusicNoteOutlined } from "@mui/icons-material";
import Topbar from "../../components/Topbar";
import Header from "../../components/admin/Header";
import DashboardStats from "../../components/admin/DashboardStats";
import SongsTabContent from "../../components/admin/SongsTabContent";
import AlbumsTabContent from "../../components/admin/AlbumsTabContent";
import { useAuthStore } from "../../stores/useAuthStore";
import { useAlbums, useSongs, useStats } from "@/api/hooks/useMusic";
import { parseCookies } from "nookies";

export default function AdminPage() {
  const { isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [tabValue, setTabValue] = useState("songs");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const { isLoading: albumsLoading } = useAlbums();
  const { isLoading: songsLoading } = useSongs();
  const { isLoading: statsLoading } = useStats();

  useEffect(() => {
    const cookies = parseCookies();
    const adminStatus = cookies?.isAdmin === 'true';

    setIsAdmin(adminStatus);

    if (!adminStatus) {
      router.push("/");
    }
  }, [router]);


  if (isAdmin === null) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  if (authLoading || albumsLoading || songsLoading || statsLoading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 3 }}>
        <Topbar />
        <Box sx={{ pt: 8 }}>
          <Typography color="text.primary">Loading...</Typography>
        </Box>
      </Box>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 3 }}>
      <Topbar />
      <Box sx={{ pt: 8 }}>
        <Header />
        <DashboardStats />
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            bgcolor: "background.paper",
            borderRadius: 1,
            "& .MuiTab-root": { color: "text.secondary" },
            "& .Mui-selected": { color: "secondary.main", bgcolor: "#27272a" },
            "& .MuiTabs-indicator": { backgroundColor: "secondary.main" },
          }}
        >
          <Tab
            value="songs"
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MusicNoteOutlined fontSize="small" />
                Songs
              </Box>
            }
          />
          <Tab
            value="albums"
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LibraryMusicOutlined fontSize="small" />
                Albums
              </Box>
            }
          />
        </Tabs>
        <Box>
          {tabValue === "songs" && <SongsTabContent />}
          {tabValue === "albums" && <AlbumsTabContent />}
        </Box>
      </Box>
    </Box>
  );
}