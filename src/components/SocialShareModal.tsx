import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
  Send,
  MessageCircle,
} from 'lucide-react';
import { Language, GeneratedImageItem } from '../types';
import { translations } from '../translations';

interface SocialShareModalProps {
  language: Language;
  item: GeneratedImageItem;
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  language,
  item,
  isOpen,
  onClose,
  onToast,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isSharingDevice, setIsSharingDevice] = useState(false);

  if (!isOpen) return null;

  const t = translations[language];
  const isUrdu = language === 'ur';

  const shareTitle = 'My 3D Portrait - 3D Picture Studio';
  const shareText = `Look at my 3D ${t.styles[item.style]?.name || item.style} portrait made with 3D Picture Studio! ✨ Transform any photo into 3D.`;
  const shareUrl = window.location.href;

  const hasWebShare = typeof navigator !== 'undefined' && !!navigator.share;

  // Web Share API Handler
  const handleNativeShare = async () => {
    if (!navigator.share) {
      onToast(t.webShareHint);
      return;
    }

    setIsSharingDevice(true);
    try {
      let file: File | null = null;
      try {
        const res = await fetch(item.resultUrl);
        const blob = await res.blob();
        const ext = blob.type.includes('png') ? 'png' : 'jpg';
        file = new File([blob], `3d-portrait-${Date.now()}.${ext}`, {
          type: blob.type || 'image/png',
        });
      } catch (err) {
        console.warn('Could not create File for Web Share:', err);
      }

      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [file],
          url: shareUrl,
        });
        onToast(t.shareSuccess);
        onClose();
      } else {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onToast(t.shareSuccess);
        onClose();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Web share error:', err);
      }
    } finally {
      setIsSharingDevice(false);
    }
  };

  // Copy Link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      onToast(t.linkCopied);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      onToast(t.copiedSuccess);
    }
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    try {
      const res = await fetch(item.resultUrl);
      const blob = await res.blob();
      
      // Ensure blob is PNG for Clipboard API compatibility
      if (typeof ClipboardItem !== 'undefined') {
        const itemObj = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([itemObj]);
        setCopiedImage(true);
        onToast(t.imageCopiedSuccess);
        setTimeout(() => setCopiedImage(false), 2500);
      } else {
        await navigator.clipboard.writeText(item.resultUrl);
        onToast(t.linkCopied);
      }
    } catch (err) {
      console.warn('Failed to copy image to clipboard:', err);
      // Fallback to copying URL
      await navigator.clipboard.writeText(shareUrl);
      onToast(t.linkCopied);
    }
  };

  // Social Sharing URLs
  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
      bg: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30',
      action: () => {
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`,
          '_blank'
        );
      },
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      bg: 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      bg: 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Telegram',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      bg: 'bg-sky-600/20 text-sky-400 border-sky-500/30 hover:bg-sky-600/30',
      action: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Reddit',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.56 12 8 12.56 8 13.25c0 .69.56 1.25 1.25 1.25.69 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm5.5 0c-.69 0-1.25.56-1.25 1.25 0 .69.56 1.25 1.25 1.25.69 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm-5.465 4.316a.417.417 0 0 0-.297.712c1.071 1.07 3.01 1.07 4.081 0a.417.417 0 0 0-.594-.585c-.752.753-2.14.753-2.893 0a.416.416 0 0 0-.297-.127z" />
        </svg>
      ),
      bg: 'bg-orange-600/20 text-orange-400 border-orange-500/30 hover:bg-orange-600/30',
      action: () => {
        window.open(
          `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
          '_blank'
        );
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl glass-panel-elevated border border-neutral-700/80 p-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t.shareModalTitle || 'Share Your 3D Portrait'}
              </h3>
              <p className="text-xs text-neutral-400">
                {t.shareModalSubtitle || 'Share directly with friends or on social media'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4">
          {/* Portrait Thumbnail Preview */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <img
              src={item.resultUrl}
              alt="3D Preview"
              className="w-16 h-16 rounded-xl object-cover border border-neutral-700 shrink-0 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate">
                  {t.styles[item.style]?.name || item.style}
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.settings.quality.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 truncate">
                {shareText}
              </p>
            </div>
          </div>

          {/* Primary Action: Device Web Share API Button */}
          {hasWebShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              disabled={isSharingDevice}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>
                {isSharingDevice
                  ? (t.sharing || 'Opening Share...')
                  : (t.shareViaDevice || 'Share via Device (AirDrop, WhatsApp, Apps)')}
              </span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Social Platforms Row */}
          <div>
            <span className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
              {t.socialPlatforms || 'Social Platforms'}
            </span>
            <div className="grid grid-cols-5 gap-2">
              {socialLinks.map((social) => (
                <button
                  key={social.name}
                  type="button"
                  onClick={social.action}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${social.bg}`}
                  title={`Share on ${social.name}`}
                >
                  {social.icon}
                  <span className="text-[10px] font-medium mt-1 truncate max-w-full">
                    {social.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Copy Link & Copy Image Actions */}
          <div className="pt-2 border-t border-neutral-800/80 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 text-xs font-medium inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">{t.copiedSuccess}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-neutral-400" />
                  <span>{t.copyShareLink || 'Copy Share Link'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyImage}
              className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 text-xs font-medium inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedImage ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">{t.imageCopiedSuccess}</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 text-neutral-400" />
                  <span>{t.copyImage || 'Copy Image'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer Note */}
        <p className="text-[11px] text-center text-neutral-500 mt-2">
          {t.webShareHint}
        </p>
      </div>
    </div>
  );
};
