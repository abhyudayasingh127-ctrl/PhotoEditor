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
  CropState,
  TextLayer,
  ShapeLayer,
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
  const [rightTab, setRightTab] = useState('adjust');
  const [showOriginal, setShowOriginal] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);
  const [resizeLock, setResizeLock] = useState(true);
  const aspectRef = useRef(1);

  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  const initialHistory: HistoryEntry = {
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    filterId: 'original',
    filterIntensity: 100,
    rotation: 0,
    flipH: false,
    flipV: false,
    crop: null,
    texts: [],
    shapes: [],
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

  const { adjustments, filterId, filterIntensity, rotation, flipH, flipV, crop, texts = [], shapes = [] } = present;

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
      setResizeWidth(img.naturalWidth);
      setResizeHeight(img.naturalHeight);
      aspectRef.current = img.naturalWidth / img.naturalHeight;
      imgRef.current = img;

      const reset: HistoryEntry = {
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        filterId: 'original',
        filterIntensity: 100,
        rotation: 0,
        flipH: false,
        flipV: false,
        crop: null,
        texts: [],
        shapes: [],
      };
      replacePresent(reset);
      setIsDirty(false);
      setSelectedTextId(null);
      setSelectedShapeId(null);
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

  const handleAdjustmentChange = (key: keyof Adjustments, value: number) => {
    startSliding();
    replacePresent({ ...present, adjustments: { ...present.adjustments, [key]: value } });
    setIsDirty(true);
  };

  const handleAdjustmentEnd = () => {
    endSliding({ ...present, adjustments: { ...present.adjustments } });
  };

  const handleFilterChange = (id: string) => {
    push({ ...present, filterId: id, filterIntensity: id === 'original' ? 100 : present.filterIntensity });
    setIsDirty(true);
  };

  const handleFilterIntensity = (v: number) => {
    startSliding();
    replacePresent({ ...present, filterIntensity: v });
  };

  const handleResetAll = () => {
    push({ ...present, adjustments: { ...DEFAULT_ADJUSTMENTS }, filterId: 'original', filterIntensity: 100 });
    setIsDirty(true);
  };

  const handleCropAspectChange = (aspect: string) => {
    if (!naturalSize.w) return;
    let newCrop: CropState;
    if (aspect === 'free') {
      newCrop = { x: 0, y: 0, width: naturalSize.w, height: naturalSize.h, aspect: 'free' };
    } else {
      const [aw, ah] = aspect.split(':').map(Number);
      const targetRatio = aw / ah;
      let w = naturalSize.w;
      let h = w / targetRatio;
      if (h > naturalSize.h) { h = naturalSize.h; w = h * targetRatio; }
      const x = (naturalSize.w - w) / 2;
      const y = (naturalSize.h - h) / 2;
      newCrop = { x, y, width: w, height: h, aspect };
    }
    push({ ...present, crop: newCrop });
    setIsDirty(true);
  };

  const handleApplyCrop = () => setIsDirty(true);
  const handleClearCrop = () => { push({ ...present, crop: null }); setIsDirty(true); };

  const handleResizeWidthChange = (w: number) => {
    setResizeWidth(w);
    if (resizeLock && aspectRef.current) setResizeHeight(Math.round(w / aspectRef.current));
  };
  const handleResizeHeightChange = (h: number) => {
    setResizeHeight(h);
    if (resizeLock && aspectRef.current) setResizeWidth(Math.round(h * aspectRef.current));
  };
  const handleResizeLockToggle = () => setResizeLock((v) => !v);
  const handleApplyResize = () => { setNaturalSize({ w: resizeWidth, h: resizeHeight }); setIsDirty(true); };

  const handleAddText = () => {
    const id = `text-${Date.now()}`;
    const newText: TextLayer = {
      id, text: 'Double-click to edit', x: 50, y: 50, fontSize: 48,
      fontFamily: 'Inter, system-ui, sans-serif', color: '#ffffff',
      strokeColor: '#000000', strokeWidth: 0, align: 'center', bold: false, italic: false,
    };
    push({ ...present, texts: [...(present.texts || []), newText] });
    setSelectedTextId(id);
    setIsDirty(true);
  };

  const handleUpdateText = (id: string, updates: Partial<TextLayer>) => {
    const next = (present.texts || []).map((t) => (t.id === id ? { ...t, ...updates } : t));
    push({ ...present, texts: next });
    setIsDirty(true);
  };

  const handleDeleteText = (id: string) => {
    push({ ...present, texts: (present.texts || []).filter((t) => t.id !== id) });
    if (selectedTextId === id) setSelectedTextId(null);
    setIsDirty(true);
  };

  const handleAddShape = (type: ShapeLayer['type']) => {
    const id = `shape-${Date.now()}`;
    const newShape: ShapeLayer = {
      id, type, x: 30, y: 30, width: 40, height: 30,
      color: '#ffffff', strokeColor: '#000000', strokeWidth: 3,
      filled: type !== 'line' && type !== 'arrow',
    };
    push({ ...present, shapes: [...(present.shapes || []), newShape] });
    setSelectedShapeId(id);
    setIsDirty(true);
  };

  const handleUpdateShape = (id: string, updates: Partial<ShapeLayer>) => {
    const next = (present.shapes || []).map((s) => (s.id === id ? { ...s, ...updates } : s));
    push({ ...present, shapes: next });
    setIsDirty(true);
  };

  const handleDeleteShape = (id: string) => {
    push({ ...present, shapes: (present.shapes || []).filter((s) => s.id !== id) });
    if (selectedShapeId === id) setSelectedShapeId(null);
    setIsDirty(true);
  };

  const handleToolChange = (tool: ToolId) => {
    setActiveTool(tool);
    if (tool === 'rotate') { push({ ...present, rotation: (present.rotation + 90) % 360 }); setIsDirty(true); }
    else if (tool === 'flipH') { push({ ...present, flipH: !present.flipH }); setIsDirty(true); }
    else if (tool === 'flipV') { push({ ...present, flipV: !present.flipV }); setIsDirty(true); }
    else if (tool === 'reset') {
      if (window.confirm('Reset all edits?')) {
        push({ adjustments: { ...DEFAULT_ADJUSTMENTS }, filterId: 'original', filterIntensity: 100, rotation: 0, flipH: false, flipV: false, crop: null, texts: [], shapes: [] });
        setIsDirty(false); setSelectedTextId(null); setSelectedShapeId(null);
      }
    } else if (tool === 'compare') setShowOriginal((v) => !v);
    else if (tool === 'filters') { setActiveSection('filters'); setRightTab('filters'); }
    else if (tool === 'effects' || tool === 'blur') { setActiveSection('effects'); setRightTab('effects'); }
    else if (tool === 'adjust' || tool === 'color') { setActiveSection('edit'); setRightTab('adjust'); }
    else if (tool === 'crop' && !present.crop && naturalSize.w > 0) {
      push({ ...present, crop: { x: 0, y: 0, width: naturalSize.w, height: naturalSize.h, aspect: 'free' } });
    }
  };

  const handleSectionChange = (s: string) => {
    setActiveSection(s);
    if (s === 'filters') setRightTab('filters');
    else if (s === 'effects') setRightTab('effects');
    else setRightTab('adjust');
  };

  const handleExport = async (format: string, quality: number, name: string) => {
    if (!imgRef.current || !imageSrc) return;
    try {
      const mime = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
      const blob = await exportImage(
        imgRef.current, present.adjustments, present.filterId, present.filterIntensity,
        present.rotation, present.flipH, present.flipV, mime, quality, present.crop,
        present.texts || [], present.shapes || []
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'o') { e.preventDefault(); handleUploadClick(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (imageSrc) setExportOpen(true); }
      else if (e.key === 'Escape') { setExportOpen(false); setShowOriginal(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, imageSrc]);

  return (
    <div className="h-full flex flex-col bg-surface-900 text-text-primary font-sans pb-16 md:pb-0">
      <TopToolbar canUndo={canUndo} canRedo={canRedo} hasImage={!!imageSrc} isDirty={isDirty}
        onUndo={undo} onRedo={redo} onExport={() => setExportOpen(true)}
        activeSection={activeSection} onSectionChange={handleSectionChange} />

      <div className="flex-1 flex overflow-hidden min-h-0">
        <ToolSidebar activeTool={activeTool} onToolChange={handleToolChange} onUploadClick={handleUploadClick} hasImage={!!imageSrc} />

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
          texts={texts}
          shapes={shapes}
        />

        {/* Right panel – on mobile becomes a bottom sheet style (full width, limited height) */}
        <div className="hidden md:contents">
          <RightPanel
            activeTab={rightTab} onTabChange={setRightTab}
            adjustments={adjustments} filterId={filterId} filterIntensity={filterIntensity}
            onAdjustmentChange={handleAdjustmentChange} onAdjustmentEnd={handleAdjustmentEnd}
            onFilterChange={handleFilterChange} onFilterIntensityChange={handleFilterIntensity}
            onResetAll={handleResetAll} imageSrc={imageSrc}
            activeTool={activeTool} crop={crop}
            naturalWidth={naturalSize.w} naturalHeight={naturalSize.h}
            onCropAspectChange={handleCropAspectChange} onApplyCrop={handleApplyCrop} onClearCrop={handleClearCrop}
            resizeWidth={resizeWidth} resizeHeight={resizeHeight} resizeLock={resizeLock}
            onResizeWidthChange={handleResizeWidthChange} onResizeHeightChange={handleResizeHeightChange}
            onResizeLockToggle={handleResizeLockToggle} onApplyResize={handleApplyResize}
            texts={texts} shapes={shapes}
            selectedTextId={selectedTextId} selectedShapeId={selectedShapeId}
            onSelectText={setSelectedTextId} onSelectShape={setSelectedShapeId}
            onAddText={handleAddText} onUpdateText={handleUpdateText} onDeleteText={handleDeleteText}
            onAddShape={handleAddShape} onUpdateShape={handleUpdateShape} onDeleteShape={handleDeleteShape}
          />
        </div>

        {/* Mobile right panel – full width overlay from bottom when needed */}
        <div className="md:hidden fixed left-0 right-0 bottom-16 z-30 max-h-[50vh] overflow-hidden rounded-t-xl border-t border-surface-500 shadow-2xl">
          <RightPanel
            activeTab={rightTab} onTabChange={setRightTab}
            adjustments={adjustments} filterId={filterId} filterIntensity={filterIntensity}
            onAdjustmentChange={handleAdjustmentChange} onAdjustmentEnd={handleAdjustmentEnd}
            onFilterChange={handleFilterChange} onFilterIntensityChange={handleFilterIntensity}
            onResetAll={handleResetAll} imageSrc={imageSrc}
            activeTool={activeTool} crop={crop}
            naturalWidth={naturalSize.w} naturalHeight={naturalSize.h}
            onCropAspectChange={handleCropAspectChange} onApplyCrop={handleApplyCrop} onClearCrop={handleClearCrop}
            resizeWidth={resizeWidth} resizeHeight={resizeHeight} resizeLock={resizeLock}
            onResizeWidthChange={handleResizeWidthChange} onResizeHeightChange={handleResizeHeightChange}
            onResizeLockToggle={handleResizeLockToggle} onApplyResize={handleApplyResize}
            texts={texts} shapes={shapes}
            selectedTextId={selectedTextId} selectedShapeId={selectedShapeId}
            onSelectText={setSelectedTextId} onSelectShape={setSelectedShapeId}
            onAddText={handleAddText} onUpdateText={handleUpdateText} onDeleteText={handleDeleteText}
            onAddShape={handleAddShape} onUpdateShape={handleUpdateShape} onDeleteShape={handleDeleteShape}
          />
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

      <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} filename={filename}
        width={naturalSize.w} height={naturalSize.h} onExport={handleExport} />
    </div>
  );
}

export default App;
