import React, { useState } from 'react';
import { Search, X, TrendingUp, Play, Flame, Users, Check, Plus, Hash } from 'lucide-react';
import { VideoItem, User } from '../types';

interface DiscoverViewProps {
  videos: VideoItem[];
  creators: User[];
  onSelectVideo: (video: VideoItem) => void;
  onSelectCreator: (creator: User) => void;
  onToggleFollow: (creatorId: string) => void;
  lang: 'bn' | 'en';
}

const TRENDING_HASHTAGS = [
  { tag: 'Nexup', views: '4.8M', isHot: true },
  { tag: 'Bangla', views: '3.2M', isHot: true },
  { tag: 'DhakaVibes', views: '1.9M', isHot: false },
  { tag: 'Cyberpunk', views: '840K', isHot: false },
  { tag: 'Dance', views: '2.5M', isHot: true },
  { tag: 'Gaming', views: '1.4M', isHot: false },
  { tag: 'CoxsBazar', views: '920K', isHot: false },
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  videos,
  creators,
  onSelectVideo,
  onSelectCreator,
  onToggleFollow,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter videos based on query and category
  const filteredVideos = videos.filter((video) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const matchCaption = video.caption.toLowerCase().includes(query);
    const matchTags = video.tags.some((t) => t.toLowerCase().includes(query));
    const matchCreator = video.creator.username.toLowerCase().includes(query) || video.creator.name.toLowerCase().includes(query);
    return matchCaption || matchTags || matchCreator;
  });

  const formatCount = (count: number): string => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
    <div className="w-full h-full pb-20 pt-3 px-3 md:px-5 overflow-y-auto bg-zinc-950 text-white select-none no-scrollbar">
      {/* Search Header */}
      <div className="relative mb-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-white/40 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'bn'
                ? 'ভিডিও, হ্যাশট্যাগ বা ক্রিয়েটর খুঁজুন...'
                : 'Search videos, #hashtags, creators...'
            }
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-pink-500 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 rounded-full text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner / Trend Announcement */}
      {!searchQuery && (
        <div className="relative rounded-2xl overflow-hidden mb-5 bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-black border border-pink-500/20 p-4 shadow-xl">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 text-[10px] font-extrabold uppercase mb-1.5">
                <Flame className="w-3 h-3" />
                {lang === 'bn' ? 'সাপ্তাহিক ট্রেন্ডিং চ্যালেঞ্জ' : 'Featured Challenge'}
              </span>
              <h2 className="text-base font-extrabold text-white">
                #NexupBanglaChallenge 🇧🇩
              </h2>
              <p className="text-xs text-white/70 max-w-sm mt-1">
                {lang === 'bn'
                  ? 'আপনার ক্রিয়েটিভ শর্ট ভিডিও পোস্ট করে জিতুন এক্সক্লুসিভ ভেরিফাইড ব্যাজ!'
                  : 'Share your 15-second creative clip and get featured on the feed.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trending Hashtags row */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-2.5">
          <TrendingUp className="w-4 h-4 text-pink-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">
            {lang === 'bn' ? 'ট্রেন্ডিং হ্যাশট্যাগ' : 'Trending Hashtags'}
          </h3>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TRENDING_HASHTAGS.map((item) => (
            <button
              key={item.tag}
              onClick={() => setSearchQuery(item.tag)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 group"
            >
              <Hash className="w-3 h-3 text-pink-400 group-hover:rotate-12 transition-transform" />
              <span>{item.tag}</span>
              <span className="text-[10px] text-white/40 font-normal">
                {item.views}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Creators to Follow */}
      {!searchQuery && (
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">
              {lang === 'bn' ? 'জনপ্রিয় ক্রিয়েটর' : 'Popular Creators'}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {creators.map((creator) => (
              <div
                key={creator.id}
                className="p-3 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col items-center text-center group relative hover:border-pink-500/30 transition-all"
              >
                <div
                  onClick={() => onSelectCreator(creator)}
                  className="cursor-pointer mb-2"
                >
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/15 group-hover:scale-105 transition-transform"
                  />
                </div>

                <div
                  onClick={() => onSelectCreator(creator)}
                  className="cursor-pointer mb-2 w-full truncate"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-bold text-xs text-white truncate">
                      {creator.name}
                    </span>
                    {creator.isVerified && (
                      <span className="w-3 h-3 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[8px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-white/50 block truncate">
                    @{creator.username}
                  </span>
                </div>

                <button
                  onClick={() => onToggleFollow(creator.id)}
                  className={`w-full py-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                    creator.isFollowed
                      ? 'bg-zinc-800 text-white/70 hover:bg-zinc-700'
                      : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/20'
                  }`}
                >
                  {creator.isFollowed ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>{lang === 'bn' ? 'ফলো করা হচ্ছে' : 'Following'}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3 stroke-[3]" />
                      <span>{lang === 'bn' ? 'ফলো' : 'Follow'}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2.5">
          {searchQuery
            ? `${lang === 'bn' ? 'অনুসন্ধান ফলাফল' : 'Search Results'} (${filteredVideos.length})`
            : (lang === 'bn' ? 'এক্সপ্লোর ভিডিও' : 'Explore Videos')}
        </h3>

        {filteredVideos.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <p className="text-sm font-semibold mb-1">
              {lang === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No matching clips found'}
            </p>
            <p className="text-xs text-white/40">
              {lang === 'bn' ? 'ভিন্ন কীওয়ার্ড দিয়ে চেষ্টা করুন' : 'Try searching for #Nexup, #Bangla, or creator names'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video)}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer hover:border-pink-500/50 transition-all shadow-md"
              >
                <img
                  src={video.posterUrl}
                  alt={video.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* View count tag */}
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-white/95 drop-shadow">
                    <Play className="w-3 h-3 fill-white" />
                    <span>{formatCount(video.viewsCount)}</span>
                  </div>
                  <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">
                    {video.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
