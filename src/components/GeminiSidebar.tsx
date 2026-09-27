import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Target, Menu, Sparkles } from 'lucide-react';
import { StopwatchMode } from '../types';

interface GeminiSidebarProps {
  activeMode: StopwatchMode;
  onSelectMode: (mode: StopwatchMode) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const GeminiSidebar: React.FC<GeminiSidebarProps> = ({
  activeMode,
  onSelectMode,
  isOpenMobile,
  onCloseMobile,
}) => {
  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#f8f9ff] text-[#191c21] border-r border-slate-200/80 w-64 sm:w-72 select-none font-sans">
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-amber-500 p-0.5 shadow-xs flex items-center justify-center">
            <div className="w-full h-full bg-[#f8f9ff] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600 fill-blue-600" />
            </div>
          </div>
          <h1 className="font-extrabold text-sm tracking-tight text-slate-900">
            Cronômetro de objetivos
          </h1>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Main Options List: 2 options (Inércia and Objetivo) */}
      <div className="flex-1 p-3 space-y-2">
        {/* Option 1: Inércia */}
        <button
          type="button"
          onClick={() => {
            onSelectMode('inertia');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all border text-left ${
            activeMode === 'inertia'
              ? 'bg-amber-500/15 border-amber-400 text-amber-950 font-bold shadow-2xs'
              : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              activeMode === 'inertia'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="text-sm font-extrabold block">Inércia</span>
          </div>
        </button>

        {/* Option 2: Objetivo */}
        <button
          type="button"
          onClick={() => {
            onSelectMode('goal');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all border text-left ${
            activeMode === 'goal'
              ? 'bg-emerald-500/15 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
              : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              activeMode === 'goal'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <Target className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="text-sm font-extrabold block">Objetivo</span>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 h-full"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

