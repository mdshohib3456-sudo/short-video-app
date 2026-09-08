import React, { useRef, useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Music, Play, Check, Plus, AlertCircle } from 'lucide-react';
import { VideoItem, SoundTrack, User } from '../types';

interface VideoPlayerProps {
  video: VideoItem;
  isActive: boolean;
  isMuted: boolean;
  onToggleLike: (videoId: string) => void;
  onToggleBookmark: (videoId: string) => void;
  onToggleFollow: (creatorId: string) => void;
  onOpenComments: (video: VideoItem) => void;
  onOpenShare: (video: VideoItem) => void;
  onOpenSound: (sound: SoundTrack) => void;
  onOpenCreatorProfile: (creator: User) => void;
  onSelectTag: (tag: string) => void;
  lang: 'bn' | 'en';
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  isActive,
  isMuted,
  onToggleLike,
  onToggleBookmark,
  onToggleFollow,
  onOpenComments,
  onOpenShare,
  onOpenSound,
  onOpenCreatorProfile,
  onSelectTag,
  lang,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showPlayStateIcon, setShowPlayStateIcon] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState<boolean>(false);
  const lastTapRef = useRef<number>(0);

  // Play/pause control based on isActive
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isActive) {
      vid.currentTime = 0;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setVideoError(false);
          })
          .catch(() => {
            // Autoplay might be blocked if unmuted; fallback to muted play
            vid.muted = true;
            vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          });
      }
    } else {
      vid.pause();
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isActive]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Track progress
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  // Handle single tap (Play/Pause) vs double tap (Like)
  const handleVideoAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected: spawn heart & like
      const newHeart: FloatingHeart = {
        id: now,
        x: clickX,
        y: clickY,
      };
      setFloatingHearts((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 900);

      if (!video.isLiked) {
        onToggleLike(video.id);
      }
      lastTapRef.current = 0;
    } else {
      // Potential single tap: toggle play/pause
      lastTapRef.current = now;
      setTimeout(() => {
        if (Date.now() - lastTapRef.current >= DOUBLE_TAP_DELAY && lastTapRef.current !== 0) {
          togglePlayPause();
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  const togglePlayPause = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.play();
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
    setShowPlayStateIcon(true);
    setTimeout(() => setShowPlayStateIcon(false), 600);
  };

  // Format count numbers e.g. 1500 -> 1.5K, 1200000 -> 1.2M
  const formatCount = (count: number): string => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none flex items-center justify-center">
      {/* Video / Fallback media */}
      {!videoError ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.posterUrl}
          loop
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover md:object-contain bg-black cursor-pointer"
        />
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-white p-6">
          <img
            src={video.posterUrl}
            alt={video.caption}
            className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-xs"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 text-center max-w-xs p-5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10">
            <AlertCircle className="w-10 h-10 text-pink-500 mx-auto mb-2" />
            <p className="text-sm font-semibold mb-1">
              {lang === 'bn' ? 'ভিডিও স্ট্রিম লোড হতে সমস্যা হয়েছে' : 'Video stream unavailable'}
            </p>
            <p className="text-xs text-white/60 mb-3">
              {lang === 'bn' ? 'দয়া করে আবার চেষ্টা করুন' : 'Tap to retry loading the clip'}
            </p>
            <button
              onClick={() => {
                setVideoError(false);
                if (videoRef.current) {
                  videoRef.current.load();
                  videoRef.current.play();
                }
              }}
              className="px-4 py-1.5 bg-pink-600 hover:bg-pink-500 rounded-full text-xs font-bold transition-colors"
            >
              {lang === 'bn' ? 'পুনরায় লোড করুন' : 'Retry'}
            </button>
          </div>
        </div>
      )}

      {/* Transparent Clickable Overlay for tap/double-tap */}
      <div
        onClick={handleVideoAreaClick}
        className="absolute inset-0 z-10"
        title="Tap to pause/play, double-tap to like"
      />

      {/* Center Play/Pause Ripple Indicator */}
      {showPlayStateIcon && (
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 animate-scale-pop">
            {!isPlaying ? (
              <Play className="w-10 h-10 fill-white text-white ml-1.5" />
            ) : (
              <div className="flex gap-2">
                <div className="w-2.5 h-8 bg-white rounded-full" />
                <div className="w-2.5 h-8 bg-white rounded-full" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Hearts from double taps */}
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          style={{ left: heart.x - 24, top: heart.y - 24 }}
          className="absolute z-20 pointer-events-none animate-float-heart"
        >
          <Heart className="w-14 h-14 text-rose-500 fill-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
        </div>
      ))}

      {/* Right Side Action Bar (TikTok/Nexup Style) */}
      <aside className="absolute right-2 bottom-18 z-20 flex flex-col items-center gap-4 text-white pointer-events-auto">
        {/* Creator Avatar with Follow Button */}
        <div className="relative mb-1 flex flex-col items-center">
          <button
            onClick={() => onOpenCreatorProfile(video.creator)}
            className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 to-cyan-400 hover:scale-105 transition-transform shadow-lg"
          >
            <img
              src={video.creator.avatar}
              alt={video.creator.name}
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover border-2 border-black"
            />
          </button>
          {!video.creator.isFollowed && (
            <button
              onClick={() => onToggleFollow(video.creator.id)}
              title={lang === 'bn' ? 'অনুসরণ করুন' : 'Follow'}
              className="absolute -bottom-2 w-5 h-5 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center border-2 border-black transition-transform active:scale-90"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={() => onToggleLike(video.id)}
          className="flex flex-col items-center group transition-transform active:scale-80"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              video.isLiked
                ? 'text-rose-500 scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                : 'text-white/90 hover:text-white'
            }`}
          >
            <Heart
              className={`w-7 h-7 transition-colors ${
                video.isLiked ? 'fill-rose-500 text-rose-500' : 'stroke-[2.2]'
              }`}
            />
          </div>
          <span className="text-[11px] font-bold tracking-tight text-white/95 mt-0.5 drop-shadow">
            {formatCount(video.likesCount)}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => onOpenComments(video)}
          className="flex flex-col items-center group transition-transform active:scale-90"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:text-white">
            <MessageCircle className="w-7 h-7 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold tracking-tight text-white/95 mt-0.5 drop-shadow">
            {formatCount(video.commentsCount)}
          </span>
        </button>

        {/* Bookmark / Favorite Button */}
        <button
          onClick={() => onToggleBookmark(video.id)}
          className="flex flex-col items-center group transition-transform active:scale-90"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              video.isBookmarked
                ? 'text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                : 'text-white/90 hover:text-white'
            }`}
          >
            <Bookmark
              className={`w-6 h-6 transition-colors ${
                video.isBookmarked ? 'fill-amber-400 text-amber-400' : 'stroke-[2.2]'
              }`}
            />
          </div>
          <span className="text-[11px] font-bold tracking-tight text-white/95 mt-0.5 drop-shadow">
            {video.isBookmarked ? (lang === 'bn' ? 'সংরক্ষিত' : 'Saved') : (lang === 'bn' ? 'সেভ' : 'Save')}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => onOpenShare(video)}
          className="flex flex-col items-center group transition-transform active:scale-90"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:text-white">
            <Share2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold tracking-tight text-white/95 mt-0.5 drop-shadow">
            {formatCount(video.sharesCount)}
          </span>
        </button>

        {/* Spinning Audio Vinyl Disc */}
        <button
          onClick={() => onOpenSound(video.sound)}
          title="Audio track"
          className="mt-1 relative group transition-transform active:scale-90"
        >
          <div
            className={`w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-700 p-1 flex items-center justify-center shadow-lg ${
              isPlaying && isActive ? 'animate-spin-slow' : ''
            }`}
          >
            <img
              src={video.sound.coverUrl}
              alt={video.sound.title}
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover"
            />
          </div>
          {isPlaying && isActive && (
            <div className="absolute -top-3 -left-2 text-pink-400 animate-bounce pointer-events-none">
              <Music className="w-3.5 h-3.5" />
            </div>
          )}
        </button>
      </aside>

      {/* Bottom Information Overlay (Caption, Username, Audio Marquee) */}
      <div className="absolute left-0 right-14 bottom-13 z-20 px-4 pb-2 pt-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-auto">
        {/* Creator Name & Handle */}
        <div className="flex items-center gap-2 mb-1.5">
          <button
            onClick={() => onOpenCreatorProfile(video.creator)}
            className="flex items-center gap-1.5 group text-left"
          >
            <span className="font-extrabold text-sm text-white group-hover:underline">
              {video.creator.name}
            </span>
            <span className="text-xs text-white/70 font-normal">
              @{video.creator.username}
            </span>
            {video.creator.isVerified && (
              <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[9px]">
                ✓
              </span>
            )}
          </button>
        </div>

        {/* Caption */}
        <div className="text-xs text-white/90 leading-relaxed mb-2 font-normal">
          <p className={isCaptionExpanded ? '' : 'line-clamp-2'}>
            {video.caption.split(' ').map((word, idx) => {
              if (word.startsWith('#')) {
                const tagClean = word.replace('#', '');
                return (
                  <span
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTag(tagClean);
                    }}
                    className="font-bold text-pink-400 hover:text-pink-300 cursor-pointer mr-1"
                  >
                    {word}{' '}
                  </span>
                );
              }
              return word + ' ';
            })}
          </p>
          {video.caption.length > 80 && (
            <button
              onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
              className="text-[11px] text-white/60 hover:text-white font-semibold mt-0.5"
            >
              {isCaptionExpanded ? (lang === 'bn' ? 'সংক্ষেপ করুন' : 'less') : (lang === 'bn' ? 'আরও দেখুন' : 'more')}
            </button>
          )}
        </div>

        {/* Music Marquee Bar */}
        <button
          onClick={() => onOpenSound(video.sound)}
          className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/45 hover:bg-black/65 border border-white/10 text-white/90 text-xs w-max max-w-[240px] overflow-hidden group transition-colors"
        >
          <Music className="w-3 h-3 text-pink-400 shrink-0 group-hover:rotate-12 transition-transform" />
          <div className="overflow-hidden whitespace-nowrap text-[11px] font-medium">
            <span className="inline-block group-hover:text-pink-300">
              {video.sound.title} • {video.sound.artist}
            </span>
          </div>
        </button>
      </div>

      {/* Scrub / Progress Bar */}
      <div className="absolute bottom-12 left-0 right-0 h-1 bg-white/20 z-30">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
