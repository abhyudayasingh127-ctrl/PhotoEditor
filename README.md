# PhotoEdit Studio

A professional, fully client-side photo editing web application.

**Live demo (after enabling Pages):**  
https://abhyudayasingh127-ctrl.github.io/hotelwaliweb/

## Features

### Core
- Professional dark charcoal UI
- Real-time adjustments (Brightness, Contrast, Saturation, Exposure, Highlights, Shadows, Temperature, Tint, Hue, Fade, Vignette, Sharpness)
- 18 Filter presets with live thumbnails
- Rotate & Flip
- Undo / Redo + keyboard shortcuts
- Before / After comparison
- Zoom & Pan
- Export as JPEG / PNG / WebP
- Drag & drop upload
- 100% local processing

### Phase 1
- **Crop** – aspect ratio presets
- **Resize** – width / height with aspect lock
- **Blur** – live soft blur
- **Film Grain** – realistic noise on export

### Phase 2
- **Text tool** – multiple layers, font, size, color, stroke, bold/italic
- **Shapes** – rectangle, circle, line, arrow with fill & stroke
- Live preview + export of text & shapes

### Phase 3
- **Curves** – Shadows / Midtones / Highlights controls
- **HSL / Color** – Hue Shift, Saturation, Lightness

## Quick Start

```bash
npm install
npm run dev
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + O` | Open image |
| `Ctrl/Cmd + S` | Export |
| `Esc` | Close dialog |

## Tech Stack

React 18 + TypeScript · Vite · Tailwind CSS · Lucide · HTML Canvas

## License

MIT
