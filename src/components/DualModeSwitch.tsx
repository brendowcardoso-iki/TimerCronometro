import React from 'react';
import { motion } from 'motion/react';
import { Zap, Target, ArrowRight, CheckCircle2 } from 'lucide-react';
import { StopwatchMode } from '../types';
import { formatMainDisplay } from '../utils/timeFormatter';

interface DualModeSwitchProps {
  activeMode: StopwatchMode;
  onSelectMode: (mode: StopwatchMode) => void;
  inertiaTimeMs: number;
  goalTimeMs: number;
  inertiaTargetMs: number;
  goalTargetMs: number;
  isAutoTransitionEnabled: boolean;
  onToggleAutoTransition: () => void;
  onEngageGoalNow: () => void;
  inertiaCompleted: boolean;
}

export const DualModeSwitch: React.FC<DualModeSwitchProps> = ({
  activeMode,
  onSelectMode,
  inertiaTimeMs,
  goalTimeMs,
  inertiaTargetMs,
  goalTargetMs,
  isAutoTransitionEnabled,
  onToggleAutoTransition,
  onEngageGoalNow,
  inertiaCompleted,
}) => {
  const inertiaProgress = Math.min(100, Math.floor((inertiaTimeMs / inertiaTargetMs) * 100));
  const goalProgress = goalTargetMs > 0 ? Math.min(100, Math.floor((goalTimeMs / goalTargetMs) * 100)) : 0;

  return (
    <div className="w-full max-w-lg mx-auto px-4 my-2 select-none">
      {/* MD3 Connected Segmented Card Container */}
      <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1.5 rounded-3xl border border-slate-300/80 shadow-xs">
        {/* Tab 1: Sair da Inércia */}
        <button
          type="button"
          id="tab-inertia"
          onClick={() => onSelectMode('inertia')}
          className={`relative flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl transition-all duration-200 text-left ${
            activeMode === 'inertia'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 font-medium'
          }`}
        >
          <div className="flex items-center gap-1.5 w-full justify-center">
            <Zap className={`w-4 h-4 ${activeMode === 'inertia' ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span className="text-xs font-bold tracking-tight">1. Inércia</span>
            {inertiaCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
          </div>
          <span className="text-xl font-black tabular-nums mt-0.5 text-amber-600">
            {formatMainDisplay(inertiaTimeMs)}
          </span>
          {/* MD3 Linear Progress Track */}
          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${inertiaProgress}%` }}
            />
          </div>
        </button>

        {/* Tab 2: Cumprir Objetivo */}
        <button
          type="button"
          id="tab-goal"
          onClick={() => onSelectMode('goal')}
          className={`relative flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl transition-all duration-200 text-left ${
            activeMode === 'goal'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 font-medium'
          }`}
        >
          <div className="flex items-center gap-1.5 w-full justify-center">
            <Target className={`w-4 h-4 ${activeMode === 'goal' ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'}`} />
            <span className="text-xs font-bold tracking-tight">2. Objetivo</span>
          </div>
          <span className="text-xl font-black tabular-nums mt-0.5 text-emerald-600">
            {formatMainDisplay(goalTimeMs)}
          </span>
          {/* MD3 Linear Progress Track */}
          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </button>
      </div>

      {/* MD3 Assist Banner when in Inertia mode */}
      {activeMode === 'inertia' && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-between text-xs text-amber-950 shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-200/80 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-amber-800 fill-amber-700" />
            </div>
            <div>
              <p className="font-bold">Meta de Impulso: {inertiaTargetMs / 60000} min</p>
              <p className="text-[11px] text-amber-800/90">Apenas vença a resistência e comece a agir!</p>
            </div>
          </div>

          <button
            type="button"
            id="btn-engage-goal"
            onClick={onEngageGoalNow}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs transition-colors shrink-0 text-xs"
          >
            <span>Ir p/ Objetivo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* MD3 Switch / Checkbox Row */}
      <div className="flex items-center justify-between mt-2 px-2 text-[11px] text-slate-600 font-semibold">
        <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
          <input
            type="checkbox"
            id="chk-auto-transition"
            checked={isAutoTransitionEnabled}
            onChange={onToggleAutoTransition}
            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
          />
          <span>Mudar p/ Objetivo automaticamente ({inertiaTargetMs / 60000}m)</span>
        </label>
      </div>
    </div>
  );
};

