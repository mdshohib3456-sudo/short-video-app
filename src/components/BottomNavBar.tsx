import React from 'react';
import { Home, Compass, Plus, Bell, User as UserIcon } from 'lucide-react';
import { ActiveNavTab, User } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  currentUser: User;
  unreadCount?: number;
  lang: 'bn' | 'en';
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  unreadCount = 2,
  lang,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 flex items-center justify-around select-none">
      {/* Home */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'home' ? 'text-white' : 'text-white/50 hover:text-white/80'
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] mt-1 font-medium">
          {lang === 'bn' ? 'হোম' : 'Home'}
        </span>
      </button>

      {/* Discover / Search */}
      <button
        onClick={() => onTabChange('discover')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'discover' ? 'text-white' : 'text-white/50 hover:text-white/80'
        }`}
      >
        <Compass className={`w-5 h-5 ${activeTab === 'discover' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] mt-1 font-medium">
          {lang === 'bn' ? 'আবিষ্কার' : 'Discover'}
        </span>
      </button>

      {/* Center Upload Button */}
      <div className="flex-1 flex justify-center py-1">
        <button
          onClick={() => onTabChange('upload')}
          title={lang === 'bn' ? 'ভিডিও আপলোড করুন' : 'Upload Video'}
          className="relative group transition-transform active:scale-95"
        >
          {/* Dual color border effect like TikTok/Nexup */}
          <div className="w-11 h-7 rounded-lg bg-gradient-to-r from-cyan-400 via-pink-500 to-rose-500 p-[2px] shadow-lg shadow-pink-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
              <Plus className="w-5 h-5 text-white stroke-[2.8]" />
            </div>
          </div>
        </button>
      </div>

      {/* Inbox / Notifications */}
      <button
        onClick={() => onTabChange('inbox')}
        className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'inbox' ? 'text-white' : 'text-white/50 hover:text-white/80'
        }`}
      >
        <div className="relative">
          <Bell className={`w-5 h-5 ${activeTab === 'inbox' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-pink-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-black animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-1 font-medium">
          {lang === 'bn' ? 'ইনবক্স' : 'Inbox'}
        </span>
      </button>

      {/* Profile */}
      <button
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'profile' ? 'text-white' : 'text-white/50 hover:text-white/80'
        }`}
      >
        <div className="relative">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className={`w-5 h-5 rounded-full object-cover border ${
                activeTab === 'profile' ? 'border-pink-500 ring-1 ring-pink-500' : 'border-white/40'
              }`}
            />
          ) : (
            <UserIcon className="w-5 h-5" />
          )}
        </div>
        <span className="text-[10px] mt-1 font-medium">
          {lang === 'bn' ? 'প্রোফাইল' : 'Profile'}
        </span>
      </button>
    </nav>
  );
};
