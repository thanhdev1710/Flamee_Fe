import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getChatSocket = (userId: string, url: string) => {
  // 1. Nếu socket đã tồn tại và đang kết nối đúng userId -> Dùng lại (Singleton)
  if (socket && socket.connected) {
    // Kiểm tra xem socket này có đúng là của userId hiện tại không (tránh case đổi acc)
    const optsQuery = socket.io.opts.query;

    let queryUserId: string | undefined;
    if (
      optsQuery &&
      typeof optsQuery === "object" &&
      !Array.isArray(optsQuery) &&
      "userId" in optsQuery
    ) {
      // ép về đúng kiểu object có userId
      const q = optsQuery as { userId?: string };
      queryUserId = q.userId;
    }

    if (queryUserId === userId) {
      return socket;
    } else {
      // Nếu khác user (đăng xuất -> đăng nhập user khác), ngắt cái cũ
      socket.disconnect();
      socket = null;
    }
  }

  // 2. Nếu chưa có socket, tạo mới
  if (!socket) {
    socket = io(url, {
      path: "/socket.io/",
      transports: ["websocket"], // Ép dùng websocket để tránh lỗi polling
      query: { userId },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: false, // Quan trọng: để ta kiểm soát khi nào connect
    });
  }

  // 3. Đảm bảo socket được kết nối
  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
