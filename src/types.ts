export interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  highlights: number;
  shadows: number;
  temperature: number;
  tint: number;
  hue: number;
  gamma: number;
  fade: number;
  vignette: number;
  sharpness: number;
  blur: number;       // 0-20
  grain: number;      // 0-100
}

export interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
  aspect: string; // 'free' | '1:1' | '4:3' | '3:2' | '16:9' | '9:16' | '3:4'
}

export interface ImageState {
  src: string | null;
  originalSrc: string | null;
  filename: string;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}

export interface HistoryEntry {
  adjustments: Adjustments;
  filterId: string;
  filterIntensity: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  crop: CropState | null;
}

export type ToolId =
  | 'adjust'
  | 'crop'
  | 'rotate'
  | 'flipH'
  | 'flipV'
  | 'resize'
  | 'filters'
  | 'effects'
  | 'blur'
  | 'sharpen'
  | 'vignette'
  | 'color'
  | 'text'
  | 'shapes'
  | 'compare'
  | 'reset'
  | 'info';

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  temperature: 0,
  tint: 0,
  hue: 0,
  gamma: 0,
  fade: 0,
  vignette: 0,
  sharpness: 0,
  blur: 0,
  grain: 0,
};

export const ASPECT_RATIOS = [
  { id: 'free', label: 'Free' },
  { id: '1:1', label: '1:1' },
  { id: '4:3', label: '4:3' },
  { id: '3:2', label: '3:2' },
  { id: '16:9', label: '16:9' },
  { id: '9:16', label: '9:16' },
  { id: '3:4', label: '3:4' },
] as const;

export const FILTERS = [
  { id: 'original', name: 'Original', css: '' },
  { id: 'natural', name: 'Natural', css: 'contrast(1.05) saturate(1.05)' },
  { id: 'warm', name: 'Warm', css: 'sepia(0.15) saturate(1.2) hue-rotate(-10deg)' },
  { id: 'cool', name: 'Cool', css: 'saturate(0.9) hue-rotate(15deg) brightness(1.02)' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(0.4) contrast(0.95) brightness(0.95) saturate(0.85)' },
  { id: 'bw', name: 'Black & White', css: 'grayscale(1)' },
  { id: 'mono', name: 'Monochrome', css: 'grayscale(1) contrast(1.15)' },
  { id: 'cinematic', name: 'Cinematic', css: 'contrast(1.2) saturate(0.85) brightness(0.95)' },
  { id: 'portrait', name: 'Portrait', css: 'contrast(1.05) brightness(1.05) saturate(0.95)' },
  { id: 'landscape', name: 'Landscape', css: 'contrast(1.1) saturate(1.25) brightness(1.02)' },
  { id: 'soft', name: 'Soft', css: 'brightness(1.05) contrast(0.9) saturate(0.9)' },
  { id: 'dramatic', name: 'Dramatic', css: 'contrast(1.35) saturate(1.1) brightness(0.95)' },
  { id: 'faded', name: 'Faded', css: 'contrast(0.85) brightness(1.08) saturate(0.75)' },
  { id: 'matte', name: 'Matte', css: 'contrast(0.9) brightness(1.05) saturate(0.85)' },
  { id: 'golden', name: 'Golden Hour', css: 'sepia(0.25) saturate(1.3) brightness(1.05) hue-rotate(-5deg)' },
  { id: 'film', name: 'Film', css: 'contrast(1.1) saturate(0.9) brightness(0.98)' },
  { id: 'highcontrast', name: 'High Contrast', css: 'contrast(1.4) saturate(1.05)' },
  { id: 'dreamy', name: 'Dreamy', css: 'brightness(1.08) contrast(0.9) saturate(1.1)' },
] as const;

export type FilterId = typeof FILTERS[number]['id'];
