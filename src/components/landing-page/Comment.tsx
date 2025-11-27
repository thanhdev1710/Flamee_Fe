import { Badge } from "@/components/ui/badge";
import CommentBox, { CommentData } from "./CommentBox";

const comments: CommentData[] = [
  {
    rate: "Nền tảng mạng xã hội sinh viên HUIT giúp mình nắm bắt thông tin sự kiện nhanh hơn rất nhiều. Giao diện dễ dùng và tiện lợi.",
    username: "Nguyễn Minh Hoàng",
    auth: "Sinh viên Khoa CNTT",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    rate: "Tính năng CLB, sự kiện, bài viết đều hoạt động ổn định. Đây đúng là thứ sinh viên cần để kết nối và học hỏi thêm.",
    username: "Trần Thảo Vy",
    auth: "Thành viên CLB Marketing",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    rate: "Là cựu sinh viên, mình rất vui khi thấy trường có một nền tảng kết nối riêng. Mong rằng HUIT Social sẽ tiếp tục phát triển mạnh mẽ.",
    username: "Phạm Quốc Đạt",
    auth: "Cựu sinh viên – K20",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    rate: "Ứng dụng chạy mượt, cộng đồng tích cực. Mình đặc biệt thích phần chia sẻ học thuật và tài liệu bổ ích từ các bạn sinh viên.",
    username: "Lê Gia Bảo",
    auth: "Sinh viên Khoa Cơ Khí",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    rate: "Những sự kiện CLB trên HUIT Social giúp mình biết thêm nhiều cơ hội phát triển bản thân. Thật sự rất hữu ích!",
    username: "Hoàng Mỹ Linh",
    auth: "Sinh viên Khoa Kinh Tế",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    rate: "Mình rất thích cách HUIT Social tạo cảm giác gần gũi giữa sinh viên các khóa. Đây là một nền tảng cực kỳ cần thiết!",
    username: "Đặng Thanh Phúc",
    auth: "Sinh viên Khoa Điện – Điện tử",
    image: "https://randomuser.me/api/portraits/men/61.jpg",
  },
];

export default function CommentSection() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-14">
          <Badge
            variant="secondary"
            className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300"
          >
            Cảm nhận
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Cảm nhận của sinh viên HUIT
          </h2>
          <p className="mt-2 text-muted-foreground">
            Những chia sẻ chân thật từ cộng đồng HUIT Social
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-10">
          {comments.map((c, i) => (
            <CommentBox data={c} key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
