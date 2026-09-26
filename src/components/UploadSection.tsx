import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Check, RefreshCw, X, ArrowUpRight, Camera } from 'lucide-react';
import { Language, SamplePreset } from '../types';
import { translations } from '../translations';

// Imported sample assets generated for fast testing
import sampleFemaleOriginal from '../assets/images/sample_portrait_female_1790412442105.jpg';
import sampleFemale3D from '../assets/images/sample_3d_female_1790412457954.jpg';
import sampleMaleOriginal from '../assets/images/sample_portrait_male_1790412475074.jpg';
import sampleMale3D from '../assets/images/sample_3d_male_1790412488382.jpg';

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'sample-female',
    nameEn: 'Female Portrait',
    nameUr: 'خاتون پورٹریٹ',
    originalUrl: sampleFemaleOriginal,
    resultUrl: sampleFemale3D,
    style: 'realistic_3d',
  },
  {
    id: 'sample-male',
    nameEn: 'Male Portrait',
    nameUr: 'مرد پورٹریٹ',
    originalUrl: sampleMaleOriginal,
    resultUrl: sampleMale3D,
    style: 'cinematic_3d',
  },
];

interface UploadSectionProps {
  language: Language;
  uploadedImage: string | null;
  onImageSelected: (base64: string, presetResult?: string) => void;
  onClearImage: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  language,
  uploadedImage,
  onImageSelected,
  onClearImage,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
      alert(t.formatError);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedSampleId(null);
        onImageSelected(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const selectSample = (preset: SamplePreset) => {
    setSelectedSampleId(preset.id);
    onImageSelected(preset.originalUrl, preset.resultUrl);
  };

  return (
    <div className="w-full">
      {/* Upload Zone or Preview Box */}
      {!uploadedImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 ${
            isDragging
              ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
              : 'border-neutral-700/80 hover:border-indigo-500/60 bg-neutral-900/40 hover:bg-neutral-900/70'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />

          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-violet-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:text-white transition-all shadow-xl shadow-indigo-500/10">
            <Upload className="w-9 h-9" />
          </div>

          <h3 className="mt-5 text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
            {t.uploadAreaTitle}
          </h3>
          <p className="mt-1.5 text-sm text-neutral-400">
            {t.uploadAreaSubtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{t.uploadButton}</span>
            </button>
          </div>

          <p className="mt-4 text-xs text-neutral-500">
            {t.uploadFormats}
          </p>
        </div>
      ) : (
        /* Preview Box of Uploaded Image */
        <div className="glass-panel-elevated rounded-3xl p-5 sm:p-6 relative">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-sm font-semibold text-white">
                {t.uploadedPreview}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.changePhoto}</span>
              </button>
              <button
                type="button"
                onClick={onClearImage}
                aria-label="Remove image"
                className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
          </div>

          <div className="relative aspect-square max-h-[380px] w-full mx-auto rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center border border-neutral-800">
            <img
              src={uploadedImage}
              alt="Uploaded source"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />

            <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-neutral-700/80 text-[11px] text-neutral-300 font-medium">
              {isUrdu ? 'اصل پورٹریٹ' : 'Original Photo'}
            </div>
          </div>
        </div>
      )}

      {/* Quick Sample Presets */}
      <div className="mt-5 p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{t.orTrySample}</span>
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {SAMPLE_PRESETS.map((preset) => {
            const isSelected = selectedSampleId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectSample(preset)}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/15 shadow-md shadow-indigo-500/10'
                    : 'border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 hover:bg-neutral-800/60'
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-neutral-700">
                  <img
                    src={preset.originalUrl}
                    alt={preset.nameEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    {isUrdu ? preset.nameUr : preset.nameEn}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {isUrdu ? '1-کلک سے آزمائیں' : '1-Click Sample'}
                  </p>
                </div>

                {isSelected ? (
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-neutral-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
