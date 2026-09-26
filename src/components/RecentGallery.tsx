import React from 'react';
import { History, Heart, Download, Trash2, Eye, ExternalLink } from 'lucide-react';
import { Language, GeneratedImageItem } from '../types';
import { translations } from '../translations';

interface RecentGalleryProps {
  language: Language;
  items: GeneratedImageItem[];
  onSelectResult: (item: GeneratedImageItem) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const RecentGallery: React.FC<RecentGalleryProps> = ({
  language,
  items,
  onSelectResult,
  onToggleFavorite,
  onDeleteItem,
  onClearAll,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  if (!items || items.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center border border-neutral-800/80">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto mb-3">
          <History className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-neutral-300">
          {t.recentTitle}
        </h4>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
          {t.noRecent}
        </p>
      </div>
    );
  }

  const handleDownloadItem = (e: React.MouseEvent, item: GeneratedImageItem) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.resultUrl;
    link.download = `3D-Studio-${item.style}-${item.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-neutral-800/80">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{t.recentTitle}</span>
              <span className="text-xs font-semibold px-2 py-0.2 rounded-full bg-neutral-800 text-neutral-300">
                {items.length}
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              {t.recentSubtitle}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            {t.clearAll}
          </button>
        )}
      </div>

      {/* Grid of recent items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const styleName = t.styles[item.style]?.name || item.style;
          const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={item.id}
              onClick={() => onSelectResult(item)}
              className="group relative rounded-2xl overflow-hidden glass-panel-elevated border border-neutral-800 hover:border-indigo-500/60 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:shadow-indigo-600/10"
            >
              {/* Aspect square preview */}
              <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden">
                <img
                  src={item.resultUrl}
                  alt={styleName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Favorite Heart Top-Left */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  aria-label="Toggle Favorite"
                  className="absolute top-2 left-2 p-1.5 rounded-lg bg-neutral-950/70 hover:bg-neutral-900 backdrop-blur-md border border-neutral-800 text-neutral-400 hover:text-rose-400 transition-all cursor-pointer"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      item.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                </button>

                {/* Quick Action Overlay on Hover */}
                <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg">
                    <Eye className="w-4 h-4" />
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDownloadItem(e, item)}
                    aria-label="Download image"
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white shadow-lg cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    aria-label="Delete image"
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-rose-600 text-white shadow-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Caption */}
              <div className="p-2.5 bg-neutral-900/80 border-t border-neutral-800">
                <p className="text-xs font-semibold text-white truncate">
                  {styleName}
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-0.5">
                  <span className="uppercase">{item.settings.quality}</span>
                  <span>{dateStr}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
