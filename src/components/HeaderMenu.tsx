import React from 'react';
import { Menu, Lock, Unlock, Volume2, VolumeX, History, Settings, Sparkles, LayoutGrid } from 'lucide-react';

interface HeaderMenuProps {
  isLocked: boolean;
  onToggleLock: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  viewMode: 'single' | 'dual';
  onToggleViewMode: () => void;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({
  isLocked,
  onToggleLock,
  soundEnabled,
  onToggleSound,
  onOpenHistory,
  onOpenSettings,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-[#f8f9ff] text-[#191c21] border-b border-slate-200/80 select-none sticky top-0 z-30">
      {/* Gemini Sparkle Branding */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-purple-600 to-amber-500 p-0.5 flex items-center justify-center shadow-xs">
          <div className="w-full h-full bg-[#f8f9ff] rounded-md flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
            Gemini Cronômetro
          </span>
          <span className="text-[10px] text-slate-500 font-bold">Inércia & Objetivo</span>
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-1.5">
        {/* Toggle Single vs Dual View */}
        <button
          type="button"
          id="btn-toggle-view-mode"
          onClick={onToggleViewMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            viewMode === 'dual'
              ? 'bg-blue-100 text-blue-800 border-blue-200'
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
          title="Alternar entre ver 1 cronômetro por vez ou 2 simultâneos"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {viewMode === 'dual' ? 'Ver 1 por vez' : 'Ver 2 Lado a Lado'}
          </span>
        </button>

        {/* Sound Toggle */}
        <button
          type="button"
          id="btn-toggle-sound"
          onClick={onToggleSound}
          className="p-2 rounded-full text-slate-700 hover:bg-slate-200/70 transition-colors"
          title={soundEnabled ? 'Som Ativado' : 'Som Desativado'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-blue-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {/* History Modal Button */}
        <button
          type="button"
          id="btn-open-history"
          onClick={onOpenHistory}
          className="p-2 rounded-full text-slate-700 hover:bg-slate-200/70 transition-colors"
          title="Histórico de Sessões"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Settings Button */}
        <button
          type="button"
          id="btn-open-settings"
          onClick={onOpenSettings}
          className="p-2 rounded-full text-slate-700 hover:bg-slate-200/70 transition-colors"
          title="Configurações"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Lock Screen Toggle */}
        <button
          type="button"
          id="btn-toggle-lock"
          onClick={onToggleLock}
          className={`p-2 rounded-full transition-all ${
            isLocked
              ? 'bg-amber-500 text-black font-bold shadow-xs'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
          title={isLocked ? 'Tela Bloqueada' : 'Bloquear Tela'}
        >
          {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};



