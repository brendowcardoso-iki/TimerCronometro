import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Zap, Target, Save } from 'lucide-react';
import { DualStopwatchConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DualStopwatchConfig;
  onSaveConfig: (newConfig: DualStopwatchConfig) => void;
  sessionTitle: string;
  onChangeSessionTitle: (title: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  sessionTitle,
  onChangeSessionTitle,
}) => {
  const [localConfig, setLocalConfig] = React.useState<DualStopwatchConfig>(config);

  React.useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig(localConfig);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-slate-50 rounded-[28px] shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col"
        >
          {/* MD3 Dialog Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight">Configurações</h2>
                <p className="text-[11px] text-slate-400">Ajuste metas de tempo e preferências</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Options */}
          <div className="p-5 overflow-y-auto space-y-4 text-xs">
            {/* Session Title */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Nome da Atividade / Objetivo:
              </label>
              <input
                type="text"
                id="input-session-title"
                value={sessionTitle}
                onChange={(e) => onChangeSessionTitle(e.target.value)}
                placeholder="Ex: Ler 10 páginas, Estudar Programação..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>

            {/* Cronômetro 1: Meta da Inércia */}
            <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200/90 space-y-2">
              <div className="flex items-center gap-1.5 font-extrabold text-amber-950 text-xs uppercase tracking-wide">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>1. Meta para Sair da Inércia</span>
              </div>
              <p className="text-[11px] text-amber-800/90 font-medium">
                A regra dos 2 minutos: tempo ideal para quebrar a inércia e começar sem pressão.
              </p>
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[1, 2, 5, 10].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() =>
                      setLocalConfig({ ...localConfig, inertiaTargetMs: mins * 60000 })
                    }
                    className={`py-2 rounded-xl font-bold border transition-colors ${
                      localConfig.inertiaTargetMs === mins * 60000
                        ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                        : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/80'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* Cronômetro 2: Meta do Objetivo */}
            <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200/90 space-y-2">
              <div className="flex items-center gap-1.5 font-extrabold text-emerald-950 text-xs uppercase tracking-wide">
                <Target className="w-4 h-4 text-emerald-600 fill-emerald-500" />
                <span>2. Meta do Objetivo Principal</span>
              </div>
              <p className="text-[11px] text-emerald-800/90 font-medium">
                Tempo total planejado para a execução do seu objetivo produtivo.
              </p>
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[15, 25, 30, 50].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() =>
                      setLocalConfig({ ...localConfig, goalTargetMs: mins * 60000 })
                    }
                    className={`py-2 rounded-xl font-bold border transition-colors ${
                      localConfig.goalTargetMs === mins * 60000
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-700 border-emerald-200 hover:bg-emerald-100/80'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* MD3 Switch Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-slate-800">Efeitos Sonoros e Bipes</span>
                <input
                  type="checkbox"
                  checked={localConfig.soundEnabled}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, soundEnabled: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between border-t border-slate-100 pt-2 cursor-pointer">
                <span className="font-bold text-slate-800">Som de Tick dos Segundos</span>
                <input
                  type="checkbox"
                  checked={localConfig.tickSoundEnabled}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, tickSoundEnabled: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between border-t border-slate-100 pt-2 cursor-pointer">
                <span className="font-bold text-slate-800">Trocar de Modo Automático</span>
                <input
                  type="checkbox"
                  checked={localConfig.autoTransitionToGoal}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, autoTransitionToGoal: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-1.5 hover:bg-indigo-700 shadow-md transition-colors text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

