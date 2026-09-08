/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { VideoItem, User, SoundTrack, FeedTab, ActiveNavTab, NotificationItem, Comment } from './types';
import { INITIAL_VIDEOS, CURRENT_USER, CREATORS, INITIAL_COMMENTS, INITIAL_NOTIFICATIONS, SOUND_TRACKS } from './data/mockData';
import { HeaderNav } from './components/HeaderNav';
import { BottomNavBar } from './components/BottomNavBar';
import { VideoFeed } from './components/VideoFeed';
import { CommentsSheet } from './components/CommentsSheet';
import { ShareModal } from './components/ShareModal';
import { UploadModal } from './components/UploadModal';
import { DiscoverView } from './components/DiscoverView';
import { InboxView } from './components/InboxView';
import { ProfileView } from './components/ProfileView';
import { SoundDetailModal } from './components/SoundDetailModal';
import { AuthModal } from './components/AuthModal';
import { Smartphone, Monitor, Keyboard } from 'lucide-react';
import { NEXUP_LOGO } from './constants/logo';

export default function App() {
  // Persistence states
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('nexup_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('nexup_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem('nexup_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('nexup_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // App navigation and view state
  const [activeNavTab, setActiveNavTab] = useState<ActiveNavTab>('home');
  const [feedTab, setFeedTab] = useState<FeedTab>('foryou');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(false);

  // Modals and sheets
  const [activeCommentsVideo, setActiveCommentsVideo] = useState<VideoItem | null>(null);
  const [activeShareVideo, setActiveShareVideo] = useState<VideoItem | null>(null);
  const [activeSound, setActiveSound] = useState<SoundTrack | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<User | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [uploadPresetSound, setUploadPresetSound] = useState<SoundTrack | undefined>(undefined);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nexup_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('nexup_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexup_comments', JSON.stringify(commentsMap));
  }, [commentsMap]);

  useEffect(() => {
    localStorage.setItem('nexup_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Global key listener for sound mute toggle (M key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())) {
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleToggleLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isLikedNow = !v.isLiked;
          return {
            ...v,
            isLiked: isLikedNow,
            likesCount: isLikedNow ? v.likesCount + 1 : Math.max(0, v.likesCount - 1),
          };
        }
        return v;
      })
    );
  };

  const handleToggleBookmark = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            isBookmarked: !v.isBookmarked,
          };
        }
        return v;
      })
    );
  };

  const handleToggleFollow = (creatorId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.creator.id === creatorId) {
          const newFollowed = !v.creator.isFollowed;
          return {
            ...v,
            creator: {
              ...v.creator,
              isFollowed: newFollowed,
              followersCount: newFollowed
                ? v.creator.followersCount + 1
                : Math.max(0, v.creator.followersCount - 1),
            },
          };
        }
        return v;
      })
    );

    if (selectedCreator && selectedCreator.id === creatorId) {
      setSelectedCreator((prev) =>
        prev
          ? {
              ...prev,
              isFollowed: !prev.isFollowed,
              followersCount: !prev.isFollowed
                ? prev.followersCount + 1
                : Math.max(0, prev.followersCount - 1),
            }
          : null
      );
    }
  };

  const handleAddComment = (videoId: string, text: string) => {
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      videoId,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
      },
      text,
      timestamp: lang === 'bn' ? 'এইমাত্র' : 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setCommentsMap((prev) => ({
      ...prev,
      [videoId]: [newComment, ...(prev[videoId] || [])],
    }));

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            commentsCount: v.commentsCount + 1,
          };
        }
        return v;
      })
    );
  };

  const handleToggleCommentLike = (videoId: string, commentId: string) => {
    setCommentsMap((prev) => {
      const currentComments = prev[videoId] || [];
      return {
        ...prev,
        [videoId]: currentComments.map((c) => {
          if (c.id === commentId) {
            const nextLiked = !c.isLiked;
            return {
              ...c,
              isLiked: nextLiked,
              likesCount: nextLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
            };
          }
          return c;
        }),
      };
    });
  };

  const handlePublishVideo = (newVideo: VideoItem) => {
    setVideos((prev) => [newVideo, ...prev]);
    setActiveNavTab('home');
    setFeedTab('foryou');
  };

  const handleOpenCreatorProfile = (creator: User) => {
    if (creator.id === currentUser.id) {
      setActiveNavTab('profile');
      setSelectedCreator(null);
    } else {
      setSelectedCreator(creator);
      setActiveNavTab('profile');
    }
  };

  const handleSelectVideoFromGrid = (video: VideoItem) => {
    // Bring chosen video to top of feed and switch to home tab
    setVideos((prev) => {
      const remaining = prev.filter((v) => v.id !== video.id);
      return [video, ...remaining];
    });
    setSelectedCreator(null);
    setActiveNavTab('home');
    setFeedTab('foryou');
  };

  const handleSelectTag = (tag: string) => {
    setActiveNavTab('discover');
  };

  const handleUseSoundInUpload = (sound: SoundTrack) => {
    setUploadPresetSound(sound);
    setActiveSound(null);
    setIsUploadOpen(true);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNavTabClick = (tab: ActiveNavTab) => {
    if (tab === 'upload') {
      setIsUploadOpen(true);
      return;
    }
    if (tab === 'home' && selectedCreator) {
      setSelectedCreator(null);
    }
    setActiveNavTab(tab);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  // Video subsets for user profile
  const myUploadedVideos = videos.filter((v) => v.creator.id === currentUser.id);
  const myLikedVideos = videos.filter((v) => v.isLiked);
  const mySavedVideos = videos.filter((v) => v.isBookmarked);

  // Selected other creator's videos
  const creatorVideos = selectedCreator
    ? videos.filter((v) => v.creator.id === selectedCreator.id)
    : [];

  return (
    <div className="w-full h-screen h-[100dvh] bg-zinc-950 text-white flex flex-col md:flex-row items-center justify-center overflow-hidden font-sans">
      {/* Desktop Background Ambient Backdrop */}
      <div className="hidden md:block fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900 via-zinc-950 to-black" />

      {/* Desktop Side Info & Shortcut Panel (Only on desktop wide screens) */}
      <div className="hidden lg:flex flex-col justify-between w-72 h-[88vh] mr-8 p-6 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl shadow-2xl z-10">
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={NEXUP_LOGO}
              alt="Nexup Logo"
              className="w-11 h-11 rounded-2xl ring-2 ring-pink-500/30 object-cover shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">
                Nexup
              </h1>
              <span className="text-[11px] text-white/50 font-semibold tracking-wide">
                Short Video Platform
              </span>
            </div>
          </div>

          <p className="text-xs text-white/70 leading-relaxed mb-5">
            {lang === 'bn'
              ? 'TikTok-এর মতো ফুল-স্ক্রিন শর্ট ভিডিও ফিড, লাইভ অডিও, কমেন্ট, শেয়ার এবং ভিডিও আপলোড স্টুডিও।'
              : 'Full-screen vertical short video social platform with custom branding, upload studio, creator profiles, and audio discovery.'}
          </p>

          {/* Quick Creator Tagline */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2 mb-5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">
                {lang === 'bn' ? 'বর্তমান ব্যবহারকারী' : 'Logged as'}:
              </span>
              <span className="font-bold text-pink-400 truncate max-w-[120px]">
                @{currentUser.username}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">
                {lang === 'bn' ? 'মোট ভিডিও' : 'Total Clips'}:
              </span>
              <span className="font-bold text-white">{videos.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">
                {lang === 'bn' ? 'ভাষা' : 'Language'}:
              </span>
              <button
                onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                className="text-cyan-400 hover:underline font-bold"
              >
                {lang === 'bn' ? 'বাংলা (BN)' : 'English (EN)'}
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
              <Keyboard className="w-3.5 h-3.5 text-pink-400" />
              <span>{lang === 'bn' ? 'কীবোর্ড শর্টকাট' : 'Shortcuts'}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-white/60">
              <div className="p-1.5 rounded-lg bg-zinc-800/60 border border-white/5 flex items-center justify-between">
                <span>Next clip</span>
                <kbd className="px-1.5 py-0.5 rounded bg-black text-pink-400 font-mono text-[9px]">↓</kbd>
              </div>
              <div className="p-1.5 rounded-lg bg-zinc-800/60 border border-white/5 flex items-center justify-between">
                <span>Prev clip</span>
                <kbd className="px-1.5 py-0.5 rounded bg-black text-pink-400 font-mono text-[9px]">↑</kbd>
              </div>
              <div className="p-1.5 rounded-lg bg-zinc-800/60 border border-white/5 flex items-center justify-between">
                <span>Mute</span>
                <kbd className="px-1.5 py-0.5 rounded bg-black text-pink-400 font-mono text-[9px]">M</kbd>
              </div>
              <div className="p-1.5 rounded-lg bg-zinc-800/60 border border-white/5 flex items-center justify-between">
                <span>Play/Pause</span>
                <kbd className="px-1.5 py-0.5 rounded bg-black text-pink-400 font-mono text-[9px]">Tap</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Frame Toggle button */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors"
          >
            {deviceFrameMode ? (
              <>
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'bn' ? 'ওয়াইড স্ক্রিন ভিউ' : 'Wide View'}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-pink-400" />
                <span>{lang === 'bn' ? 'মোবাইল ফ্রেম ভিউ' : 'Phone Frame'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Application Container (Phone-proportioned or Fullscreen) */}
      <main
        className={`relative w-full h-full bg-black overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
          deviceFrameMode
            ? 'md:max-w-[420px] md:h-[92vh] md:rounded-[40px] md:border-[7px] md:border-zinc-800 md:ring-1 md:ring-white/20'
            : 'md:max-w-[460px] md:h-full md:border-x md:border-white/10'
        }`}
      >
        {/* Header (Visible on Home Feed) */}
        {activeNavTab === 'home' && (
          <HeaderNav
            currentTab={feedTab}
            onSelectTab={(tab) => setFeedTab(tab)}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            onOpenSearch={() => setActiveNavTab('discover')}
            lang={lang}
            onToggleLang={() => setLang(lang === 'bn' ? 'en' : 'bn')}
          />
        )}

        {/* View Switcher */}
        <div className="flex-1 w-full h-full relative overflow-hidden">
          {activeNavTab === 'home' && (
            <VideoFeed
              videos={videos}
              currentTab={feedTab}
              isMuted={isMuted}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              onToggleFollow={handleToggleFollow}
              onOpenComments={(vid) => setActiveCommentsVideo(vid)}
              onOpenShare={(vid) => setActiveShareVideo(vid)}
              onOpenSound={(sound) => setActiveSound(sound)}
              onOpenCreatorProfile={handleOpenCreatorProfile}
              onSelectTag={handleSelectTag}
              onExploreMore={() => setFeedTab('foryou')}
              lang={lang}
            />
          )}

          {activeNavTab === 'discover' && (
            <DiscoverView
              videos={videos}
              creators={Object.values(CREATORS)}
              onSelectVideo={handleSelectVideoFromGrid}
              onSelectCreator={handleOpenCreatorProfile}
              onToggleFollow={handleToggleFollow}
              lang={lang}
            />
          )}

          {activeNavTab === 'inbox' && (
            <InboxView
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllRead}
              lang={lang}
            />
          )}

          {activeNavTab === 'profile' && (
            <ProfileView
              user={selectedCreator || currentUser}
              isCurrentUser={!selectedCreator || selectedCreator.id === currentUser.id}
              userVideos={selectedCreator ? creatorVideos : myUploadedVideos}
              likedVideos={myLikedVideos}
              savedVideos={mySavedVideos}
              onSelectVideo={handleSelectVideoFromGrid}
              onToggleFollow={handleToggleFollow}
              onUpdateProfile={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
              onLogout={() => setIsAuthOpen(true)}
              onBackToFeed={() => {
                setSelectedCreator(null);
                setActiveNavTab('home');
              }}
              lang={lang}
            />
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeNavTab}
          onTabChange={handleNavTabClick}
          currentUser={currentUser}
          unreadCount={unreadNotificationCount}
          lang={lang}
        />
      </main>

      {/* Slide-over / Modal overlays */}
      {/* 1. Comments Drawer */}
      {activeCommentsVideo && (
        <CommentsSheet
          isOpen={Boolean(activeCommentsVideo)}
          onClose={() => setActiveCommentsVideo(null)}
          videoId={activeCommentsVideo.id}
          comments={commentsMap[activeCommentsVideo.id] || []}
          onAddComment={handleAddComment}
          onToggleCommentLike={handleToggleCommentLike}
          currentUser={currentUser}
          lang={lang}
        />
      )}

      {/* 2. Share Modal */}
      {activeShareVideo && (
        <ShareModal
          isOpen={Boolean(activeShareVideo)}
          onClose={() => setActiveShareVideo(null)}
          video={activeShareVideo}
          lang={lang}
        />
      )}

      {/* 3. Upload Video Studio */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setUploadPresetSound(undefined);
        }}
        onPublish={handlePublishVideo}
        currentUser={currentUser}
        initialSound={uploadPresetSound}
        lang={lang}
      />

      {/* 4. Sound Details Modal */}
      <SoundDetailModal
        sound={activeSound}
        onClose={() => setActiveSound(null)}
        videos={videos}
        onSelectVideo={handleSelectVideoFromGrid}
        onUseSound={handleUseSoundInUpload}
        lang={lang}
      />

      {/* 5. Auth / Account Switch Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(user) => {
          setCurrentUser(user);
          setSelectedCreator(null);
        }}
        lang={lang}
      />
    </div>
  );
}
