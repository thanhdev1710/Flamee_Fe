import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getChatSocket = (userId: string, url: string) => {
    // 1. Nếu socket đã tồn tại và đang kết nối đúng userId -> Dùng lại (Singleton)
    if (socket && socket.connected) {
        // Kiểm tra xem socket này có đúng là của userId hiện tại không (tránh case đổi acc)
        // Lưu ý: auth hoặc query phải khớp logic server của bạn
        const queryUserId = (socket.io.opts.query as any)?.userId;
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
            path: "/socket.io",
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