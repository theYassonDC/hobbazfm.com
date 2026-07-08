import type { ChangeEventHandler } from "react";

interface VolumeSliderProps {
  volume: number; // 0 a 1
  onChange: (vol: any) => void;
}

export default function VolumeSlider({ volume, onChange }: VolumeSliderProps) {
  const pct = `${Math.round(volume * 100)}%`;

  return (
    <div className="flex items-center gap-3 w-48">
      <i className={`text-white/60 hover:text-white transition-colors text-lg ${
        volume === 0 ? "ti ti-volume-off" : "ti ti-volume"
      }`} />

      {/* Track container */}
      <div className="group relative flex-1 h-1 cursor-pointer">

        {/* Track fondo */}
        <div className="absolute inset-0 bg-white/30 rounded-full overflow-hidden">
          {/* Fill */}
          <div
            className="h-full bg-white rounded-full group-hover:bg-purple-500 transition-colors duration-150"
            style={{ width: pct }}
          />
        </div>

        {/* Thumb — solo visible en hover */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10"
          style={{ left: pct }}
        />

        {/* Input invisible encima de todo */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Volumen"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
      </div>

      <span className="text-white/50 text-xs w-7 text-right tabular-nums">
        {Math.round(volume * 100)}
      </span>
    </div>
  );
}