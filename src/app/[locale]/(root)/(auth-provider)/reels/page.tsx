"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Play,
  Flame,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/shared/Logo";
import { formatNumber } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

interface Reel {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  video: {
    url: string;
    thumbnail: string;
    duration: number;
  };
  caption: string;
  hashtags: string[];
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked: boolean;
  music: {
    title: string;
    artist: string;
  };
}

export default function ReelsPage() {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  // const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const reels: Reel[] = [
    {
      id: 1,
      user: {
        name: "Nguyễn Minh Anh",
        username: "@minhanh",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
      video: {
        url: "/placeholder.svg?height=600&width=400",
        thumbnail: "/placeholder.svg?height=600&width=400",
        duration: 15,
      },
      caption: "Sunset vibes tại Đà Lạt 🌅 Cảnh đẹp quá không thể tả!",
      hashtags: ["#dalat", "#sunset", "#vietnam", "#travel"],
      stats: {
        likes: 1234,
        comments: 89,
        shares: 45,
      },
      isLiked: false,
      music: {
        title: "Chill Vibes",
        artist: "Lo-fi Beats",
      },
    },
    {
      id: 2,
      user: {
        name: "Trần Văn Bình",
        username: "@vanbinh",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: false,
      },
      video: {
        url: "/placeholder.svg?height=600&width=400",
        thumbnail: "/placeholder.svg?height=600&width=400",
        duration: 22,
      },
      caption:
        "Món ăn street food Sài Gòn 🍜 Ai đoán được đây là món gì không?",
      hashtags: ["#streetfood", "#saigon", "#vietnam", "#food"],
      stats: {
        likes: 856,
        comments: 124,
        shares: 67,
      },
      isLiked: true,
      music: {
        title: "Sài Gòn Đêm Nay",
        artist: "V-Pop Mix",
      },
    },
    {
      id: 3,
      user: {
        name: "Lê Thu Hương",
        username: "@thuhuong",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
      video: {
        url: "/placeholder.svg?height=600&width=400",
        thumbnail: "/placeholder.svg?height=600&width=400",
        duration: 18,
      },
      caption: "Dance challenge mới nhất! 💃 Các bạn thử theo nhé!",
      hashtags: ["#dance", "#challenge", "#trending", "#viral"],
      stats: {
        likes: 2341,
        comments: 234,
        shares: 156,
      },
      isLiked: false,
      music: {
        title: "Dance Fever",
        artist: "EDM Hits",
      },
    },
  ];

  const handleScroll = (direction: "up" | "down") => {
    if (direction === "down" && currentReelIndex < reels.length - 1) {
      setCurrentReelIndex((prev) => prev + 1);
    } else if (direction === "up" && currentReelIndex > 0) {
      setCurrentReelIndex((prev) => prev - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentReel = reels[currentReelIndex];

  return (
    <div className="h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 dark:bg-gradient-to-b dark:from-background/50 dark:to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link href="/feeds">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Logo size={30} isText={false} />
              <span className="font-bold text-lg">Reels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative h-full">
        {/* Video Background */}
        <div className="absolute inset-0 flex items-center justify-center md:py-6">
          <div className="relative w-full max-w-sm h-full bg-background md:rounded-lg overflow-hidden">
            {/* Video Placeholder */}
            <div
              className="w-full h-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center cursor-pointer"
              onClick={togglePlayPause}
            >
              <img
                src={currentReel.video.thumbnail || "/placeholder.svg"}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/50 rounded-full p-4">
                    <Play className="h-8 w-8" />
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/30 hover:bg-background/50"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-20 flex flex-col gap-4 z-10">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={currentReel.user.avatar || "/placeholder.svg"}
                alt={currentReel.user.name}
              />
              <AvatarFallback>{currentReel.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="default"
              className="h-6 w-6 text-white bg-flamee-primary rounded-full absolute -bottom-1.5 -right-1.5"
            >
              <Plus />
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1">
              <Button variant="ghost" size="icon">
                <Heart
                  className={`h-7 w-7 ${
                    currentReel.isLiked
                      ? "fill-flamee-primary text-flamee-primary"
                      : ""
                  }`}
                />
              </Button>
              <span className="text-xs font-medium">
                {formatNumber(currentReel.stats.likes)}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-7 w-7" />
              </Button>
              <span className="text-xs font-medium">
                {formatNumber(currentReel.stats.comments)}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Button variant="ghost" size="icon">
                <Share className="h-7 w-7" />
              </Button>
              <span className="text-xs font-medium">
                {formatNumber(currentReel.stats.shares)}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 dark:bg-gradient-to-t dark:from-background/70 dark:to-transparent">
          <div className="sm:max-w-sm max-w-[300px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{currentReel.user.name}</span>
              {currentReel.user.isVerified && (
                <div className="bg-orange-500 rounded-full p-0.5">
                  <Flame className="h-3 w-3" />
                </div>
              )}
              <span className="text-sm">{currentReel.user.username}</span>
            </div>

            <p className="text-sm mb-2 line-clamp-2">{currentReel.caption}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {currentReel.hashtags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs border-none"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded animate-spin"></div>
                <span>
                  {currentReel.music.title} - {currentReel.music.artist}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow Navigation */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full h-12 w-12 ${
              currentReelIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handleScroll("up")}
            disabled={currentReelIndex === 0}
          >
            <ArrowUp className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={`rounded-full h-12 w-12 ${
              currentReelIndex === reels.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => handleScroll("down")}
            disabled={currentReelIndex === reels.length - 1}
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
