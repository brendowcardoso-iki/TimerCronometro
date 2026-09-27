import React, { useState } from 'react';
import { Lap, AppTheme } from '../types';
import { formatFullTime } from '../utils/timeFormatter';
import { Trophy, Flame, ChevronDown, ChevronUp, History } from 'lucide-react';

interface LapListProps {
  laps: Lap[];
  theme?: AppTheme;
}

export const LapList: React.FC<LapListProps> = ({ laps, theme = 'light' }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Find fastest and slowest lap times
  let minLapTime = Infinity;
  let maxLapTime = -1;

  if (laps.length > 1) {
    laps.forEach((lap) => {
      if (lap.lapTime < minLapTime) minLapTime = lap.lapTime;
      if (lap.lapTime > maxLapTime) maxLapTime = lap.lapTime;
    });
  }

  // Theme styling helpers
  const getButtonStyles = () => {
    if (theme === 'light') return 'bg-white border-slate-200/90 text-slate-800 hover:bg-slate-50 shadow-2xs';
    if (theme === 'dark') return 'bg-neutral-900 border-neutral-800 text-neutral-100 hover:bg-neutral-800 shadow-2xs';
    if (theme === 'midnight') return 'bg-[#1c2541] border-slate-700 text-blue-50 hover:bg-[#2e3b5e] shadow-2xs';
    return 'bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800 shadow-2xs';
  };

  const getContainerStyles = () => {
    if (theme === 'light') return 'bg-white border-slate-200 divide-slate-100 text-slate-800';
    if (theme === 'dark') return 'bg-neutral-900 border-neutral-800 divide-neutral-800 text-neutral-100';
    if (theme === 'midnight') return 'bg-[#1c2541] border-slate-700 divide-slate-700/60 text-blue-50';
    return 'bg-slate-900 border-slate-700 divide-slate-800 text-slate-100';
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 my-2 select-none flex flex-col items-center">
      {/* "Registros" Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-5 py-2.5 rounded-full border text-xs font-extrabold transition-all cursor-pointer ${getButtonStyles()}`}
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 opacity-80" />
          <span>Registros</span>
          {laps.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-600 dark:text-blue-300 text-[11px] font-bold">
              {laps.length}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 opacity-70" />
        ) : (
          <ChevronDown className="w-4 h-4 opacity-70" />
        )}
      </button>

      {/* Collapsible Laps List */}
      {isOpen && (
        <div className="w-full mt-3 transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          {laps.length === 0 ? (
            <div className="w-full text-center py-4 text-xs text-slate-400 border border-dashed border-slate-400/40 rounded-2xl bg-black/5 dark:bg-white/5">
              <p className="font-semibold">Nenhuma volta registrada.</p>
            </div>
          ) : (
            <div className={`max-h-56 overflow-y-auto rounded-2xl border shadow-xs divide-y ${getContainerStyles()}`}>
              {laps.map((lap) => {
                const isFastest = laps.length > 1 && lap.lapTime === minLapTime;
                const isSlowest =
                  laps.length > 1 && lap.lapTime === maxLapTime && minLapTime !== maxLapTime;

                return (
                  <div
                    key={lap.id}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors ${
                      isFastest
                        ? 'bg-blue-500/15 font-bold'
                        : isSlowest
                        ? 'bg-slate-500/10 opacity-85'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {/* Lap Number & Mode Badge */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold tabular-nums opacity-60 w-7">
                        #{lap.lapNumber.toString().padStart(2, '0')}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-600/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                        {lap.mode === 'inertia' ? 'Inércia' : 'Desenvolvimento'}
                      </span>
                      {isFastest && (
                        <span className="flex items-center gap-0.5 text-[10px] text-blue-700 dark:text-blue-300 font-bold bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                          <Trophy className="w-3 h-3" />
                          Rápida
                        </span>
                      )}
                      {isSlowest && (
                        <span className="flex items-center gap-0.5 text-[10px] text-slate-700 dark:text-slate-300 font-bold bg-slate-500/20 px-2 py-0.5 rounded-full border border-slate-400/30">
                          <Flame className="w-3 h-3" />
                          Lenta
                        </span>
                      )}
                    </div>

                    {/* Lap Time & Total Time */}
                    <div className="flex items-center gap-3 tabular-nums">
                      <span className="font-mono font-bold text-xs sm:text-sm">
                        +{formatFullTime(lap.lapTime)}
                      </span>
                      <span className="font-mono text-[11px] sm:text-xs opacity-50 w-16 text-right">
                        {formatFullTime(lap.totalTime)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


