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
import Footer from "@/components/landing-page/Footer";
import MenuBar from "@/components/landing-page/MenuBar";

export default function EventsPage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Ngày hội Việc làm HUIT 2025",
      date: "2025-03-15",
      time: "08:00",
      location: "Cơ sở chính – 140 Lê Trọng Tấn",
      attendees: 350,
      maxAttendees: 2000,
      category: "Sự kiện lớn",
      image:
        "https://huit.edu.vn/wp-content/uploads/2024/11/ngay-hoi-viec-lam-2048x1365.jpg",
      description:
        "Sự kiện quy mô lớn quy tụ hơn 50 doanh nghiệp, mang đến cơ hội thực tập và việc làm cho sinh viên.",
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
        "https://huit.edu.vn/wp-content/uploads/2024/05/hoi-thao-2048x1366.jpg",
      description:
        "Hướng dẫn cách trả lời phỏng vấn và xử lý tình huống thực tế cho sinh viên năm cuối.",
    },
    {
      id: 3,
      title: "HUIT Tech Talk: Blockchain & AI",
      date: "2025-04-02",
      time: "18:00",
      location: "Hội trường lớn – Cơ sở Quận 9",
      attendees: 220,
      maxAttendees: 300,
      category: "Công nghệ",
      image:
        "https://huit.edu.vn/wp-content/uploads/2024/12/hoi-thao-cn-1536x1025.jpg",
      description:
        "Buổi chia sẻ về ứng dụng Blockchain, AI vào doanh nghiệp và định hướng nghề nghiệp IT.",
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
        "https://huit.edu.vn/wp-content/uploads/2024/05/lap-trinh-competition.jpg",
      description:
        "Cuộc thi lập trình cấp trường dành cho sinh viên yêu thích Web, React, NodeJS.",
    },
    {
      id: 5,
      title: "Ngày hội CLB HUIT 2025",
      date: "2025-02-28",
      time: "07:30",
      location: "Sân trường – Cơ sở chính",
      attendees: 500,
      maxAttendees: 2500,
      category: "CLB – Hoạt động",
      image: "https://huit.edu.vn/wp-content/uploads/2024/03/huit-club-day.jpg",
      description:
        "31 CLB học thuật – văn nghệ – thể thao cùng giao lưu, tuyển thành viên mới.",
    },
    {
      id: 6,
      title: "Hoạt động tình nguyện: Xuân Yêu Thương",
      date: "2025-02-10",
      time: "06:30",
      location: "Quận 12 – TP.HCM",
      attendees: 80,
      maxAttendees: 100,
      category: "Tình nguyện",
      image: "https://huit.edu.vn/wp-content/uploads/2024/01/tinh-nguyen.jpg",
      description:
        "Chương trình thiện nguyện giúp đỡ trẻ em khó khăn trước thềm năm mới.",
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

  return (
    <div className="min-h-svh">
      <MenuBar />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="relative">
                  <Image
                    width={600}
                    height={400}
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-white">
                    {event.category}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                </CardHeader>

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
                    ></div>
                  </div>

                  <Button className="w-full mt-4">Đăng ký tham gia</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Xem thêm sự kiện
            </Button>
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
                src="https://huit.edu.vn/wp-content/uploads/2024/11/ngay-hoi-viec-lam-2048x1365.jpg"
                alt="Ngày hội việc làm HUIT 2025"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
