# PhotoEdit Studio

A professional, fully client-side photo editing web application.

## Features

- **Professional dark UI** inspired by desktop photo editors
- **Real-time adjustments**: Brightness, Contrast, Saturation, Exposure, Highlights, Shadows, Temperature, Tint, Hue, Fade, Vignette, Sharpness
- **18 Filter presets** with live thumbnails generated from your image
- **Rotate** (90°) and **Flip** horizontal / vertical
- **Undo / Redo** history with keyboard shortcuts
- **Before / After** comparison
- **Zoom & Pan** (25% – 200%)
- **Export** as JPEG, PNG, or WebP with quality control
- **Drag & drop** + file picker upload
- **Fully responsive** layout
- **100% local** – no images leave your browser

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide icons
- HTML Canvas for export

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
```

The `dist/` folder can be deployed to GitHub Pages, Netlify, Vercel, or any static host.

### GitHub Pages

1. Go to repo **Settings → Pages**
2. Source: Deploy from branch `main` / folder `/docs` or use GitHub Actions
3. Or simply push the `dist` contents after build

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + O` | Open image |
| `Ctrl/Cmd + S` | Export |
| `Esc` | Close dialog / exit compare |

## Limitations (current version)

- Advanced pixel-level effects (true Gaussian blur, film grain) are placeholders
- Crop tool UI is present but full interactive crop rectangle will be enhanced next
- Text / Shapes layers coming in a future update
- No persistent project save yet (session only)

## License

MIT
