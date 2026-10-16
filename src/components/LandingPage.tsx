import {
  Sparkles,
  Shield,
  Zap,
  Image as ImageIcon,
  Type,
  Crop,
  Palette,
  Smartphone,
  Github,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onLaunch: () => void;
}

const FEATURES = [
  {
    icon: Palette,
    title: 'Pro Adjustments',
    desc: 'Brightness, contrast, curves, HSL, temperature, vignette and more — all live.',
  },
  {
    icon: Sparkles,
    title: 'Filters & Effects',
    desc: '18 cinematic presets plus blur and film grain, applied instantly in your browser.',
  },
  {
    icon: Crop,
    title: 'Crop & Resize',
    desc: 'Aspect ratio presets and precise resize with optional lock — export ready.',
  },
  {
    icon: Type,
    title: 'Text & Shapes',
    desc: 'Add text layers and shapes with full style control. Baked into every export.',
  },
  {
    icon: Shield,
    title: '100% Private',
    desc: 'Everything runs on your device. Your photos never leave your computer.',
  },
  {
    icon: Smartphone,
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(52,120,246,0.15),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pb-24 sm:pt-24">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[12px] text-accent">
            <Zap size={14} />
            Fully client-side · No uploads · Free
          </div>
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
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-[14px] font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-hover"
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

      {/* Features */}
      <section className="border-t border-surface-500/60 bg-surface-800/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Everything you need</h2>
            <p className="mt-2 text-[14px] text-text-secondary">
              A focused toolkit for everyday edits and creative work.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-surface-500 bg-surface-800/80 p-5 transition hover:border-accent/40"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-[15px] font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-surface-500/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: '1', title: 'Upload', desc: 'Drop a JPEG, PNG or WebP — or pick from your device.' },
              { step: '2', title: 'Edit', desc: 'Use adjustments, filters, crop, text and shapes in real time.' },
              { step: '3', title: 'Export', desc: 'Download your image. Nothing is stored on any server.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-lg font-bold text-accent">
                  {s.step}
                </div>
                <h3 className="text-[15px] font-semibold">{s.title}</h3>
                <p className="mt-1 text-[13px] text-text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creators */}
      <section className="border-t border-surface-500/60 bg-surface-800/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Created by</h2>
            <p className="mt-2 text-[14px] text-text-secondary">
              Built together for a fast, private photo editor anyone can use.
            </p>
          </div>
          <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
            <a
              href="https://github.com/DrPhrma"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-surface-500 bg-surface-800 p-5 transition hover:border-accent/50"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/20 text-lg font-bold text-accent">
                DP
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[15px] font-semibold group-hover:text-accent">DrPhrma</div>
                <div className="text-[13px] text-text-secondary">@DrPhrma · GitHub</div>
              </div>
              <Github size={18} className="ml-auto shrink-0 text-text-muted group-hover:text-accent" />
            </a>
            <a
              href="https://github.com/abhyudayasingh127-ctrl"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-surface-500 bg-surface-800 p-5 transition hover:border-accent/50"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/20 text-lg font-bold text-accent">
                AS
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[15px] font-semibold group-hover:text-accent">abhyudayasingh127-ctrl</div>
                <div className="text-[13px] text-text-secondary">@abhyudayasingh127-ctrl · GitHub</div>
              </div>
              <Github size={18} className="ml-auto shrink-0 text-text-muted group-hover:text-accent" />
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-surface-500/60">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <ImageIcon size={28} />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to edit?</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-text-secondary">
            No account. No upload. Just open the editor and drop an image.
          </p>
          <button
            onClick={onLaunch}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-[14px] font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-hover"
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
