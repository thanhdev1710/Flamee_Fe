import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Mail, Phone, Calendar, User, Camera } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import PostCard from "@/components/shared/PostCard/PostCard";

export default function ProfilePage() {
  return (
    <ScrollArea className="h-full">
      <div className="padding-flame max-w-7xl mx-auto h-full">
        {/* Profile Header */}
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20">
          {/* Cover Photo */}
          <div className="relative md:h-[260px] h-[180px] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <Image
              src="https://placehold.co/600x400/6366f1/ffffff?text=Cover+Photo"
              alt="Cover Photo"
              fill
              className="object-cover mix-blend-overlay opacity-60"
            />
            <Button
              variant="secondary"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900 shadow-lg backdrop-blur-sm border-0"
            >
              <Camera className="w-4 h-4 mr-2" />
              Edit Cover Photo
            </Button>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6 bg-gradient-to-b from-background to-muted/10">
            {/* Profile Picture */}
            <Avatar className="absolute -top-16 left-6 w-32 h-32 shadow-2xl ring-4 ring-background">
              <AvatarImage
                src="https://placehold.co/128x128/8b5cf6/ffffff?text=CT"
                alt="Chí Thành"
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white">
                CT
              </AvatarFallback>
            </Avatar>

            {/* Profile Details */}
            <div className="pt-20 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                  Chí Thành
                </h1>
                <p className="text-lg text-muted-foreground">@ChiThanh1710</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <User className="w-4 h-4" />
                    Following:{" "}
                    <span className="font-semibold text-foreground">234</span>
                  </span>
                  <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <User className="w-4 h-4" />
                    Followers:{" "}
                    <span className="font-semibold text-foreground">1.2K</span>
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-purple-200 hover:border-purple-300 dark:border-purple-700 dark:hover:border-purple-600 backdrop-blur-sm"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Left Sidebar - About (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full" />
                    About
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm group hover:bg-muted/50 p-2 rounded-lg transition-colors">
                      <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                        Male
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm group hover:bg-muted/50 p-2 rounded-lg transition-colors">
                      <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                        Born June 26, 1980
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-sm group hover:bg-muted/50 p-2 rounded-lg transition-colors">
                      <div className="p-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 mt-0.5">
                        <MapPin className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                        2239 Hog Camp Road
                        <br />
                        Schaumburg
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm group hover:bg-muted/50 p-2 rounded-lg transition-colors">
                      <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                        charles5182@ummoh.com
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm group hover:bg-muted/50 p-2 rounded-lg transition-colors">
                      <div className="p-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30">
                        <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                        3375005467
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Center - Posts */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg py-0 overflow-hidden border-0 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm">
              <CardContent className="p-0">
                <Tabs defaultValue="posts" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent h-auto p-0 backdrop-blur-sm">
                    <TabsTrigger
                      value="followers"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 py-4 transition-all duration-200"
                    >
                      Followers
                    </TabsTrigger>
                    <TabsTrigger
                      value="following"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 py-4 transition-all duration-200"
                    >
                      Following
                    </TabsTrigger>
                    <TabsTrigger
                      value="posts"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-pink-500/10 data-[state=active]:text-pink-600 dark:data-[state=active]:text-pink-400 py-4 transition-all duration-200"
                    >
                      Posts
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="posts"
                    className="p-6 flex flex-col gap-6"
                  >
                    <PostCard
                      body="dsafs fds afsd fdsa"
                      id={60}
                      title="dsa"
                      userId={1}
                    />
                    <PostCard
                      body="dsafs fds afsd fdsa"
                      id={60}
                      title="dsa"
                      userId={1}
                    />
                    <PostCard
                      body="dsafs fds afsd fdsa"
                      id={60}
                      title="dsa"
                      userId={1}
                    />
                  </TabsContent>
                  <TabsContent value="followers" className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Followers content would go here</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="following" className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Following content would go here</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - You might know (Sticky) */}
          <div className="lg:col-span-1 max-lg:hidden">
            <div className="sticky top-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 rounded-full" />
                    You might know
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Eddie Lobanovskiy",
                        email: "lobanovskiy@gmail.com",
                        avatar: "EL",
                        color: "from-blue-500 to-cyan-500",
                      },
                      {
                        name: "Alexey Stave",
                        email: "alexeyst@gmail.com",
                        avatar: "AS",
                        color: "from-purple-500 to-pink-500",
                      },
                      {
                        name: "Anton Tkacheve",
                        email: "tkacheveanton@gmail.com",
                        avatar: "AT",
                        color: "from-green-500 to-teal-500",
                      },
                    ].map((person, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group"
                      >
                        <Avatar className="w-10 h-10 ring-2 ring-transparent group-hover:ring-muted transition-all">
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40`}
                            alt={person.name}
                          />
                          <AvatarFallback
                            className={`bg-gradient-to-br ${person.color} text-white text-sm font-semibold`}
                          >
                            {person.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate text-foreground group-hover:text-foreground transition-colors">
                            {person.name}
                          </p>
                          <p className="text-xs truncate text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                            {person.email}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-purple-200 hover:border-purple-300 dark:border-purple-700 dark:hover:border-purple-600 hover:shadow-md transition-all duration-200"
                        >
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[90px]"></div>
    </ScrollArea>
  );
}
