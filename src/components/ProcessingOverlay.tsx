import React, { useEffect, useState } from 'react';
import { Box, Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface ProcessingOverlayProps {
  language: Language;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ language }) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev < t.processingSteps.length - 1 ? prev + 1 : prev));
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return prev;
        const jump = Math.floor(Math.random() * 8) + 3;
        return Math.min(94, prev + jump);
      });
    }, 450);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [t.processingSteps.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative max-w-md w-full glass-panel-elevated p-8 rounded-3xl border border-indigo-500/30 text-center shadow-2xl shadow-indigo-900/30">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* 3D Animated Scanner Core */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          {/* Outer Pulsing Rings */}
          <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/30 animate-ping opacity-25" />
          <div className="absolute inset-0 rounded-2xl border border-indigo-400/40 animate-pulse" />

          {/* Center 3D Box Icon */}
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
              <Box className="w-9 h-9 text-indigo-400 animate-bounce" />
            </div>
          </div>

          {/* Laser scanning beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse" />
        </div>

        {/* Heading */}
        <h3 className="text-xl font-bold text-white mb-1.5 flex items-center justify-center gap-2">
          <span>{t.processingTitle}</span>
        </h3>

        {/* Progress Bar */}
        <div className="my-5">
          <div className="flex justify-between items-center text-xs font-semibold text-neutral-400 mb-2">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              <span>{isUrdu ? '3D ماڈل پروسیسنگ' : 'Neural 3D Engine'}</span>
            </span>
            <span className="text-white font-mono text-sm">{progress}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-neutral-800 overflow-hidden p-0.5 border border-neutral-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(99,102,241,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step Description */}
        <div className="min-h-[44px] flex items-center justify-center px-2 py-1.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-xs text-neutral-300 leading-normal animate-pulse">
            {t.processingSteps[stepIndex]}
          </p>
        </div>

        {/* Face Preservation Reassurance */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-center gap-2 text-xs text-emerald-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="font-medium">
            {isUrdu
              ? 'چہرے کے نقوش کی حفاظت جاری ہے'
              : 'Facial identity strictly preserved'}
          </span>
        </div>
      </div>
    </div>
  );
};
