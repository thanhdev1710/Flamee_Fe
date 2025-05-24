import Link from "next/link";
import { Facebook, Linkedin, Twitter, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <img
                  src="/assets/images/logo.svg"
                  alt="Flamee logo"
                  className="h-5 w-5"
                />
              </div>
              <span className="text-xl font-bold text-primary">Flamee</span>
            </Link>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  140 Lê Trọng Tấn, phường Tây Thạnh, quận Tân Phú, TP. Hồ Chí
                  Minh
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>flamee123@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>0123456789</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-300 hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-300 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-300 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Product</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Download
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Location
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Services
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Address
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Map
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Pricing
              </Link>
            </nav>
          </div>

          {/* Community Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Community</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Accessibility
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Frontline
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Gift
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Quest
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                About us
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Contact
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Center
              </Link>
            </nav>
          </div>

          {/* About Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">About</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Investors
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Careers
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Founders
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Work
              </Link>
              <Link
                href="#"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Newsroom
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2024 Flamee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
