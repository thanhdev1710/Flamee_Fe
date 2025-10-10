export interface FriendSuggestion {
  source_user: string;
  suggested_user: string;
  mutual_friend_count: number;
  mutual_friends: string[];
}
