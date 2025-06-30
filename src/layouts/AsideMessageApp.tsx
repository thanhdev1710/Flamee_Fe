"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMenuStore } from "@/store/onMenuStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  ChevronDown,
  Plus,
  X,
  Home,
  Users,
  Calendar,
  Grid3X3,
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

export default function AsideMessageApp() {
  const [selectedChat, setSelectedChat] = useState("florencio");
  const { isSidebarOpen, setIsSidebarOpen } = useMenuStore();

  const conversations = [
    {
      id: "elmer",
      name: "Elmer Laverty",
      message: "Haha oh man 😊",
      time: "12m",
      avatar: "/placeholder.svg?height=40&width=40",
      tags: [
        {
          text: "Question",
          color:
            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        },
        {
          text: "Help wanted",
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        },
      ],
    },
    {
      id: "florencio",
      name: "Florencio Dorrance",
      message: "woohoooo",
      time: "24m",
      avatar: "/placeholder.svg?height=40&width=40",
      tags: [
        {
          text: "Some content",
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        },
      ],
    },
    {
      id: "lavern",
      name: "Lavern Laboy",
      message: "Haha that's terrifying 😊",
      time: "1h",
      avatar: "/placeholder.svg?height=40&width=40",
      tags: [
        {
          text: "Bug",
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        },
        {
          text: "Hacktoberfest",
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        },
      ],
    },
    {
      id: "titus",
      name: "Titus Kitamura",
      message: "omg, this is amazing",
      time: "5h",
      avatar: "/placeholder.svg?height=40&width=40",
      tags: [
        {
          text: "Question",
          color:
            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        },
        {
          text: "Some content",
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        },
      ],
    },
    {
      id: "geoffrey",
      name: "Geoffrey Mott",
      message: "aww 😊",
      time: "2d",
      avatar: "/placeholder.svg?height=40&width=40",
      tags: [
        {
          text: "Request",
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        },
      ],
    },
    {
      id: "alfonzo",
      name: "Alfonzo Schuessler",
      message: "perfect!",
      time: "1m",
      avatar: "/placeholder.svg?height=40&width=40",
      tags: [
        {
          text: "Follow up",
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen()}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`
          fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50 lg:z-0 h-full
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Messages
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <Badge variant="secondary" className="text-xs">
                  12
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                className="w-8 h-8 p-0 bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen()}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 flex-shrink-0">
          <Input
            placeholder="Search messages"
            className="bg-gray-100 dark:bg-gray-800 border-0 text-gray-900 dark:text-white"
          />
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-1 p-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`
                  p-3 rounded-lg cursor-pointer transition-colors
                  ${
                    selectedChat === conv.id
                      ? "bg-indigo-50 dark:bg-indigo-800/30 border border-indigo-200 dark:border-indigo-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                `}
                onClick={() => {
                  setSelectedChat(conv.id);
                  setIsSidebarOpen();
                }}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={conv.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {conv.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {conv.name}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                      {conv.message}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {conv.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className={`text-xs ${tag.color}`}
                        >
                          {tag.text}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Navigation Icons */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-around">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 flex flex-col items-center"
              asChild
            >
              <Link href={"/app"}>
                <Home className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 flex flex-col items-center"
              asChild
            >
              <Link href={"/friends"}>
                <Users className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 flex flex-col items-center"
              asChild
            >
              <Link href={"/messages"}>
                <MessageCircle className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 flex flex-col items-center"
            >
              <Calendar className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 flex flex-col items-center"
            >
              <Grid3X3 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
