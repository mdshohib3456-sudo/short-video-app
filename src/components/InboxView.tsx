import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Sparkles, CheckCheck } from 'lucide-react';
import { NotificationItem } from '../types';

interface InboxViewProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  lang: 'bn' | 'en';
}

export const InboxView: React.FC<InboxViewProps> = ({
  notifications,
  onMarkAllAsRead,
  lang,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'like' | 'comment' | 'follow'>('all');

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === activeFilter);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3 h-3 text-cyan-400" />;
      case 'follow':
        return <UserPlus className="w-3 h-3 text-pink-500" />;
      case 'system':
      default:
        return <Sparkles className="w-3 h-3 text-amber-400" />;
    }
  };

  return (
    <div className="w-full h-full pb-20 pt-3 px-3 md:px-5 overflow-y-auto bg-zinc-950 text-white select-none no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-pink-400" />
          <h2 className="text-base font-extrabold">
            {lang === 'bn' ? 'নোটিফিকেশন ও অ্যাক্টিভিটি' : 'Inbox & Activity'}
          </h2>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-[11px] font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'সব পঠিত হিসেবে চিহ্নিত করুন' : 'Mark all read'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: lang === 'bn' ? 'সকল' : 'All' },
          { id: 'like', label: lang === 'bn' ? 'লাইক' : 'Likes' },
          { id: 'comment', label: lang === 'bn' ? 'কমেন্ট' : 'Comments' },
          { id: 'follow', label: lang === 'bn' ? 'ফলোয়ার' : 'Followers' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === tab.id
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold">
              {lang === 'bn' ? 'কোনো নোটিফিকেশন নেই' : 'No notifications in this category'}
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl flex items-center gap-3 border transition-colors ${
                !item.isRead
                  ? 'bg-zinc-900/90 border-pink-500/30'
                  : 'bg-zinc-900/50 border-white/5'
              }`}
            >
              {/* User Avatar with Type Icon Badge */}
              <div className="relative shrink-0">
                {item.fromUser ? (
                  <img
                    src={item.fromUser.avatar}
                    alt={item.fromUser.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-950 border border-white/20 flex items-center justify-center shadow">
                  {getIcon(item.type)}
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/90 leading-snug">
                  {item.fromUser && (
                    <span className="font-bold text-white mr-1">
                      {item.fromUser.name}
                    </span>
                  )}
                  <span className="text-white/80">{item.text}</span>
                </p>
                <span className="text-[10px] text-white/40 mt-0.5 block">
                  {item.time}
                </span>
              </div>

              {/* Video Thumbnail if present */}
              {item.videoThumbnail && (
                <img
                  src={item.videoThumbnail}
                  alt="Clip thumbnail"
                  referrerPolicy="no-referrer"
                  className="w-10 h-12 rounded-lg object-cover shrink-0 border border-white/10"
                />
              )}

              {/* Unread indicator dot */}
              {!item.isRead && (
                <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
