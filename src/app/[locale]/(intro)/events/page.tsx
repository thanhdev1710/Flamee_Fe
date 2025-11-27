import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Users, Clock, Search, Filter } from "lucide-react";
import Image from "next/image";

const upcomingEvents = [
  {
    id: 1,
    title: "Hội chợ Việc làm HUIT 2025",
    date: "2025-03-15",
    time: "08:00",
    location: "Cơ sở chính – 140 Lê Trọng Tấn",
    attendees: 350,
    maxAttendees: 2000,
    category: "Sự kiện lớn",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=60",
    description:
      "Quy tụ hơn 60 doanh nghiệp hàng đầu và mang đến hàng nghìn cơ hội việc làm cho sinh viên.",
  },
  {
    id: 2,
    title: "Workshop: Kỹ năng phỏng vấn chuyên nghiệp",
    date: "2025-02-22",
    time: "09:00",
    location: "Hội trường A – Cơ sở Tân Bình",
    attendees: 120,
    maxAttendees: 180,
    category: "Workshop",
    image:
      "https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=900&q=60",
    description:
      "Hướng dẫn thực chiến các dạng câu hỏi phỏng vấn, kỹ năng xử lý tình huống và xây dựng CV.",
  },
  {
    id: 3,
    title: "Tech Talk: AI & Blockchain Trends 2025",
    date: "2025-04-02",
    time: "18:00",
    location: "Hội trường lớn – Cơ sở Quận 9",
    attendees: 220,
    maxAttendees: 300,
    category: "Công nghệ",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=60",
    description:
      "Cập nhật xu hướng công nghệ mới nhất: AI thế hệ mới, Blockchain Layer 2 và ứng dụng doanh nghiệp.",
  },
  {
    id: 4,
    title: "Cuộc thi Lập trình Web HUIT 2025",
    date: "2025-03-28",
    time: "13:00",
    location: "Phòng máy – Cơ sở Tân Bình",
    attendees: 80,
    maxAttendees: 120,
    category: "Cuộc thi",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=60",
    description:
      "Thử thách lập trình React – NodeJS dành cho sinh viên yêu thích Web Development.",
  },
  {
    id: 5,
    title: "Ngày hội CLB – Hoạt động HUIT 2025",
    date: "2025-02-28",
    time: "07:30",
    location: "Sân trường – Cơ sở chính",
    attendees: 500,
    maxAttendees: 2500,
    category: "CLB – Hoạt động",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=60",
    description:
      "50+ CLB học thuật – nghệ thuật – thể thao tham gia giao lưu và tuyển thành viên.",
  },
  {
    id: 6,
    title: "Chiến dịch Xuân Yêu Thương 2025",
    date: "2025-02-10",
    time: "06:30",
    location: "Quận 12 – TP.HCM",
    attendees: 80,
    maxAttendees: 100,
    category: "Tình nguyện",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=60",
    description:
      "Hoạt động thiện nguyện hỗ trợ trẻ em khó khăn và các mái ấm địa phương.",
  },
];

const categories = [
  "Tất cả",
  "Sự kiện lớn",
  "Workshop",
  "Công nghệ",
  "Cuộc thi",
  "CLB – Hoạt động",
  "Tình nguyện",
];

export default function EventsPage() {
  return (
    <div className="min-h-svh">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-linear-to-b from-background to-muted/30">
        <div className="container mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-4 bg-emerald-100 text-emerald-600"
          >
            Sự kiện HUIT
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Kết nối qua
            <span className="block text-primary">Các sự kiện tại HUIT</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Tham gia sự kiện – hội thảo – workshop – hoạt động CLB để mở rộng
            mối quan hệ và phát triển kỹ năng trong môi trường đại học.
          </p>

          {/* Search & Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-background p-6 rounded-2xl shadow-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm sự kiện..." className="pl-10" />
              </div>

              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Khu vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="csc">Cơ sở chính</SelectItem>
                  <SelectItem value="tb">Tân Bình</SelectItem>
                  <SelectItem value="q9">Quận 9</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>

              <Button className="px-8">Tìm kiếm</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Sự kiện sắp diễn ra</h2>
            <Button variant="outline">Tạo sự kiện</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 grid-rows-[auto_1fr_auto]">
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="grid grid-rows-subgrid row-span-3 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1
      "
              >
                {/* 1. IMAGE */}
                <div className="relative w-full h-48">
                  <Image
                    src={event.image}
                    width={600}
                    height={400}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4">
                    {event.category}
                  </Badge>
                </div>

                {/* 2. CONTENT */}
                <CardHeader>
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {event.description}
                  </p>
                </CardHeader>

                {/* 3. FOOTER */}
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString("vi-VN")} –{" "}
                    {event.time}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {event.attendees}/{event.maxAttendees} người tham gia
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${
                          (event.attendees / event.maxAttendees) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <Button className="w-full mt-4">Đăng ký tham gia</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 bg-emerald-100 text-emerald-600"
              >
                Sự kiện nổi bật
              </Badge>

              <h2 className="text-3xl font-bold mb-4">
                Ngày hội Việc làm HUIT 2025
              </h2>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Hơn 50 doanh nghiệp – 2.000+ vị trí tuyển dụng – cơ hội thực tập
                và việc làm hấp dẫn dành cho sinh viên HUIT.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <span>15 Tháng 3, 2025</span>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <span>Cơ sở chính – Sân trường</span>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-primary" />
                  <span>2.000+ sinh viên tham dự</span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <span>07:30 – 16:00</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="px-8">
                  Đăng ký ngay
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  Xem chi tiết
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                width={600}
                height={400}
                src="https://huit.edu.vn/images/bgr-nhvl2025.jpg"
                alt="Ngày hội việc làm HUIT 2025"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
