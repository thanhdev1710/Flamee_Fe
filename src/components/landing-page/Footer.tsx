import Link from "next/link";
import { Facebook, Linkedin, Twitter, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo + Info */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-md">
                <Image
                  width={40}
                  height={40}
                  src="/assets/images/logo.svg"
                  alt="HUIT Social"
                />
              </div>
              <span className="text-2xl font-bold text-primary">
                HUIT Social
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-slate-300 max-w-xs">
              Nền tảng kết nối sinh viên Trường Đại học Công Thương TP.HCM – nơi
              chia sẻ học tập, sự kiện và hoạt động cộng đồng.
            </p>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>140 Lê Trọng Tấn, Tân Phú, TP. Hồ Chí Minh</span>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@huit.edu.vn</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>028 3816 3317</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex space-x-3 pt-2">
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-slate-800"
              >
                <Facebook className="h-5 w-5 text-slate-300 hover:text-white transition" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-slate-800"
              >
                <Linkedin className="h-5 w-5 text-slate-300 hover:text-white transition" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-slate-800"
              >
                <Twitter className="h-5 w-5 text-slate-300 hover:text-white transition" />
              </Button>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-5">
            <h4 className="text-lg font-semibold text-white">Khám phá</h4>

            <div className="flex flex-col space-y-3 text-sm">
              <Link href="/" className="hover:text-primary transition">
                Trang chủ
              </Link>
              <Link href="/events" className="hover:text-primary transition">
                Sự kiện
              </Link>
            </div>

            <div className="border-t border-slate-800 pt-4"></div>

            <h4 className="text-lg font-semibold text-white pt-2">
              Kết nối nhanh
            </h4>
            <div className="flex flex-col space-y-3 text-sm">
              <Link href="/clubs" className="hover:text-primary transition">
                Câu lạc bộ
              </Link>
              <Link href="/blog" className="hover:text-primary transition">
                Blog sinh viên
              </Link>
            </div>
          </div>

          {/* About */}
          <div className="space-y-5">
            <h4 className="text-lg font-semibold text-white">Thông tin</h4>

            <div className="flex flex-col space-y-3 text-sm">
              <Link href="/about" className="hover:text-primary transition">
                Giới thiệu
              </Link>
              <Link href="/contact" className="hover:text-primary transition">
                Liên hệ
              </Link>
              <Link href="/privacy" className="hover:text-primary transition">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="hover:text-primary transition">
                Điều khoản sử dụng
              </Link>
            </div>

            <div className="border-t border-slate-800 pt-4"></div>

            <h4 className="text-lg font-semibold text-white pt-2">Hỗ trợ</h4>
            <div className="flex flex-col space-y-3 text-sm">
              <Link href="/help" className="hover:text-primary transition">
                Trung tâm hỗ trợ
              </Link>
              <Link href="/feedback" className="hover:text-primary transition">
                Góp ý
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
          © 2024 HUIT Social – Designed for Students.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
