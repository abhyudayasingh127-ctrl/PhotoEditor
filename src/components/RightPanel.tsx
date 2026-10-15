import { Adjustments, FILTERS, ASPECT_RATIOS, CropState } from '../types';
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
  // Phase 1 additions
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
}

export default function RightPanel({
  activeTab,
  onTabChange,
  adjustments,
  filterId,
  filterIntensity,
  onAdjustmentChange,
  onAdjustmentEnd,
  onFilterChange,
  onFilterIntensityChange,
  onResetAll,
  imageSrc,
  activeTool,
  crop,
  naturalWidth,
  naturalHeight,
  onCropAspectChange,
  onApplyCrop,
  onClearCrop,
  resizeWidth,
  resizeHeight,
  resizeLock,
  onResizeWidthChange,
  onResizeHeightChange,
  onResizeLockToggle,
  onApplyResize,
}: Props) {
  // When Crop or Resize tool is active, show dedicated panel instead of tabs
  if (activeTool === 'crop') {
    return (
      <aside className="w-[320px] shrink-0 bg-surface-800 border-l border-surface-500 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-500">
          <h3 className="text-[14px] font-semibold">Crop</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <p className="text-[12px] text-text-secondary mb-2">Aspect Ratio</p>
            <div className="grid grid-cols-4 gap-1.5">
              {ASPECT_RATIOS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onCropAspectChange(r.id)}
                  className={`py-1.5 text-[12px] rounded-md border transition-colors ${
                    (crop?.aspect || 'free') === r.id
                      ? 'bg-accent/20 border-accent text-accent'
                      : 'border-surface-500 text-text-secondary hover:border-surface-400'
                  }`}
                >
                  {r.label}
                </button>
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
            <button
              onClick={onApplyCrop}
              disabled={!crop}
              className="flex-1 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-[13px] font-medium disabled:opacity-40"
            >
              Apply Crop
            </button>
            <button
              onClick={onClearCrop}
              className="px-3 py-2 rounded-md border border-surface-500 text-text-secondary text-[13px] hover:bg-surface-600"
            >
              Clear
            </button>
          </div>

          <p className="text-[11px] text-text-muted leading-relaxed">
            Drag on the image to set the crop area. Choose an aspect ratio to constrain proportions.
          </p>
        </div>
      </aside>
    );
  }

  if (activeTool === 'resize') {
    return (
      <aside className="w-[320px] shrink-0 bg-surface-800 border-l border-surface-500 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-500">
          <h3 className="text-[14px] font-semibold">Resize</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-[12px] text-text-muted">
            Original: {naturalWidth} × {naturalHeight}px
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[12px] text-text-secondary block mb-1">Width (px)</label>
              <input
                type="number"
                value={resizeWidth || ''}
                onChange={(e) => onResizeWidthChange(Number(e.target.value) || 0)}
                className="w-full bg-surface-700 border border-surface-500 rounded-md px-3 py-2 text-[13px] text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-[12px] text-text-secondary block mb-1">Height (px)</label>
              <input
                type="number"
                value={resizeHeight || ''}
                onChange={(e) => onResizeHeightChange(Number(e.target.value) || 0)}
                className="w-full bg-surface-700 border border-surface-500 rounded-md px-3 py-2 text-[13px] text-text-primary outline-none focus:border-accent"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-[13px] text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={resizeLock}
              onChange={onResizeLockToggle}
              className="rounded"
            />
            Lock aspect ratio
          </label>

          <button
            onClick={onApplyResize}
            disabled={!resizeWidth || !resizeHeight}
            className="w-full py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-[13px] font-medium disabled:opacity-40"
          >
            Apply Resize
          </button>

          <p className="text-[11px] text-text-muted leading-relaxed">
            Resize changes the output dimensions. The preview stays the same until you export.
          </p>
        </div>
      </aside>
    );
  }

  // Default tabs view
  return (
    <aside className="w-[320px] shrink-0 bg-surface-800 border-l border-surface-500 flex flex-col overflow-hidden">
      <div className="flex border-b border-surface-500">
        {['adjust', 'filters', 'effects'].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 py-3 text-[13px] font-medium capitalize transition-colors relative ${
              activeTab === tab
                ? 'text-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'adjust' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold">Adjustments</h3>
              <button onClick={onResetAll} className="text-[12px] text-accent hover:underline">
                Reset All
              </button>
            </div>

            <SliderControl label="Brightness" value={adjustments.brightness} onChange={(v) => onAdjustmentChange('brightness', v)} onChangeEnd={onAdjustmentEnd} description="Overall image brightness" />
            <SliderControl label="Contrast" value={adjustments.contrast} onChange={(v) => onAdjustmentChange('contrast', v)} onChangeEnd={onAdjustmentEnd} description="Difference between dark and light" />
            <SliderControl label="Saturation" value={adjustments.saturation} onChange={(v) => onAdjustmentChange('saturation', v)} onChangeEnd={onAdjustmentEnd} description="Color intensity" />
            <SliderControl label="Exposure" value={adjustments.exposure} onChange={(v) => onAdjustmentChange('exposure', v)} onChangeEnd={onAdjustmentEnd} description="Overall exposure" />
            <SliderControl label="Highlights" value={adjustments.highlights} onChange={(v) => onAdjustmentChange('highlights', v)} onChangeEnd={onAdjustmentEnd} description="Bright regions" />
            <SliderControl label="Shadows" value={adjustments.shadows} onChange={(v) => onAdjustmentChange('shadows', v)} onChangeEnd={onAdjustmentEnd} description="Dark regions" />
            <SliderControl label="Temperature" value={adjustments.temperature} onChange={(v) => onAdjustmentChange('temperature', v)} onChangeEnd={onAdjustmentEnd} description="Warm / Cool balance" />
            <SliderControl label="Tint" value={adjustments.tint} onChange={(v) => onAdjustmentChange('tint', v)} onChangeEnd={onAdjustmentEnd} description="Green / Magenta shift" />
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
                <button
                  key={f.id}
                  onClick={() => onFilterChange(f.id)}
                  className={`rounded-md overflow-hidden border-2 transition-all ${
                    filterId === f.id ? 'border-accent ring-1 ring-accent/40' : 'border-transparent hover:border-surface-500'
                  }`}
                >
                  <div className="aspect-square bg-surface-600 flex items-center justify-center relative overflow-hidden" style={{ filter: f.css || 'none' }}>
                    {imageSrc ? (
                      <img src={imageSrc} alt={f.name} className="w-full h-full object-cover" draggable={false} />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface-600 to-surface-700" />
                    )}
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
            <SliderControl label="Blur" value={adjustments.blur} min={0} max={20} onChange={(v) => onAdjustmentChange('blur', v)} onChangeEnd={onAdjustmentEnd} description="Soft blur (Gaussian-like)" />
            <SliderControl label="Film Grain" value={adjustments.grain} min={0} max={100} onChange={(v) => onAdjustmentChange('grain', v)} onChangeEnd={onAdjustmentEnd} description="Add realistic film noise" />
            <p className="text-[12px] text-text-muted mt-5 leading-relaxed">
              Blur is applied live via CSS. Film grain is fully rendered on export for best quality.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
