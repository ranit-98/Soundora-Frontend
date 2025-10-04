"use client";

import { useEffect } from "react";
import { useMusicStore } from "../stores/useMusicStore";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  HomeOutlined,
  LibraryMusicOutlined,
  MessageOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { useAlbums } from "@/api/hooks/useMusic";

const PlaylistSkeleton = () => (
  <Box sx={{ p: 2 }}>
    {[...Array(5)].map((_, i) => (
      <Box
        key={i}
        sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
      >
        <Skeleton
          variant="rectangular"
          width={48}
          height={48}
          sx={{ borderRadius: 1 }}
        />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Box>
    ))}
  </Box>
);

export default function LeftSidebar() {
  const { data: albums = [], isLoading } = useAlbums();

  return (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 1 }}
    >
      <Box sx={{ bgcolor: "#09090b", p: 2, borderRadius: 2 }}>
        <List>
          {/* <ListItem disablePadding> */}
          {/* <ListItemButton component={Link} href="/" sx={{ color: 'white', '&:hover': { bgcolor: '#18181b' } }}>
              <ListItemIcon><HomeOutlined sx={{ color: 'white' }} /></ListItemIcon>
              <ListItemText primary="Home" sx={{ display: { xs: 'none', md: 'block' } }} />
            </ListItemButton> */}
          {/* </ListItem> */}
          {/* <ListItem disablePadding>
            <ListItemButton component={Link} href="/chat" sx={{ color: 'white', '&:hover': { bgcolor: '#18181b' } }}>
              <ListItemIcon><MessageOutlined sx={{ color: 'white' }} /></ListItemIcon>
              <ListItemText primary="Messages" sx={{ display: { xs: 'none', md: 'block' } }} />
            </ListItemButton>
          </ListItem> */}
        </List>
      </Box>
      <Box sx={{ flex: 1, bgcolor: "#09090b", p: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, px: 1 }}>
          <LibraryMusicOutlined sx={{ mr: 1, fontSize: 20, color: "white" }} />
          <Typography
            variant="subtitle1"

          >
            Playlists
          </Typography>
        </Box>
        <Box sx={{ height: "calc(100vh - 300px)", overflowY: "auto" }}>
          {isLoading ? (
            <PlaylistSkeleton />
          ) : (
            <List>
              {albums.map((album) => (
                <ListItem
                  key={album._id}
                  disablePadding
                  sx={{ "&:hover": { bgcolor: "#18181b" }, borderRadius: 1 }}
                >
                  <ListItemButton
                    component={Link}
                    href={`/albums/${album._id}`}
                  >
                    <ListItemIcon>
                      <Image
                        src={album.imageUrl}
                        alt={album.title}
                        width={48}
                        height={48}
                        style={{ borderRadius: 4, objectFit: "cover" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={album.title}
                      secondary={`Album • ${album.artist}`}
                      primaryTypographyProps={{ noWrap: true }}
                      secondaryTypographyProps={{
                        noWrap: true,
                        color: "text.secondary",
                      }}
                    />
                    <Typography variant="subtitle1" sx={{ display: { xs: 'none', md: 'block' }, color: 'white' }}>
  
</Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );
}
