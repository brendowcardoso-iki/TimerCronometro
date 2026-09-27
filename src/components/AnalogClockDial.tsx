import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause } from 'lucide-react';

interface AnalogClockDialProps {
  timeMs: number;
  isRunning: boolean;
  onTogglePlayPause: () => void;
  accentColor?: string;
  modeLabel?: string;
  progressPercent?: number;
}

export const AnalogClockDial: React.FC<AnalogClockDialProps> = ({
  timeMs,
  isRunning,
  onTogglePlayPause,
  accentColor = '#6366f1',
  modeLabel,
  progressPercent,
}) => {
  // Calculate hand angles
  const secondsAngle = ((timeMs % 60000) / 60000) * 360;
  const minutesAngle = ((timeMs % 3600000) / 3600000) * 360;

  // Numbers around the dial (60, 5, 10, ... 55)
  const dialNumbers = [60, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <div className="relative flex items-center justify-center my-2 sm:my-3 select-none touch-none">
      {/* MD3 Surface Container Elevated Dial Outer Ring */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-88 md:h-88 rounded-full flex items-center justify-center bg-slate-200/70 shadow-[0_10px_30px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(255,255,255,0.9)] border border-slate-300/80 p-4">
        
        {/* SVG Ticks & Outer MD3 Active Arc Ring */}
        <svg className="absolute inset-0 w-full h-full p-2 pointer-events-none" viewBox="0 0 300 300">
          {/* Target progress arc */}
          {progressPercent !== undefined && (
            <circle
              cx="150"
              cy="150"
              r="138"
              fill="none"
              stroke={accentColor}
              strokeWidth="4"
              strokeDasharray={`${(progressPercent / 100) * 867} 867`}
              strokeLinecap="round"
              className="transition-all duration-300 opacity-80 transform -rotate-90 origin-center"
            />
          )}

          {/* 60 Tick Marks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const isMajor = i % 5 === 0;
            const angle = i * 6;
            const length = isMajor ? 12 : 6;
            const strokeWidth = isMajor ? 2.5 : 1.2;
            const color = isMajor ? '#1e293b' : '#94a3b8';

            return (
              <line
                key={i}
                x1="150"
                y1={150 - 136}
                x2="150"
                y2={150 - 136 + length}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                transform={`rotate(${angle} 150 150)`}
              />
            );
          })}
        </svg>

        {/* Dial Numbers: 60, 5, 10, ... 55 */}
        <div className="absolute inset-0 pointer-events-none p-3 sm:p-4">
          {dialNumbers.map((num, idx) => {
            const angleDeg = idx * 30;
            const angleRad = ((angleDeg - 90) * Math.PI) / 180;
            const radiusPercent = 38;
            const x = 50 + radiusPercent * Math.cos(angleRad);
            const y = 50 + radiusPercent * Math.sin(angleRad);

            return (
              <span
                key={num}
                className="absolute text-xs sm:text-sm font-bold font-sans transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  color: num === 60 ? '#0f172a' : '#64748b',
                }}
              >
                {num}
              </span>
            );
          })}
        </div>

        {/* Minute Hand Pointer */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ transform: `rotate(${minutesAngle}deg)` }}
        >
          <div className="w-1 h-20 sm:h-22 bg-slate-400 rounded-full origin-bottom transform -translate-y-1/2 opacity-75 shadow-xs" />
        </div>

        {/* Second Hand Pointer (Signature teardrop cap + needle stem) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          style={{ transform: `rotate(${secondsAngle}deg)` }}
        >
          <div className="flex flex-col items-center origin-bottom transform -translate-y-full">
            <div
              className="w-3.5 h-6 rounded-t-full shadow-md transition-colors"
              style={{ backgroundColor: isRunning ? '#0f172a' : '#475569' }}
            />
            <div
              className="w-1.5 h-20 sm:h-22 shadow-xs"
              style={{ backgroundColor: isRunning ? '#0f172a' : '#475569' }}
            />
          </div>
        </div>

        {/* MD3 Central Floating Action Hub (Multi-layered Elevated Button Container) */}
        <div className="relative z-30 w-36 h-36 sm:w-42 sm:h-42 md:w-44 md:h-44 rounded-full bg-slate-100 p-2 shadow-[0_8px_24px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] flex items-center justify-center border border-slate-300">
          
          {/* Inner Surface Ring */}
          <div className="w-full h-full rounded-full bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center relative p-2 shadow-inner">
            
            {/* MD3 Large Center Action Button */}
            <motion.button
              type="button"
              id="btn-play-pause-dial"
              onClick={onTogglePlayPause}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 ${
                isRunning
                  ? 'bg-amber-400 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)] border border-amber-300'
                  : 'bg-indigo-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.35)] hover:bg-indigo-700 border border-indigo-500'
              }`}
              title={isRunning ? 'Pausar' : 'Iniciar'}
            >
              {isRunning ? (
                <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-current" strokeWidth={1.5} />
              ) : (
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" strokeWidth={1.5} />
              )}
            </motion.button>

            {/* Mode Tag */}
            {modeLabel && (
              <span className="absolute bottom-1.5 text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                {modeLabel}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

