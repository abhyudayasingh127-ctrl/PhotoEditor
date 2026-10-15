import { useState, useCallback, useRef, useEffect } from 'react';
import TopToolbar from './components/TopToolbar';
import ToolSidebar from './components/ToolSidebar';
import ImageWorkspace from './components/ImageWorkspace';
import RightPanel from './components/RightPanel';
import ExportDialog from './components/ExportDialog';
import {
  Adjustments,
  DEFAULT_ADJUSTMENTS,
  ToolId,
  HistoryEntry,
} from './types';
import { useHistory } from './hooks/useHistory';
import { exportImage } from './utils/imageProcessing';

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [filename, setFilename] = useState('image');
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [activeTool, setActiveTool] = useState<ToolId>('adjust');
  const [activeSection, setActiveSection] = useState('edit');
  const [showOriginal, setShowOriginal] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const initialHistory: HistoryEntry = {
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    filterId: 'original',
    filterIntensity: 100,
    rotation: 0,
    flipH: false,
    flipV: false,
    crop: null,
  };

  const {
    present,
    canUndo,
    canRedo,
    push,
    replacePresent,
    startSliding,
    endSliding,
    undo,
    redo,
  } = useHistory(initialHistory);

  const { adjustments, filterId, filterIntensity, rotation, flipH, flipV } = present;

  // Load image
  const loadFile = useCallback((file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
      alert('Unsupported format. Please use JPEG, PNG, or WebP.');
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (originalSrc) URL.revokeObjectURL(originalSrc);

      setImageSrc(url);
      setOriginalSrc(url);
      setFilename(file.name);
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      imgRef.current = img;

      // Reset history
      const reset: HistoryEntry = {
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        filterId: 'original',
        filterIntensity: 100,
        rotation: 0,
        flipH: false,
        flipV: false,
        crop: null,
      };
      replacePresent(reset);
      setIsDirty(false);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert('Failed to load image.');
    };
    img.src = url;
  }, [imageSrc, originalSrc, replacePresent]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = '';
  };

  // Adjustment handlers
  const handleAdjustmentChange = (key: keyof Adjustments, value: number) => {
    startSliding();
    replacePresent({
      ...present,
      adjustments: { ...present.adjustments, [key]: value },
    });
    setIsDirty(true);
  };

  const handleAdjustmentEnd = () => {
    endSliding({
      ...present,
      adjustments: { ...present.adjustments },
    });
  };

  const handleFilterChange = (id: string) => {
    push({
      ...present,
      filterId: id,
      filterIntensity: id === 'original' ? 100 : present.filterIntensity,
    });
    setIsDirty(true);
  };

  const handleFilterIntensity = (v: number) => {
    startSliding();
    replacePresent({ ...present, filterIntensity: v });
  };

  const handleResetAll = () => {
    push({
      ...present,
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      filterId: 'original',
      filterIntensity: 100,
    });
    setIsDirty(true);
  };

  // Tool actions
  const handleToolChange = (tool: ToolId) => {
    setActiveTool(tool);

    if (tool === 'rotate') {
      push({ ...present, rotation: (present.rotation + 90) % 360 });
      setIsDirty(true);
    } else if (tool === 'flipH') {
      push({ ...present, flipH: !present.flipH });
      setIsDirty(true);
    } else if (tool === 'flipV') {
      push({ ...present, flipV: !present.flipV });
      setIsDirty(true);
    } else if (tool === 'reset') {
      if (window.confirm('Reset all edits?')) {
        push({
          adjustments: { ...DEFAULT_ADJUSTMENTS },
          filterId: 'original',
          filterIntensity: 100,
          rotation: 0,
          flipH: false,
          flipV: false,
          crop: null,
        });
        setIsDirty(false);
      }
    } else if (tool === 'compare') {
      setShowOriginal((v) => !v);
    } else if (tool === 'filters') {
      setActiveSection('filters');
    } else if (tool === 'effects') {
      setActiveSection('effects');
    } else if (tool === 'adjust' || tool === 'color') {
      setActiveSection('edit');
    }
  };

  // Export
  const handleExport = async (format: string, quality: number, name: string) => {
    if (!imgRef.current || !imageSrc) return;

    try {
      const mime =
        format === 'png'
          ? 'image/png'
          : format === 'webp'
          ? 'image/webp'
          : 'image/jpeg';

      const blob = await exportImage(
        imgRef.current,
        present.adjustments,
        present.filterId,
        present.filterIntensity,
        present.rotation,
        present.flipH,
        present.flipV,
        mime,
        quality
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.${format === 'jpeg' ? 'jpg' : format}`;
      a.click();
      URL.revokeObjectURL(url);
      setExportOpen(false);
      setIsDirty(false);
    } catch (err) {
      console.error(err);
      alert('Export failed. Try a different format or smaller image.');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        handleUploadClick();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (imageSrc) setExportOpen(true);
      } else if (e.key === 'Escape') {
        setExportOpen(false);
        setShowOriginal(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, imageSrc]);

  // Map section to right panel tab
  const rightTab =
    activeSection === 'filters'
      ? 'filters'
      : activeSection === 'effects'
      ? 'effects'
      : 'adjust';

  return (
    <div className="h-full flex flex-col bg-surface-900 text-text-primary font-sans">
      <TopToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        hasImage={!!imageSrc}
        isDirty={isDirty}
        onUndo={undo}
        onRedo={redo}
        onExport={() => setExportOpen(true)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 flex overflow-hidden">
        <ToolSidebar
          activeTool={activeTool}
          onToolChange={handleToolChange}
          onUploadClick={handleUploadClick}
          hasImage={!!imageSrc}
        />

        <ImageWorkspace
          imageSrc={imageSrc}
          adjustments={adjustments}
          filterId={filterId}
          filterIntensity={filterIntensity}
          rotation={rotation}
          flipH={flipH}
          flipV={flipV}
          showOriginal={showOriginal}
          onDrop={loadFile}
          onUploadClick={handleUploadClick}
        />

        <RightPanel
          activeTab={rightTab}
          adjustments={adjustments}
          filterId={filterId}
          filterIntensity={filterIntensity}
          onAdjustmentChange={handleAdjustmentChange}
          onAdjustmentEnd={handleAdjustmentEnd}
          onFilterChange={handleFilterChange}
          onFilterIntensityChange={handleFilterIntensity}
          onResetAll={handleResetAll}
          imageSrc={imageSrc}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        filename={filename}
        width={naturalSize.w}
        height={naturalSize.h}
        onExport={handleExport}
      />
    </div>
  );
}

export default App;