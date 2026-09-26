import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Share2,
  Heart,
  RefreshCw,
  RotateCcw,
  Maximize2,
  Sliders,
  Sparkles,
  Eye,
  Check,
  X,
  Layers,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { Language, GeneratedImageItem } from '../types';
import { translations } from '../translations';
import { SocialShareModal } from './SocialShareModal';

interface ResultSectionProps {
  language: Language;
  item: GeneratedImageItem;
  onReset: () => void;
  onToggleFavorite: (id: string) => void;
  onToast: (msg: string) => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  language,
  item,
  onReset,
  onToggleFavorite,
  onToast,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'tilt' | 'sideBySide'>('slider');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // 3D Tilt perspective state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingSlider = useRef(false);

  // Handle slider movement
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const onMouseDownSlider = () => {
    isDraggingSlider.current = true;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider.current) {
        handleSliderMove(e.clientX);
      }
    };
    const onMouseUp = () => {
      isDraggingSlider.current = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDraggingSlider.current && e.touches[0]) {
        handleSliderMove(e.touches[0].clientX);
      }
    };
    const onTouchEnd = () => {
      isDraggingSlider.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // 3D Tilt interaction for desktop mouse move
  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== 'tilt' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 22, y: -y * 22 });
  };

  const handleContainerMouseLeave = () => {
    if (viewMode === 'tilt') {
      setTilt({ x: 0, y: 0 });
    }
  };

  // Download Handler
  const handleDownload = async (format: 'png' | 'jpg' = 'png') => {
    setDownloading(true);
    onToast(t.downloadStarted);

    try {
      const link = document.createElement('a');
      link.href = item.resultUrl;
      link.download = `3D-Studio-${item.style}-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  // Social Media Sharing Handler via Web Share API
  const handleSocialShare = async () => {
    setIsSharing(true);

    const shareTitle = 'My 3D Portrait - 3D Picture Studio';
    const styleName = t.styles[item.style]?.name || item.style;
    const shareText = `Check out my 3D ${styleName} portrait created with 3D Picture Studio! ✨ Transform any photo into 3D.`;
    const shareUrl = window.location.href;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        let file: File | null = null;
        try {
          const res = await fetch(item.resultUrl);
          const blob = await res.blob();
          const ext = blob.type.includes('png') ? 'png' : 'jpg';
          file = new File([blob], `3d-portrait-${item.style}-${Date.now()}.${ext}`, {
            type: blob.type || 'image/png',
          });
        } catch (fetchErr) {
          console.warn('Could not prepare file for share:', fetchErr);
        }

        // Try file sharing if supported by browser's Web Share API
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            files: [file],
            url: shareUrl,
          });
          onToast(t.shareSuccess);
          return;
        }

        // Fall back to title, text, and URL
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onToast(t.shareSuccess);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // User dismissed the native share sheet
          return;
        }
        console.warn('Web Share API error, opening social modal fallback:', err);
        setShowShareModal(true);
      } finally {
        setIsSharing(false);
      }
    } else {
      // Web Share API not available in current environment (e.g. desktop non-Safari)
      setIsSharing(false);
      setShowShareModal(true);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner / Quality Indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{t.resultLabel}</span>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {item.settings.quality.toUpperCase()}
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              {t.styles[item.style]?.name || item.style} ·{' '}
              {item.settings.depth} depth · {item.settings.lighting.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'slider'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.viewModeSlider}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tilt')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'tilt'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.viewMode3DTilt}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div className="relative group">
        <div
          ref={containerRef}
          onMouseMove={handleContainerMouseMove}
          onMouseLeave={handleContainerMouseLeave}
          className="relative w-full aspect-square sm:aspect-[4/3] max-h-[580px] rounded-3xl overflow-hidden glass-panel-elevated border border-neutral-700/80 select-none shadow-2xl"
          style={
            viewMode === 'tilt'
              ? {
                  perspective: '1200px',
                }
              : undefined
          }
        >
          {viewMode === 'slider' ? (
            /* Comparison Slider Mode */
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-neutral-950">
              {/* Result Image (Underneath, full view) */}
              <img
                src={item.resultUrl}
                alt="3D Result"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />

              {/* Original Image (Clipped by slider position) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none z-10"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={item.originalUrl}
                  alt="Original"
                  referrerPolicy="no-referrer"
                  className="absolute inset-y-0 left-0 h-full max-w-none object-contain"
                  style={{
                    width: containerRef.current?.clientWidth
                      ? `${containerRef.current.clientWidth}px`
                      : '100%',
                  }}
                />
              </div>

              {/* Draggable Divider Line & Handle */}
              <div
                onMouseDown={onMouseDownSlider}
                onTouchStart={onMouseDownSlider}
                className="absolute inset-y-0 z-20 w-1 bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.8)] cursor-ew-resize flex items-center justify-center -ml-0.5"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-10 h-10 -ml-[19px] rounded-full bg-white text-neutral-900 shadow-2xl flex items-center justify-center font-bold text-xs ring-4 ring-indigo-500/30">
                  <Sliders className="w-4 h-4 rotate-90" />
                </div>
              </div>

              {/* Comparison Corner Labels */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="px-3 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-neutral-700/80 text-xs font-semibold text-neutral-200 shadow-lg">
                  {t.originalLabel}
                </span>
              </div>
              <div className="absolute top-4 right-4 z-20 pointer-events-none">
                <span className="px-3 py-1 rounded-lg bg-indigo-600/80 backdrop-blur-md border border-indigo-400/40 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20">
                  {t.resultLabel}
                </span>
              </div>
            </div>
          ) : (
            /* Interactive 3D Holographic / Tilt Mode */
            <div
              className="relative w-full h-full flex items-center justify-center bg-neutral-950 transition-transform duration-100 ease-out"
              style={{
                transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(1.02)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src={item.resultUrl}
                alt="3D Result Perspective"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Dynamic 3D lighting reflection sheen */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-200"
                style={{
                  background: `radial-gradient(circle at ${50 + tilt.x * 2}% ${
                    50 - tilt.y * 2
                  }%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`,
                }}
              />

              {/* 3D Mode Label and Instruction */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-center pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-neutral-700/80 text-xs font-medium text-neutral-300 text-center shadow-lg">
                  {t.tiltInstruction}
                </span>
              </div>
            </div>
          )}

          {/* Quick Share Floating Button */}
          <button
            type="button"
            onClick={handleSocialShare}
            aria-label="Share 3D Portrait"
            title="Share with Friends"
            disabled={isSharing}
            className="absolute bottom-4 right-16 z-30 p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 backdrop-blur-md transition-all shadow-lg cursor-pointer flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4 text-violet-400" />
            <span className="hidden sm:inline text-xs font-semibold">{t.share}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label="View Fullscreen"
            className="absolute bottom-4 right-4 z-30 p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 backdrop-blur-md transition-all shadow-lg cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-neutral-800/80 space-y-4">
        {/* Primary Row: Download HD, Social Media Share (Web Share API), & Create Another */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Download HD Button */}
          <button
            type="button"
            onClick={() => handleDownload('png')}
            disabled={downloading}
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Download className="w-5 h-5 shrink-0" />
            <span>{t.downloadHD}</span>
          </button>

          {/* Social Media Sharing Button (Web Share API) */}
          <button
            type="button"
            onClick={handleSocialShare}
            disabled={isSharing}
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-purple-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
          >
            <Share2 className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
            <span>{isSharing ? (t.sharing || 'Opening Share...') : (t.share3DPortrait || 'Share 3D Portrait')}</span>
            <Sparkles className="w-4 h-4 text-pink-200" />
          </button>

          {/* Create Another Picture Button */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700/90 text-white font-semibold text-sm border border-neutral-700 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.createAnother}</span>
          </button>
        </div>

        {/* Secondary Row: Favorite, Social Options Menu, Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800/80">
          <div className="flex items-center gap-2">
            {/* Favorite Button */}
            <button
              type="button"
              onClick={() => onToggleFavorite(item.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                item.isFavorite
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  item.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              <span>{item.isFavorite ? t.favorited : t.saveFavorite}</span>
            </button>

            {/* Social Options Menu Button */}
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-violet-400" />
              <span>{t.moreSharingOptions || 'Social Channels'}</span>
            </button>
          </div>

          {/* Reset All */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.reset}</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-2xl flex flex-col p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-base font-bold text-white">
                {t.resultLabel} · {t.styles[item.style]?.name}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSocialShare}
                disabled={isSharing}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.share3DPortrait || 'Share'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownload('png')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.downloadHD}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex items-center justify-center p-2">
            <img
              src={item.resultUrl}
              alt="3D Result Fullscreen"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-neutral-800"
            />
          </div>
        </div>
      )}

      {/* Social Media Sharing Modal */}
      <SocialShareModal
        language={language}
        item={item}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onToast={onToast}
      />
    </div>
  );
};
