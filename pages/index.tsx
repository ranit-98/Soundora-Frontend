"use client";
import {
  useFeaturedSongs,
  useMadeForYouSongs,
  useTrendingSongs,
} from "@/api/hooks/useMusic";
import FeaturedSection from "@/components/home/FeaturedSection";
import { Close, Menu } from "@mui/icons-material";
import { Box, Drawer, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import SectionGrid from "../components/home/SectionGrid";
import LeftSidebar from "../components/LeftSidebar";
import PlaybackControls from "../components/PlaybackControls";
import Topbar from "../components/Topbar";
import { usePlayerStore } from "../stores/usePlayerStore";

export default function Home() {
  const { data: featuredSongs = [] } = useFeaturedSongs();
  const { data: madeForYouSongs = [], isLoading: isMadeForYouLoading } =
    useMadeForYouSongs();
  const { data: trendingSongs = [], isLoading: isTrendingLoading } =
    useTrendingSongs();
  const { initializeSongs } = usePlayerStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFriendsActivity] = useState(false);

  useEffect(() => {
    if (featuredSongs.length > 0) {
      initializeSongs(featuredSongs);
    }
  }, [featuredSongs, initializeSongs]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Topbar />

      {/* Mobile Menu Button */}
      <IconButton
        onClick={() => setMobileMenuOpen(true)}
        sx={{
          display: { xs: "flex", lg: "none" },
          position: "fixed",
          top: 72,
          left: 16,
          zIndex: 1200,
          bgcolor: "#18181b",
          color: "white",
          "&:hover": { bgcolor: "#27272a" },
        }}
      >
        <Menu />
      </IconButton>

      <Box sx={{ display: "flex", flexGrow: 1, pt: { xs: 7, sm: 8 } }}>
        {/* Desktop Left Sidebar */}
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <LeftSidebar />
        </Box>

        {/* Mobile Left Sidebar Drawer */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              width: 280,
              bgcolor: "#09090b",
              borderRight: "1px solid #27272a",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton
              onClick={() => setMobileMenuOpen(false)}
              sx={{ color: "white" }}
            >
              <Close />
            </IconButton>
          </Box>
          <LeftSidebar />
        </Drawer>

        <Box
          component="main"
          sx={{
            display: {
              xs: showFriendsActivity ? "none" : "block",
              xl: "block",
            },
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            bgcolor: "background.default",
            overflowY: "auto",
            pb: { xs: 12, sm: 14 },
          }}
        >
          <FeaturedSection />
          <SectionGrid
            title="Made For You"
            songs={madeForYouSongs}
            isLoading={isMadeForYouLoading}
          />
          <SectionGrid
            title="Trending"
            songs={trendingSongs}
            isLoading={isTrendingLoading}
          />
        </Box>
      </Box>

      <Box
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }}
      >
        <PlaybackControls />
      </Box>
    </Box>
  );
}
