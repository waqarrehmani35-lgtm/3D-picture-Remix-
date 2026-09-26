import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Sun,
  Moon,
  Camera,
  Gamepad2,
  Smile,
  Sliders,
  Maximize2,
  Shield,
  Palette,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Language,
  StyleType,
  DepthLevel,
  LightingType,
  ShadowType,
  BackgroundType,
  AspectRatioType,
  QualityType,
  GenerationSettings,
} from '../types';
import { translations } from '../translations';

interface StyleSelectorProps {
  language: Language;
  settings: GenerationSettings;
  onChangeSettings: (newSettings: Partial<GenerationSettings>) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  language,
  settings,
  onChangeSettings,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';
  const [showAdvanced, setShowAdvanced] = useState(false);

  const styleIcons: Record<StyleType, React.ReactNode> = {
    realistic_3d: <Layers className="w-5 h-5" />,
    cinematic_3d: <Sparkles className="w-5 h-5" />,
    portrait_3d: <Camera className="w-5 h-5" />,
    character_3d: <Smile className="w-5 h-5" />,
    gaming_3d: <Gamepad2 className="w-5 h-5" />,
    studio_3d: <Palette className="w-5 h-5" />,
  };

  const styleKeys: StyleType[] = [
    'realistic_3d',
    'cinematic_3d',
    'portrait_3d',
    'character_3d',
    'gaming_3d',
    'studio_3d',
  ];

  return (
    <div className="w-full space-y-6">
      {/* 3D Styles Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>{t.styleSectionTitle}</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isUrdu
                ? 'کسی ایک 3D انداز کا انتخاب کریں'
                : 'Select the 3D aesthetic for your final render'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {styleKeys.map((key) => {
            const isSelected = settings.style === key;
            const item = t.styles[key];

            return (
              <button
                key={key}
                type="button"
                onClick={() => onChangeSettings({ style: key })}
                className={`relative group p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-950/60 to-neutral-900 shadow-lg shadow-indigo-600/15 ring-1 ring-indigo-500'
                    : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-neutral-800 text-neutral-300 group-hover:text-white'
                    }`}
                  >
                    {styleIcons[key]}
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      {isUrdu ? 'منتخب' : 'Selected'}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enhancements Accordion / Panel */}
      <div className="rounded-2xl glass-panel p-5 border border-neutral-800/80">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-indigo-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                {t.enhancementsTitle}
              </h4>
              <p className="text-xs text-neutral-400">
                {t.enhancementsSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400 group-hover:text-white">
            <span>{showAdvanced ? (isUrdu ? 'چھپائیں' : 'Hide') : (isUrdu ? 'دیکھیں' : 'Customize')}</span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {showAdvanced && (
          <div className="mt-6 pt-6 border-t border-neutral-800/80 space-y-6">
            {/* Depth Effect */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
                {t.depthLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'ultra'] as DepthLevel[]).map((level) => {
                  const isSel = settings.depth === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => onChangeSettings({ depth: level })}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                        isSel
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 font-semibold shadow-sm'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      {t.depthOptions[level]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lighting Enhancement */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
                {t.lightingLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    'studio_softbox',
                    'dramatic_rim',
                    'cyberpunk_neon',
                    'golden_hour',
                    'volumetric_sun',
                  ] as LightingType[]
                ).map((lType) => {
                  const isSel = settings.lighting === lType;
                  return (
                    <button
                      key={lType}
                      type="button"
                      onClick={() => onChangeSettings({ lighting: lType })}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all truncate text-left cursor-pointer ${
                        isSel
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 font-semibold shadow-sm'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      {t.lightingOptions[lType]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shadow Enhancement */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
                {t.shadowLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['subtle', 'deep_ao', 'soft_diffused'] as ShadowType[]).map((sType) => {
                  const isSel = settings.shadow === sType;
                  return (
                    <button
                      key={sType}
                      type="button"
                      onClick={() => onChangeSettings({ shadow: sType })}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                        isSel
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 font-semibold shadow-sm'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      {t.shadowOptions[sType]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background Replacement */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
                {t.backgroundLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {(
                  [
                    'original_stylized',
                    'studio_backdrop',
                    'cyber_holo',
                    'architectural_minimal',
                    'dark_bokeh',
                  ] as BackgroundType[]
                ).map((bgType) => {
                  const isSel = settings.background === bgType;
                  return (
                    <button
                      key={bgType}
                      type="button"
                      onClick={() => onChangeSettings({ background: bgType })}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all truncate text-left cursor-pointer ${
                        isSel
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 font-semibold shadow-sm'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      {t.backgroundOptions[bgType]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio & Quality & Watermark Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Aspect Ratio */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  {t.aspectRatioLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['1:1', '4:5', '9:16', '16:9'] as AspectRatioType[]).map((ar) => (
                    <button
                      key={ar}
                      type="button"
                      onClick={() => onChangeSettings({ aspectRatio: ar })}
                      className={`py-1.5 px-2 text-xs rounded-lg border text-center font-medium transition-all cursor-pointer ${
                        settings.aspectRatio === ar
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  {t.qualityLabel}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['standard', 'hd', 'ultra_hd'] as QualityType[]).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => onChangeSettings({ quality: q })}
                      className={`py-1.5 px-1 text-xs rounded-lg border text-center font-medium uppercase transition-all cursor-pointer ${
                        settings.quality === q
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {q === 'ultra_hd' ? 'Ultra' : q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Watermark Toggle */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  {t.watermarkLabel}
                </label>
                <button
                  type="button"
                  onClick={() => onChangeSettings({ watermark: !settings.watermark })}
                  className={`w-full py-1.5 px-3 rounded-lg border text-center text-xs font-medium transition-all cursor-pointer ${
                    settings.watermark
                      ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  {settings.watermark ? t.watermarkOn : t.watermarkOff}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
