import { ScrollArea } from "@/components/ui/scroll-area";
import AboutCard from "@/components/users/AboutCard";
import ProfileHeader from "@/components/users/ProfileHeader";
import PostSectionCard from "@/components/users/PostSectionCard";
import YouMightKnow from "@/components/users/YouMightKnow";

export default async function page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <ScrollArea className="h-full">
      <div className="padding-flame max-w-7xl mx-auto h-full">
        <h1 className="text-7xl">{username}</h1>
        {/* Profile Header */}
        <ProfileHeader />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Left Sidebar - About (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <AboutCard />
            </div>
          </div>

          {/* Center - Posts */}
          <div className="lg:col-span-2">
            <PostSectionCard />
          </div>

          {/* Right Sidebar - You might know (Sticky) */}
          <div className="lg:col-span-1 max-lg:hidden">
            <div className="sticky top-6">
              <YouMightKnow />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[90px]"></div>
    </ScrollArea>
  );
}
