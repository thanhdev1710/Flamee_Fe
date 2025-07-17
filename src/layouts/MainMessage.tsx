"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMenuStore } from "@/store/onMenuStore";
import {
  Menu,
  Phone,
  MoreVertical,
  Paperclip,
  ImageIcon,
  Smile,
  Send,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function MainMessage() {
  const [message, setMessage] = useState("");
  const { setIsSidebarOpen } = useMenuStore();
  const [showFileMenu, setShowFileMenu] = useState(false);

  const chatMessages = [
    {
      id: 1,
      sender: "florencio",
      message: "omg, this is amazing",
      time: "2:30 PM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      sender: "florencio",
      message: "perfect! ✅",
      time: "2:31 PM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      sender: "florencio",
      message: "Wow, this is really epic",
      time: "2:32 PM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      sender: "me",
      message: "How are you?",
      time: "2:33 PM",
      isMe: true,
    },
    {
      id: 5,
      sender: "florencio",
      message: "just ideas for next time",
      time: "2:34 PM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 6,
      sender: "florencio",
      message: "I'll be there in 2 mins ⏰",
      time: "2:35 PM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 7,
      sender: "me",
      message: "woohoooo",
      time: "2:36 PM",
      isMe: true,
    },
    {
      id: 8,
      sender: "me",
      message: "Haha oh man",
      time: "2:37 PM",
      isMe: true,
    },
    {
      id: 9,
      sender: "me",
      message: "Haha that's terrifying 😊",
      time: "2:38 PM",
      isMe: true,
    },
    {
      id: 10,
      sender: "florencio",
      message: "aww",
      time: "2:39 PM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 11,
      sender: "florencio",
      message: "omg, this is amazing",
      time: "2:40 PM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 12,
      sender: "florencio",
      message: "woohoooo 🔥",
      time: "2:41 PM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex-shrink-0 h-[65px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden flex-shrink-0"
              onClick={() => setIsSidebarOpen()}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>FD</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-gray-900 dark:text-white truncate">
                Florencio Dorrance
              </h2>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Online
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="flex bg-transparent">
              <Phone className="w-4 h-4 mr-0" />
              <span className="hidden md:inline ml-2">Call</span>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={""}>
                <MoreVertical className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-hidden dark:bg-gray-900">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-xs sm:max-w-md lg:max-w-lg ${
                    msg.isMe ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  {!msg.isMe && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                      <AvatarFallback>FD</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.isMe
                        ? "bg-indigo-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0 h-[65px]">
        <div className="flex items-end space-x-2 max-w-4xl mx-auto">
          {/* File Upload Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setShowFileMenu(!showFileMenu)}
            >
              <Paperclip className="w-5 h-5" />
            </Button>

            {showFileMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-2 min-w-[160px] z-10">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.multiple = true;
                      input.accept = "*/*";
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files) {
                          console.log("Files selected:", files);
                        }
                      };
                      input.click();
                      setShowFileMenu(false);
                    }}
                  >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.multiple = true;
                      input.accept = "image/*";
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files) {
                          console.log("Images selected:", files);
                        }
                      };
                      input.click();
                      setShowFileMenu(false);
                    }}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="pr-10 bg-gray-100 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setMessage("");
                  setShowFileMenu(false);
                }
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          {/* Send Button */}
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4"
            onClick={() => {
              setMessage("");
              setShowFileMenu(false);
            }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
