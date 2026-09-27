import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StopwatchMode, Lap, SessionRecord, DualStopwatchConfig, AppTheme } from './types';
import { GeminiStopwatchCard } from './components/GeminiStopwatchCard';
import { LapList } from './components/LapList';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { soundManager } from './utils/audio';
import { Lock, MoreVertical, Palette, Check } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'cronometro_duplo_history_v1';
const STORAGE_KEY_CONFIG = 'cronometro_duplo_config_v1';

const THEMES: { id: AppTheme; name: string; bgPreview: string; dot: string }[] = [
  { id: 'light', name: 'Claro Clean', bgPreview: 'bg-slate-100 border-slate-300', dot: 'bg-blue-600' },
  { id: 'dark', name: 'Escuro Elegante', bgPreview: 'bg-neutral-900 border-neutral-700', dot: 'bg-blue-500' },
  { id: 'midnight', name: 'Azul Noturno', bgPreview: 'bg-[#0b1329] border-slate-700', dot: 'bg-blue-400' },
  { id: 'slate', name: 'Cinza Urbano', bgPreview: 'bg-[#1e293b] border-slate-600', dot: 'bg-blue-500' },
];

export default function App() {
  // App Mode & State
  const [mode, setMode] = useState<StopwatchMode>('inertia');
  const [isInertiaRunning, setIsInertiaRunning] = useState<boolean>(false);
  const [isGoalRunning, setIsGoalRunning] = useState<boolean>(false);

  // Time Counters (in milliseconds)
  const [inertiaTimeMs, setInertiaTimeMs] = useState<number>(0);
  const [goalTimeMs, setGoalTimeMs] = useState<number>(0);

  // Laps
  const [laps, setLaps] = useState<Lap[]>([]);

  // UI Locks, Theme Menu & Modals
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Custom session title
  const [sessionTitle, setSessionTitle] = useState<string>('Meu Objetivo');

  // Configuration
  const [config, setConfig] = useState<DualStopwatchConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch {
      // Default config
    }
    return {
      inertiaTargetMs: 2 * 60 * 1000, // 2 minutes
      goalTargetMs: 25 * 60 * 1000, // 25 minutes
      autoTransitionToGoal: true,
      soundEnabled: true,
      tickSoundEnabled: false,
      theme: 'light',
    };
  });

  // Saved Session History
  const [history, setHistory] = useState<SessionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Default empty
    }
    return [];
  });

  // Track if inertia goal chime has been played
  const inertiaChimePlayedRef = useRef<boolean>(false);

  // Precision Timer Reference
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const lastTickSecondRef = useRef<number>(-1);

  // Save Config to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch {
      // Ignore storage errors
    }
  }, [config]);

  // Save History to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // Ignore storage errors
    }
  }, [history]);

  // Main High Precision Timer Loop
  const timerTick = useCallback(
    (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (delta > 0) {
        if (isInertiaRunning) {
          setInertiaTimeMs((prev) => {
            const nextTime = prev + delta;

            // Tick sound check
            const currentSec = Math.floor(nextTime / 1000);
            if (currentSec !== lastTickSecondRef.current) {
              lastTickSecondRef.current = currentSec;
              soundManager.playTick(config.soundEnabled, config.tickSoundEnabled);
            }

            // Check if inertia target reached
            if (
              nextTime >= config.inertiaTargetMs &&
              !inertiaChimePlayedRef.current
            ) {
              inertiaChimePlayedRef.current = true;
              soundManager.playCompletionChime(config.soundEnabled);

              // Auto-transition to goal if enabled
              if (config.autoTransitionToGoal) {
                setTimeout(() => {
                  setMode('goal');
                }, 300);
              }
            }

            return nextTime;
          });
        }

        if (isGoalRunning) {
          setGoalTimeMs((prev) => {
            const nextTime = prev + delta;

            // Tick sound check
            const currentSec = Math.floor(nextTime / 1000);
            if (currentSec !== lastTickSecondRef.current) {
              lastTickSecondRef.current = currentSec;
              soundManager.playTick(config.soundEnabled, config.tickSoundEnabled);
            }

            return nextTime;
          });
        }
      }

      if (isInertiaRunning || isGoalRunning) {
        animationFrameRef.current = requestAnimationFrame(timerTick);
      }
    },
    [
      isInertiaRunning,
      isGoalRunning,
      config.soundEnabled,
      config.tickSoundEnabled,
      config.inertiaTargetMs,
      config.autoTransitionToGoal,
    ]
  );

  // Start / Stop Timer effect
  useEffect(() => {
    if (isInertiaRunning || isGoalRunning) {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(timerTick);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInertiaRunning, isGoalRunning, timerTick]);

  // Play / Pause Toggle
  const handleTogglePlayPause = (targetMode?: StopwatchMode) => {
    if (isLocked) return;

    const activeM = targetMode || mode;
    if (activeM === 'inertia') {
      const nextState = !isInertiaRunning;
      setIsInertiaRunning(nextState);
      if (nextState) {
        soundManager.playStart(config.soundEnabled);
      } else {
        soundManager.playPause(config.soundEnabled);
      }
    } else {
      const nextState = !isGoalRunning;
      setIsGoalRunning(nextState);
      if (nextState) {
        soundManager.playStart(config.soundEnabled);
      } else {
        soundManager.playPause(config.soundEnabled);
      }
    }
  };

  // Record Lap
  const handleLap = (targetMode?: StopwatchMode) => {
    if (isLocked) return;

    const activeM = targetMode || mode;
    const currentModeTime = activeM === 'inertia' ? inertiaTimeMs : goalTimeMs;

    const modeLaps = laps.filter((l) => l.mode === activeM);
    const lastModeTotal = modeLaps.length > 0 ? modeLaps[0].totalTime : 0;
    const lapTime = Math.max(0, currentModeTime - lastModeTotal);

    const newLap: Lap = {
      id: Date.now().toString(),
      lapNumber: laps.length + 1,
      lapTime,
      totalTime: currentModeTime,
      mode: activeM,
      timestamp: Date.now(),
    };

    setLaps((prev) => [newLap, ...prev]);
    soundManager.playLap(config.soundEnabled);
  };

  // Reset / Reiniciar
  const handleReset = (targetMode?: StopwatchMode) => {
    if (isLocked) return;

    const activeM = targetMode || mode;
    const totalTime = inertiaTimeMs + goalTimeMs;

    if (totalTime > 3000) {
      const newRecord: SessionRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        title: sessionTitle || 'Sessão Concluída',
        inertiaTimeMs,
        goalTimeMs,
        totalTimeMs: totalTime,
        lapsCount: laps.length,
        completedGoal: goalTimeMs >= config.goalTargetMs,
      };

      setHistory((prev) => [newRecord, ...prev]);
    }

    if (!targetMode || targetMode === 'inertia') {
      setIsInertiaRunning(false);
      setInertiaTimeMs(0);
    }
    if (!targetMode || targetMode === 'goal') {
      setIsGoalRunning(false);
      setGoalTimeMs(0);
    }

    setLaps((prev) => prev.filter((l) => l.mode !== activeM));
    if (!targetMode) setLaps([]);

    inertiaChimePlayedRef.current = false;
    soundManager.playPause(config.soundEnabled);
  };

  // Switch between modes
  const handleSwitchMode = (newMode: StopwatchMode) => {
    if (isLocked) return;
    setMode(newMode);
    soundManager.playLap(config.soundEnabled);
  };

  // Theme Styling Helpers
  const getAppBgClass = () => {
    if (config.theme === 'light') return 'bg-slate-50 text-slate-900';
    if (config.theme === 'dark') return 'bg-[#090a0f] text-slate-100';
    if (config.theme === 'midnight') return 'bg-[#0b1329] text-blue-50';
    return 'bg-[#1e293b] text-slate-100';
  };

  const getPillBgClass = () => {
    if (config.theme === 'light') return 'bg-slate-200/90';
    if (config.theme === 'dark') return 'bg-neutral-900 border border-neutral-800';
    if (config.theme === 'midnight') return 'bg-[#1c2541] border border-slate-700/60';
    return 'bg-slate-900 border border-slate-700/60';
  };

  const getInertiaBtnClass = () => {
    if (mode === 'inertia') {
      return 'bg-blue-600 text-white shadow-sm';
    }
    if (config.theme === 'light') return 'text-slate-600 hover:text-slate-900';
    return 'text-slate-400 hover:text-white';
  };

  const getGoalBtnClass = () => {
    if (mode === 'goal') {
      if (config.theme === 'light') return 'bg-slate-900 text-white shadow-sm';
      return 'bg-slate-100 text-slate-900 shadow-sm';
    }
    if (config.theme === 'light') return 'text-slate-600 hover:text-slate-900';
    return 'text-slate-400 hover:text-white';
  };

  return (
    <div className={`min-h-screen ${getAppBgClass()} font-sans flex flex-col overflow-x-hidden relative select-none transition-colors duration-200`}>
      {/* Top Right 3-Dots Menu Button */}
      <div className="absolute top-4 right-4 z-30">
        <button
          type="button"
          onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
          className="p-3 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer text-current flex items-center justify-center"
          aria-label="Opções de Tema"
        >
          <MoreVertical className="w-6 h-6" />
        </button>

        {/* Theme Menu Dropdown */}
        {isThemeMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsThemeMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 text-slate-900 dark:text-white animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-500" />
                <span>Temas do App</span>
              </div>
              <div className="flex flex-col gap-1">
                {THEMES.map((t) => {
                  const isSelected = config.theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setConfig((prev) => ({ ...prev, theme: t.id }));
                        setIsThemeMenuOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border ${t.bgPreview} flex items-center justify-center`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                        </div>
                        <span>{t.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Locked Screen Overlay */}
        {isLocked && (
          <div
            onClick={() => setIsLocked(false)}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs flex items-center justify-center cursor-pointer"
          >
            <div className="bg-[#1e1f20] text-blue-400 px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-blue-500/40 animate-pulse">
              <Lock className="w-4 h-4" />
              <span>TELA BLOQUEADA • Clique em qualquer lugar para desbloquear</span>
            </div>
          </div>
        )}

        {/* Main Body Layout */}
        <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-6 justify-center items-center p-4 sm:p-8 min-h-[calc(100vh-60px)]">
          {/* Mode Switcher Pill: Inércia <-> Desenvolvimento */}
          <div className={`flex items-center justify-center p-1 rounded-full max-w-xs w-full shadow-inner ${getPillBgClass()}`}>
            <button
              type="button"
              onClick={() => handleSwitchMode('inertia')}
              className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-full font-extrabold text-xs transition-all ${getInertiaBtnClass()}`}
            >
              <span>Inércia</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('goal')}
              className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-full font-extrabold text-xs transition-all ${getGoalBtnClass()}`}
            >
              <span>Desenvolvimento</span>
            </button>
          </div>

          {/* Stopwatch Display */}
          {mode === 'inertia' ? (
            <GeminiStopwatchCard
              mode="inertia"
              title="Inércia"
              subtitle="Cronômetro de Inércia"
              timeMs={inertiaTimeMs}
              targetMs={config.inertiaTargetMs}
              otherTimeMs={goalTimeMs}
              isRunning={isInertiaRunning}
              onTogglePlayPause={() => handleTogglePlayPause('inertia')}
              onLap={() => handleLap('inertia')}
              onReset={() => handleReset('inertia')}
              onSwitchMode={() => handleSwitchMode('goal')}
              isActive={true}
              lapsCount={laps.filter((l) => l.mode === 'inertia').length}
              theme={config.theme}
            />
          ) : (
            <GeminiStopwatchCard
              mode="goal"
              title="Desenvolvimento"
              subtitle="Cronômetro de Desenvolvimento"
              timeMs={goalTimeMs}
              targetMs={config.goalTargetMs}
              otherTimeMs={inertiaTimeMs}
              isRunning={isGoalRunning}
              onTogglePlayPause={() => handleTogglePlayPause('goal')}
              onLap={() => handleLap('goal')}
              onReset={() => handleReset('goal')}
              onSwitchMode={() => handleSwitchMode('inertia')}
              isActive={true}
              lapsCount={laps.filter((l) => l.mode === 'goal').length}
              theme={config.theme}
            />
          )}

          {/* Lap History List Section */}
          <div className="w-full">
            <LapList laps={laps} theme={config.theme} />
          </div>
        </main>
      </div>

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={setConfig}
        sessionTitle={sessionTitle}
        onChangeSessionTitle={setSessionTitle}
      />
    </div>
  );
}
