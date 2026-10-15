# PhotoEdit Studio

A professional, fully client-side photo editing web application.

**Live demo (after enabling Pages):**  
https://abhyudayasingh127-ctrl.github.io/hotelwaliweb/

## Features

- Professional dark charcoal UI
- Real-time adjustments (Brightness, Contrast, Saturation, Exposure, Highlights, Shadows, Temperature, Tint, Hue, Fade, Vignette, Sharpness)
- 18 Filter presets with live thumbnails from your image
- Rotate & Flip
- Undo / Redo + keyboard shortcuts
- Before / After comparison
- Zoom & Pan
- Export as JPEG / PNG / WebP
- Drag & drop upload
- 100% local processing (privacy first)

## Quick Start (Local)

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to GitHub Pages

1. Go to your repo → **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically build and deploy every time you push to `main`
4. Wait 1–2 minutes, then open:  
   https://abhyudayasingh127-ctrl.github.io/hotelwaliweb/

You can also trigger it manually from the **Actions** tab.

## Build for production

```bash
npm run build
```

Output goes to the `dist/` folder.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + O` | Open image |
| `Ctrl/Cmd + S` | Export |
| `Esc` | Close dialog / exit compare |

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide icons
- HTML Canvas

## License

MIT
