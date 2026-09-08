import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { NEXUP_LOGO } from '../constants/logo';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  lang: 'bn' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  lang,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      username: (username.trim() || 'nexup_creator').toLowerCase().replace(/\s+/g, '_'),
      name: name.trim() || 'Nexup Creator',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      bio: 'New creator on Nexup 🚀 Ready to share amazing short videos!',
      followersCount: 1,
      followingCount: 5,
      totalLikes: 0,
      isFollowed: false,
      isVerified: false,
      email: email || 'user@nexup.app',
    };

    onLogin(newUser);
    onClose();
  };

  const handleQuickGuest = () => {
    const guestUser: User = {
      id: 'usr_guest',
      username: 'bangla_viewer',
      name: 'Guest Explorer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Exploring trending clips on Nexup 🇧🇩',
      followersCount: 120,
      followingCount: 45,
      totalLikes: 890,
      isFollowed: false,
      isVerified: false,
    };
    onLogin(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <img
            src={NEXUP_LOGO}
            alt="Nexup Logo"
            className="w-12 h-12 rounded-xl ring-2 ring-pink-500/40 mb-2 object-cover shadow-lg"
            referrerPolicy="no-referrer"
          />
          <h2 className="font-extrabold text-lg text-white">
            {lang === 'bn' ? 'Nexup এ স্বাগতম' : 'Join Nexup'}
          </h2>
          <p className="text-xs text-white/50">
            {lang === 'bn' ? 'শর্ট ভিডিও তৈরি ও উপভোগ করুন' : 'Your home for next-generation short videos'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-zinc-800 p-1 mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              tab === 'login' ? 'bg-pink-600 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'লগইন' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              tab === 'register' ? 'bg-pink-600 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'রেজিস্ট্রেশন' : 'Register'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {tab === 'register' && (
            <div>
              <label className="block text-white/70 mb-1 font-semibold">
                {lang === 'bn' ? 'পুরো নাম' : 'Full Name'}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shihab Ahmed"
                  className="w-full bg-zinc-800 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-white/70 mb-1 font-semibold">
              {lang === 'bn' ? 'ইউজারনেম' : 'Username'}
            </label>
            <div className="relative">
              <span className="text-white/40 absolute left-3 top-1/2 -translate-y-1/2 font-bold">@</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="shihab_vibes"
                className="w-full bg-zinc-800 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 mb-1 font-semibold">
              {lang === 'bn' ? 'ইমেইল বা ফোন' : 'Email or Phone'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-zinc-800 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 mb-1 font-semibold">
              {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                defaultValue="password123"
                className="w-full bg-zinc-800 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold shadow-lg shadow-pink-500/25 mt-2 transition-all active:scale-95"
          >
            {tab === 'login'
              ? (lang === 'bn' ? 'লগইন করুন' : 'Sign In')
              : (lang === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
          </button>
        </form>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-2 bg-zinc-900 text-[10px] text-white/40 uppercase">
            {lang === 'bn' ? 'অথবা' : 'or continue as'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleQuickGuest}
          className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-semibold text-white/80 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>{lang === 'bn' ? 'অতিথি হিসেবে চালিয়ে যান' : 'Quick Guest Mode'}</span>
        </button>
      </div>
    </div>
  );
};
