import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { User } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function PostSectionCard() {
  return (
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
          <TabsContent value="posts" className="p-6 flex flex-col gap-6">
            {/* <PostCard
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
            /> */}
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
  );
}
