"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../stores/useChatStore";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Topbar from "../../components/Topbar";
import UsersList from "../../components/chat/UsersList";
import ChatHeader from "../../components/chat/ChatHeader";
import MessageInput from "../../components/chat/MessageInput";
import Image from "next/image";
import { useUserDetails } from "@/api/hooks/useUsers";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const NoConversationPlaceholder = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: 2,
      p: 2,
    }}
  >
    <Image
      src="/spotify.png"
      alt="Spotify"
      width={64}
      height={64}
      className="animate-bounce"
    />
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" color="text.secondary">
        No conversation selected
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Choose a friend to start chatting
      </Typography>
    </Box>
  </Box>
);

interface ChatPageProps {
  initialUserId: string | null;
  initialIsAdmin: boolean;
}

export default function ChatPage({
  initialUserId,
  initialIsAdmin,
}: ChatPageProps) {
  const cookies = parseCookies();
  const { data: user } = useUserDetails(cookies.userId || "");
  const { fetchUsers, fetchMessages, selectedUser, messages, setSelectedUser } =
    useChatStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize socket & fetch users
  useEffect(() => {
    if (user && initialUserId) {
      useChatStore.getState().initSocket(initialUserId);
      fetchUsers();
    }
    return () => useChatStore.getState().disconnectSocket();
  }, [fetchUsers, user, initialUserId]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedUser && user) {
      fetchMessages(selectedUser._id);
      setShowMobileChat(true); 
    }
  }, [selectedUser, fetchMessages, user]);

  // Handle back button on mobile
  const handleBackToUserList = () => {
    setShowMobileChat(false);
    setSelectedUser(null);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "linear-gradient(to bottom, #18181b, #09090b)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Topbar />
      <Box
        sx={{
          mt: "60px",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "300px 1fr" },
          height: "calc(100vh - 60px)",
          overflow: "hidden",
        }}
      >
        {/* Users list - Hidden on mobile when chat is open */}
        <Box
          sx={{
            display: {
              xs: showMobileChat ? "none" : "block",
              lg: "block",
            },
            borderRight: { lg: "1px solid #27272a" },
            height: "100%",
          }}
        >
          <UsersList />
        </Box>

        {/* Chat area - Hidden on mobile when no chat selected */}
        <Box
          sx={{
            display: {
              xs: showMobileChat ? "flex" : "none",
              lg: "flex",
            },
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {selectedUser ? (
            <>
              {/* Mobile Back Button + Chat Header */}
              <Box sx={{ flexShrink: 0 }}>
                <Box
                  sx={{
                    display: { xs: "flex", lg: "none" },
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    borderBottom: "1px solid #333",
                  }}
                >
                  <IconButton
                    onClick={handleBackToUserList}
                    sx={{ color: "white" }}
                  >
                    <ArrowBack />
                  </IconButton>
                  <Avatar
                    src={selectedUser.imageUrl}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {selectedUser.fullName}
                  </Typography>
                </Box>
                <Box sx={{ display: { xs: "none", lg: "block" } }}>
                  <ChatHeader />
                </Box>
              </Box>

              {/* Messages container */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  overflowX: "hidden",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minHeight: 0,
                  scrollbarWidth: "thin",
                  scrollbarColor: "#888 transparent",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "3px",
                    "&:hover": {
                      backgroundColor: "#555",
                    },
                  },
                }}
              >
                {messages
                  .filter(
                    (msg) =>
                      (msg.senderId === user?._id &&
                        msg.receiverId === selectedUser._id) ||
                      (msg.senderId === selectedUser._id &&
                        msg.receiverId === user?._id)
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .map((message) => (
                    <Box
                      key={message._id}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        flexDirection:
                          message.senderId === user?._id
                            ? "row-reverse"
                            : "row",
                        flexShrink: 0,
                      }}
                    >
                      <Avatar
                        src={
                          message.senderId === user?._id
                            ? user.imageUrl
                            : selectedUser.imageUrl
                        }
                        sx={{ width: 32, height: 32, flexShrink: 0 }}
                      />
                      <Box
                        sx={{
                          bgcolor:
                            message.senderId === user?._id
                              ? "#22c55e"
                              : "#18181b",
                          borderRadius: 2,
                          p: 2,
                          maxWidth: "70%",
                          wordBreak: "break-word",
                        }}
                      >
                        <Typography variant="body2">
                          {message.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.5,
                            display: "block",
                            color:
                              message.senderId === user?._id
                                ? "rgba(0,0,0,0.7)"
                                : "text.secondary",
                          }}
                        >
                          {formatTime(message.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message input */}
              <Box sx={{ flexShrink: 0, p: 1, borderTop: "1px solid #333" }}>
                <MessageInput />
              </Box>
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps<ChatPageProps> = async (
  context
) => {
  const cookies = parseCookies(context);
  return {
    props: {
      initialUserId: cookies.userId || null,
      initialIsAdmin: cookies.isAdmin === "true" || false,
    },
  };
};
