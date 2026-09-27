import React from 'react';
import { motion } from 'motion/react';
import { StopwatchMode, AppTheme } from '../types';
import { formatTimeComponents } from '../utils/timeFormatter';

interface GeminiStopwatchCardProps {
  mode: StopwatchMode;
  title: string;
  subtitle: string;
  timeMs: number;
  targetMs: number;
  otherTimeMs: number;
  isRunning: boolean;
  onTogglePlayPause: () => void;
  onLap: () => void;
  onReset: () => void;
  onSwitchMode: () => void;
  isActive: boolean;
  lapsCount: number;
  theme?: AppTheme;
}

export const GeminiStopwatchCard: React.FC<GeminiStopwatchCardProps> = ({
  mode,
  timeMs,
  isRunning,
  onTogglePlayPause,
  onLap,
  onReset,
  theme = 'light',
}) => {
  const formatted = formatTimeComponents(timeMs);
  const isZero = timeMs === 0;

  // Format digital time as 00:00,00
  const minutesStr = formatted.minutes;
  const secondsStr = formatted.seconds;
  const hundredthsStr = formatted.hundredths;

  // Dynamic Button Styles based on Theme (Black, White, Gray, Blue)
  const getLeftButtonClasses = () => {
    if (isZero && !isRunning) {
      if (theme === 'light') return 'bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed';
      if (theme === 'dark') return 'bg-neutral-900/60 text-neutral-600 border border-neutral-800/60 cursor-not-allowed';
      if (theme === 'midnight') return 'bg-[#1c2541]/40 text-slate-500 border border-slate-800/60 cursor-not-allowed';
      return 'bg-slate-800/40 text-slate-500 border border-slate-700/50 cursor-not-allowed';
    }

    if (theme === 'light') return 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-300 cursor-pointer shadow-xs';
    if (theme === 'dark') return 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700 cursor-pointer shadow-xs';
    if (theme === 'midnight') return 'bg-[#1c2541] text-white hover:bg-[#2e3b5e] border border-slate-700 cursor-pointer shadow-xs';
    return 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 cursor-pointer shadow-xs';
  };

  const getRightButtonClasses = () => {
    if (isRunning) {
      // "Parar" button
      if (theme === 'light') return 'bg-slate-900 text-white hover:bg-black shadow-md cursor-pointer';
      if (theme === 'dark') return 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700 shadow-md cursor-pointer';
      if (theme === 'midnight') return 'bg-[#1c2541] text-blue-100 hover:bg-[#2e3b5e] border border-slate-600 shadow-md cursor-pointer';
      return 'bg-slate-950 text-white hover:bg-black border border-slate-700 shadow-md cursor-pointer';
    }

    // "Iniciar" / "Retomar" button (Primary Blue Action)
    return 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg cursor-pointer';
  };

  const getTextColor = () => {
    if (theme === 'light') return 'text-slate-900';
    if (theme === 'midnight') return 'text-blue-50';
    return 'text-white';
  };

  return (
    <div className="relative flex flex-col items-center justify-between py-2 px-2 select-none w-full flex-1 min-h-[360px]">
      {/* Main Digital Time Display */}
      <div className="my-auto py-4 text-center flex flex-col items-center justify-center w-full">
        <div className={`flex items-baseline justify-center font-sans tracking-tight ${getTextColor()} text-5xl sm:text-6xl md:text-7xl font-semibold leading-none`}>
          <span>{minutesStr}</span>
          <span>:</span>
          <span>{secondsStr}</span>
          <span className="text-4xl sm:text-5xl md:text-6xl">,{hundredthsStr}</span>
        </div>

        {/* Motivational Action Text when running in Inertia mode (Plain blue text, no box/checkbox) */}
        {isRunning && mode === 'inertia' && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-blue-500 font-extrabold text-xs sm:text-sm text-center leading-tight max-w-md px-4 select-none tracking-wide"
          >
            Use a apelância de fazer a ação até vencer a inércia
          </motion.p>
        )}
      </div>

      {/* Bottom Circular Controls */}
      <div className="w-full flex items-center justify-between max-w-sm sm:max-w-md mx-auto pt-6 px-2 sm:px-6">
        {/* Left Button: "Volta" OR "Restaurar" */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            if (!isRunning && !isZero) {
              onReset();
            } else if (isRunning) {
              onLap();
            }
          }}
          disabled={isZero && !isRunning}
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full font-extrabold text-sm sm:text-base transition-all flex items-center justify-center text-center ${getLeftButtonClasses()}`}
        >
          {!isRunning && !isZero ? 'Restaurar' : 'Volta'}
        </motion.button>

        {/* Right Button: "Iniciar" OR "Parar" OR "Retomar" */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={onTogglePlayPause}
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full font-extrabold text-sm sm:text-base transition-all flex items-center justify-center text-center ${getRightButtonClasses()}`}
        >
          {isRunning ? 'Parar' : isZero ? 'Iniciar' : 'Retomar'}
        </motion.button>
      </div>
    </div>
  );
};

