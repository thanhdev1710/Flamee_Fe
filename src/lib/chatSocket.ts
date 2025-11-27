// utils/chatSocket.ts
import { io, Socket } from "socket.io-client";

declare global {
  interface Window {
    _chatSocket?: Socket | null;
    _chatSocketUserId?: string;
  }
}

export const getChatSocket = (userId: string) => {
  // 1. Nếu socket đã tồn tại trên window -> dùng lại
  if (typeof window !== "undefined" && window._chatSocket) {
    const existingSocket = window._chatSocket;

    // Kiểm tra đúng userId
    if (window._chatSocketUserId === userId && existingSocket.connected) {
      return existingSocket;
    }

    // Sai user -> logout và login acc khác -> hủy socket cũ
    existingSocket.disconnect();
    window._chatSocket = null;
    window._chatSocketUserId = undefined;
  }

  // 2. Tạo socket mới
  const newSocket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    transports: ["websocket"],
    path: "/socket.io/",
    query: { userId },
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Lưu vào window (singleton thật sự)
  if (typeof window !== "undefined") {
    window._chatSocket = newSocket;
    window._chatSocketUserId = userId;
  }

  // 3. Kết nối nếu chưa connected
  if (!newSocket.connected) newSocket.connect();

  return newSocket;
};

// Ngắt socket khi logout
export const disconnectSocket = () => {
  if (typeof window !== "undefined" && window._chatSocket) {
    window._chatSocket.disconnect();
    window._chatSocket = null;
    window._chatSocketUserId = undefined;
  }
};
