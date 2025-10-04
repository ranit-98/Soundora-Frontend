"use client";

import { useUsers } from "@/api/hooks/useChat";
import { useChatStore } from "../../stores/useChatStore";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import { parseCookies } from "nookies";
import { useMemo } from "react";

const UsersListSkeleton = () => (
  <Box sx={{ p: 2 }}>
    {[...Array(5)].map((_, i) => (
      <Box
        key={i}
        sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
      >
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width="60%" />
      </Box>
    ))}
  </Box>
);

export default function UsersList() {
  const { selectedUser, setSelectedUser, onlineUsers } = useChatStore();
  const { data: users = [], isLoading } = useUsers();
  const cookies = parseCookies();

  const filteredUsers = useMemo(
    () => users.filter((user) => user._id !== cookies?.userId),
    [users, cookies?.userId]
  );

  return (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      {isLoading ? (
        <UsersListSkeleton />
      ) : (
        <List sx={{ p: { xs: 1, lg: 2 } }}>
          {filteredUsers?.map((user) => {
            const isOnline =
              onlineUsers.has(user.googleId) || onlineUsers.has(user._id);
            const isSelected = selectedUser?.googleId === user.googleId;

            return (
              <ListItem
                key={user._id}
                disablePadding
                sx={{
                  borderRadius: 1,
                  bgcolor: isSelected ? "#18181b" : "transparent",
                  "&:hover": { bgcolor: "#18181b80" },
                  transition: "background-color 0.2s",
                  mb: 0.5,
                }}
              >
                <ListItemButton
                  onClick={() => setSelectedUser(user)}
                  sx={{
                    py: { xs: 1.5, lg: 1 },
                    px: { xs: 2, lg: 2 },
                  }}
                >
                  {/* Avatar + Online Dot */}
                  <ListItemAvatar sx={{ position: "relative", minWidth: { xs: 56, lg: 64 } }}>
                    <Avatar
                      src={user.imageUrl}
                      sx={{
                        width: { xs: 40, lg: 48 },
                        height: { xs: 40, lg: 48 },
                      }}
                    >
                      {user.fullName[0]}
                    </Avatar>
                 
                  </ListItemAvatar>

                  {/* Texts aligned */}
                  <ListItemText
                    primary={
                      <Typography
                        noWrap
                        fontSize={{ xs: "0.95rem", lg: "1rem" }}
                        fontWeight={500}
                      >
                        {user.fullName}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: isOnline ? "#22c55e" : "#6b7280",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontSize="0.75rem"
                          color={isOnline ? "success.main" : "text.secondary"}
                        >
                          {isOnline ? "Online" : "Offline"}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}
