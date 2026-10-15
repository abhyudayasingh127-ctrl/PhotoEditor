import { useRef, useState, useCallback, useEffect } from 'react';
import { Upload, ImageIcon, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { buildCssFilter } from '../utils/imageProcessing';
import { Adjustments } from '../types';

interface Props {
  imageSrc: string | null;
  adjustments: Adjustments;
  filterId: string;
  filterIntensity: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  showOriginal: boolean;
  onDrop: (file: File) => void;
  onUploadClick: () => void;
}

const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export default function ImageWorkspace({
  imageSrc,
  adjustments,
  filterId,
  filterIntensity,
  rotation,
  flipH,
  flipV,
  showOriginal,
  onDrop,
  onUploadClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        onDrop(file);
      }
    },
    [onDrop]
  );

  const cssFilter = showOriginal
    ? 'none'
    : buildCssFilter(adjustments, filterId, filterIntensity);

  const transform = `
    scale(${zoom})
    rotate(${rotation}deg)
    scaleX(${flipH ? -1 : 1})
    scaleY(${flipV ? -1 : 1})
    translate(${pan.x / zoom}px, ${pan.y / zoom}px)
  `;

  // Mouse pan when zoomed
  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPan({
        x: dragStart.current.panX + (e.clientX - dragStart.current.x),
        y: dragStart.current.panY + (e.clientY - dragStart.current.y),
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

  const zoomIn = () => {
    const idx = ZOOM_LEVELS.findIndex((z) => z >= zoom);
    setZoom(ZOOM_LEVELS[Math.min(idx + 1, ZOOM_LEVELS.length - 1)]);
  };
  const zoomOut = () => {
    const idx = ZOOM_LEVELS.findIndex((z) => z >= zoom);
    setZoom(ZOOM_LEVELS[Math.max(idx - 1, 0)]);
  };
  const fit = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <main
      ref={containerRef}
      className="flex-1 relative bg-surface-900 overflow-hidden flex flex-col"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Canvas area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-20 h-20 rounded-2xl bg-surface-700 border border-surface-500 flex items-center justify-center">
              <ImageIcon size={32} className="text-text-muted" />
            </div>
            <div>
              <p className="text-[15px] font-medium text-text-primary mb-1">
                Drop an image here to start editing
              </p>
              <p className="text-[13px] text-text-secondary">
                JPEG, PNG, or WebP
              </p>
            </div>
            <button
              onClick={onUploadClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-[13px] font-medium transition-colors"
            >
              <Upload size={16} />
              Upload Image
            </button>
          </div>
        ) : (
          <div
            className={`relative max-w-full max-h-full ${isDragging ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : ''}`}
            onMouseDown={onMouseDown}
          >
            <div className="checkerboard rounded-sm overflow-hidden shadow-2xl">
              <img
                src={imageSrc}
                alt="Editing preview"
                className="max-w-[min(90vw,900px)] max-h-[calc(100vh-160px)] object-contain block"
                style={{
                  filter: cssFilter,
                  transform,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.15s ease',
                }}
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* Zoom controls */}
      {imageSrc && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-surface-800/90 backdrop-blur border border-surface-500 rounded-lg px-2 py-1.5 shadow-lg">
          <button
            onClick={zoomOut}
            className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-600"
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-[12px] tabular-nums text-text-secondary w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-600"
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-4 bg-surface-500 mx-1" />
          <button
            onClick={fit}
            className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-600"
            title="Fit to screen"
          >
            <Maximize size={16} />
          </button>
        </div>
      )}
    </main>
  );
}