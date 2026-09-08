import React, { useState } from 'react';
import { X, Send, Heart, Smile } from 'lucide-react';
import { Comment, User } from '../types';

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  comments: Comment[];
  onAddComment: (videoId: string, text: string) => void;
  onToggleCommentLike: (videoId: string, commentId: string) => void;
  currentUser: User;
  lang: 'bn' | 'en';
}

const EMOJI_SUGGESTIONS = ['🔥', '❤️', '👏', '🚀', '😍', '😂', '🇧🇩', '✨', '💯'];

export const CommentsSheet: React.FC<CommentsSheetProps> = ({
  isOpen,
  onClose,
  videoId,
  comments,
  onAddComment,
  onToggleCommentLike,
  currentUser,
  lang,
}) => {
  const [commentText, setCommentText] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(videoId, commentText.trim());
    setCommentText('');
  };

  const handleEmojiClick = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Sheet Container */}
      <div className="w-full max-w-lg mx-auto bg-zinc-900 border-t border-white/10 rounded-t-2xl max-h-[75vh] h-[75vh] flex flex-col text-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250">
        {/* Header */}
        <div className="relative px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="w-6" /> {/* spacer */}
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">
            {comments.length}{' '}
            {lang === 'bn'
              ? comments.length === 1 ? 'টি কমেন্ট' : 'টি কমেন্ট'
              : comments.length === 1 ? 'Comment' : 'Comments'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/50">
              <Smile className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm font-semibold">
                {lang === 'bn' ? 'এখনো কোনো কমেন্ট নেই' : 'No comments yet'}
              </p>
              <p className="text-xs text-white/40 mt-0.5">
                {lang === 'bn' ? 'প্রথম কমেন্টটি আপনিই করুন!' : 'Be the first to share your thoughts!'}
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 group">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-bold text-xs text-white/90">
                      {comment.user.name}
                    </span>
                    <span className="text-[11px] text-white/40">
                      @{comment.user.username}
                    </span>
                    {comment.user.isVerified && (
                      <span className="w-3 h-3 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[8px]">
                        ✓
                      </span>
                    )}
                    <span className="text-[10px] text-white/30 ml-auto">
                      {comment.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-white/85 leading-relaxed break-words">
                    {comment.text}
                  </p>
                </div>

                {/* Like comment button */}
                <button
                  onClick={() => onToggleCommentLike(videoId, comment.id)}
                  className="flex flex-col items-center shrink-0 pt-1 text-white/40 hover:text-white/80 transition-colors"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      comment.isLiked
                        ? 'fill-rose-500 text-rose-500'
                        : 'stroke-[2.2]'
                    }`}
                  />
                  <span className="text-[9px] mt-0.5 font-medium">
                    {comment.likesCount > 0 ? comment.likesCount : ''}
                  </span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Quick Emoji Bar */}
        <div className="px-3 py-1.5 bg-zinc-950/80 border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {EMOJI_SUGGESTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmojiClick(emoji)}
              className="text-base p-1 hover:scale-125 transition-transform shrink-0"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-zinc-900 border-t border-white/10 flex items-center gap-2"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white/20"
          />

          <div className="flex-1 relative">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                lang === 'bn'
                  ? 'একটি সুন্দর কমেন্ট লিখুন...'
                  : 'Add a comment...'
              }
              className="w-full bg-zinc-800/90 text-white placeholder-white/40 text-xs rounded-full pl-3.5 pr-9 py-2 border border-white/10 focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-pink-500 hover:text-pink-400 disabled:text-white/20 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
