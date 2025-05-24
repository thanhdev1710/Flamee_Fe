import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import type { Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ModeToggle } from "@/components/shared/ModeToggle";

const geistInter = Inter({
  subsets: ["latin", "vietnamese"],
  adjustFontFallback: true,
  display: "auto",
  fallback: ["'Inter', sans-serif"],
  preload: true,
  style: ["normal"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flamee-fe.vercel.app"),

  title: {
    default: "Flamee",
    template: "%s | Flamee",
  },

  abstract:
    "Flamee - Mạng xã hội ảnh, video dành cho người Việt kết nối và chia sẻ.",

  description:
    "Flamee là mạng xã hội thế hệ mới dành cho người Việt, nơi bạn có thể kết nối bạn bè, chia sẻ hình ảnh, video và khám phá những khoảnh khắc đáng nhớ.",

  keywords: [
    "Flamee",
    "mạng xã hội",
    "social network",
    "kết nối bạn bè",
    "chia sẻ ảnh",
    "chia sẻ video",
    "mạng xã hội ảnh",
    "ứng dụng mạng xã hội",
    "nền tảng mạng xã hội",
    "social media app",
    "social media Việt Nam",
    "mạng xã hội Việt Nam",
    "kết nối người dùng",
    "social interaction",
    "social feed",
    "trang cá nhân",
    "flamee-fe.vercel.app",
    "ứng dụng chia sẻ",
    "Flamee app",
    "Flamee social media",
    "startup Việt Nam",
    "cộng đồng số",
    "kết nối trực tuyến",
    "khoảnh khắc cuộc sống",
    "Flamee mạng xã hội",
    "ứng dụng chia sẻ ảnh",
    "ứng dụng chia sẻ video",
    "Flamee chính thức",
    "app mạng xã hội mới",
  ],

  applicationName: "Flamee",
  generator: "Next.js",
  creator: "@Chiithanh1",
  authors: [{ name: "ThanhDev", url: "https://thanhdev.io.vn" }],
  publisher: "Flamee Team",

  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },

  category: "social",
  classification: "Networking and Communication",

  openGraph: {
    title: "Flamee - Mạng xã hội kết nối thời đại số",
    description:
      "Tham gia Flamee để chia sẻ hình ảnh, video và kết nối với cộng đồng người Việt năng động. Nền tảng mạng xã hội hiện đại, đơn giản và an toàn.",
    url: "https://flamee-fe.vercel.app",
    siteName: "Flamee",
    images: [
      {
        url: "https://flamee-fe.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Giao diện mạng xã hội Flamee",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Flamee - Kết nối và chia sẻ khoảnh khắc của bạn",
    description:
      "Khám phá Flamee – ứng dụng mạng xã hội dành cho người Việt để kết nối, chia sẻ và tương tác mỗi ngày.",
    creator: "@Chiithanh1",
    images: ["https://flamee-fe.vercel.app/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#615EF0",
      },
    ],
  },

  alternates: {
    canonical: "https://flamee-fe.vercel.app",
    languages: {
      vi: "https://flamee-fe.vercel.app",
    },
  },

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    title: "Flamee",
    statusBarStyle: "default",
  },

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  verification: {
    google: "googled7cd0c3e1cdd6cd4.html",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${geistInter.className} antialiased relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <div className="fixed bottom-3 right-3">
            <ModeToggle />
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
