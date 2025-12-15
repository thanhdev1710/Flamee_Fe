import useSWR from "swr";
import {
  countPosts,
  dashboardPosts,
  getInteractionsPostById,
  getPostById,
  recentPostActivities,
  weeklyPostActivity,
} from "@/services/post.service";

export const keySWRPost = {
  list: "posts",
  postDetail: "post-detail",
  interaction: "interactions",
  postsCount: "posts-count",
  postsWeekly: "posts-weekly",
  postsRecent: "posts-recent",
  postsDashboard: "posts-dashboard",
};

export function usePostDetail(id: string) {
  return useSWR([keySWRPost.postDetail, id], () => getPostById(id));
}

export function useInteractions(id: string) {
  return useSWR([keySWRPost.interaction, id], () =>
    getInteractionsPostById(id)
  );
}

/**
 * COUNT POSTS
 */
export function useCountPosts() {
  return useSWR(keySWRPost.postsCount, () => countPosts());
}

/**
 * WEEKLY POST ACTIVITY
 */
export function useWeeklyPostActivity() {
  return useSWR(keySWRPost.postsWeekly, () => weeklyPostActivity());
}

/**
 * RECENT POST ACTIVITIES
 */
export function useRecentPostActivities() {
  return useSWR(keySWRPost.postsRecent, () => recentPostActivities());
}

/**
 * FULL POSTS DASHBOARD (count + weekly + recent)
 */
export function usePostDashboard() {
  return useSWR(keySWRPost.postsDashboard, () => dashboardPosts());
}
