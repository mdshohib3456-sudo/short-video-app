import React from 'react';
import { Volume2, VolumeX, Search, Radio, Globe } from 'lucide-react';
import { NEXUP_LOGO } from '../constants/logo';
import { FeedTab } from '../types';

interface HeaderNavProps {
  currentTab: FeedTab;
  onSelectTab: (tab: FeedTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSearch: () => void;
  lang: 'bn' | 'en';
  onToggleLang: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTab,
  onSelectTab,
  isMuted,
  onToggleMute,
  onOpenSearch,
  lang,
  onToggleLang,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3.5 pt-3 pb-2 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-auto">
      {/* Left: Nexup Logo & Live Indicator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => onSelectTab('foryou')}>
          <img
            src={NEXUP_LOGO}
            alt="Nexup Logo"
            className="w-8 h-8 rounded-lg shadow-md ring-1 ring-white/20 object-cover group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
            Nexup
          </span>
        </div>

        <button
          onClick={onToggleLang}
          title={lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
          className="ml-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white/80 border border-white/10 flex items-center gap-1 transition-colors"
        >
          <Globe className="w-3 h-3 text-pink-400" />
          <span>{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
        </button>
      </div>

      {/* Center: Feed Tabs (Following / For You) */}
      <div className="flex items-center gap-4 text-sm font-bold">
        <button
          onClick={() => onSelectTab('following')}
          className={`relative pb-1 transition-all ${
            currentTab === 'following'
              ? 'text-white scale-105 font-extrabold'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          {lang === 'bn' ? 'অনুসরণ' : 'Following'}
          {currentTab === 'following' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-pink-500 rounded-full" />
          )}
        </button>

        <span className="text-white/20">|</span>

        <button
          onClick={() => onSelectTab('foryou')}
          className={`relative pb-1 transition-all ${
            currentTab === 'foryou'
              ? 'text-white scale-105 font-extrabold'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          {lang === 'bn' ? 'আপনার জন্য' : 'For You'}
          {currentTab === 'foryou' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-pink-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Right: Sound & Search Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white transition-transform active:scale-95"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>

        <button
          onClick={onOpenSearch}
          title="Search Nexup"
          className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white transition-transform active:scale-95"
        >
          <Search className="w-4 h-4 text-white/90" />
        </button>
      </div>
    </header>
  );
};
