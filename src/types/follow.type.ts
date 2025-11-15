export interface ProfileSummary {
  user_id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatar_url: string | null;
  bio: string | null;
  course: string | null;
  major: string | null;
  mssv: string | null;
}

export type GetFriendSuggestionsResult = {
  mutualFriends: ProfileSummary[];
  followers: ProfileSummary[];
  following: ProfileSummary[];
  suggestions: ProfileSummary[];
};
