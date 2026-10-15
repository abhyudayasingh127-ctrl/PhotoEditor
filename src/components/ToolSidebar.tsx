import {
  SlidersHorizontal,
  Crop,
  RotateCw,
  FlipHorizontal2,
  FlipVertical2,
  Maximize2,
  Aperture,
  Sparkles,
  Focus,
  SunMedium,
  Palette,
  Type,
  Square,
  Columns2,
  RotateCcw,
  Info,
  Upload,
} from 'lucide-react';
import { ToolId } from '../types';

interface Props {
  activeTool: ToolId;
  onToolChange: (tool: ToolId) => void;
  onUploadClick: () => void;
  hasImage: boolean;
}

const TOOL_GROUPS = [
  {
    title: 'Basic',
    tools: [
      { id: 'adjust' as ToolId, label: 'Adjust', icon: forSliders },
      { id: 'crop' as ToolId, label: 'Crop', icon: Crop },
      { id: 'rotate' as ToolId, label: 'Rotate', icon: RotateCw },
      { id: 'flipH' as ToolId, label: 'Flip H', icon: FlipHorizontal2 },
      { id: 'flipV' as ToolId, label: 'Flip V', icon: FlipVertical2 },
      { id: 'resize' as ToolId, label: 'Resize', icon: Maximize2 },
    ],
  },
  {
    title: 'Enhance',
    tools: [
      { id: 'filters' as ToolId, label: 'Filters', icon: Aperture },
      { id: 'effects' as ToolId, label: 'Effects', icon: Sparkles },
      { id: 'blur' as ToolId, label: 'Blur', icon: Focus },
      { id: 'sharpen' as ToolId, label: 'Sharpen', icon: SunMedium },
      { id: 'vignette' as ToolId, label: 'Vignette', icon: Aperture },
      { id: 'color' as ToolId, label: 'Color', icon: Palette },
    ],
  },
  {
    title: 'Creative',
    tools: [
      { id: 'text' as ToolId, label: 'Text', icon: Type },
      { id: 'shapes' as ToolId, label: 'Shapes', icon: Square },
    ],
  },
  {
    title: 'View',
    tools: [
      { id: 'compare' as ToolId, label: 'Before/After', icon: Columns2 },
      { id: 'reset' as ToolId, label: 'Reset', icon: RotateCcw },
      { id: 'info' as ToolId, label: 'Info', icon: Info },
    ],
  },
];

// Fix accidental rename
function forSliders(props: any) {
  return <SlidersHorizontal {...props} />;
}

const MOBILE_TOOLS: { id: ToolId; label: string; icon: any }[] = [
  { id: 'adjust', label: 'Adjust', icon: SlidersHorizontal },
  { id: 'crop', label: 'Crop', icon: Crop },
  { id: 'filters', label: 'Filters', icon: Aperture },
  { id: 'effects', label: 'Effects', icon: Sparkles },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'shapes', label: 'Shapes', icon: Square },
  { id: 'rotate', label: 'Rotate', icon: RotateCw },
  { id: 'compare', label: 'Compare', icon: Columns2 },
];

export default function ToolSidebar({
  activeTool,
  onToolChange,
  onUploadClick,
  hasImage,
}: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] lg:w-[240px] shrink-0 bg-surface-800 border-r border-surface-500 flex-col overflow-hidden">
        <div className="p-3 border-b border-surface-500">
          <button
            onClick={onUploadClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-[13px] font-medium transition-colors"
          >
            <Upload size={16} />
            Upload Image
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {TOOL_GROUPS.map((group) => (
            <div key={group.title} className="mb-3">
              <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                {group.title}
              </div>
              <div className="space-y-0.5 px-1.5">
                {group.tools.map((tool) => {
                  const Icon = tool.icon === forSliders ? SlidersHorizontal : tool.icon;
                  const isActive = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => onToolChange(tool.id)}
                      disabled={!hasImage && tool.id !== 'adjust'}
                      className={`tool-btn w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] ${
                        isActive
                          ? 'bg-accent/15 text-accent border border-accent/30'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-600 border border-transparent'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      <Icon size={16} strokeWidth={1.75} />
                      {tool.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile bottom toolbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-800 border-t border-surface-500 safe-bottom">
        <div className="flex items-center overflow-x-auto gap-1 px-2 py-2">
          <button
            onClick={onUploadClick}
            className="shrink-0 flex flex-col items-center justify-center w-14 h-12 rounded-md bg-accent text-white text-[10px] font-medium"
          >
            <Upload size={18} />
            <span className="mt-0.5">Upload</span>
          </button>

          {MOBILE_TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                disabled={!hasImage && tool.id !== 'adjust'}
                className={`shrink-0 flex flex-col items-center justify-center w-14 h-12 rounded-md text-[10px] ${
                  isActive
                    ? 'bg-accent/20 text-accent'
                    : 'text-text-secondary'
                } disabled:opacity-40`}
              >
                <Icon size={18} strokeWidth={1.75} />
                <span className="mt-0.5 truncate max-w-[52px]">{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
