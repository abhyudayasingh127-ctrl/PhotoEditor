# PhotoEdit Studio

A professional, fully client-side photo editing web application.

**Live demo (GitHub Pages):**  
https://abhyudayasingh127-ctrl.github.io/PhotoEditor/

> **Important:** Pages must use **GitHub Actions** as the source  
> (Repo → Settings → Pages → Build and deployment → Source: **GitHub Actions**).

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
- **Curves** – Shadows / Midtones / Highlights
- **HSL / Color** – Hue Shift, Saturation, Lightness

### Mobile
- Bottom toolbar on phones
- Full-width controls panel
- Larger touch targets

## Run locally (recommended to see changes immediately)

```bash
git clone https://github.com/abhyudayasingh127-ctrl/PhotoEditor.git
cd PhotoEditor
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Deploy to GitHub Pages

1. Repo → **Settings → Pages**
2. **Source** = **GitHub Actions**
3. Push to `main` (or run the workflow manually from the **Actions** tab)
4. After ~1–2 minutes open:  
   https://abhyudayasingh127-ctrl.github.io/PhotoEditor/

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
