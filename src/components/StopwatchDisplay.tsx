import React from 'react';
import { formatTimeComponents } from '../utils/timeFormatter';
import { StopwatchMode } from '../types';
import { Zap, Target } from 'lucide-react';

interface StopwatchDisplayProps {
  timeMs: number;
  lapTimeMs?: number;
  currentLapNumber?: number;
  mode: StopwatchMode;
  inertiaTimeMs: number;
  goalTimeMs: number;
}

export const StopwatchDisplay: React.FC<StopwatchDisplayProps> = ({
  timeMs,
  lapTimeMs = 0,
  currentLapNumber = 0,
  mode,
  inertiaTimeMs,
  goalTimeMs,
}) => {
  const mainFormatted = formatTimeComponents(timeMs);
  const lapFormatted = formatTimeComponents(lapTimeMs);

  return (
    <div className="flex flex-col items-center justify-center my-2 select-none">
      {/* MD3 Filter Chip / Badge */}
      <div
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-colors shadow-2xs border ${
          mode === 'inertia'
            ? 'bg-amber-100/90 text-amber-900 border-amber-200/90'
            : 'bg-emerald-100/90 text-emerald-950 border-emerald-200/90'
        }`}
      >
        {mode === 'inertia' ? (
          <>
            <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span className="uppercase">1. Sair da Inércia</span>
          </>
        ) : (
          <>
            <Target className="w-4 h-4 text-emerald-700 fill-emerald-600" />
            <span className="uppercase">2. Cumprir Objetivo</span>
          </>
        )}
      </div>

      {/* MD3 Display Large Time Readout */}
      <div className="flex items-baseline justify-center font-sans text-slate-900 my-1">
        <span className="text-6xl sm:text-7xl font-extralight tracking-tighter tabular-nums">
          {mainFormatted.isHoursShown
            ? `${mainFormatted.hours}:${mainFormatted.minutes}`
            : mainFormatted.minutes}
        </span>
        <span className="text-6xl sm:text-7xl font-light tracking-tighter tabular-nums text-slate-900">
          :{mainFormatted.seconds}
        </span>
        <span className="text-2xl sm:text-3xl font-normal text-slate-400 tabular-nums ml-1">
          .{mainFormatted.hundredths}
        </span>
      </div>

      {/* MD3 Tonal Surface Sub-row readout */}
      <div className="flex items-center justify-center gap-3 sm:gap-5 px-4 py-1.5 rounded-2xl bg-slate-200/60 border border-slate-300/60 text-xs font-medium text-slate-600 tabular-nums shadow-2xs">
        {/* Lap time or secondary time */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Volta:</span>
          <span className="text-slate-800 font-bold">
            {lapFormatted.minutes}:{lapFormatted.seconds}.{lapFormatted.hundredths}
          </span>
        </div>

        {/* Lap Number Badge */}
        <div className="px-2 py-0.5 rounded-full bg-slate-300/80 text-slate-900 text-xs font-bold">
          {currentLapNumber > 0 ? `#${currentLapNumber}` : '0'}
        </div>

        {/* Secondary Mode Time */}
        <div className="flex items-center gap-1 text-slate-500">
          <span>{mode === 'inertia' ? 'Objetivo:' : 'Inércia:'}</span>
          <span className="text-slate-800 font-bold">
            {mode === 'inertia'
              ? formatTimeComponents(goalTimeMs).minutes + ':' + formatTimeComponents(goalTimeMs).seconds
              : formatTimeComponents(inertiaTimeMs).minutes + ':' + formatTimeComponents(inertiaTimeMs).seconds}
          </span>
        </div>
      </div>
    </div>
  );
};

