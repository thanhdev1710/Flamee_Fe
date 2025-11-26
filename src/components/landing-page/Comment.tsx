"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import CommentBox, { CommentData } from "./CommentBox";

const CommentSection = () => {
  const [features] = useState<CommentData[]>([
    {
      rate: "Nền tảng mạng xã hội sinh viên HUIT giúp mình nắm bắt thông tin sự kiện nhanh hơn rất nhiều. Giao diện dễ dùng và tiện lợi.",
      username: "Nguyễn Minh Hoàng",
      auth: "Sinh viên Khoa CNTT",
      image:
        "https://images.generated.photos/Ip2PzefDs2fzGEGZm4G6dkprdFM5l-tBC0bYKT1eZqg/rs:fit:512:512/czM6Ly9nZW5lcmF0ZWRfcGhvdG9zL3Bob3RvLzAwMzQwNzIuanBn.jpg",
    },
    {
      rate: "Tính năng CLB, sự kiện, bài viết đều hoạt động ổn định. Đây đúng là thứ sinh viên cần để kết nối và học hỏi thêm.",
      username: "Trần Thảo Vy",
      auth: "Thành viên CLB Marketing HUIT",
      image:
        "https://images.generated.photos/5x14hTrgG2wE8xmPKzW0fvkYlCYwH14r2raXI5Qun7Q/rs:fit:512:512/czM6Ly9nZW5lcmF0ZWRfcGhvdG9zL3Bob3RvLzAwMzQwMzguanBn.jpg",
    },
    {
      rate: "Là cựu sinh viên, mình rất vui khi thấy trường có một nền tảng kết nối riêng. Mong rằng HUIT Social sẽ tiếp tục phát triển mạnh mẽ.",
      username: "Phạm Quốc Đạt",
      auth: "Cựu sinh viên – K20",
      image:
        "https://images.generated.photos/nYk-fYy3cR5Yp9rHW7QV7h3y8YEkFHklLqTGW6qhF2w/rs:fit:512:512/czM6Ly9nZW5lcmF0ZWRfcGhvdG9zL3Bob3RvLzAwMzQwNDkuanBn.jpg",
    },
  ]);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            variant="secondary"
            className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100"
          >
            Cảm nhận
          </Badge>

          <h2 className="text-3xl font-bold tracking-tight">
            Cảm nhận của sinh viên HUIT
          </h2>

          <p className="mt-2 text-muted-foreground">
            Những chia sẻ chân thật từ cộng đồng HUIT Social
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-8">
          {features.map((feature, index) => (
            <CommentBox data={feature} key={index} />
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30"></div>
          <div className="h-2 w-2 rounded-full bg-primary"></div>
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30"></div>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
