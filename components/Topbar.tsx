"use client";

import { useState } from "react";
import { useUserDetails } from "@/api/hooks/useUsers";
import { useAuthStore } from "../stores/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { ChatOutlined, AdminPanelSettingsOutlined, Logout, Login } from "@mui/icons-material";
import { parseCookies } from "nookies";

export default function Topbar() {
  const router = useRouter();
  const { isHydrated, logout } = useAuthStore();
  const cookies = parseCookies();
  const isAdmin = cookies.isAdmin === "true";

  const { data: user } = useUserDetails(cookies?.userId || "");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    ["token", "userId", "googleId", "isAdmin"].forEach((c) => {
      document.cookie = `${c}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    });
    toast.success("Logged out successfully");
    router.push("/login");
    handleMenuClose();
  };

  if (!isHydrated) return <div>Loading...</div>;

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "#09090b",
        borderBottom: "1px solid #27272a",
        boxShadow: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
        {/* Logo */}
       <Box
          component={Link}
          href="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Image
            src="/spotify.png"
            alt="Musify Logo"
            width={36}
            height={36}
            style={{ objectFit: "contain", cursor: "pointer" }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              letterSpacing: 0.5,
              color: "#fff",
            }}
          >
            Soundora
          </Typography>
        </Box>

        {/* Right-aligned navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {cookies?.userId && (
            <IconButton
              component={Link}
              href="/chat"
              sx={{
                color: "white",
                "&:hover": { bgcolor: "#18181b" },
                borderRadius: 1,
              }}
            >
              <ChatOutlined />
              <Typography sx={{ display: { xs: "none", md: "block" }, ml: 1 }}>
                Chat
              </Typography>
            </IconButton>
          )}

          {isAdmin && (
            <IconButton
              component={Link}
              href="/admin"
              sx={{
                color: "white",
                "&:hover": { bgcolor: "#18181b" },
                borderRadius: 1,
              }}
            >
              <AdminPanelSettingsOutlined />
              <Typography sx={{ display: { xs: "none", md: "block" }, ml: 1 }}>
                Admin
              </Typography>
            </IconButton>
          )}

          {cookies?.userId ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  src={user?.imageUrl}
                  alt={user?.fullName}
                  sx={{ width: 32, height: 32 }}
                >
                  {user?.fullName?.[0] || "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: { bgcolor: "#18181b", border: "1px solid #27272a", color: "white", mt: 1 },
                }}
              >
                <MenuItem disabled sx={{ opacity: 1 }}>
                  <Typography variant="body2">{user?.fullName || "User"}</Typography>
                </MenuItem>
                <Divider sx={{ bgcolor: "#27272a" }} />
                <MenuItem onClick={handleLogout} sx={{ "&:hover": { bgcolor: "#27272a" } }}>
                  <Logout fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton
              component={Link}
              href="/login"
              sx={{
                color: "white",
                "&:hover": { bgcolor: "#18181b" },
                borderRadius: 1,
              }}
            >
              <Login />
              <Typography sx={{ display: { xs: "none", md: "block" }, ml: 1 }}>
                Login
              </Typography>
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
