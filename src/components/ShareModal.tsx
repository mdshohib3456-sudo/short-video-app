import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Send, Share, Download, Flag, QrCode } from 'lucide-react';
import { VideoItem } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoItem;
  lang: 'bn' | 'en';
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  video,
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [reported, setReported] = useState(false);

  if (!isOpen) return null;

  const videoShareUrl = `${window.location.origin}/#video=${video.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(`${video.caption} | Watch on Nexup`);
    const url = encodeURIComponent(videoShareUrl);
    let target = '';

    switch (platform) {
      case 'whatsapp':
        target = `https://api.whatsapp.com/send?text=${text}%20${url}`;
        break;
      case 'facebook':
        target = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'telegram':
        target = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
      case 'twitter':
        target = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
    }

    if (target) {
      window.open(target, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = video.videoUrl;
    a.download = `nexup_${video.id}.mp4`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center bg-black/70 backdrop-blur-xs p-0 md:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Content */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-t-3xl md:rounded-3xl p-5 text-white shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <h3 className="font-extrabold text-sm">
            {lang === 'bn' ? 'ভিডিও শেয়ার করুন' : 'Share Video'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video mini preview card */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-800/80 mb-4 border border-white/5">
          <img
            src={video.posterUrl}
            alt={video.caption}
            className="w-12 h-16 rounded-lg object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              @{video.creator.username}
            </p>
            <p className="text-[11px] text-white/70 line-clamp-2 mt-0.5">
              {video.caption}
            </p>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="grid grid-cols-4 gap-3 text-center mb-5">
          <button
            onClick={() => handleSocialShare('whatsapp')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-all">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-white/70">WhatsApp</span>
          </button>

          <button
            onClick={() => handleSocialShare('telegram')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center transition-all">
              <Send className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-white/70">Telegram</span>
          </button>

          <button
            onClick={() => handleSocialShare('facebook')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center transition-all">
              <Share className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-white/70">Facebook</span>
          </button>

          <button
            onClick={() => handleSocialShare('twitter')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white flex items-center justify-center transition-all">
              <span className="font-extrabold text-lg">𝕏</span>
            </div>
            <span className="text-[11px] text-white/70">Twitter/X</span>
          </button>
        </div>

        {/* Actions Row (Copy Link, Download, QR Code, Report) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-zinc-950 rounded-xl border border-white/10">
            <input
              type="text"
              readOnly
              value={videoShareUrl}
              className="bg-transparent text-xs text-white/70 flex-1 outline-none px-2 truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-pink-600 hover:bg-pink-500 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'লিংক কপি' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={handleDownload}
              className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 text-white/80 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-pink-400" />
              <span>{lang === 'bn' ? 'ডাউনলোড' : 'Save'}</span>
            </button>

            <button
              onClick={() => setShowQr(!showQr)}
              className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 text-white/80 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>QR Code</span>
            </button>

            <button
              onClick={() => {
                setReported(true);
                setTimeout(() => setReported(false), 3000);
              }}
              className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 text-white/80 transition-colors"
            >
              <Flag className="w-3.5 h-3.5 text-rose-400" />
              <span>{reported ? (lang === 'bn' ? 'রিপোর্ট হয়েছে' : 'Reported') : (lang === 'bn' ? 'রিপোর্ট' : 'Report')}</span>
            </button>
          </div>

          {showQr && (
            <div className="mt-3 p-4 bg-white rounded-2xl flex flex-col items-center justify-center text-black">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(videoShareUrl)}`}
                alt="QR Code"
                className="w-36 h-36"
              />
              <span className="text-[11px] font-bold mt-2 text-zinc-700">
                {lang === 'bn' ? 'স্ক্যান করে Nexup এ ভিডিওটি দেখুন' : 'Scan to watch on Nexup'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
