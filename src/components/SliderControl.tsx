import { useCallback } from 'react';

interface Props {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  onChangeEnd?: (v: number) => void;
  description?: string;
}

export default function SliderControl({
  label,
  value,
  min = -100,
  max = 100,
  step = 1,
  onChange,
  onChangeEnd,
  description,
}: Props) {
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange]
  );

  const handleUp = useCallback(() => {
    onChangeEnd?.(value);
  }, [onChangeEnd, value]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[13px] font-medium text-text-primary">{label}</label>
        <span className="text-[12px] tabular-nums text-text-secondary w-10 text-right">
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleInput}
        onMouseUp={handleUp}
        onTouchEnd={handleUp}
        className="w-full"
        aria-label={label}
      />
      {description && (
        <p className="text-[11px] text-text-muted mt-1">{description}</p>
      )}
    </div>
  );
}