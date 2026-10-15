import { Adjustments, FILTERS } from '../types';

/** Build CSS filter string from adjustments + selected filter */
export function buildCssFilter(
  adj: Adjustments,
  filterId: string,
  filterIntensity: number
): string {
  const parts: string[] = [];

  // Base adjustments
  const brightness = 1 + adj.brightness / 100 + adj.exposure / 120;
  const contrast = 1 + adj.contrast / 100;
  const saturation = 1 + adj.saturation / 100;
  const hue = adj.hue;

  parts.push(`brightness(${brightness.toFixed(3)})`);
  parts.push(`contrast(${contrast.toFixed(3)})`);
  parts.push(`saturate(${saturation.toFixed(3)})`);

  if (hue !== 0) parts.push(`hue-rotate(${hue}deg)`);

  // Temperature approximation (warm/cool)
  if (adj.temperature > 0) {
    parts.push(`sepia(${(adj.temperature / 200).toFixed(3)})`);
  } else if (adj.temperature < 0) {
    parts.push(`hue-rotate(${(adj.temperature / 4).toFixed(1)}deg)`);
  }

  // Tint
  if (adj.tint !== 0) {
    parts.push(`hue-rotate(${(adj.tint / 5).toFixed(1)}deg)`);
  }

  // Fade
  if (adj.fade > 0) {
    parts.push(`opacity(${(1 - adj.fade / 200).toFixed(3)})`);
  }

  // Blur (CSS blur is in px)
  if (adj.blur > 0) {
    parts.push(`blur(${(adj.blur * 0.6).toFixed(2)}px)`);
  }

  // Selected filter blended by intensity
  const filter = FILTERS.find((f) => f.id === filterId);
  if (filter && filter.css && filterId !== 'original' && filterIntensity > 0) {
    parts.push(filter.css);
  }

  return parts.join(' ');
}

/** Apply adjustments + filter to a canvas and return a blob for export */
export async function exportImage(
  source: HTMLImageElement | HTMLCanvasElement,
  adj: Adjustments,
  filterId: string,
  filterIntensity: number,
  rotation: number,
  flipH: boolean,
  flipV: boolean,
  format: 'image/jpeg' | 'image/png' | 'image/webp',
  quality: number,
  crop?: { x: number; y: number; width: number; height: number } | null
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  let srcW = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  let srcH = source instanceof HTMLImageElement ? source.naturalHeight : source.height;

  // Apply crop if present
  let sx = 0, sy = 0, sw = srcW, sh = srcH;
  if (crop && crop.width > 0 && crop.height > 0) {
    sx = Math.max(0, crop.x);
    sy = Math.max(0, crop.y);
    sw = Math.min(crop.width, srcW - sx);
    sh = Math.min(crop.height, srcH - sy);
  }

  // Handle rotation dimensions
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const outW = Math.round(sw * cos + sh * sin);
  const outH = Math.round(sw * sin + sh * cos);

  canvas.width = outW;
  canvas.height = outH;

  ctx.save();
  ctx.translate(outW / 2, outH / 2);
  ctx.rotate(rad);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  // Apply CSS-like filters via canvas filter property
  ctx.filter = buildCssFilter(adj, filterId, filterIntensity);

  ctx.drawImage(source, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh);
  ctx.restore();

  // Simple vignette if needed
  if (adj.vignette > 0) {
    const strength = adj.vignette / 100;
    const gradient = ctx.createRadialGradient(
      outW / 2, outH / 2, outW * 0.3,
      outW / 2, outH / 2, Math.max(outW, outH) * 0.75
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, `rgba(0,0,0,${strength * 0.85})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, outW, outH);
  }

  // Simple film grain (noise overlay)
  if (adj.grain > 0) {
    const strength = adj.grain / 100;
    const imageData = ctx.getImageData(0, 0, outW, outH);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 60 * strength;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Export failed'));
      },
      format,
      quality
    );
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
