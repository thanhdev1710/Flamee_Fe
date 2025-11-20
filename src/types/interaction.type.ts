export interface Interaction {
  likes: Like[];
  comments: Comment[];
  shares: Share[];
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
  user: UserInteract;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  user: UserInteract;
  replies: Reply[];
}

export interface Share {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
  user: UserInteract;
}

export interface UserInteract {
  username: string;
  fullname: string;
  avatarUrl: string;
}

export interface Reply {
  id: string;
  userId: string;
  postId: string;
  parentId: string;
  content: string;
  createdAt: string;
  user: UserInteract;
}
