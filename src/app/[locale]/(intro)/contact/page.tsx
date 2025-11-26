import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Users,
  Headphones,
} from "lucide-react";
import Footer from "@/components/landing-page/Footer";
import MenuBar from "@/components/landing-page/MenuBar";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Địa chỉ",
      details: [
        "140 Lê Trọng Tấn, Phường Tây Thạnh",
        "Quận Tân Phú, TP. Hồ Chí Minh",
      ],
      action: "Xem chỉ đường",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Điện thoại",
      details: ["(028) 3816 3333", "(028) 3816 3375"],
      action: "Gọi ngay",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["ctsv@huit.edu.vn", "daotao@huit.edu.vn"],
      action: "Gửi email",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Giờ làm việc",
      details: ["Thứ 2 – Thứ 6: 7:30 – 16:30", "Thứ 7: 7:30 – 11:30"],
      action: "Xem lịch",
    },
  ];

  const supportOptions = [
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Hỗ trợ Sinh viên (CTSV)",
      description: "Giải đáp thắc mắc về hoạt động, giấy tờ, hồ sơ sinh viên.",
      availability: "Giờ hành chính",
      action: "Liên hệ CTSV",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Hỗ trợ Đào tạo",
      description: "Đăng ký môn học – thời khóa biểu – kết quả học tập.",
      availability: "Giờ hành chính",
      action: "Liên hệ Đào tạo",
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Hỗ trợ Kỹ thuật",
      description: "Mail sinh viên, đăng nhập hệ thống, lỗi tài khoản.",
      availability: "24/7 (qua email)",
      action: "Gửi yêu cầu",
    },
  ];

  return (
    <div className="min-h-screen">
      <MenuBar />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-4 bg-emerald-100 text-emerald-600"
          >
            Liên hệ
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Kết nối với
            <span className="block text-primary">HUIT Social</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nếu bạn có góp ý, câu hỏi hoặc cần hỗ trợ — hãy liên hệ ngay. Chúng
            tôi luôn sẵn sàng hỗ trợ sinh viên HUIT.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <Card>
                <CardContent className="p-6">
                  <form className="space-y-6">
                    {/* Họ tên */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Họ</Label>
                        <Input id="firstName" placeholder="Nguyễn" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Tên</Label>
                        <Input id="lastName" placeholder="Văn A" />
                      </div>
                    </div>

                    {/* MSSV */}
                    <div className="space-y-2">
                      <Label htmlFor="mssv">Mã số sinh viên</Label>
                      <Input id="mssv" placeholder="K204060123" />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email sinh viên</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="205xxxxxx@student.huit.edu.vn"
                      />
                    </div>

                    {/* Chủ đề */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Chủ đề</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chủ đề" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daotao">Đào tạo</SelectItem>
                          <SelectItem value="ctsv">
                            Công tác sinh viên
                          </SelectItem>
                          <SelectItem value="khoahoc">Khoa – Bộ môn</SelectItem>
                          <SelectItem value="kythuat">
                            Hỗ trợ kỹ thuật
                          </SelectItem>
                          <SelectItem value="suco">Báo lỗi hệ thống</SelectItem>
                          <SelectItem value="khac">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Nội dung</Label>
                      <Textarea
                        id="message"
                        placeholder="Bạn cần hỗ trợ vấn đề gì?"
                        className="min-h-[120px]"
                      />
                    </div>

                    <Button className="w-full" size="lg">
                      Gửi tin nhắn
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg text-primary">
                          {info.icon}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{info.title}</h3>
                          {info.details.map((detail, idx) => (
                            <p
                              key={idx}
                              className="text-muted-foreground text-sm"
                            >
                              {detail}
                            </p>
                          ))}

                          <Button
                            variant="link"
                            className="p-0 h-auto mt-2 text-primary"
                          >
                            {info.action}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Cần hỗ trợ ngay?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chọn hình thức hỗ trợ phù hợp nhất. Đội ngũ của HUIT sẵn sàng giúp
              đỡ bạn.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4 text-primary">
                    {option.icon}
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {option.description}
                  </p>

                  <Badge variant="secondary" className="mb-4">
                    {option.availability}
                  </Badge>

                  <Button className="w-full">{option.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Bản đồ đến HUIT</h2>
            <p className="text-muted-foreground">
              Cơ sở chính: 140 Lê Trọng Tấn, P. Tây Thạnh, Quận Tân Phú
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.025965269857!2d106.6172028759348!3d10.80687378934469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b24b8c9e7af%3A0xf4a8cc5b64cf685!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBDw7RuZyBUaMawxqFuZw!5e0!3m2!1svi!2s!4v1710000000000"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Câu hỏi thường gặp</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tổng hợp các câu hỏi phổ biến của sinh viên HUIT.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Làm sao đăng ký môn học?</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Truy cập hệ thống Đào tạo → Đăng nhập → Chọn mục Đăng ký môn
                  học.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold">
                  Làm lại thẻ sinh viên như thế nào?
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Liên hệ Phòng CTSV để nộp đơn xin cấp lại thẻ sinh viên và
                  đóng phí.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold">
                  Mail sinh viên bị khóa phải làm sao?
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Gửi yêu cầu hỗ trợ kỹ thuật qua email hoặc hotline IT của
                  trường.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold">Học phí đóng ở đâu?</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Sinh viên đóng học phí qua ngân hàng Vietcombank hoặc trực
                  tiếp tại trường.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Xem thêm FAQ
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
