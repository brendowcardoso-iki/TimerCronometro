import React from 'react';
import { motion } from 'motion/react';
import { Flag, RotateCcw, Play, Pause, ChevronRight } from 'lucide-react';
import { StopwatchMode } from '../types';

interface ControlBarProps {
  isRunning: boolean;
  onTogglePlayPause: () => void;
  onLap: () => void;
  onReset: () => void;
  onSwitchMode: () => void;
  mode: StopwatchMode;
  canLap: boolean;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isRunning,
  onTogglePlayPause,
  onLap,
  onReset,
  onSwitchMode,
  mode,
  canLap,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto px-4 mt-2 mb-4 select-none">
      {/* MD3 Bottom Floating App Bar */}
      <div className="relative flex items-center justify-between bg-slate-900 text-white rounded-3xl shadow-xl p-2.5 border border-slate-800">
        
        {/* Left Action: MD3 Filled Tonal Button (Flag / Lap) */}
        <motion.button
          type="button"
          id="btn-lap"
          onClick={onLap}
          disabled={!canLap}
          whileTap={{ scale: 0.92 }}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-150 ${
            canLap
              ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 active:bg-slate-600'
              : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
          }`}
          title="Gravar Volta"
        >
          <Flag className="w-5 h-5 fill-current" />
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Volta</span>
        </motion.button>

        {/* Center: MD3 Extended FAB for Play / Pause */}
        <motion.button
          type="button"
          id="btn-center-toggle"
          onClick={onTogglePlayPause}
          whileTap={{ scale: 0.94 }}
          className={`px-7 py-3.5 rounded-2xl flex items-center gap-2.5 font-bold text-sm tracking-wide shadow-md transition-all ${
            isRunning
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>PAUSAR</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>INICIAR</span>
            </>
          )}
        </motion.button>

        {/* Right Action: MD3 Filled Tonal Button (Reset / Zerar) */}
        <motion.button
          type="button"
          id="btn-reset"
          onClick={onReset}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all duration-150 active:bg-slate-600"
          title="Zerar / Reiniciar"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Zerar</span>
        </motion.button>
      </div>

      {/* MD3 Text Switch Button Row */}
      <div className="flex items-center justify-between mt-3 px-2">
        <button
          type="button"
          id="btn-switch-mode"
          onClick={onSwitchMode}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-200/80 bg-slate-200/40 border border-slate-300/60"
        >
          <span>Mudar p/:</span>
          <span className="text-indigo-600 font-extrabold">
            {mode === 'inertia' ? '2. Cumprir Objetivo' : '1. Sair da Inércia'}
          </span>
          <ChevronRight className="w-4 h-4 text-indigo-600" />
        </button>

        <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
          {mode === 'inertia' ? 'Impulso Inicial' : 'Foco em Objetivo'}
        </span>
      </div>
    </div>
  );
};

