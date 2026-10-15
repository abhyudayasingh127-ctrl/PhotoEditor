import { Adjustments, FILTERS, ASPECT_RATIOS, CropState, TextLayer, ShapeLayer, FONT_FAMILIES } from '../types';
import SliderControl from './SliderControl';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  adjustments: Adjustments;
  filterId: string;
  filterIntensity: number;
  onAdjustmentChange: (key: keyof Adjustments, value: number) => void;
  onAdjustmentEnd: () => void;
  onFilterChange: (id: string) => void;
  onFilterIntensityChange: (v: number) => void;
  onResetAll: () => void;
  imageSrc: string | null;
  activeTool: string;
  crop: CropState | null;
  naturalWidth: number;
  naturalHeight: number;
  onCropAspectChange: (aspect: string) => void;
  onApplyCrop: () => void;
  onClearCrop: () => void;
  resizeWidth: number;
  resizeHeight: number;
  resizeLock: boolean;
  onResizeWidthChange: (w: number) => void;
  onResizeHeightChange: (h: number) => void;
  onResizeLockToggle: () => void;
  onApplyResize: () => void;
  // Phase 2
  texts: TextLayer[];
  shapes: ShapeLayer[];
  selectedTextId: string | null;
  selectedShapeId: string | null;
  onSelectText: (id: string | null) => void;
  onSelectShape: (id: string | null) => void;
  onAddText: () => void;
  onUpdateText: (id: string, updates: Partial<TextLayer>) => void;
  onDeleteText: (id: string) => void;
  onAddShape: (type: ShapeLayer['type']) => void;
  onUpdateShape: (id: string, updates: Partial<ShapeLayer>) => void;
  onDeleteShape: (id: string) => void;
}

export default function RightPanel(props: Props) {
  const {
    activeTab, onTabChange, adjustments, filterId, filterIntensity,
    onAdjustmentChange, onAdjustmentEnd, onFilterChange, onFilterIntensityChange,
    onResetAll, imageSrc, activeTool, crop, naturalWidth, naturalHeight,
    onCropAspectChange, onApplyCrop, onClearCrop,
    resizeWidth, resizeHeight, resizeLock,
    onResizeWidthChange, onResizeHeightChange, onResizeLockToggle, onApplyResize,
    texts = [], shapes = [], selectedTextId, selectedShapeId,
    onSelectText, onSelectShape, onAddText, onUpdateText, onDeleteText,
    onAddShape, onUpdateShape, onDeleteShape,
  } = props;

  const selectedText = texts.find((t) => t.id === selectedTextId) || null;
  const selectedShape = shapes.find((s) => s.id === selectedShapeId) || null;

  // ---- Crop panel ----
  if (activeTool === 'crop') {
    return (
      <aside className="w-[320px] shrink-0 bg-surface-800 border-l border-surface-500 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-500"><h3 className="text-[14px] font-semibold">Crop</h3></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <p className="text-[12px] text-text-secondary mb-2">Aspect Ratio</p>
            <div className="grid grid-cols-4 gap-1.5">
              {ASPECT_RATIOS.map((r) => (
                <button key={r.id} onClick={() => onCropAspectChange(r.id)}
                  className={`py-1.5 text-[12px] rounded-md border transition-colors ${
                    (crop?.aspect || 'free') === r.id ? 'bg-accent/20 border-accent text-accent' : 'border-surface-500 text-text-secondary hover:border-surface-400'
                  }`}>{r.label}</button>
              ))}
            </div>
          </div>
          {crop && (
            <div className="text-[12px] text-text-muted space-y-1 bg-surface-700/50 rounded-md p-3">
              <div>X: {Math.round(crop.x)} &nbsp; Y: {Math.round(crop.y)}</div>
              <div>W: {Math.round(crop.width)} &nbsp; H: {Math.round(crop.height)}</div>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button onClick={onApplyCrop} disabled={!crop} className="flex-1 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-[13px] font-medium disabled:opacity-40">Apply Crop</button>
            <button onClick={onClearCrop} className="px-3 py-2 rounded-md border border-surface-500 text-text-secondary text-[13px] hover:bg-surface-600">Clear</button>
          </div>
        </div>
      </aside>
    );
  }

  // ---- Resize panel ----
  if (activeTool === 'resize') {
    return (
      <aside className="w-[320px] shrink-0 bg-surface-800 border-l border-surface-500 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-500"><h3 className="text-[14px] font-semibold">Resize</h3></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-[12px] text-text-muted">Original: {naturalWidth} × {naturalHeight}px</div>
          <div className="space-y-3">
            <div>
              <label className="text-[12px] text-text-secondary block mb-1">Width (px)</label>
              <input type="number" value={resizeWidth || ''} onChange={(e) => onResizeWidthChange(Number(e.target.value) || 0)}
                className="w-full bg-surface-700 border border-surface-500 rounded-md px-3 py-2 text-[13px] outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[12px] text-text-secondary block mb-1">Height (px)</label>
              <input type="number" value={resizeHeight || ''} onChange={(e) => onResizeHeightChange(Number(e.target.value) || 0)}
                className="w-full bg-surface-700 border border-surface-500 rounded-md px-3 py-2 text-[13px] outline-none focus:border-accent" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-[13px] text-text-secondary cursor-pointer">
            <input type="checkbox" checked={resizeLock} onChange={onResizeLockToggle} className="rounded" /> Lock aspect ratio
          </label>
          <button onClick={onApplyResize} disabled={!resizeWidth || !resizeHeight}
            className="w-full py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-[13px] font-medium disabled:opacity-40">Apply Resize</button>
        </div>
      </aside>
    );
  }

  // ---- Text panel ----
  if (activeTool === 'text') {
    return (
      <aside className="w-[320px] shrink-0 bg-surface-800 border-l border-surface-500 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-500 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold">Text</h3>
          <button onClick={onAddText} className="text-[12px] text-accent hover:underline">+ Add Text</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {texts.length === 0 && (
            <p className="text-[12px] text-text-muted">Click “+ Add Text” to place text on the image.</p>
          )}

          {texts.map((t) => (
            <div key={t.id}
              onClick={() => onSelectText(t.id)}
              className={`p-2 rounded-md border cursor-pointer text-[12px] truncate ${
                selectedTextId === t.id ? 'border-accent bg-accent/10' : 'border-surface-500 hover:border-surface-400'
              }`}>{t.text || '(empty)'}</div>
          ))}

          {selectedText && (
            <div className="space-y-3 pt-2 border-t border-surface-500">
              <div>
                <label className="text-[12px] text-text-secondary block mb-1">Content</label>
                <textarea value={selectedText.text} rows={2}
                  onChange={(e) => onUpdateText(selectedText.id, { text: e.target.value })}
                  className="w-full bg-surface-700 border border-surface-500 rounded-md px-3 py-2 text-[13px] outline-none focus:border-accent resize-none" />
              </div>

              <div>
                <label className="text-[12px] text-text-secondary block mb-1">Font</label>
                <select value={selectedText.fontFamily}
                  onChange={(e) => onUpdateText(selectedText.id, { fontFamily: e.target.value })}
                  className="w-full bg-surface-700 border border-surface-500 rounded-md px-3 py-2 text-[13px] outline-none focus:border-accent">
                  {FONT_FAMILIES.map((f) => <option key={f} value={f}>{f.split(',')[0]}</option>)}
                </select>
              </div>

              <SliderControl label="Size" value={selectedText.fontSize} min={12} max={200}
                onChange={(v) => onUpdateText(selectedText.id, { fontSize: v })} onChangeEnd={() => {}} />

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[12px] text-text-secondary block mb-1">Color</label>
                  <input type="color" value={selectedText.color}
                    onChange={(e) => onUpdateText(selectedText.id, { color: e.target.value })}
                    className="w-full h-9 rounded cursor-pointer" />
                </div>
                <div className="flex-1">
                  <label className="text-[12px] text-text-secondary block mb-1">Stroke</label>
                  <input type="color" value={selectedText.strokeColor}
                    onChange={(e) => onUpdateText(selectedText.id, { strokeColor: e.target.value })}
                    className="w-full h-9 rounded cursor-pointer" />
                </div>
              </div>

              <SliderControl label="Stroke Width" value={selectedText.strokeWidth} min={0} max={20}
                onChange={(v) => onUpdateText(selectedText.id, { strokeWidth: v })} onChangeEnd={() => {}} />

              <div className="flex gap-2">
                <button onClick={() => onUpdateText(selectedText.id, { bold: !selectedText.bold })}
                  className={`flex-1 py-1.5 rounded text-[12px] border ${selectedText.bold ? 'bg-accent/20 border-accent text-accent' : 'border-surface-500'}`}>Bold</button>
                <button onClick={() => onUpdateText(selectedText.id, { italic: !selectedText.italic })}
                  className={`flex-1 py-1.5 rounded text-[12px] border ${selectedText.italic ? 'bg-accent/20 border-accent text-accent' : 'border-surface-500'}`}>Italic</button>
              </div>

              <button onClick={() => onDeleteText(selectedText.id)}
                className="w-full py-2 rounded-md border border-red-500/50 text-red-400 text-[13px] hover:bg-red-500/10">Delete Text</button>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // ---- Shapes panel ----
  if (activeTool === 'shapes') {
    return (
      <aside className="w-[320px] shrink-0 bg-surface-800 border-l border-surface-500 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-500"><h3 className="text-[14px] font-semibold">Shapes</h3></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(['rect', 'circle', 'line', 'arrow'] as const).map((type) => (
              <button key={type} onClick={() => onAddShape(type)}
                className="py-2 rounded-md border border-surface-500 text-[12px] capitalize hover:border-accent hover:text-accent">
                + {type}
              </button>
            ))}
          </div>

          {shapes.length > 0 && (
            <div className="space-y-1">
              {shapes.map((s) => (
                <div key={s.id} onClick={() => onSelectShape(s.id)}
                  className={`p-2 rounded-md border cursor-pointer text-[12px] capitalize ${
                    selectedShapeId === s.id ? 'border-accent bg-accent/10' : 'border-surface-500'
                  }`}>{s.type}</div>
              ))}
            </div>
          )}

          {selectedShape && (
            <div className="space-y-3 pt-2 border-t border-surface-500">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[12px] text-text-secondary block mb-1">Fill</label>
                  <input type="color" value={selectedShape.color}
                    onChange={(e) => onUpdateShape(selectedShape.id, { color: e.target.value })}
                    className="w-full h-9 rounded cursor-pointer" />
                </div>
                <div className="flex-1">
                  <label className="text-[12px] text-text-secondary block mb-1">Stroke</label>
                  <input type="color" value={selectedShape.strokeColor}
                    onChange={(e) => onUpdateShape(selectedShape.id, { strokeColor: e.target.value })}
                    className="w-full h-9 rounded cursor-pointer" />
                </div>
              </div>

              <SliderControl label="Stroke Width" value={selectedShape.strokeWidth} min={0} max={30}
                onChange={(v) => onUpdateShape(selectedShape.id, { strokeWidth: v })} onChangeEnd={() => {}} />

              <label className="flex items-center gap-2 text-[13px] text-text-secondary cursor-pointer">
                <input type="checkbox" checked={selectedShape.filled}
                  onChange={(e) => onUpdateShape(selectedShape.id, { filled: e.target.checked })} className="rounded" />
                Filled
              </label>

              <button onClick={() => onDeleteShape(selectedShape.id)}
                className="w-full py-2 rounded-md border border-red-500/50 text-red-400 text-[13px] hover:bg-red-500/10">Delete Shape</button>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // Default tabs
  return (
    <aside className="w-[320px] shrink-0 bg-surface-800 border-l border-surface-500 flex flex-col overflow-hidden">
      <div className="flex border-b border-surface-500">
        {['adjust', 'filters', 'effects'].map((tab) => (
          <button key={tab} onClick={() => onTabChange(tab)}
            className={`flex-1 py-3 text-[13px] font-medium capitalize transition-colors relative ${
              activeTab === tab ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
            }`}>
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'adjust' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold">Adjustments</h3>
              <button onClick={onResetAll} className="text-[12px] text-accent hover:underline">Reset All</button>
            </div>
            <SliderControl label="Brightness" value={adjustments.brightness} onChange={(v) => onAdjustmentChange('brightness', v)} onChangeEnd={onAdjustmentEnd} />
            <SliderControl label="Contrast" value={adjustments.contrast} onChange={(v) => onAdjustmentChange('contrast', v)} onChangeEnd={onAdjustmentEnd} />
            <SliderControl label="Saturation" value={adjustments.saturation} onChange={(v) => onAdjustmentChange('saturation', v)} onChangeEnd={onAdjustmentEnd} />
            <SliderControl label="Exposure" value={adjustments.exposure} onChange={(v) => onAdjustmentChange('exposure', v)} onChangeEnd={onAdjustmentEnd} />
            <SliderControl label="Highlights" value={adjustments.highlights} onChange={(v) => onAdjustmentChange('highlights', v)} onChangeEnd={onAdjustmentEnd} />
            <SliderControl label="Shadows" value={adjustments.shadows} onChange={(v) => onAdjustmentChange('shadows', v)} onChangeEnd={onAdjustmentEnd} />
            <SliderControl label="Temperature" value={adjustments.temperature} onChange={(v) => onAdjustmentChange('temperature', v)} onChangeEnd={onAdjustmentEnd} />
            <SliderControl label="Tint" value={adjustments.tint} onChange={(v) => onAdjustmentChange('tint', v)} onChangeEnd={onAdjustmentEnd} />
            <SliderControl label="Hue" value={adjustments.hue} min={-180} max={180} onChange={(v) => onAdjustmentChange('hue', v)} onChangeEnd={onAdjustmentEnd} />
            <SliderControl label="Fade" value={adjustments.fade} min={0} max={100} onChange={(v) => onAdjustmentChange('fade', v)} onChangeEnd={onAdjustmentEnd} />
            <SliderControl label="Vignette" value={adjustments.vignette} min={0} max={100} onChange={(v) => onAdjustmentChange('vignette', v)} onChangeEnd={onAdjustmentEnd} />
            <SliderControl label="Sharpness" value={adjustments.sharpness} min={0} max={100} onChange={(v) => onAdjustmentChange('sharpness', v)} onChangeEnd={onAdjustmentEnd} />
          </div>
        )}

        {activeTab === 'filters' && (
          <div>
            <h3 className="text-[14px] font-semibold mb-3">Filters</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {FILTERS.map((f) => (
                <button key={f.id} onClick={() => onFilterChange(f.id)}
                  className={`rounded-md overflow-hidden border-2 transition-all ${
                    filterId === f.id ? 'border-accent ring-1 ring-accent/40' : 'border-transparent hover:border-surface-500'
                  }`}>
                  <div className="aspect-square bg-surface-600 overflow-hidden" style={{ filter: f.css || 'none' }}>
                    {imageSrc ? <img src={imageSrc} alt={f.name} className="w-full h-full object-cover" draggable={false} /> : <div className="w-full h-full bg-surface-600" />}
                  </div>
                  <div className="py-1 text-[11px] text-center bg-surface-700 truncate px-1">{f.name}</div>
                </button>
              ))}
            </div>
            {filterId !== 'original' && (
              <SliderControl label="Intensity" value={filterIntensity} min={0} max={100} onChange={onFilterIntensityChange} onChangeEnd={onAdjustmentEnd} />
            )}
          </div>
        )}

        {activeTab === 'effects' && (
          <div>
            <h3 className="text-[14px] font-semibold mb-3">Effects</h3>
            <SliderControl label="Blur" value={adjustments.blur} min={0} max={20} onChange={(v) => onAdjustmentChange('blur', v)} onChangeEnd={onAdjustmentEnd} description="Soft blur" />
            <SliderControl label="Film Grain" value={adjustments.grain} min={0} max={100} onChange={(v) => onAdjustmentChange('grain', v)} onChangeEnd={onAdjustmentEnd} description="Film noise" />
          </div>
        )}
      </div>
    </aside>
  );
}
