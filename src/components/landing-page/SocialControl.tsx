import {
  Images,
  Users,
  NotebookText,
  Sparkles,
  HeartHandshake,
  MessageSquareText,
} from "lucide-react";
import FeatureBox from "./FeatureBox";
import { Badge } from "../ui/badge";

const features = [
  {
    name: "Hình ảnh",
    icon: Images,
    description:
      "Chia sẻ khoảnh khắc của bạn qua hình ảnh – từ hoạt động trên lớp, sự kiện trường, đến cuộc sống hằng ngày.",
  },
  {
    name: "Người theo dõi",
    icon: Users,
    description:
      "Theo dõi bạn bè, giảng viên, CLB hoặc cộng đồng HUIT để không bỏ lỡ thông tin mới.",
  },
  {
    name: "Bài viết",
    icon: NotebookText,
    description:
      "Viết chia sẻ, đăng thông báo, tài liệu học tập hoặc cảm nghĩ mỗi ngày. Một không gian dành riêng cho bạn.",
  },
  {
    name: "Hoạt động",
    icon: Sparkles,
    description:
      "Tham gia sự kiện, thử thách, hoạt động CLB và kết nối với sinh viên HUIT từ mọi khóa.",
  },
  {
    name: "Tương tác xã hội",
    icon: HeartHandshake,
    description:
      "Like, chia sẻ, tương tác và kết nối với mọi người trong cộng đồng sinh viên.",
  },
  {
    name: "Bình luận",
    icon: MessageSquareText,
    description:
      "Trao đổi, thảo luận học tập hoặc trò chuyện vui vẻ ngay dưới mỗi bài viết.",
  },
];

function SocialControl() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-6">
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-600 hover:bg-orange-100"
          >
            Mạng Xã Hội HUIT
          </Badge>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Tất Cả Trong Tầm Tay Bạn
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Chủ động xây dựng cộng đồng, chia sẻ hành trình học tập và kết nối
            với sinh viên HUIT theo cách của riêng bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <FeatureBox key={feature.name} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialControl;
