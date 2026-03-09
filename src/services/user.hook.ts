import useSWR from "swr";
import {
  countUsers,
  dashboardUsers,
  getAllUsers,
  getMyProfiles,
  getProfilesByUsername,
  recentUserActivities,
  weeklyUserActivity,
} from "./user.service";
import { getFriendSuggestionsByUsername } from "./follow.service";

export const keySWRUser = {
  myProfile: "my-profile",
  userDetail: "user-profile",
  allUser: "all-user",
  usersInvitation: "users-invitation",
  usersCount: "users-count",
  usersWeekly: "users-weekly",
  usersRecent: "users-recent",
  usersDashboard: "users-dashboard",
};

export function useProfile() {
  return useSWR(keySWRUser.myProfile, () => getMyProfiles(), {
    revalidateOnFocus: false,
  });
}

export function useFriendSuggestionsByUsername(username: string) {
  return useSWR(username ? [keySWRUser.usersInvitation, username] : null, () =>
    getFriendSuggestionsByUsername(username)
  );
}

export function useProfileByUsername(username: string) {
  return useSWR(
    [keySWRUser.userDetail, username],
    () => getProfilesByUsername(username),
    { revalidateOnFocus: false }
  );
}

export function useAllUser({
  limit = 20,
  page = 0,
  search = "",
}: {
  limit?: number;
  page?: number;
  search?: string;
}) {
  const key = [keySWRUser.allUser, limit, page, search];

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getAllUsers({ limit, page, search }),
    { revalidateOnFocus: false }
  );

  return {
    users: data?.data ?? [],
    pagination: data?.pagination,
    error,
    isLoading,
    mutate,
  };
}

// ==========================================
// GET COUNT USERS
// ==========================================
export function useCountUsers() {
  return useSWR(keySWRUser.usersCount, () => countUsers(), {
    revalidateOnFocus: false,
  });
}

// ==========================================
// GET WEEKLY USER ACTIVITY
// ==========================================
export function useWeeklyUserActivity() {
  return useSWR(keySWRUser.usersWeekly, () => weeklyUserActivity(), {
    revalidateOnFocus: false,
  });
}

// ==========================================
// GET RECENT USER ACTIVITIES
// ==========================================
export function useRecentUserActivities() {
  return useSWR(keySWRUser.usersRecent, () => recentUserActivities(), {
    revalidateOnFocus: false,
  });
}

// ==========================================
// FULL DASHBOARD (count + weekly + recent)
// ==========================================
export function useUserDashboard() {
  return useSWR(keySWRUser.usersDashboard, () => dashboardUsers(), {
    revalidateOnFocus: false,
  });
}
