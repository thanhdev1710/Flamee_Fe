import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Search } from "lucide-react";
import React from "react";

export default function AsideFriendApp() {
  const friends = [
    {
      name: "Phung Phong",
      status: "Online",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Robert Bacins",
      status: "Busy",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "John Carilo",
      status: "Offline",
      time: "5 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Adriene Watson",
      status: "Offline",
      time: "8 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Shelby Goode",
      status: "Offline",
      time: "1 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Adriene Watson",
      status: "Offline",
      time: "2 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "John Carilo",
      status: "Offline",
      time: "10 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];
  return (
    <aside className="hidden xl:block w-80 sticky top-0">
      <Card>
        <CardContent className="p-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search" className="pl-10 border-none" />
            </div>
          </div>

          <h3 className="font-semibold mb-4">Friend</h3>

          <div className="space-y-3">
            {friends.map((friend, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        friend.status === "Online"
                          ? "bg-green-500"
                          : friend.status === "Busy"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{friend.name}</div>
                    <div className="text-xs text-gray-500">{friend.status}</div>
                  </div>
                </div>
                {friend.time && (
                  <div className="text-xs text-gray-400">{friend.time}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
