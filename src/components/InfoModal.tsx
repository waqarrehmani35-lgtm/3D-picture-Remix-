import React from 'react';
import { X, ShieldCheck, Box, Sparkles, Layers, Sliders, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface InfoModalProps {
  language: Language;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ language, onClose }) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative max-w-xl w-full glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-neutral-700 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t.appTitle}
              </h3>
              <p className="text-xs text-neutral-400">
                {isUrdu ? 'اسٹوڈیو گائیڈ اور چہرے کے تحفظ کی پالیسی' : 'Studio Guide & Facial Preservation System'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm text-neutral-300">
          {/* Section 1: How it works */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{isUrdu ? 'یہ کیسے کام کرتا ہے؟' : 'How It Works'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400">
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <span className="font-semibold text-white block mb-1">1. {isUrdu ? 'تصویر اپلوڈ کریں' : 'Upload Photo'}</span>
                {isUrdu ? 'کسی بھی واضح پورٹریٹ تصویر کو منتخب کریں۔' : 'Select any clear portrait or casual photo.'}
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <span className="font-semibold text-white block mb-1">2. {isUrdu ? '3D انداز منتخب کریں' : 'Choose 3D Style'}</span>
                {isUrdu ? 'حقیقت پسندانہ، سنیماٹک، گیمنگ یا اسٹوڈیو لک چنیں۔' : 'Pick realistic, cinematic, gaming or studio style.'}
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <span className="font-semibold text-white block mb-1">3. {isUrdu ? '3D انجن پراسیسنگ' : 'Neural 3D Engine'}</span>
                {isUrdu ? 'گہرائی، رم لائٹ اور سرفیس شیڈرز کا نفاذ۔' : 'Applies depth maps, rim light & surface shaders.'}
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <span className="font-semibold text-white block mb-1">4. {isUrdu ? 'ڈاؤنلوڈ اور شیئر' : 'Download & Share'}</span>
                {isUrdu ? 'فل ریزولوشن میں بغیر کسی واٹر مارک کے محفوظ کریں۔' : 'Save in crisp HD resolution or share instantly.'}
              </div>
            </div>
          </div>

          {/* Section 2: Face Preservation Rule */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <h4 className="text-sm font-bold text-emerald-400 mb-1.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.faceGuaranteeTitle}</span>
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              {t.faceGuaranteeDesc}
            </p>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isUrdu ? 'آنکھیں، ناک، منہ اور چہرے کی قدرتی جیومیٹری محفوظ رہتی ہے۔' : 'Eyes, nose, lips and facial geometry remain authentic.'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isUrdu ? 'قدرتی جلد کی چمک اور رنگت برقرار رہتی ہے۔' : 'Natural skin tones and hair texture stay genuine.'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isUrdu ? 'صرف 3D لائٹنگ، گہرائی اور سائے لاگو ہوتے ہیں۔' : 'Only 3D lighting, volumetric volume & shadows are added.'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-md"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
