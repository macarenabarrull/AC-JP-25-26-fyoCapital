import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Maximize, Minimize, Keyboard, X, MousePointer2, 
  Sparkles, Home, Target, Users, Info, CheckCircle2, Compass,
  BrainCircuit, Layers, Zap, ClipboardCheck, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SLIDES } from '../constants';

interface SlideLayoutProps {
  children: ReactNode;
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onJumpToSlide: (index: number) => void;
  isProjectorMode: boolean;
  onToggleProjectorMode: () => void;
  title?: string;
  subtitle?: string;
  direction?: number;
}

export const SlideLayout: React.FC<SlideLayoutProps> = ({ 
  children, 
  currentSlide, 
  totalSlides, 
  onNext, 
  onPrev,
  onJumpToSlide,
  isProjectorMode,
  onToggleProjectorMode,
  title,
  subtitle,
  direction = 0
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [showIndex, setShowIndex] = useState(false);
  const [showTouchHint, setShowTouchHint] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Force light mode always
  useEffect(() => {
    setIsDarkMode(false);
  }, []);

  // TV Mode Class Toggle
  useEffect(() => {
    if (isProjectorMode) {
      document.body.classList.add('tv-mode');
    } else {
      document.body.classList.remove('tv-mode');
    }
  }, [isProjectorMode]);
  
  // Parallax Logic
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if ('ontouchstart' in window) return;
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Swipe Logic
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < totalSlides - 1) {
        onNext();
    }
    if (isRightSwipe && currentSlide > 0) {
        onPrev();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'r') {
        setIsReadingMode(prev => !prev);
      } else if (e.key.toLowerCase() === 'p') {
        onToggleProjectorMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onToggleProjectorMode]);

  // Wake Lock Logic
  const wakeLock = useRef<any>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && (navigator as any).wakeLock) {
          wakeLock.current = await (navigator as any).wakeLock.request('screen');
          
          // Re-request on visibility change
          const handleVisibilityChange = async () => {
            if (wakeLock.current !== null && document.visibilityState === 'visible') {
              wakeLock.current = await (navigator as any).wakeLock.request('screen');
            }
          };
          document.addEventListener('visibilitychange', handleVisibilityChange);
          return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
      } catch (err: any) {
        if (err.name !== 'NotAllowedError' && err.name !== 'SecurityError') {
          console.warn(`WakeLock failed: ${err.name}, ${err.message}`);
        }
      }
    };

    const releaseWakeLock = () => {
      if (wakeLock.current !== null) {
        wakeLock.current.release();
        wakeLock.current = null;
      }
    };

    if (isFullscreen) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => releaseWakeLock();
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Hide shortcuts toast after 4 seconds
    const timer = setTimeout(() => setShowShortcuts(false), 4000);

    // Show touch hint on mobile
    if ('ontouchstart' in window) {
      const hintTimer = setTimeout(() => setShowTouchHint(true), 2000);
      const hideHintTimer = setTimeout(() => setShowTouchHint(false), 6000);
      return () => {
        clearTimeout(timer);
        clearTimeout(hintTimer);
        clearTimeout(hideHintTimer);
      }
    }

    return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        clearTimeout(timer);
    }
  }, []);

  // Animation Variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
      filter: 'blur(10px)',
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 1.02,
      filter: 'blur(10px)',
    }),
  };

  return (
    <div 
        className={`h-[100dvh] w-full flex flex-col relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 print:h-auto print:overflow-visible transition-colors duration-1000 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
    >
      {/* --- PREMIUM BACKGROUND --- */}
      <div className={`absolute inset-0 w-full h-full overflow-hidden -z-10 print:hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
          {/* Noise Texture Overlay */}
          <div className="absolute inset-0 bg-noise z-10"></div>
          
          {/* Animated Blobs with Parallax - Hidden in Projector Mode for clarity */}
          {!isProjectorMode && (
            <motion.div 
              animate={{ x: mousePos.x * 0.8, y: mousePos.y * 0.8 }}
              transition={{ type: 'spring', damping: 60, stiffness: 80 }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className={`absolute top-[-10%] -left-[10%] w-[500px] h-[500px] rounded-full mix-blend-soft-light filter blur-[120px] animate-blob ${isDarkMode ? 'bg-indigo-400 opacity-10' : 'bg-indigo-200 opacity-20'}`}></div>
              <div className={`absolute top-[-5%] -right-[10%] w-[400px] h-[400px] rounded-full mix-blend-soft-light filter blur-[120px] animation-delay-2000 animate-blob ${isDarkMode ? 'bg-emerald-400 opacity-[0.08]' : 'bg-emerald-100 opacity-15'}`}></div>
              <div className={`absolute -bottom-[10%] left-[15%] w-[500px] h-[500px] rounded-full mix-blend-soft-light filter blur-[120px] animation-delay-4000 animate-blob ${isDarkMode ? 'bg-slate-300 opacity-10' : 'bg-slate-200 opacity-20'}`}></div>
              
              {/* Floating Organic Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="absolute top-[20%] left-[10%] w-12 h-12 border-2 border-indigo-200/30 rounded-2xl rotate-12"
              />
              <motion.div 
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                className="absolute bottom-[30%] right-[15%] w-16 h-16 border-2 border-emerald-200/20 rounded-full"
              />
            </motion.div>
          )}
          
          {/* Large Static Gradients for depth */}
          {!isProjectorMode && (
            <div className={`absolute top-[-20%] right-[-10%] w-[100vw] h-[100vw] rounded-full blur-[180px] pointer-events-none ${isDarkMode ? 'bg-gradient-to-b from-indigo-400/10 to-transparent' : 'bg-gradient-to-b from-indigo-50/20 to-transparent'}`} />
          )}
          
          {/* Grain Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* Top Progress Bar - Minimalist */}
      <div className="absolute top-0 left-0 h-1 bg-slate-100/50 w-full z-50 print:hidden">
          <motion.div 
            className="h-full bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)] relative"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            transition={{ type: 'spring', damping: 30, stiffness: 100 }}
          >
            <div className="absolute right-0 top-full mt-1 px-2 py-0.5 bg-white/80 backdrop-blur-md rounded-md border border-slate-100 shadow-sm">
                <span className="text-[7px] font-black text-indigo-600 uppercase tracking-widest whitespace-nowrap">
                    Paso {currentSlide + 1} de {totalSlides}
                </span>
            </div>
          </motion.div>
      </div>

      {/* Header - Minimalist & Elegant */}
      <header className={`flex-none px-6 md:px-12 lg:px-16 flex justify-between items-center z-20 print:hidden h-12 md:h-16 transition-all duration-700 ${isReadingMode ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <motion.div 
          layoutId="brand-header"
          className="flex items-center gap-2 md:gap-4 group cursor-pointer"
          onClick={() => onJumpToSlide(0)}
        >
          {/* Fyo Logo with Shimmer */}
          <div className="relative w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-[10px] md:text-xs shadow-xl group-hover:bg-indigo-600 transition-colors overflow-hidden">
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            />
            fyo
          </div>
          <div className="h-6 md:h-8 w-px bg-slate-200/60 mx-1"></div>
          <div className="flex flex-col leading-tight">
             <span className="text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] text-slate-900 uppercase">Programa fyoCapital</span>
             <span className="text-[7px] md:text-[8px] text-slate-400 font-bold tracking-widest uppercase">Assessment Center</span>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-2 md:gap-4 bg-white/70 backdrop-blur-3xl p-2 rounded-full border border-white/80 shadow-2xl">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleProjectorMode}
                className={`p-1.5 md:p-2.5 transition-all rounded-full border ${
                  isProjectorMode 
                  ? 'bg-amber-500 text-white border-amber-400 shadow-lg' 
                  : 'text-slate-400 hover:text-amber-600 hover:bg-white border-transparent'
                }`}
                title={isProjectorMode ? "Desactivar Modo TV/Proyector" : "Activar Modo TV/Proyector (Alta Legibilidad)"}
              >
                <Compass size={16} className={isProjectorMode ? 'animate-spin-slow' : ''} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsReadingMode(true)}
                className="p-1.5 md:p-2.5 text-slate-400 hover:text-indigo-600 transition-all rounded-full hover:bg-white border border-transparent"
                title="Modo Lectura (Foco)"
              >
                <Keyboard size={16} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowIndex(!showIndex)}
                className={`p-1.5 md:p-2.5 transition-all rounded-full border ${
                  showIndex 
                  ? 'bg-slate-900 text-white border-slate-800 shadow-xl' 
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-white border-transparent'
                }`}
                title="Índice de diapositivas"
              >
                <Sparkles size={16} className={showIndex ? 'animate-pulse' : ''} />
              </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFullscreen}
              className="p-1.5 md:p-2.5 text-slate-400 hover:text-indigo-600 transition-all rounded-full hover:bg-white border border-transparent"
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </motion.button>
        </div>
      </header>

      {/* Reading Mode Exit Button */}
      <AnimatePresence>
        {isReadingMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsReadingMode(false)}
            className="absolute top-6 right-6 z-[100] p-3 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-indigo-600 transition-all group"
          >
            <X size={20} />
            <span className="absolute right-full mr-3 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Salir del modo foco</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Content Area - Optimized Spacing */}
      <main className="flex-1 w-full relative z-10 flex flex-col justify-center print:block print:max-w-none print:px-0 min-h-0">
        <AnimatePresence mode="wait" custom={direction}>
            <motion.div
                key={currentSlide}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    x: { type: "spring", stiffness: 150, damping: 25 },
                    opacity: { duration: 0.4 }
                }}
                className="w-full h-full flex flex-col justify-center overflow-hidden"
            >
                {title && (
                    <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 shrink-0 print:hidden">
                        <motion.div 
                            initial={{ opacity: 0, y: -20, filter: 'blur(15px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ delay: 0.1, duration: 1, ease: "easeOut" }}
                            className="mb-4 md:mb-6 print:mb-2"
                        >
                            <h1 className={`text-2xl md:text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[0.85] drop-shadow-sm font-display uppercase ${isProjectorMode ? 'lg:text-7xl' : ''}`}>
                            {title}
                            </h1>
                            {subtitle && (
                                <div className="flex items-center gap-3 mt-2">
                                    <div className={`h-1 bg-indigo-600 rounded-full ${isProjectorMode ? 'w-12 h-1.5' : 'w-8'}`}></div>
                                    <p className={`text-slate-500 font-bold tracking-[0.3em] uppercase opacity-70 ${isProjectorMode ? 'text-base md:text-lg' : 'text-[8px] md:text-[10px]'}`}>
                                        {subtitle}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
                <div className="w-full h-full flex flex-col justify-center print:block overflow-y-auto overflow-x-hidden py-4 custom-scrollbar relative px-6 md:px-12 lg:px-16">
                    {children}
                </div>
            </motion.div>
        </AnimatePresence>
      </main>

      {/* Index Sidebar - Deep Glass Overlay */}
      <AnimatePresence>
        {showIndex && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIndex(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] print:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-full max-w-[300px] bg-white/80 backdrop-blur-2xl border-l border-white/40 z-[70] shadow-2xl flex flex-col print:hidden"
            >
              <div className="p-6 flex justify-between items-center border-b border-slate-100">
                <h2 className="text-xl font-black tracking-tight text-slate-900">Índice</h2>
                <button onClick={() => setShowIndex(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {SLIDES.map((slide, idx) => {
                  const isCurrent = idx === currentSlide;
                  // Map slide types/ids to icons
                  const getSlideIcon = () => {
                    if (slide.type === 'cover') return Home;
                    if (slide.type === 'objectives') return Target;
                    if (slide.type === 'info') return Users;
                    if (slide.type === 'closing') return CheckCircle2;
                    if (slide.type === 'tutor-content') {
                      // Use the icon from content if it exists in our imports
                      const iconName = slide.content?.icon;
                      if (iconName === 'Compass') return Compass;
                      if (iconName === 'Target') return Target;
                      if (iconName === 'BrainCircuit') return BrainCircuit;
                      if (iconName === 'Layers') return Layers;
                      if (iconName === 'Zap') return Zap;
                      if (iconName === 'ClipboardCheck') return ClipboardCheck;
                      if (iconName === 'Heart') return Heart;
                      if (iconName === 'Sparkles') return Sparkles;
                    }
                    return Info;
                  };
                  const Icon = getSlideIcon();

                  return (
                    <button
                      key={slide.id}
                      onClick={() => {
                        onJumpToSlide(idx);
                        setShowIndex(false);
                      }}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-4 group ${
                        isCurrent 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'hover:bg-indigo-50 text-slate-600'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isCurrent ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'
                      }`}>
                        <Icon size={18} className={isCurrent ? 'text-white' : 'text-slate-400'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-black truncate leading-tight ${isCurrent ? 'text-white' : 'text-slate-800'}`}>
                          {slide.title || (slide.type === 'cover' ? 'Portada' : slide.type)}
                        </div>
                        <div className={`text-[10px] font-bold truncate opacity-70 ${isCurrent ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {slide.subtitle || slide.type}
                        </div>
                      </div>
                      {isCurrent && (
                        <motion.div layoutId="active-indicator">
                          <Sparkles size={14} className="text-white animate-pulse" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Touch Hint */}
      <AnimatePresence>
        {showTouchHint && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute bottom-32 left-12 z-[55] flex flex-col items-start gap-2 pointer-events-none print:hidden"
          >
            <div className="flex items-center gap-4">
              <motion.div 
                animate={{ x: [-20, 20, -20] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="p-3 bg-white/40 backdrop-blur-md border border-white/60 rounded-full shadow-lg"
              >
                <MousePointer2 size={24} className="text-indigo-500 rotate-90" />
              </motion.div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full">Desliza para navegar</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shortcuts Toast - Deep Glass */}
      <AnimatePresence>
        {showShortcuts && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute bottom-24 right-8 z-50 bg-slate-900/80 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-slate-900/20 flex items-center gap-4 backdrop-blur-xl border border-white/10 pointer-events-none print:hidden"
            >
                <Keyboard size={20} className="text-indigo-400" />
                <div className="text-sm font-medium tracking-wide flex flex-col gap-1">
                    <div>Navegar: <span className="font-mono bg-white/10 border border-white/20 px-2 py-0.5 rounded text-xs mx-1">←</span> <span className="font-mono bg-white/10 border border-white/20 px-2 py-0.5 rounded text-xs mx-1">→</span></div>
                    <div className="text-[10px] opacity-60">F: Pantalla Completa | R: Modo Foco | P: Modo Proyector</div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Navigation Controls */}
      <footer className={`flex-none px-6 md:px-12 lg:px-16 py-2 flex justify-between items-center z-20 print:hidden h-12 md:h-16 transition-all duration-500 ${isReadingMode ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        {/* Pagination Dots - Premium Style */}
        <div className="flex gap-2 md:gap-3">
            {Array.from({ length: totalSlides }).map((_, idx) => (
                <motion.button 
                    key={idx}
                    whileHover={{ scale: 1.3 }}
                    onClick={() => onJumpToSlide(idx)}
                    className={`rounded-full transition-all duration-700 ease-out
                        ${isProjectorMode ? 'h-2' : 'h-1'}
                        ${idx === currentSlide 
                            ? (isProjectorMode ? 'w-12 bg-indigo-600' : 'w-8 bg-indigo-600')
                            : (isProjectorMode ? 'w-3 bg-slate-200 hover:bg-indigo-200' : 'w-2 bg-slate-200 hover:bg-indigo-200')}`}
                />
            ))}
        </div>

        {/* Navigation Buttons - Elegant Glass Style */}
        <div className="flex items-center gap-4">
            <motion.button 
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrev}
            disabled={currentSlide === 0}
            className={`group rounded-full glass-border bg-white/40 backdrop-blur-xl hover:bg-white/60 disabled:opacity-20 transition-all shadow-sm active:scale-90 ${isProjectorMode ? 'p-4' : 'p-2.5'}`}
            >
            <ChevronLeft size={isProjectorMode ? 24 : 20} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
            </motion.button>

            <motion.button 
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            disabled={currentSlide === totalSlides - 1}
            className={`group rounded-full bg-slate-900/90 backdrop-blur-xl hover:bg-indigo-700 disabled:opacity-20 transition-all shadow-xl active:scale-90 glass-border ${isProjectorMode ? 'p-4' : 'p-2.5'}`}
            >
            <ChevronRight size={isProjectorMode ? 24 : 20} className="text-white transition-colors" />
            </motion.button>
        </div>
      </footer>
    </div>
  );
};