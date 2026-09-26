export type Language = 'en' | 'ur';

export type StyleType =
  | 'realistic_3d'
  | 'cinematic_3d'
  | 'portrait_3d'
  | 'character_3d'
  | 'gaming_3d'
  | 'studio_3d';

export type DepthLevel = 'low' | 'medium' | 'high' | 'ultra';

export type LightingType =
  | 'studio_softbox'
  | 'dramatic_rim'
  | 'cyberpunk_neon'
  | 'golden_hour'
  | 'volumetric_sun';

export type ShadowType = 'subtle' | 'deep_ao' | 'soft_diffused';

export type BackgroundType =
  | 'original_stylized'
  | 'studio_backdrop'
  | 'cyber_holo'
  | 'architectural_minimal'
  | 'dark_bokeh';

export type AspectRatioType = '1:1' | '4:5' | '9:16' | '16:9';

export type QualityType = 'standard' | 'hd' | 'ultra_hd';

export interface GenerationSettings {
  style: StyleType;
  depth: DepthLevel;
  lighting: LightingType;
  shadow: ShadowType;
  background: BackgroundType;
  aspectRatio: AspectRatioType;
  quality: QualityType;
  watermark: boolean;
}

export interface GeneratedImageItem {
  id: string;
  originalUrl: string;
  resultUrl: string;
  style: StyleType;
  settings: GenerationSettings;
  timestamp: number;
  isFavorite?: boolean;
}

export interface SamplePreset {
  id: string;
  nameEn: string;
  nameUr: string;
  originalUrl: string;
  resultUrl: string;
  style: StyleType;
}
