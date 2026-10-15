import {
  Undo2,
  Redo2,
  Download,
  Settings,
  Image as ImageIcon,
  Keyboard,
} from 'lucide-react';

interface Props {
  canUndo: boolean;
  canRedo: boolean;
  hasImage: boolean;
  isDirty: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  activeSection: string;
  onSectionChange: (s: string) => void;
}

export default function TopToolbar({
  canUndo,
  canRedo,
  hasImage,
  isDirty,
  onUndo,
  onRedo,
  onExport,
  activeSection,
  onSectionChange,
}: Props) {
  const sections = ['Edit', 'Filters', 'Effects'];

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-surface-800 border-b border-surface-500 select-none">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <ImageIcon size={16} className="text-white" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight hidden sm:block">
            PhotoEdit Studio
          </span>
        </div>
        {isDirty && (
          <span className="text-[11px] text-amber-400/90 font-medium">• Unsaved</span>
        )}
      </div>

      {/* Center sections */}
      <nav className="flex items-center gap-1">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => onSectionChange(s.toLowerCase())}
            className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
              activeSection === s.toLowerCase()
                ? 'bg-accent/20 text-accent'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-600'
            }`}
          >
            {s}
          </button>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 min-w-[200px] justify-end">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
          className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Redo2 size={18} />
        </button>

        <div className="w-px h-5 bg-surface-500 mx-1" />

        <button
          onClick={onExport}
          disabled={!hasImage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent hover:bg-accent-hover text-white text-[13px] font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={15} />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          title="Keyboard shortcuts"
          className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-600 transition-colors hidden md:flex"
        >
          <Keyboard size={17} />
        </button>
        <button
          title="Settings"
          className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-600 transition-colors"
        >
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
}