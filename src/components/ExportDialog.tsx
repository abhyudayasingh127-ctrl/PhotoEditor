import { useState } from 'react';
import { X, Download } from 'lucide-react';
import { formatBytes } from '../utils/imageProcessing';

interface Props {
  open: boolean;
  onClose: () => void;
  filename: string;
  width: number;
  height: number;
  onExport: (format: string, quality: number, name: string) => void;
}

export default function ExportDialog({
  open,
  onClose,
  filename,
  width,
  height,
  onExport,
}: Props) {
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [quality, setQuality] = useState(92);
  const [name, setName] = useState(filename.replace(/\.[^.]+$/, '') || 'edited-photo');

  if (!open) return null;

  const estimatedSize = Math.round((width * height * (format === 'png' ? 3 : 0.4) * (quality / 100)) / 1024);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-700 border border-surface-500 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-500">
          <h2 className="text-[16px] font-semibold">Export Image</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[13px] font-medium mb-1.5">Filename</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-surface-800 border border-surface-500 text-[13px] focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium mb-1.5">Format</label>
            <div className="flex gap-2">
              {(['jpeg', 'png', 'webp'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-2 rounded-md text-[13px] font-medium capitalize transition-colors ${
                    format === f
                      ? 'bg-accent text-white'
                      : 'bg-surface-800 text-text-secondary hover:bg-surface-600'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {(format === 'jpeg' || format === 'webp') && (
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[13px] font-medium">Quality</label>
                <span className="text-[12px] text-text-secondary">{quality}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div className="flex justify-between text-[12px] text-text-secondary pt-1">
            <span>
              {width} × {height} px
            </span>
            <span>~{formatBytes(estimatedSize * 1024)}</span>
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-surface-500">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-md bg-surface-600 hover:bg-surface-500 text-[13px] font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onExport(format, quality / 100, name)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-[13px] font-medium transition-colors"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}