import React, { useState } from 'react';
import { Settings, Edit3, Bookmark, Heart, Grid, Play, Check, Plus, Share2, LogOut, ArrowLeft } from 'lucide-react';
import { User, VideoItem } from '../types';

interface ProfileViewProps {
  user: User;
  isCurrentUser: boolean;
  userVideos: VideoItem[];
  likedVideos: VideoItem[];
  savedVideos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  onToggleFollow: (creatorId: string) => void;
  onUpdateProfile?: (updated: Partial<User>) => void;
  onLogout?: () => void;
  onBackToFeed?: () => void;
  lang: 'bn' | 'en';
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  isCurrentUser,
  userVideos,
  likedVideos,
  savedVideos,
  onSelectVideo,
  onToggleFollow,
  onUpdateProfile,
  onLogout,
  onBackToFeed,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'liked' | 'saved'>('videos');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editAvatar, setEditAvatar] = useState(user.avatar);

  const formatCount = (count: number): string => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: editName.trim() || user.name,
        bio: editBio.trim() || user.bio,
        avatar: editAvatar.trim() || user.avatar,
      });
    }
    setIsEditing(false);
  };

  const getDisplayedVideos = () => {
    switch (activeTab) {
      case 'liked':
        return likedVideos;
      case 'saved':
        return savedVideos;
      case 'videos':
      default:
        return userVideos;
    }
  };

  const displayedVideos = getDisplayedVideos();

  return (
    <div className="w-full h-full pb-20 pt-2 px-3 md:px-5 overflow-y-auto bg-zinc-950 text-white select-none no-scrollbar">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          {!isCurrentUser && onBackToFeed && (
            <button
              onClick={onBackToFeed}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <span className="font-extrabold text-sm text-white/90 truncate">
            @{user.username}
          </span>
          {user.isVerified && (
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[9px]">
              ✓
            </span>
          )}
        </div>

        {isCurrentUser && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              title={lang === 'bn' ? 'প্রোফাইল এডিট করুন' : 'Edit Profile'}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                title={lang === 'bn' ? 'লগ আউট' : 'Logout'}
                className="p-1.5 rounded-full hover:bg-rose-500/20 text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-rose-500 to-cyan-400 shadow-xl">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover border-2 border-black"
            />
          </div>
          {user.isVerified && (
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-cyan-400 border-2 border-black text-black flex items-center justify-center text-[10px] font-extrabold">
              ✓
            </div>
          )}
        </div>

        <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
          {user.name}
        </h2>
        <span className="text-xs text-white/50 mb-2">@{user.username}</span>

        {/* Stats Row */}
        <div className="flex items-center gap-6 py-2 px-4 rounded-2xl bg-zinc-900/80 border border-white/10 mb-3">
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-sm text-white">
              {formatCount(user.followingCount)}
            </span>
            <span className="text-[10px] text-white/50">
              {lang === 'bn' ? 'অনুসরণ' : 'Following'}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-sm text-white">
              {formatCount(user.followersCount)}
            </span>
            <span className="text-[10px] text-white/50">
              {lang === 'bn' ? 'ফলোয়ার' : 'Followers'}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-sm text-white">
              {formatCount(user.totalLikes)}
            </span>
            <span className="text-[10px] text-white/50">
              {lang === 'bn' ? 'লাইকস' : 'Likes'}
            </span>
          </div>
        </div>

        {/* Action Button: Edit Profile vs Follow */}
        {isCurrentUser ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'প্রোফাইল এডিট' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/#profile=${user.username}`);
                alert(lang === 'bn' ? 'প্রোফাইল লিংক কপি হয়েছে!' : 'Profile link copied!');
              }}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-bold text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onToggleFollow(user.id)}
            className={`px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-lg ${
              user.isFollowed
                ? 'bg-zinc-800 text-white/80 hover:bg-zinc-700'
                : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-pink-500/25'
            }`}
          >
            {user.isFollowed ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ফলো করা হচ্ছে' : 'Following'}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{lang === 'bn' ? 'ফলো করুন' : 'Follow'}</span>
              </>
            )}
          </button>
        )}

        {/* Bio */}
        <p className="text-xs text-white/80 max-w-sm mt-3 leading-relaxed">
          {user.bio}
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center justify-around border-b border-white/10 mb-3 text-white/60">
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-1.5 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'videos'
              ? 'border-pink-500 text-white'
              : 'border-transparent hover:text-white/80'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>{lang === 'bn' ? 'ভিডিও' : 'Videos'}</span>
          <span className="text-[10px] text-white/40">({userVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`flex items-center gap-1.5 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'liked'
              ? 'border-pink-500 text-white'
              : 'border-transparent hover:text-white/80'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{lang === 'bn' ? 'লাইকড' : 'Liked'}</span>
          <span className="text-[10px] text-white/40">({likedVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-1.5 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'saved'
              ? 'border-pink-500 text-white'
              : 'border-transparent hover:text-white/80'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>{lang === 'bn' ? 'সংরক্ষিত' : 'Saved'}</span>
          <span className="text-[10px] text-white/40">({savedVideos.length})</span>
        </button>
      </div>

      {/* Grid of Videos */}
      {displayedVideos.length === 0 ? (
        <div className="text-center py-12 text-white/40">
          <p className="text-xs font-semibold">
            {activeTab === 'videos'
              ? (lang === 'bn' ? 'কোনো ভিডিও আপলোড করা হয়নি' : 'No videos posted yet')
              : activeTab === 'liked'
              ? (lang === 'bn' ? 'কোনো লাইক করা ভিডিও নেই' : 'No liked videos yet')
              : (lang === 'bn' ? 'কোনো সংরক্ষিত ভিডিও নেই' : 'No bookmarked videos')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {displayedVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              className="relative aspect-[9/16] rounded-xl overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img
                src={video.posterUrl}
                alt={video.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] font-bold text-white drop-shadow">
                <Play className="w-3 h-3 fill-white" />
                <span>{formatCount(video.viewsCount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-5 text-white shadow-2xl">
            <h3 className="font-extrabold text-sm mb-4">
              {lang === 'bn' ? 'প্রোফাইল আপডেট করুন' : 'Edit Profile'}
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/60 mb-1 font-semibold">
                  {lang === 'bn' ? 'নাম' : 'Display Name'}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-semibold">
                  {lang === 'bn' ? 'বায়ো / বিবরণ' : 'Bio'}
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-semibold">
                  {lang === 'bn' ? 'প্রোফাইল ছবি URL' : 'Avatar URL'}
                </label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-xl text-white/60 hover:text-white"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold"
                >
                  {lang === 'bn' ? 'সংরক্ষণ' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
