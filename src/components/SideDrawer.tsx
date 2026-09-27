import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Target, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (inertiaMins: number, goalMins: number, title: string) => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
}) => {
  if (!isOpen) return null;

  const presets = [
    {
      title: 'Regra dos 2 Minutos',
      desc: 'Ideal para vencer o bloqueio inicial em tarefas acumuladas',
      inertia: 2,
      goal: 25,
      icon: Zap,
    },
    {
      title: 'Foco Profundo (Pomodoro)',
      desc: '5 min de aquecimento + 50 min de trabalho concentrado',
      inertia: 5,
      goal: 50,
      icon: Target,
    },
    {
      title: 'Treino & Movimento',
      desc: '1 min para começar + 30 min de exercícios',
      inertia: 1,
      goal: 30,
      icon: Sparkles,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* MD3 Standard Navigation Drawer Panel */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative z-10 w-84 max-w-[85vw] bg-slate-50 h-full shadow-2xl flex flex-col border-r border-slate-200 rounded-r-[28px] overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight">Método Duplo</h2>
                <p className="text-[11px] text-slate-400">Guia & Modos Rápidos</p>
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

          {/* Drawer Content */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
            {/* Concept Explanation Card */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Como funciona o Método?
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                A maior dificuldade na produtividade não é executar a tarefa, mas <strong>vencer a inércia inicial</strong>.
              </p>
              <ul className="space-y-2 text-slate-700 pt-1 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>1º Cronômetro:</strong> Quebra a resistência inicial com uma meta curta (1-5 min) sem cobrança de desempenho.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>2º Cronômetro:</strong> Entra em ação para cumprir o objetivo assim que o movimento for estabelecido.</span>
                </li>
              </ul>
            </div>

            {/* Presets List */}
            <div>
              <h4 className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] mb-2 px-1">
                Modos Recomendados:
              </h4>
              <div className="space-y-2">
                {presets.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => {
                        onApplyPreset(p.inertia, p.goal, p.title);
                        onClose();
                      }}
                      className="w-full text-left p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-100/80 transition-all shadow-2xs group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 group-hover:text-indigo-600">
                          {p.title}
                        </span>
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2 font-medium">{p.desc}</p>
                      <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                          Inércia: {p.inertia}m
                        </span>
                        <span className="bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Objetivo: {p.goal}m
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="p-3.5 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500 font-bold">
            Material Design 3 • Cronômetro de Inércia e Objetivo
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

