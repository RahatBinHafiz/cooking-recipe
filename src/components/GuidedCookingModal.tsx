import React, { useState, useEffect, useRef } from 'react';
import { Recipe } from '../types/recipe';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Bell,
  CheckCircle2,
  Utensils,
  Thermometer,
  Sparkles,
  Flame,
} from 'lucide-react';
import { markRecipeAsCooked } from '../services/storage';

interface GuidedCookingModalProps {
  recipe: Recipe;
  onClose: () => void;
  onFinishCooking: (recipeId: string) => void;
}

// Synthesize pleasant kitchen chime sound with Web Audio API
function playChimeSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, ctx.currentTime); // A5

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.2);
    osc2.stop(ctx.currentTime + 1.2);
  } catch (e) {
    console.log('Audio chime not permitted or supported:', e);
  }
}

export const GuidedCookingModal: React.FC<GuidedCookingModalProps> = ({
  recipe,
  onClose,
  onFinishCooking,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showIngredientsDrawer, setShowIngredientsDrawer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer state
  const currentStep = recipe.instructions[currentStepIndex];
  const initialSeconds =
    currentStep?.timerSeconds ||
    (currentStep?.durationMinutes ? currentStep.durationMinutes * 60 : 0);

  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Reset timer on step change
  useEffect(() => {
    const newSeconds =
      currentStep?.timerSeconds ||
      (currentStep?.durationMinutes ? currentStep.durationMinutes * 60 : 0);
    setTimeLeft(newSeconds);
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [currentStepIndex, recipe]);

  // Timer interval ticker
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            playChimeSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, isCompleted]);

  const handleNext = () => {
    if (currentStepIndex < recipe.instructions.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      markRecipeAsCooked(recipe.id);
    }
  };

  const handlePrev = () => {
    if (isCompleted) {
      setIsCompleted(false);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const progressPercent = ((currentStepIndex + 1) / recipe.instructions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] text-white flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
      {/* Top Bar: Recipe Name, Step Indicator, Ingredients Drawer Toggle & Exit */}
      <header className="px-4 sm:px-8 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
        <div>
          <span className="text-xs text-amber-400 font-bold tracking-wider uppercase block">
            Guided Cooking Mode
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate max-w-xs sm:max-w-md">
            {recipe.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowIngredientsDrawer(!showIngredientsDrawer)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span>Ingredients</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Exit Guided Cooking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5">
        <div
          className="bg-[#FFD447] h-full transition-all duration-300 ease-out"
          style={{ width: `${isCompleted ? 100 : progressPercent}%` }}
        />
      </div>

      {/* Main Center Stage */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-4xl mx-auto w-full flex flex-col justify-center">
        {isCompleted ? (
          /* Completion Screen */
          <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Bon Appétit!
              </h2>
              <p className="text-base text-slate-400 max-w-md mx-auto">
                You've successfully prepared <strong className="text-white">{recipe.title}</strong>!
              </p>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 max-w-sm mx-auto text-xs text-slate-300">
              <span className="font-semibold text-emerald-400 block mb-1">
                Food Safety Check:
              </span>
              Verify that the chicken reached a safe minimum internal temperature of 74°C (165°F).
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  onFinishCooking(recipe.id);
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-[#FFD447] hover:bg-[#F2C32E] text-[#173B67] font-bold text-sm shadow-lg transition-transform hover:scale-105"
              >
                Done & Return to Recipe
              </button>
            </div>
          </div>
        ) : (
          /* Step Instruction Card */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Step Counter Badge */}
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs sm:text-sm font-bold tracking-wide border border-amber-400/30">
                Step {currentStep.step} of {recipe.instructions.length}
              </span>
              {currentStep.title && (
                <span className="text-sm font-semibold text-slate-400">{currentStep.title}</span>
              )}
            </div>

            {/* Instruction Text (Large & Legible) */}
            <p className="text-xl sm:text-2xl md:text-3xl font-medium text-slate-100 leading-relaxed font-display">
              {currentStep.text}
            </p>

            {/* Temperature and Visual Doneness Badges */}
            <div className="flex flex-wrap gap-3">
              {currentStep.temperatureC && (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-950/60 border border-orange-500/40 text-orange-200 text-xs sm:text-sm font-semibold">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>
                    Heat Target: {currentStep.temperatureC}°C ({currentStep.temperatureF}°F)
                  </span>
                </div>
              )}

              {currentStep.donenessCue && (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Doneness Cue: {currentStep.donenessCue}</span>
                </div>
              )}
            </div>

            {/* Integrated Working Step Countdown Timer */}
            {initialSeconds > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg tabular-nums ${
                      timeLeft === 0
                        ? 'bg-emerald-500 text-white animate-bounce'
                        : isTimerRunning
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Step Timer</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                      {formatTimer(timeLeft)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
                      isTimerRunning
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>{timeLeft === 0 ? 'Restart' : 'Start Timer'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimeLeft(initialSeconds);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Side Slide Drawer for Ingredients Checklist Peek */}
      {showIngredientsDrawer && (
        <div
          className="fixed inset-y-0 right-0 w-full max-w-sm bg-slate-900 border-l border-slate-800 p-6 z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Recipe Ingredients</h3>
            <button
              onClick={() => setShowIngredientsDrawer(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {recipe.ingredients.map((ing) => (
              <div
                key={ing.id}
                className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200"
              >
                <strong className="text-amber-400 mr-1.5 tabular-nums">
                  {ing.quantity} {ing.unit}
                </strong>
                <span>{ing.name}</span>
                {ing.preparationNotes && (
                  <span className="text-slate-400 italic block text-[11px] mt-0.5">
                    {ing.preparationNotes}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation Buttons (Previous, Next, Finish) */}
      <footer className="px-4 sm:px-8 py-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0 && !isCompleted}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Tip: Use Left & Right Arrow keys on keyboard to navigate
        </span>

        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl bg-[#FFD447] hover:bg-[#F2C32E] text-[#173B67] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
        >
          <span>
            {currentStepIndex === recipe.instructions.length - 1 ? 'Finish Cooking' : 'Next Step'}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
