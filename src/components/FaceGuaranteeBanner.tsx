import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface FaceGuaranteeBannerProps {
  language: Language;
}

export const FaceGuaranteeBanner: React.FC<FaceGuaranteeBannerProps> = ({ language }) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-5 sm:p-6 border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-neutral-900/60 to-indigo-950/20 shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-white flex items-center gap-1.5">
              {t.faceGuaranteeTitle}
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              100% Guaranteed
            </span>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {t.faceGuaranteeDesc}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {isUrdu ? 'اصل نقوش اور تاثرات' : 'Exact facial features & expression'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {isUrdu ? 'جلد کی حقیقی بناوٹ' : 'Natural skin tones & micro-details'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {isUrdu ? 'کوئی تحریف یا بگاڑ نہیں' : 'Zero cartoon morphing or distortions'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
