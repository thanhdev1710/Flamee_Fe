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

export function useProfile() {
  return useSWR("my-profile", () => getMyProfiles(), {
    revalidateOnFocus: false,
  });
}

export function useProfileByUsername(username: string) {
  return useSWR(
    ["user-profile", username],
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
  const key = ["all-user", limit, page, search];

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
  return useSWR("dashboard-count-users", () => countUsers(), {
    revalidateOnFocus: false,
  });
}

// ==========================================
// GET WEEKLY USER ACTIVITY
// ==========================================
export function useWeeklyUserActivity() {
  return useSWR("dashboard-weekly-users", () => weeklyUserActivity(), {
    revalidateOnFocus: false,
  });
}

// ==========================================
// GET RECENT USER ACTIVITIES
// ==========================================
export function useRecentUserActivities() {
  return useSWR("dashboard-recent-users", () => recentUserActivities(), {
    revalidateOnFocus: false,
  });
}

// ==========================================
// FULL DASHBOARD (count + weekly + recent)
// ==========================================
export function useUserDashboard() {
  return useSWR("dashboard-users", () => dashboardUsers(), {
    revalidateOnFocus: false,
  });
}
