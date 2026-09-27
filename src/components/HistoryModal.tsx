import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Zap, Target, Trash2, Calendar, Clock } from 'lucide-react';
import { SessionRecord } from '../types';
import { formatMainDisplay } from '../utils/timeFormatter';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SessionRecord[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const totalInertiaMs = history.reduce((acc, item) => acc + item.inertiaTimeMs, 0);
  const totalGoalMs = history.reduce((acc, item) => acc + item.goalTimeMs, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-slate-50 rounded-[28px] shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* MD3 Dialog Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Trophy className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight">Histórico de Conquistas</h2>
                <p className="text-[11px] text-slate-400">Registros das suas sessões de foco</p>
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

          {/* MD3 Tonal Summary Cards */}
          <div className="grid grid-cols-3 gap-2.5 p-4 bg-slate-200/60 border-b border-slate-300/60 text-center text-xs">
            <div className="p-2.5 bg-white rounded-2xl shadow-2xs border border-slate-200/80">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Sessões</span>
              <span className="text-xl font-black text-slate-900">{history.length}</span>
            </div>
            <div className="p-2.5 bg-white rounded-2xl shadow-2xs border border-slate-200/80">
              <span className="text-[10px] text-amber-700 uppercase font-bold block">Sair da Inércia</span>
              <span className="text-sm font-black text-amber-600">{formatMainDisplay(totalInertiaMs)}</span>
            </div>
            <div className="p-2.5 bg-white rounded-2xl shadow-2xs border border-slate-200/80">
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">Objetivos</span>
              <span className="text-sm font-black text-emerald-600">{formatMainDisplay(totalGoalMs)}</span>
            </div>
          </div>

          {/* History List */}
          <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <Clock className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-600">Nenhum histórico encontrado</p>
                <p className="text-slate-400 mt-1">Conclua ou resete um cronômetro para arquivar sua sessão!</p>
              </div>
            ) : (
              history.map((record) => (
                <div
                  key={record.id}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-2 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900 text-sm">{record.title || 'Sessão de Foco'}</span>
                    <span className="text-slate-400 flex items-center gap-1 font-medium text-[11px]">
                      <Calendar className="w-3.5 h-3.5" />
                      {record.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-700 font-bold">
                        <Zap className="w-3.5 h-3.5 fill-amber-500" />
                        <span>Inércia: {formatMainDisplay(record.inertiaTimeMs)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 font-bold">
                        <Target className="w-3.5 h-3.5 fill-emerald-500" />
                        <span>Objetivo: {formatMainDisplay(record.goalTimeMs)}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 font-mono">
                      {formatMainDisplay(record.totalTimeMs)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
            {history.length > 0 ? (
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-100/60 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpar Histórico</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

