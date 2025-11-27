import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Zap, Globe } from "lucide-react";
import Footer from "@/components/landing-page/Footer";
import MenuBar from "@/components/landing-page/MenuBar";
import Image from "next/image";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Nguyễn Minh Khang",
      role: "Founder & Backend Engineer",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Sinh viên HUIT đam mê công nghệ và mong muốn xây dựng một nền tảng kết nối dành riêng cho trường.",
    },
    {
      name: "Lê Hoàng Thư",
      role: "Frontend Developer",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Tập trung tạo nên giao diện hiện đại – thân thiện để sinh viên dễ dàng sử dụng.",
    },
    {
      name: "Trần Gia Huy",
      role: "UI/UX Designer",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Thiết kế trải nghiệm phù hợp với sinh viên: tối giản, trực quan và đẹp mắt.",
    },
    {
      name: "Phạm Quỳnh Anh",
      role: "Content & Community Lead",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Kết nối sinh viên, câu lạc bộ và khoa để xây dựng cộng đồng HUIT năng động.",
    },
  ];

  const values = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Kết nối cộng đồng",
      description:
        "Tạo không gian chung nơi sinh viên, cựu sinh viên và giảng viên có thể chia sẻ, học hỏi và hỗ trợ lẫn nhau.",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Tôn trọng & Văn minh",
      description:
        "Ưu tiên sự tôn trọng, minh bạch và tinh thần sinh viên HUIT trong mọi tương tác.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Đổi mới sáng tạo",
      description:
        "Không ngừng cải tiến để mang lại trải nghiệm tốt nhất cho cộng đồng HUIT.",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Tác động tích cực",
      description:
        "HUIT Social thúc đẩy môi trường năng động, lan tỏa giá trị tốt đẹp và tinh thần sinh viên.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Sinh viên tham gia" },
    { number: "20+", label: "Câu lạc bộ hoạt động" },
    { number: "50,000+", label: "Bài viết & khoảnh khắc" },
    { number: "99.9%", label: "Thời gian hoạt động" },
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
            Giới thiệu
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Mạng Xã Hội Dành Riêng Cho{" "}
            <span className="block text-primary">Sinh Viên HUIT</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            HUIT Social được xây dựng nhằm mang đến nơi kết nối sinh viên –
            giảng viên – câu lạc bộ một cách hiện đại, thân thiện và bảo mật.
            Chia sẻ khoảnh khắc, học hỏi cùng nhau và đồng hành trong hành trình
            đại học.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl sm:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 bg-emerald-100 text-emerald-600"
              >
                Sứ mệnh
              </Badge>

              <h2 className="text-3xl font-bold mb-6">
                Kết nối – Chia sẻ – Phát triển
              </h2>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                HUIT Social hướng đến việc tạo ra một không gian số an toàn,
                tích cực, giúp sinh viên chia sẻ câu chuyện của mình, cập nhật
                thông tin từ khoa – CLB, và xây dựng các mối quan hệ giá trị
                trong môi trường đại học.
              </p>

              <div className="flex items-center space-x-4">
                <Target className="h-6 w-6 text-primary" />
                <span className="font-medium">
                  Mục tiêu trở thành nền tảng số trung tâm của sinh viên HUIT
                </span>
              </div>
            </div>

            <div className="relative">
              <Image
                height={400}
                width={600}
                src="/placeholder.svg?height=400&width=600"
                alt="Sinh viên HUIT"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-emerald-100 text-emerald-600"
            >
              Giá trị cốt lõi
            </Badge>

            <h2 className="text-3xl font-bold mb-4">
              Điều Chúng Tôi Theo Đuổi
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những giá trị này định hình văn hoá và định hướng phát triển của
              HUIT Social.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-emerald-100 text-emerald-600"
            >
              Đội ngũ phát triển
            </Badge>

            <h2 className="text-3xl font-bold mb-4">
              Những Người Đứng Sau HUIT Social
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              Đội ngũ sinh viên trẻ cùng chung đam mê công nghệ và mong muốn
              mang đến một nền tảng kết nối hiện đại cho HUIT.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                    />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng tham gia cộng đồng HUIT?
          </h2>

          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Hãy kết nối với bạn bè, cháy hết mình cùng các CLB và tạo nên hành
            trình đại học tuyệt vời nhất của bạn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8">
              Tham gia ngay
            </Button>
            <Button size="lg" variant="ghost" className="px-8">
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
