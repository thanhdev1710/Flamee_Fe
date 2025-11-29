import useSWR from "swr";
import {
  countPosts,
  dashboardPosts,
  getInteractionsPostById,
  getPostById,
  recentPostActivities,
  weeklyPostActivity,
} from "@/services/post.service";

export function usePostDetail(id: string) {
  return useSWR(["post-detail", id], () => getPostById(id));
}

export function useInteractions(id: string) {
  return useSWR(["interactions", id], () => getInteractionsPostById(id));
}

/**
 * COUNT POSTS
 */
export function useCountPosts() {
  return useSWR("posts-count", () => countPosts(), {
    revalidateOnFocus: false,
  });
}

/**
 * WEEKLY POST ACTIVITY
 */
export function useWeeklyPostActivity() {
  return useSWR("posts-weekly", () => weeklyPostActivity(), {
    revalidateOnFocus: false,
  });
}

/**
 * RECENT POST ACTIVITIES
 */
export function useRecentPostActivities() {
  return useSWR("posts-recent", () => recentPostActivities(), {
    revalidateOnFocus: false,
  });
}

/**
 * FULL POSTS DASHBOARD (count + weekly + recent)
 */
export function usePostDashboard() {
  return useSWR("posts-dashboard", () => dashboardPosts(), {
    revalidateOnFocus: false,
  });
}
