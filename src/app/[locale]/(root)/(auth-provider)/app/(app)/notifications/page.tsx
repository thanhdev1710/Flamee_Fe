import React from "react";
import Image from "next/image";

type Notification = {
  id: number;
  avatar: string;
  text: string;
  time: string;
  unread?: boolean;
  group: "Mới" | "Trước đó";
};

const notifications: Notification[] = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/40?img=1",
    text: "Phạm Hoàng Hiếu, Nhật Linh Nguyễn và 14 người khác đã bày tỏ cảm xúc về tin của bạn.",
    time: "3 giờ",
    unread: true,
    group: "Mới",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/40?img=2",
    text: "Hôm nay, bạn có thể ôn lại kỷ niệm.",
    time: "1 giờ",
    unread: true,
    group: "Mới",
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/40?img=3",
    text: "Gia Linh, Trịnh Thanh Tâm và Trung Kiên đã thêm vào tin của mình.",
    time: "46 phút",
    unread: true,
    group: "Mới",
  },
  {
    id: 4,
    avatar: "https://i.pravatar.cc/40?img=4",
    text: "Lê Tấn Tài đã nhắc đến bạn trong bình luận ở FC 230 tân sơn (20h45).",
    time: "5 phút",
    unread: true,
    group: "Mới",
  },
  {
    id: 5,
    avatar: "https://i.pravatar.cc/40?img=5",
    text: "Bây giờ trong Mua Bán Vợt Cầu Lông TPHCM: Cần giao lưu hoặc bán thắng.",
    time: "7 giờ",
    unread: false,
    group: "Trước đó",
  },
  {
    id: 6,
    avatar: "https://i.pravatar.cc/40?img=6",
    text: "FO4VN – Cộng đồng FIFA Online 4: Đủ wow chưa ta: acc có sẵn 13k3 FC.",
    time: "15 giờ",
    unread: false,
    group: "Trước đó",
  },
];

export default function Notifications() {
  const groups = ["Mới", "Trước đó"] as const;
  return (
    <div>
      {/* Container chính */}
      <div className="text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Thông báo</h2>
          <div className="flex gap-4 text-sm">
            <button className="text-blue-400 hover:underline">Tất cả</button>
            <button className="hover:underline">Chưa đọc</button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full">
          {groups.map((group) => (
            <div key={group}>
              <h3 className="px-4 pt-3 pb-1 text-sm font-semibold text-gray-400">
                {group}
              </h3>
              {notifications
                .filter((n) => n.group === group)
                .map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-gray-700 hover:bg-gray-800 transition ${
                      n.unread ? "bg-gray-900" : ""
                    }`}
                  >
                    <Image
                      src={n.avatar}
                      alt="avatar"
                      unoptimized
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm">{n.text}</p>
                      <span className="text-xs text-gray-400">{n.time}</span>
                    </div>
                    {n.unread && (
                      <span className="w-2 h-2 mt-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                ))}
            </div>
          ))}
          <div className="px-4 py-3 text-center">
            <button className="text-blue-400 hover:underline text-sm">
              Xem thông báo trước đó
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
