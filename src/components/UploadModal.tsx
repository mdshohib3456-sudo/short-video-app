import React, { useState, useRef } from 'react';
import { Upload, X, Music, Sparkles, Check, Film, Play, Pause, Globe, Lock, Users } from 'lucide-react';
import { VideoItem, SoundTrack, User } from '../types';
import { SOUND_TRACKS } from '../data/mockData';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (video: VideoItem) => void;
  currentUser: User;
  initialSound?: SoundTrack;
  lang: 'bn' | 'en';
}

const PRESET_TEMPLATES = [
  {
    title: 'Neon Cyberpunk Dance',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    caption: 'My new Nexup dance session with neon aesthetic! ✨🎶 #Nexup #Vibes #Bangla',
  },
  {
    title: 'Skater Sunset Vibes',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-performing-a-trick-41199-large.mp4',
    poster: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=600&q=80',
    caption: 'Sunset skating in Dhaka streets! 🛹🌅 Keep pushing forward! #Skate #Nexup #Action',
  },
  {
    title: 'Aesthetic Nature Stream',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    caption: 'Relaxing sounds of nature 🌊🍃 Share peace with everyone. #Nature #Peace #Nexup',
  },
];

const SUGGESTED_HASHTAGS = ['#Nexup', '#Bangla', '#Viral', '#Trending', '#Dance', '#Comedy', '#Dhaka', '#Tech'];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  currentUser,
  initialSound,
  lang,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [selectedSound, setSelectedSound] = useState<SoundTrack>(initialSound || SOUND_TRACKS[0]);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  const handleSelectPreset = (template: typeof PRESET_TEMPLATES[0]) => {
    setVideoPreviewUrl(template.url);
    setCaption(template.caption);
  };

  const handleAddHashtag = (tag: string) => {
    if (!caption.includes(tag)) {
      setCaption((prev) => (prev ? `${prev} ${tag}` : tag));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPreviewUrl) return;

    setIsUploading(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      setUploadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Extract tags from caption
          const extractedTags = caption
            .split(' ')
            .filter((w) => w.startsWith('#'))
            .map((w) => w.replace('#', ''));

          const newVideo: VideoItem = {
            id: `vid_custom_${Date.now()}`,
            videoUrl: videoPreviewUrl,
            posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            caption: caption.trim() || (lang === 'bn' ? 'আমার নতুন Nexup ভিডিও! ✨' : 'My brand new clip on Nexup! ✨'),
            tags: extractedTags.length > 0 ? extractedTags : ['Nexup', 'New'],
            creator: currentUser,
            sound: selectedSound,
            likesCount: 1,
            commentsCount: 0,
            sharesCount: 0,
            viewsCount: 12,
            isLiked: true,
            isBookmarked: false,
            createdAt: 'Just now',
          };

          onPublish(newVideo);
          setIsUploading(false);
          setUploadProgress(0);
          onClose();
        }, 400);
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-3xl p-5 md:p-6 text-white shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-cyan-400 p-[1px] flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {lang === 'bn' ? 'ভিডিও আপলোড স্টুডিও' : 'Create Video Studio'}
              </h2>
              <p className="text-[11px] text-white/50">
                {lang === 'bn' ? 'আপনার শর্ট ভিডিও শেয়ার করুন' : 'Share your story with the Nexup community'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left: Video preview or dropzone */}
            <div className="md:col-span-5 flex flex-col">
              {videoPreviewUrl ? (
                <div className="relative aspect-[9/16] w-full max-h-[290px] rounded-2xl overflow-hidden bg-black border border-white/15 mx-auto group">
                  <video
                    ref={videoPreviewRef}
                    src={videoPreviewUrl}
                    loop
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div
                    onClick={() => {
                      if (videoPreviewRef.current) {
                        if (videoPreviewRef.current.paused) {
                          videoPreviewRef.current.play();
                          setIsPreviewPlaying(true);
                        } else {
                          videoPreviewRef.current.pause();
                          setIsPreviewPlaying(false);
                        }
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 cursor-pointer transition-colors"
                  >
                    {!isPreviewPlaying && (
                      <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white shadow-lg">
                        <Play className="w-5 h-5 ml-0.5" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoPreviewUrl('');
                      setVideoFile(null);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[9/16] w-full max-h-[280px] rounded-2xl border-2 border-dashed border-white/20 hover:border-pink-500 bg-zinc-950/60 flex flex-col items-center justify-center text-center p-4 cursor-pointer group transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-500/15 group-hover:bg-pink-500/30 flex items-center justify-center text-pink-400 mb-2 transition-transform group-hover:scale-110">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {lang === 'bn' ? 'ভিডিও ফাইল নির্বাচন করুন' : 'Choose Video File'}
                  </span>
                  <span className="text-[10px] text-white/50 mt-1">
                    MP4, WebM (upto 60s)
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* Sample Templates Quick-Pick (Great for instant testing) */}
              {!videoPreviewUrl && (
                <div className="mt-2 text-left">
                  <span className="text-[10px] text-white/60 font-semibold mb-1 block">
                    {lang === 'bn' ? 'অথবা ডেমো ক্লিপ বাছাই করুন:' : 'Or pick sample clip:'}
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {PRESET_TEMPLATES.map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectPreset(tpl)}
                        className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] text-white/80 shrink-0 border border-white/10"
                      >
                        {tpl.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Metadata, Sound, Hashtags */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-3">
              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-white/90 mb-1">
                  {lang === 'bn' ? 'ক্যাপশন ও হ্যাশট্যাগ' : 'Caption & Hashtags'}
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  placeholder={
                    lang === 'bn'
                      ? 'আপনার ভিডিও সম্পর্কে কিছু লিখুন... যেমন: #Nexup #Bangla'
                      : 'Describe your video and add hashtags...'
                  }
                  className="w-full bg-zinc-800/90 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Suggested Hashtags */}
              <div>
                <span className="text-[10px] text-white/50 block mb-1 font-medium">
                  {lang === 'bn' ? 'জনপ্রিয় হ্যাশট্যাগ যোগ করুন:' : 'Add trending hashtags:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_HASHTAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddHashtag(tag)}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-pink-500/20 hover:text-pink-400 border border-white/10 text-[10px] text-white/70 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Selector */}
              <div>
                <label className="block text-xs font-bold text-white/90 mb-1 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-pink-400" />
                  <span>{lang === 'bn' ? 'ব্যাকগ্রাউন্ড অডিও' : 'Audio Track'}</span>
                </label>
                <select
                  value={selectedSound.id}
                  onChange={(e) => {
                    const found = SOUND_TRACKS.find((s) => s.id === e.target.value);
                    if (found) setSelectedSound(found);
                  }}
                  className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  {SOUND_TRACKS.map((snd) => (
                    <option key={snd.id} value={snd.id}>
                      🎵 {snd.title} - {snd.artist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Privacy mode */}
              <div>
                <label className="block text-xs font-bold text-white/90 mb-1">
                  {lang === 'bn' ? 'প্রাইভেসি' : 'Who can view'}
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPrivacy('public')}
                    className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 transition-colors ${
                      privacy === 'public'
                        ? 'bg-pink-600/30 border-pink-500 text-pink-300 font-bold'
                        : 'bg-zinc-800 border-white/10 text-white/60'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>{lang === 'bn' ? 'পাবলিক' : 'Public'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrivacy('friends')}
                    className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 transition-colors ${
                      privacy === 'friends'
                        ? 'bg-pink-600/30 border-pink-500 text-pink-300 font-bold'
                        : 'bg-zinc-800 border-white/10 text-white/60'
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    <span>{lang === 'bn' ? 'বন্ধুরা' : 'Friends'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrivacy('private')}
                    className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 transition-colors ${
                      privacy === 'private'
                        ? 'bg-pink-600/30 border-pink-500 text-pink-300 font-bold'
                        : 'bg-zinc-800 border-white/10 text-white/60'
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                    <span>{lang === 'bn' ? 'প্রাইভেট' : 'Private'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-bold text-pink-400">
                <span>{lang === 'bn' ? 'Nexup এ আপলোড হচ্ছে...' : 'Publishing to Nexup...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-rose-500 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={!videoPreviewUrl || isUploading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-pink-500/30 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isUploading
                  ? (lang === 'bn' ? 'পোস্ট হচ্ছে...' : 'Publishing...')
                  : (lang === 'bn' ? 'ভিডিও পোস্ট করুন' : 'Post Video')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
