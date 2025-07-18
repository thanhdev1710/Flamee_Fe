// components/ProfileHeader.tsx
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Camera, User } from "lucide-react";
import Image from "next/image";

export default function ProfileHeader() {
  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20">
      {/* Cover */}
      <div className="relative md:h-[260px] h-[180px] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <Image
          src="https://placehold.co/600x400/6366f1/ffffff?text=Cover+Photo"
          alt="Cover Photo"
          fill
          className="object-cover mix-blend-overlay opacity-60"
        />
        <Button className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900">
          <Camera className="w-4 h-4 mr-2" />
          Edit Cover Photo
        </Button>
      </div>

      {/* Info */}
      <div className="relative px-6 pb-6 bg-gradient-to-b from-background to-muted/10">
        <Avatar className="absolute -top-16 left-6 w-32 h-32 shadow-2xl ring-4 ring-background">
          <AvatarImage src="https://placehold.co/128x128/8b5cf6/ffffff?text=CT" />
          <AvatarFallback>CT</AvatarFallback>
        </Avatar>

        <div className="pt-20 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Chí Thành
            </h1>
            <p className="text-lg text-muted-foreground">@ChiThanh1710</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Following: <span className="font-semibold">234</span>
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Followers: <span className="font-semibold">1.2K</span>
              </span>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </div>
      </div>
    </Card>
  );
}
