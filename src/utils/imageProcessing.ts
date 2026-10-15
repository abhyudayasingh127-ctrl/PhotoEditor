import { Adjustments, FILTERS, TextLayer, ShapeLayer } from '../types';

/** Build CSS filter string from adjustments + selected filter */
export function buildCssFilter(
  adj: Adjustments,
  filterId: string,
  filterIntensity: number
): string {
  const parts: string[] = [];

  const brightness = 1 + adj.brightness / 100 + adj.exposure / 120;
  const contrast = 1 + adj.contrast / 100;
  const saturation = 1 + adj.saturation / 100;
  const hue = adj.hue;

  parts.push(`brightness(${brightness.toFixed(3)})`);
  parts.push(`contrast(${contrast.toFixed(3)})`);
  parts.push(`saturate(${saturation.toFixed(3)})`);

  if (hue !== 0) parts.push(`hue-rotate(${hue}deg)`);

  if (adj.temperature > 0) {
    parts.push(`sepia(${(adj.temperature / 200).toFixed(3)})`);
  } else if (adj.temperature < 0) {
    parts.push(`hue-rotate(${(adj.temperature / 4).toFixed(1)}deg)`);
  }

  if (adj.tint !== 0) {
    parts.push(`hue-rotate(${(adj.tint / 5).toFixed(1)}deg)`);
  }

  if (adj.fade > 0) {
    parts.push(`opacity(${(1 - adj.fade / 200).toFixed(3)})`);
  }

  if (adj.blur > 0) {
    parts.push(`blur(${(adj.blur * 0.6).toFixed(2)}px)`);
  }

  const filter = FILTERS.find((f) => f.id === filterId);
  if (filter && filter.css && filterId !== 'original' && filterIntensity > 0) {
    parts.push(filter.css);
  }

  return parts.join(' ');
}

/** Draw shapes onto canvas (percentages relative to canvas size) */
function drawShapes(ctx: CanvasRenderingContext2D, shapes: ShapeLayer[], w: number, h: number) {
  for (const s of shapes) {
    const x = (s.x / 100) * w;
    const y = (s.y / 100) * h;
    const sw = (s.width / 100) * w;
    const sh = (s.height / 100) * h;

    ctx.save();
    ctx.lineWidth = s.strokeWidth;
    ctx.strokeStyle = s.strokeColor;
    ctx.fillStyle = s.color;

    if (s.type === 'rect') {
      if (s.filled) ctx.fillRect(x, y, sw, sh);
      if (s.strokeWidth > 0) ctx.strokeRect(x, y, sw, sh);
    } else if (s.type === 'circle') {
      const rx = sw / 2;
      const ry = sh / 2;
      ctx.beginPath();
      ctx.ellipse(x + rx, y + ry, rx, ry, 0, 0, Math.PI * 2);
      if (s.filled) ctx.fill();
      if (s.strokeWidth > 0) ctx.stroke();
    } else if (s.type === 'line' || s.type === 'arrow') {
      ctx.beginPath();
      ctx.moveTo(x, y + sh / 2);
      ctx.lineTo(x + sw, y + sh / 2);
      ctx.stroke();

      if (s.type === 'arrow') {
        const head = Math.min(12, sw * 0.15);
        ctx.beginPath();
        ctx.moveTo(x + sw, y + sh / 2);
        ctx.lineTo(x + sw - head, y + sh / 2 - head / 2);
        ctx.lineTo(x + sw - head, y + sh / 2 + head / 2);
        ctx.closePath();
        ctx.fillStyle = s.strokeColor;
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

/** Draw text layers onto canvas */
function drawTexts(ctx: CanvasRenderingContext2D, texts: TextLayer[], w: number, h: number) {
  for (const t of texts) {
    const x = (t.x / 100) * w;
    const y = (t.y / 100) * h;

    ctx.save();
    ctx.font = `${t.italic ? 'italic ' : ''}${t.bold ? 'bold ' : ''}${t.fontSize}px ${t.fontFamily}`;
    ctx.textAlign = t.align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = t.color;

    if (t.strokeWidth > 0) {
      ctx.strokeStyle = t.strokeColor;
      ctx.lineWidth = t.strokeWidth;
      ctx.strokeText(t.text, x, y);
    }
    ctx.fillText(t.text, x, y);
    ctx.restore();
  }
}

/** Apply adjustments + filter + texts/shapes to a canvas and return a blob */
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
  crop?: { x: number; y: number; width: number; height: number } | null,
  texts: TextLayer[] = [],
  shapes: ShapeLayer[] = []
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  let srcW = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  let srcH = source instanceof HTMLImageElement ? source.naturalHeight : source.height;

  let sx = 0, sy = 0, sw = srcW, sh = srcH;
  if (crop && crop.width > 0 && crop.height > 0) {
    sx = Math.max(0, crop.x);
    sy = Math.max(0, crop.y);
    sw = Math.min(crop.width, srcW - sx);
    sh = Math.min(crop.height, srcH - sy);
  }

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
  ctx.filter = buildCssFilter(adj, filterId, filterIntensity);
  ctx.drawImage(source, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh);
  ctx.restore();

  // Vignette
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

  // Film grain
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

  // Draw shapes then texts (on top)
  drawShapes(ctx, shapes, outW, outH);
  drawTexts(ctx, texts, outW, outH);

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
