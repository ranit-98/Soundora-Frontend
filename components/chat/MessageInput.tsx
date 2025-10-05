
"use client";

import { useState } from "react";
import { useChatStore } from "../../stores/useChatStore";
import { Box, TextField, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useUserDetails } from "@/api/hooks/useUsers";
import { parseCookies } from "nookies";

export default function MessageInput() {
  const [newMessage, setNewMessage] = useState("");
  const { selectedUser, sendMessage } = useChatStore();
  const cookies = parseCookies();
  const { data: user } = useUserDetails(cookies.userId || "");

  const handleSend = () => {
  
    if (!selectedUser || !user || !newMessage.trim()) return;
    sendMessage(selectedUser._id, user._id, newMessage.trim());
    setNewMessage("");
  };

  return (
    <Box sx={{ p: 2, borderTop: "1px solid #27272a", mt: "auto" }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          fullWidth
          sx={{ bgcolor: "#18181b", borderRadius: 1 }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!newMessage.trim()}
          sx={{ bgcolor: "#22c55e", color: "black", "&:hover": { bgcolor: "#16a34a" } }}
        >
          <Send fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}