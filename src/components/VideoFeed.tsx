import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown, Compass, HeartHandshake } from 'lucide-react';
import { VideoItem, SoundTrack, User, FeedTab } from '../types';
import { VideoPlayer } from './VideoPlayer';

interface VideoFeedProps {
  videos: VideoItem[];
  currentTab: FeedTab;
  isMuted: boolean;
  onToggleLike: (videoId: string) => void;
  onToggleBookmark: (videoId: string) => void;
  onToggleFollow: (creatorId: string) => void;
  onOpenComments: (video: VideoItem) => void;
  onOpenShare: (video: VideoItem) => void;
  onOpenSound: (sound: SoundTrack) => void;
  onOpenCreatorProfile: (creator: User) => void;
  onSelectTag: (tag: string) => void;
  onExploreMore: () => void;
  lang: 'bn' | 'en';
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  videos,
  currentTab,
  isMuted,
  onToggleLike,
  onToggleBookmark,
  onToggleFollow,
  onOpenComments,
  onOpenShare,
  onOpenSound,
  onOpenCreatorProfile,
  onSelectTag,
  onExploreMore,
  lang,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const touchStartY = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);

  // Filter videos based on tab
  const filteredVideos = currentTab === 'following'
    ? videos.filter((v) => v.creator.isFollowed)
    : videos;

  // Reset index when tab changes or video list shrinks
  useEffect(() => {
    setCurrentIndex(0);
  }, [currentTab]);

  const goToNextVideo = useCallback(() => {
    if (currentIndex < filteredVideos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, filteredVideos.length]);

  const goToPrevVideo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())) {
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goToNextVideo();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevVideo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextVideo, goToPrevVideo]);

  // Mouse wheel navigation with debounce
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isScrollingRef.current) return;

    if (Math.abs(e.deltaY) > 35) {
      isScrollingRef.current = true;
      if (e.deltaY > 0) {
        goToNextVideo();
      } else {
        goToPrevVideo();
      }

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 550);
    }
  };

  // Touch swipe navigation
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY.current - touchEndY;

    if (Math.abs(diffY) > 50) {
      if (diffY > 0) {
        // Swiped up -> next video
        goToNextVideo();
      } else {
        // Swiped down -> previous video
        goToPrevVideo();
      }
    }
  };

  if (filteredVideos.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center">
        <HeartHandshake className="w-14 h-14 text-pink-500 mb-3 animate-pulse" />
        <h3 className="text-lg font-bold mb-1">
          {lang === 'bn' ? 'কোনো ভিডিও পাওয়া যায়নি' : 'No videos found'}
        </h3>
        <p className="text-xs text-white/60 max-w-xs mb-4">
          {currentTab === 'following'
            ? (lang === 'bn'
                ? 'আপনি যাদের ফলো করেছেন তাদের কোনো ভিডিও এখনো নেই। ক্রিয়েটরদের ফলো করুন বা "আপনার জন্য" দেখুন।'
                : 'You have not followed creators yet, or they have not posted clips. Explore trending videos!')
            : (lang === 'bn'
                ? 'ফিডে কোনো ভিডিও পাওয়া যায়নি।'
                : 'No videos available right now.')}
        </p>
        <button
          onClick={onExploreMore}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 font-bold text-xs shadow-lg shadow-pink-500/25 flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <Compass className="w-4 h-4" />
          {lang === 'bn' ? 'ট্রেন্ডিং ভিডিও দেখুন' : 'Explore For You Feed'}
        </button>
      </div>
    );
  }

  const currentVideo = filteredVideos[currentIndex];

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full bg-black overflow-hidden select-none"
    >
      {/* Video Display */}
      <VideoPlayer
        key={currentVideo.id}
        video={currentVideo}
        isActive={true}
        isMuted={isMuted}
        onToggleLike={onToggleLike}
        onToggleBookmark={onToggleBookmark}
        onToggleFollow={onToggleFollow}
        onOpenComments={onOpenComments}
        onOpenShare={onOpenShare}
        onOpenSound={onOpenSound}
        onOpenCreatorProfile={onOpenCreatorProfile}
        onSelectTag={onSelectTag}
        lang={lang}
      />

      {/* Desktop Floating Navigation Controls (Up / Down Arrows) */}
      <div className="hidden md:flex flex-col gap-2 absolute right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
        <button
          onClick={goToPrevVideo}
          disabled={currentIndex === 0}
          title={lang === 'bn' ? 'পূর্ববর্তী ভিডিও (Arrow Up)' : 'Previous video (Arrow Up)'}
          className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
            currentIndex === 0
              ? 'bg-black/20 border-white/5 text-white/20 cursor-not-allowed'
              : 'bg-black/60 hover:bg-black/85 border-white/20 text-white hover:scale-110 active:scale-95'
          }`}
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        <div className="text-center text-[10px] font-bold text-white/70 py-0.5">
          {currentIndex + 1} / {filteredVideos.length}
        </div>

        <button
          onClick={goToNextVideo}
          disabled={currentIndex === filteredVideos.length - 1}
          title={lang === 'bn' ? 'পরবর্তী ভিডিও (Arrow Down)' : 'Next video (Arrow Down)'}
          className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
            currentIndex === filteredVideos.length - 1
              ? 'bg-black/20 border-white/5 text-white/20 cursor-not-allowed'
              : 'bg-black/60 hover:bg-black/85 border-white/20 text-white hover:scale-110 active:scale-95'
          }`}
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Swipe Hint Badge (Only on first video for first few seconds) */}
      {currentIndex === 0 && (
        <div className="md:hidden absolute bottom-18 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] text-white/70 animate-pulse flex items-center gap-1">
          <ChevronDown className="w-3.5 h-3.5 text-pink-400" />
          <span>{lang === 'bn' ? 'পরের ভিডিওতে যেতে উপরে সোয়াইপ করুন' : 'Swipe up for next clip'}</span>
        </div>
      )}
    </div>
  );
};
