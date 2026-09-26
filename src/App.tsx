import React, { useState, useEffect } from 'react';
import {
  Box,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  Wand2,
} from 'lucide-react';
import { Header } from './components/Header';
import { FaceGuaranteeBanner } from './components/FaceGuaranteeBanner';
import { UploadSection, SAMPLE_PRESETS } from './components/UploadSection';
import { StyleSelector } from './components/StyleSelector';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { ResultSection } from './components/ResultSection';
import { RecentGallery } from './components/RecentGallery';
import { InfoModal } from './components/InfoModal';
import { Toast } from './components/Toast';
import {
  Language,
  GenerationSettings,
  GeneratedImageItem,
} from './types';
import { translations } from './translations';
import { processImageLocal3D } from './utils/local3dEngine';

const DEFAULT_SETTINGS: GenerationSettings = {
  style: 'realistic_3d',
  depth: 'high',
  lighting: 'studio_softbox',
  shadow: 'soft_diffused',
  background: 'original_stylized',
  aspectRatio: '1:1',
  quality: 'hd',
  watermark: false,
};

const STORAGE_KEY = '3d_picture_studio_recent_v1';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [presetResultImage, setPresetResultImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<GeneratedImageItem | null>(null);
  const [recentImages, setRecentImages] = useState<GeneratedImageItem[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const t = translations[language];
  const isUrdu = language === 'ur';

  // Load recent images from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentImages(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load recent gallery:', err);
    }
  }, []);

  // Save recent images to localStorage
  const saveRecentImages = (items: GeneratedImageItem[]) => {
    setRecentImages(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 20)));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  // Image selection handler
  const handleImageSelected = (base64: string, presetResult?: string) => {
    setUploadedImage(base64);
    setPresetResultImage(presetResult || null);
    // If a result is currently active, clear it so user can focus on generation
    setCurrentResult(null);
  };

  const handleClearImage = () => {
    setUploadedImage(null);
    setPresetResultImage(null);
    setCurrentResult(null);
  };

  const handleSettingsChange = (newSettings: Partial<GenerationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Main 3D Generation Execution
  const handleCreate3D = async () => {
    if (!uploadedImage) {
      showToast(t.errorNoImage, 'error');
      return;
    }

    setIsProcessing(true);

    try {
      // If user selected a pre-generated sample and kept the sample style, we can use the pre-rendered high quality 3D asset
      if (presetResultImage && settings.style === 'realistic_3d') {
        await new Promise((resolve) => setTimeout(resolve, 2400)); // allow scanner animation
        const newItem: GeneratedImageItem = {
          id: `render-${Date.now()}`,
          originalUrl: uploadedImage,
          resultUrl: presetResultImage,
          style: settings.style,
          settings: { ...settings },
          timestamp: Date.now(),
        };
        setCurrentResult(newItem);
        saveRecentImages([newItem, ...recentImages]);
        setIsProcessing(false);
        return;
      }

      // 1. Try server-side generation via `/api/generate-3d`
      let finalResultUrl: string | null = null;
      try {
        const response = await fetch('/api/generate-3d', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: uploadedImage,
            mimeType: 'image/jpeg',
            style: settings.style,
            depth: settings.depth,
            lighting: settings.lighting,
            shadow: settings.shadow,
            background: settings.background,
            aspectRatio: settings.aspectRatio,
            quality: settings.quality,
            language,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.imageUrl) {
            finalResultUrl = data.imageUrl;
          }
        }
      } catch (networkErr) {
        console.warn('Backend API request skipped or offline, utilizing 3D Studio Depth Engine:', networkErr);
      }

      // 2. Fallback to Local 3D Depth Engine if server was unavailable or didn't return image
      if (!finalResultUrl) {
        // If it was preset, we can also check
        if (presetResultImage) {
          finalResultUrl = presetResultImage;
        } else {
          finalResultUrl = await processImageLocal3D(uploadedImage, settings);
        }
      }

      const newItem: GeneratedImageItem = {
        id: `render-${Date.now()}`,
        originalUrl: uploadedImage,
        resultUrl: finalResultUrl,
        style: settings.style,
        settings: { ...settings },
        timestamp: Date.now(),
      };

      setCurrentResult(newItem);
      saveRecentImages([newItem, ...recentImages]);
    } catch (err: any) {
      console.error('Error in 3D generation:', err);
      // Even on unexpected error, attempt emergency fallback render
      try {
        const emergencyResult = await processImageLocal3D(uploadedImage, settings);
        const newItem: GeneratedImageItem = {
          id: `render-${Date.now()}`,
          originalUrl: uploadedImage,
          resultUrl: emergencyResult,
          style: settings.style,
          settings: { ...settings },
          timestamp: Date.now(),
        };
        setCurrentResult(newItem);
        saveRecentImages([newItem, ...recentImages]);
      } catch (fallbackErr) {
        showToast(t.errorProcessing, 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleFavorite = (id: string) => {
    const updated = recentImages.map((img) =>
      img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
    );
    saveRecentImages(updated);
    if (currentResult && currentResult.id === id) {
      setCurrentResult({
        ...currentResult,
        isFavorite: !currentResult.isFavorite,
      });
    }
    showToast(t.favorited);
  };

  const handleDeleteItem = (id: string) => {
    const updated = recentImages.filter((img) => img.id !== id);
    saveRecentImages(updated);
    if (currentResult && currentResult.id === id) {
      setCurrentResult(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm(isUrdu ? 'کیا آپ تمام حالیہ تصاویر حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to clear your recent gallery?')) {
      saveRecentImages([]);
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
    setUploadedImage(null);
    setPresetResultImage(null);
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div
      lang={language}
      dir={isUrdu ? 'rtl' : 'ltr'}
      className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-x-hidden"
    >
      {/* Background Ambience Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Main Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onOpenInfo={() => setShowInfo(true)}
      />

      {/* Processing Modal Overlay */}
      {isProcessing && <ProcessingOverlay language={language} />}

      {/* Info Modal */}
      {showInfo && (
        <InfoModal language={language} onClose={() => setShowInfo(false)} />
      )}

      {/* Floating Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />

      {/* Main Application Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 w-full space-y-10 sm:space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          {/* Subtle Studio Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>{isUrdu ? 'پروفیشنل 3D فوٹو اسٹوڈیو' : 'Next-Gen 3D Portrait Engine'}</span>
          </div>

          {/* Large Main Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t.heroHeading}
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Simple 4-Step Visual Workflow */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium text-neutral-400">
            <span className="px-3 py-1 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300">
              {t.step1}
            </span>
            <span className="text-neutral-600 hidden sm:inline">→</span>
            <span className="px-3 py-1 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300">
              {t.step2}
            </span>
            <span className="text-neutral-600 hidden sm:inline">→</span>
            <span className="px-3 py-1 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300">
              {t.step3}
            </span>
            <span className="text-neutral-600 hidden sm:inline">→</span>
            <span className="px-3 py-1 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300">
              {t.step4}
            </span>
          </div>
        </section>

        {/* Face Preservation Guarantee Banner */}
        <section>
          <FaceGuaranteeBanner language={language} />
        </section>

        {/* Main Work Area: Either Result View OR Creation Studio */}
        {currentResult ? (
          <section className="animate-in fade-in zoom-in-95 duration-300">
            <ResultSection
              language={language}
              item={currentResult}
              onReset={handleReset}
              onToggleFavorite={handleToggleFavorite}
              onToast={(msg) => showToast(msg, 'success')}
            />
          </section>
        ) : (
          <section className="space-y-10">
            {/* 2-Column Responsive Layout: Upload on left, Styles on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Upload Area */}
              <div className="lg:col-span-5 space-y-4">
                <UploadSection
                  language={language}
                  uploadedImage={uploadedImage}
                  onImageSelected={handleImageSelected}
                  onClearImage={handleClearImage}
                />
              </div>

              {/* Right Column: Style Selection & Enhancements */}
              <div className="lg:col-span-7 space-y-6">
                <StyleSelector
                  language={language}
                  settings={settings}
                  onChangeSettings={handleSettingsChange}
                />

                {/* Create 3D Picture Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCreate3D}
                    disabled={!uploadedImage || isProcessing}
                    className={`w-full py-4.5 px-8 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-2xl ${
                      uploadedImage
                        ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01] active:scale-[0.99]'
                        : 'bg-neutral-800/80 text-neutral-500 border border-neutral-700/50 cursor-not-allowed'
                    }`}
                  >
                    <Box className="w-6 h-6 animate-pulse" />
                    <span>{t.createButton}</span>
                    <Wand2 className="w-5 h-5" />
                  </button>

                  {!uploadedImage && (
                    <p className="text-center text-xs text-neutral-500 mt-2">
                      {isUrdu
                        ? 'شروع کرنے کے لیے پہلے تصویر اپلوڈ کریں یا نمونہ منتخب کریں'
                        : 'Upload a photo or click a sample preset above to begin'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent Generated Images Gallery */}
        <section className="pt-4">
          <RecentGallery
            language={language}
            items={recentImages}
            onSelectResult={(item) => setCurrentResult(item)}
            onToggleFavorite={handleToggleFavorite}
            onDeleteItem={handleDeleteItem}
            onClearAll={handleClearAll}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-8 mt-16 bg-neutral-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-neutral-400">
              {t.appTitle}
            </span>
            <span>·</span>
            <span>{isUrdu ? 'حقیقی چہرہ اور جدید 3D کوالٹی' : 'Authentic Face Identity & Modern 3D Quality'}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowInfo(true)}
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              {isUrdu ? 'اسٹوڈیو گائیڈ' : 'Studio Guide'}
            </button>
            <span>·</span>
            <span>JPG · JPEG · PNG</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
