import {
  Image as ImageIcon,
  Github,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onLaunch: () => void;
}

const FEATURES = [
  {
    title: 'Pro Adjustments',
    desc: 'Brightness, contrast, curves, HSL, temperature, vignette and more — all live.',
  },
  {
    title: 'Filters & Effects',
    desc: '18 cinematic presets plus blur and film grain, applied instantly in your browser.',
  },
  {
    title: 'Crop & Resize',
    desc: 'Aspect ratio presets and precise resize with optional lock — export ready.',
  },
  {
    title: 'Text & Shapes',
    desc: 'Add text layers and shapes with full style control. Baked into every export.',
  },
  {
    title: '100% Private',
    desc: 'Everything runs on your device. Your photos never leave your computer.',
  },
  {
    title: 'Mobile Ready',
    desc: 'Responsive layout with a bottom toolbar so editing works great on phones too.',
  },
];

export default function LandingPage({ onLaunch }: Props) {
  return (
    <div className="h-full overflow-y-auto bg-surface-900 text-text-primary">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-surface-500/80 bg-surface-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
              P
            </div>
            <span className="text-[15px] font-semibold tracking-tight">PhotoEdit Studio</span>
          </div>
          <button
            onClick={onLaunch}
            className="rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-white transition hover:bg-accent-hover"
          >
            Open Editor
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(52,120,246,0.12),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pb-24 sm:pt-24">
          <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl sm:leading-[1.15]">
            Professional photo editing,{' '}
            <span className="text-accent">right in your browser</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary sm:text-base">
            Adjust, crop, filter, add text and shapes — then export as JPEG, PNG or WebP.
            Fast, private, and built for creators who want control without the cloud.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={onLaunch}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-accent-hover"
            >
              Start Editing
              <ArrowRight size={18} />
            </button>
            <a
              href="https://github.com/abhyudayasingh127-ctrl/PhotoEditor"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-surface-500 px-5 py-3 text-[14px] font-medium text-text-secondary transition hover:border-surface-400 hover:text-text-primary"
            >
              <Github size={18} />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features — simple list, no cards */}
      <section className="border-t border-surface-500/60">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What it does</h2>
          <p className="mt-2 max-w-lg text-[14px] text-text-secondary">
            The tools you actually use when editing a photo — nothing extra.
          </p>

          <ul className="mt-10 divide-y divide-surface-500/70">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
                <span className="w-40 shrink-0 text-[14px] font-medium text-text-primary">{f.title}</span>
                <span className="text-[14px] leading-relaxed text-text-secondary">{f.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-surface-500/60 bg-surface-800/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
          <ol className="mt-8 space-y-6">
            {[
              { step: '01', title: 'Open an image', desc: 'Drop a JPEG, PNG or WebP, or pick one from your device.' },
              { step: '02', title: 'Edit', desc: 'Adjustments, filters, crop, text and shapes — all in real time.' },
              { step: '03', title: 'Export', desc: 'Download the result. Nothing is uploaded or stored on a server.' },
            ].map((s) => (
              <li key={s.step} className="flex gap-4 sm:gap-6">
                <span className="w-8 shrink-0 text-[13px] font-medium tabular-nums text-accent">{s.step}</span>
                <div>
                  <div className="text-[15px] font-medium">{s.title}</div>
                  <p className="mt-0.5 text-[14px] text-text-secondary">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Creators */}
      <section className="border-t border-surface-500/60">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Created by</h2>
          <p className="mt-2 text-[14px] text-text-secondary">
            Built by two people who wanted a simple, private editor in the browser.
          </p>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:gap-12">
            <a
              href="https://github.com/DrPhrma"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 text-left"
            >
              <span className="text-[15px] font-medium group-hover:text-accent">DrPhrma</span>
              <span className="text-[13px] text-text-muted">GitHub ↗</span>
            </a>
            <a
              href="https://github.com/abhyudayasingh127-ctrl"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 text-left"
            >
              <span className="text-[15px] font-medium group-hover:text-accent">abhyudayasingh127-ctrl</span>
              <span className="text-[13px] text-text-muted">GitHub ↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-surface-500/60 bg-surface-800/30">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to edit?</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-text-secondary">
            Open the editor and drop an image. No account needed.
          </p>
          <button
            onClick={onLaunch}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-accent-hover"
          >
            Launch PhotoEdit Studio
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-500/60 py-6 text-center text-[12px] text-text-muted">
        <p>
          © {new Date().getFullYear()} PhotoEdit Studio · Built by{' '}
          <a href="https://github.com/DrPhrma" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent">
            DrPhrma
          </a>
          {' '}&{' '}
          <a href="https://github.com/abhyudayasingh127-ctrl" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent">
            abhyudayasingh127-ctrl
          </a>
        </p>
        <p className="mt-1">Open source · MIT License</p>
      </footer>
    </div>
  );
}
