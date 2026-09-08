export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  totalLikes: number;
  isFollowed: boolean;
  isVerified?: boolean;
  email?: string;
}

export interface SoundTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration?: string;
  videoCount?: number;
}

export interface Comment {
  id: string;
  videoId: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  text: string;
  timestamp: string;
  likesCount: number;
  isLiked: boolean;
}

export interface VideoItem {
  id: string;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  tags: string[];
  creator: User;
  sound: SoundTrack;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  fromUser?: {
    name: string;
    username: string;
    avatar: string;
  };
  text: string;
  time: string;
  isRead: boolean;
  videoThumbnail?: string;
}

export type FeedTab = 'foryou' | 'following';
export type ActiveNavTab = 'home' | 'discover' | 'upload' | 'inbox' | 'profile';
