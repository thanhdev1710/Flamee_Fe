"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";

export default function AsideDirectoryPanel() {
  const teamMembers = [
    {
      name: "Florencio Dorrance",
      role: "Market Development Manager",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Benny Spanbauer",
      role: "Area Sales Manager",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Jamel Eusebio",
      role: "Administrator",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Lavern Laboy",
      role: "Account Executive",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Alfonzo Schuessler",
      role: "Proposal Writer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Daryl Heli",
      role: "Nursing Assistant",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Lehls",
      role: "Nursing Assistant",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: " Nehls",
      role: "Nursing Assistant",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Daryl",
      role: "Nursing Assistant",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  const files = [
    {
      name: "i9.pdf",
      type: "PDF",
      size: "3mb",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
    {
      name: "Screenshot-3817.png",
      type: "PNG",
      size: "4mb",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    {
      name: "sharefile.docx",
      type: "DOC",
      size: "555kb",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      name: "Jerry-2020_I-9_Form1.xxl",
      type: "XXL",
      size: "24mb",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      name: "Jerry-2020_I-9_Form.xxl",
      type: "XXL",
      size: "24mb",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      name: "Jerry-2020_I-9_Form3.xxl",
      type: "XXL",
      size: "24mb",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      name: "Jerry-2020_I-9_For4m.xxl",
      type: "XXL",
      size: "24mb",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
  ];

  return (
    <>
      <div
        className={`
          fixed xl:relative transition-transform duration-300 ease-in-out translate-x-full xl:translate-x-0
          w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col z-50 xl:z-0 right-0 h-full
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center flex-shrink-0 h-[65px]">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Directory
          </h3>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          {/* Team Members */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Team Members
              </h4>
              <Badge variant="secondary" className="text-xs">
                {teamMembers.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Files */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Files
              </h4>
              <Badge variant="secondary" className="text-xs">
                {files.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${file.color}`}
                    >
                      <span className="text-xs font-medium">{file.type}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {file.type} {file.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
