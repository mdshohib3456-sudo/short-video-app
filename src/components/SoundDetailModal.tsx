import React from 'react';
import { X, Music, Play, Plus, Film } from 'lucide-react';
import { SoundTrack, VideoItem } from '../types';

interface SoundDetailModalProps {
  sound: SoundTrack | null;
  onClose: () => void;
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  onUseSound: (sound: SoundTrack) => void;
  lang: 'bn' | 'en';
}

export const SoundDetailModal: React.FC<SoundDetailModalProps> = ({
  sound,
  onClose,
  videos,
  onSelectVideo,
  onUseSound,
  lang,
}) => {
  if (!sound) return null;

  const soundVideos = videos.filter((v) => v.sound.id === sound.id);

  const formatCount = (count?: number): string => {
    if (!count) return '12.4K';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-5 md:p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sound Header Info */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg border border-white/15 shrink-0 group">
            <img
              src={sound.coverUrl}
              alt={sound.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-pink-500/90 text-white flex items-center justify-center shadow">
                <Music className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-base text-white truncate">
              {sound.title}
            </h3>
            <p className="text-xs text-white/70 truncate mt-0.5">
              {sound.artist}
            </p>
            <p className="text-[11px] text-pink-400 font-semibold mt-1">
              {formatCount(sound.videoCount)} {lang === 'bn' ? 'টি ভিডিওতে ব্যবহার করা হয়েছে' : 'clips created'}
            </p>
          </div>
        </div>

        {/* "Use this sound" Action */}
        <button
          onClick={() => onUseSound(sound)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-xs font-bold text-white shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 mb-5 active:scale-95 transition-all"
        >
          <Film className="w-4 h-4" />
          <span>
            {lang === 'bn' ? 'এই সাউন্ড দিয়ে ভিডিও তৈরি করুন' : 'Use this sound in video'}
          </span>
        </button>

        {/* Videos with this audio */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2.5">
            {lang === 'bn' ? 'এই অডিওর জনপ্রিয় ভিডিও' : 'Videos with this sound'}
          </h4>

          {soundVideos.length === 0 ? (
            <div className="text-center py-6 text-white/40 text-xs">
              {lang === 'bn' ? 'এই অডিও দিয়ে প্রথম ভিডিওটি আপনিই বানান!' : 'Be the first to create a clip with this track!'}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {soundVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => {
                    onSelectVideo(vid);
                    onClose();
                  }}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden bg-zinc-950 border border-white/10 group cursor-pointer hover:border-pink-500 transition-colors"
                >
                  <img
                    src={vid.posterUrl}
                    alt={vid.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] font-bold text-white">
                    <Play className="w-3 h-3 fill-white" />
                    <span>{formatCount(vid.viewsCount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
