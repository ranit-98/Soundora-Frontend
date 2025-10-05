// stores/useChatStore.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { io, Socket } from "socket.io-client";
import { User, Message } from "@/types/types";

interface ChatState {
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;
  users: User[];
  currentUserId: string | null;

  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  addMessage: (message: Message) => void;
  setSelectedUser: (user: User | null) => void;
  fetchUsers: () => Promise<void>;
  fetchMessages: (otherUserId: string) => Promise<void>;
  setCurrentUserId: (userId: string | null) => void;
  updateActivity: (activity: string) => void;
}

const baseURL = process.env.NEXT_PUBLIC_SOCKET_URL ||  "http://localhost:3001";

const socket: Socket = io(baseURL, {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      isConnected: false,
      onlineUsers: new Set(),
      userActivities: new Map(),
      messages: [],
      selectedUser: null,
      users: [],
      currentUserId: null,

      setSelectedUser: (user) => {
        console.log(
          `[CHATSTORE] Setting selected user: ${user?._id || "null"}`
        );
        set({ selectedUser: user });
      },

      setCurrentUserId: (userId) => {
        console.log(`[CHATSTORE] Setting current user ID: ${userId || "null"}`);
        set({ currentUserId: userId });
      },

      initSocket: (userId) => {
        if (!get().isConnected) {
          console.log(
            `[SOCKET] Initializing socket for user: ${userId} at ${new Date().toLocaleTimeString()}`
          );

          socket.auth = { userId }; // Use _id
          socket.connect();

          socket.emit("user_connected", userId);
          console.log(`[SOCKET] Emitted user_connected for: ${userId}`);

          socket.on("connect", () => {
            console.log(
              `[SOCKET] Connected successfully with ID: ${socket.id}`
            );
            set({ isConnected: true });
          });

          socket.on("connect_error", (err) => {
            console.error(`[SOCKET] Connection error: ${err.message}`);
          });

          socket.on("disconnect", (reason) => {
            console.warn(`[SOCKET] Disconnected: ${reason}`);
            set({ isConnected: false });
          });

          socket.on("users_online", (users: string[]) => {
            console.log(`[SOCKET] Received online users:`, users);
            set({ onlineUsers: new Set(users) });
          });

          socket.on("activities", (activities: [string, string][]) => {
            console.log(`[SOCKET] Received activities:`, activities);
            set({ userActivities: new Map(activities) });
          });

          socket.on("user_connected", (userId: string) => {
            console.log(`[SOCKET] User connected: ${userId}`);
            set((state) => ({
              onlineUsers: new Set([...state.onlineUsers, userId]),
            }));
          });

          socket.on("user_disconnected", (userId: string) => {
            console.log(`[SOCKET] User disconnected: ${userId}`);
            set((state) => {
              const newOnlineUsers = new Set(state.onlineUsers);
              newOnlineUsers.delete(userId);
              return { onlineUsers: newOnlineUsers };
            });
          });

         
          socket.on("receive_message", (message: Message) => {
            set((state) => {
              if (state.messages.some((m) => m._id === message._id))
                return state;
              return { messages: [...state.messages, message] };
            });
          });

          socket.on("message_sent", (message: Message) => {
            set((state) => {
              if (state.messages.some((m) => m._id === message._id))
                return state;
              return { messages: [...state.messages, message] };
            });
          });

          socket.on("message_error", (error: string) => {
            console.error(`[SOCKET] Message error:`, error);
          });

          socket.on("messages_fetched", (messages: Message[]) => {
            console.log(`[SOCKET] Messages fetched:`, messages);
            set((state) => ({
              messages: [...state.messages, ...messages].sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              ),
            }));
          });

          socket.on("activity_updated", ({ userId, activity }) => {
            console.log(`[SOCKET] Activity updated for ${userId}: ${activity}`);
            set((state) => {
              const newActivities = new Map(state.userActivities);
              newActivities.set(userId, activity);
              return { userActivities: newActivities };
            });
          });

          set({ isConnected: true, currentUserId: userId });
        } else {
          console.log(
            `[SOCKET] Already connected — skipping init for ${userId}`
          );
        }
      },

      disconnectSocket: () => {
        if (get().isConnected) {
          console.log(
            `[SOCKET] Disconnecting socket at ${new Date().toLocaleTimeString()}`
          );
          socket.disconnect();
          set({
            isConnected: false,
            onlineUsers: new Set(),
            userActivities: new Map(),
            currentUserId: null,
            messages: [],
            selectedUser: null,
          });
        }
      },

      sendMessage: (receiverId, senderId, content) => {
        if (socket && socket.connected) {
          socket.emit("send_message", { receiverId, senderId, content });
        } else {
          console.error(`[SOCKET] Cannot send message: Socket not connected`);
        }
      },

      addMessage: (message) => {
        console.log(`[CHATSTORE] Adding message locally:`, message);
        set((state) => ({ messages: [...state.messages, message] }));
      },

      fetchUsers: async () => {
        try {
          console.log(`[CHATSTORE] Fetching users from ${baseURL}/users`);
          const response = await fetch(`${baseURL}/users`, {
            method: "GET",
            credentials: "include",
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
          }
          const users: User[] = await response.json();
          console.log(`[CHATSTORE] Users fetched:`, users);
          set({ users });
        } catch (error) {
          console.error(`[CHATSTORE] Error fetching users:`, error);
        }
      },

      fetchMessages: async (otherUserId: string) => {
        const userId = get().currentUserId;
        if (!socket || !socket.connected || !userId) {
          console.error(
            `[SOCKET] Cannot fetch messages: Socket not connected or userId missing`,
            { userId, socketConnected: socket?.connected }
          );
          return;
        }
        console.log(
          `[SOCKET] Emitting fetch_messages for userId: ${userId}, otherUserId: ${otherUserId}`
        );
        socket.emit("fetch_messages", { userId, otherUserId });
      },

      updateActivity: (activity: string) => {
        const { currentUserId } = get();
        if (socket && socket.connected && currentUserId) {
          console.log(
            `[SOCKET] Emitting update_activity for ${currentUserId}: ${activity}`
          );
          socket.emit("update_activity", { userId: currentUserId, activity });
        } else {
          console.error(
            `[SOCKET] Cannot update activity: Socket not connected or userId missing`
          );
        }
      },
    }),
    { name: "chatStore" }
  )
);
