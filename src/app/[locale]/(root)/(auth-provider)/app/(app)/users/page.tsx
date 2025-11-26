"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import AboutCard from "@/components/users/AboutCard";
import ProfileHeader from "@/components/users/ProfileHeader";
import PostSectionCard from "@/components/users/PostSectionCard";
import YouMightKnow from "@/components/users/YouMightKnow";
import useSWR from "swr";
import { getMyProfiles } from "@/services/user.service";
import { getFriendSuggestions } from "@/services/follow.service";

export default function UserPage() {
  const { data: profile, isLoading: isLoadingProfile } = useSWR(
    "my-profile",
    getMyProfiles
  );
  const { data: friend, isLoading: isLoadingFriend } = useSWR(
    "invitationUsers",
    getFriendSuggestions
  );

  if (isLoadingFriend || isLoadingProfile) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="h-6 w-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="padding-flame max-w-7xl mx-auto h-full">
        {/* Profile Header */}
        <ProfileHeader profile={profile} friend={friend} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Left Sidebar - About (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <AboutCard profile={profile} />
            </div>
          </div>

          {/* Center - Posts */}
          <div className="lg:col-span-2">
            <PostSectionCard friend={friend} />
          </div>

          {/* Right Sidebar - You might know (Sticky) */}
          <div className="lg:col-span-1 max-lg:hidden">
            <div className="sticky top-6">
              <YouMightKnow friend={friend} />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[90px]"></div>
    </ScrollArea>
  );
}
