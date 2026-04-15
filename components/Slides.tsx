import React, { useState, useEffect } from 'react';
import { SlideData } from '../constants';
import { 
  Users, Calendar, GraduationCap, FileText, Flag, Heart, 
  BrainCircuit, Zap, ClipboardCheck, PencilRuler, Search, FileSignature, 
  Rocket, BarChart3, Compass, Target, Layers, Sparkles, DollarSign, Briefcase,
  RotateCcw, Clock, Lightbulb, Quote, AlertCircle, Check,
  Download, FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { SLIDES } from '../constants';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface SlideProps {
  data: SlideData;
  onPrint?: () => void;
  onJumpToSlide?: (index: number) => void;
}

const IconMap: Record<string, any> = {
  Compass, Target, BrainCircuit, Layers, Zap, ClipboardCheck, Heart, Sparkles,
  Users, DollarSign, Briefcase, Calendar, GraduationCap, FileText, Flag,
  PencilRuler, Search, FileSignature, Rocket, BarChart3, Clock, Lightbulb
};

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(15px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 120, damping: 20 } }
};

// --- Reusable Premium Components ---
const OrganicShape: React.FC<{ children: React.ReactNode, bg: string, color: string, className?: string }> = ({ children, bg, color, className = "" }) => (
    <div className={`relative flex items-center justify-center ${bg} ${color} p-3 md:p-4 shadow-sm border border-white/40 transition-all duration-700 rounded-2xl md:rounded-3xl ${className} group-hover:scale-110 group-hover:rotate-3`}>
        <div className={`absolute inset-0 ${bg} blur-xl opacity-10 rounded-full -z-10 animate-pulse`} />
        <div className="absolute inset-0 glass-border rounded-[inherit] pointer-events-none" />
        {children}
    </div>
);

const GlowIcon: React.FC<{ icon: any, color: string, bg: string, size?: number }> = ({ icon: Icon, color, bg, size = 24 }) => (
    <OrganicShape bg={bg} color={color}>
        <div className="relative">
            <Icon size={size} strokeWidth={2} className="relative z-10" />
            <Icon size={size} strokeWidth={2} className="absolute inset-0 blur-sm opacity-50" />
        </div>
    </OrganicShape>
);

const GlassCard: React.FC<{ children?: React.ReactNode, className?: string, hover?: boolean, theme?: 'light' | 'dark' | 'brand', onClick?: () => void }> = ({ children, className = "", hover = false, theme = 'light', onClick }) => {
    const themeClasses = {
        light: 'bg-white/90 border-white/80 shadow-lg glass-border',
        dark: 'bg-slate-900/98 border-slate-700/50 shadow-2xl text-white glass-border',
        brand: 'bg-indigo-600/15 border-indigo-500/20 shadow-lg glass-border'
    };

    return (
        <div 
            onClick={onClick}
            className={`
            backdrop-blur-2xl 
            rounded-3xl md:rounded-[2rem]
            relative overflow-hidden
            ${themeClasses[theme]}
            ${hover ? 'transition-all duration-700 hover:bg-white/95 hover:shadow-2xl hover:-translate-y-2' : ''}
            ${className}
            ${onClick ? 'cursor-pointer' : ''}
        `}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            {children}
        </div>
    );
};

// 1. Cover Slide
export const CoverSlide: React.FC<SlideProps> = ({ data }) => {
  const isAssessment = data.id === 'assessment-cover';
  const isBreak = data.id === 'break-cover';

  return (
    <motion.div 
        className="flex flex-col justify-center items-center h-full text-center relative z-10 overflow-hidden"
        initial="hidden" animate="show" variants={containerVariants}
    >
      {/* Animated Gradient Background */}
      <div className={`absolute inset-0 -z-20 bg-gradient-to-br ${isAssessment ? 'from-indigo-900 via-slate-900 to-blue-900' : isBreak ? 'from-amber-50 via-white to-orange-50' : 'from-indigo-50 via-white to-cyan-50'} animate-gradient-xy`} />
      
      <motion.div variants={itemVariants} className="mb-4 relative w-full max-w-4xl px-6">
        {/* Universe Effect Background */}
        <div className="absolute inset-0 -z-10">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${isAssessment ? 'bg-blue-500/20' : isBreak ? 'bg-amber-500/10' : 'bg-indigo-500/10'} rounded-full blur-[120px] animate-pulse`} />
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                        rotate: { repeat: Infinity, duration: 20 + i * 10, ease: "linear" },
                        scale: { repeat: Infinity, duration: 5 + i, ease: "easeInOut" },
                        opacity: { repeat: Infinity, duration: 3 + i, ease: "easeInOut" }
                    }}
                    className="absolute inset-0 pointer-events-none"
                >
                    <div 
                        className={`w-1.5 h-1.5 ${isAssessment ? 'bg-blue-400/60' : isBreak ? 'bg-amber-400/40' : 'bg-indigo-400/40'} rounded-full absolute`}
                        style={{ 
                            top: `${10 + i * 15}%`, 
                            left: `${5 + i * 15}%`,
                            boxShadow: `0 0 15px ${isAssessment ? '#60a5fa' : isBreak ? '#d97706' : '#4f46e5'}`
                        }}
                    />
                </motion.div>
            ))}
        </div>

        <GlassCard theme={isAssessment ? 'dark' : data.theme} className={`p-6 md:p-12 flex flex-col items-center border-white/20 shadow-2xl relative overflow-visible ${isAssessment ? 'bg-slate-900/40 border-blue-500/30' : 'bg-white/30'} backdrop-blur-2xl rounded-[2rem]`}>
            {isAssessment && (
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600 rounded-full blur-2xl opacity-50 animate-pulse" />
            )}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-32 h-1 bg-gradient-to-r from-transparent via-${isAssessment ? 'blue' : isBreak ? 'amber' : 'indigo'}-500 to-transparent rounded-b-full`} />
            
            <motion.div 
                layoutId="brand-tag"
                variants={itemVariants} 
                className={`inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 rounded-full border ${isAssessment ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-slate-100/50 bg-white/80 text-slate-400'} shadow-md text-[7px] md:text-[9px] font-black tracking-[0.4em] uppercase mb-4 md:mb-8`}
            >
                <div className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full ${isAssessment ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : isBreak ? 'bg-amber-500' : 'bg-indigo-500'} animate-pulse`} />
                {isAssessment ? 'Assessment Center' : isBreak ? 'Descanso' : 'fyo'}
            </motion.div>
            
            <motion.h1 
                layoutId="slide-title"
                variants={{
                  hidden: { opacity: 0, y: 50, filter: 'blur(20px)', scale: 0.9 },
                  show: { 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)', 
                    scale: 1,
                    transition: { 
                      type: 'spring', 
                      stiffness: 100, 
                      damping: 15,
                      delay: 0.3
                    } 
                  }
                }}
                className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter ${isAssessment ? 'text-white' : 'text-slate-900'} mb-6 md:mb-8 leading-[0.8] font-display uppercase drop-shadow-2xl`}
            >
                {(data.title || '').split(' ').map((word, i) => {
                    const isSpecial = word.toUpperCase().includes('JP') || word.toUpperCase().includes('FYO') || word.toUpperCase().includes('ASSESSMENT');
                    const hasEmoji = /\p{Emoji}/u.test(word);
                    const colorClass = isAssessment ? 'text-blue-400' : isBreak ? 'text-amber-600' : 'text-indigo-600';
                    return (
                        <span key={i} className={i % 2 === 1 && !isSpecial && !hasEmoji ? `italic ${colorClass} font-serif lowercase` : ''}>
                            {word}{' '}
                        </span>
                    );
                })}
            </motion.h1>
            
            <motion.p 
                variants={itemVariants}
                className={`text-base md:text-xl ${isAssessment ? 'text-blue-100/60' : 'text-slate-500'} font-bold tracking-[0.3em] mb-12 max-w-3xl leading-relaxed uppercase opacity-90`}
            >
              {data.subtitle}
            </motion.p>

            {data.content?.tags && (
              <motion.div 
                variants={{
                  show: {
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
                className="flex flex-wrap justify-center gap-4"
              >
                  {data.content.tags.map((tag: string, idx: number) => {
                    const colorHex = isAssessment ? '#3b82f6' : isBreak ? '#d97706' : '#4f46e5';
                    const colorShadow = isAssessment ? 'rgb(59 130 246 / 0.2)' : isBreak ? 'rgb(217 119 6 / 0.1)' : 'rgb(79 70 229 / 0.1)';
                    return (
                      <motion.div 
                        variants={{
                          hidden: { opacity: 0, scale: 0.8, y: 20 },
                          show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200 } }
                        }} 
                        key={idx} 
                        whileHover={{ y: -10, scale: 1.1, borderColor: colorHex, color: isAssessment ? '#fff' : colorHex, backgroundColor: isAssessment ? colorHex : '#fff', boxShadow: `0 25px 30px -5px ${colorShadow}` }}
                        className={`px-6 py-3 ${isAssessment ? 'bg-white/5 text-white border-white/10' : 'bg-white text-slate-900 border-slate-100'} text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl border shadow-xl transition-all cursor-default`}
                      >
                          {tag}
                      </motion.div>
                    );
                  })}
              </motion.div>
            )}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

// 2. Image Slide
export const ImageSlide: React.FC<SlideProps> = ({ data }) => {
  const [error, setError] = React.useState(false);
  
  return (
    <motion.div 
        className="flex flex-col justify-center items-center h-full relative z-10"
        initial="hidden" animate="show" variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="w-full h-full flex flex-col items-center justify-center p-2">
        <GlassCard theme={data.theme} className="w-full max-w-6xl aspect-video overflow-hidden border-white/40 shadow-2xl relative flex items-center justify-center bg-slate-50 group">
          {!error ? (
            <img 
              src={data.content.imageUrl} 
              alt={data.content.alt || data.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
              onError={() => setError(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-6 text-slate-300">
              <OrganicShape bg="bg-slate-100" color="text-slate-200" className="w-24 h-24">
                <Layers size={48} />
              </OrganicShape>
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Ecosistema fyo</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          {data.title && (
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <motion.h2 
                layoutId="slide-title"
                className="text-white text-lg md:text-xl font-black tracking-tighter font-display"
              >
                {data.title}
              </motion.h2>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

// 3. Agenda Slide (Table)
export const TableCapitalSlide: React.FC<SlideProps> = ({ data }) => {
    const { headers, rows } = data.content;
    const colCount = headers.length;
    
    return (
        <motion.div className="w-full flex flex-col items-center justify-center py-4" initial="hidden" animate="show" variants={containerVariants}>
            <motion.div variants={itemVariants} className="w-full max-w-4xl">
                <GlassCard className="overflow-hidden shadow-2xl relative bg-white/60 backdrop-blur-2xl rounded-[2rem]">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 via-cyan-400 to-indigo-600 animate-gradient-x" />
                    <div 
                        className="grid border-b border-slate-100/50 text-[6px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] font-display bg-slate-50/80"
                        style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
                    >
                        {headers.map((header: string, i: number) => (
                            <div key={i} className="p-1.5 md:p-3 text-center text-slate-400">{header}</div>
                        ))}
                    </div>
                    {rows.map((row: string[], idx: number) => (
                        <div 
                            key={idx} 
                            className="grid border-b border-slate-50/50 hover:bg-white/80 transition-all duration-500 text-[8px] md:text-[10px] group"
                            style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
                        >
                            <div className="p-1.5 md:p-3 font-mono flex items-center justify-center font-black text-indigo-600 bg-indigo-50/40 group-hover:bg-indigo-100/60 transition-colors border-r border-slate-50/50">{row[0]}</div>
                            {row.slice(1).map((cell, i) => (
                                <div key={i} className="p-1.5 md:p-3 flex items-center justify-center border-l border-slate-50/50 text-center font-bold tracking-tight text-slate-600 group-hover:text-slate-900">
                                    {cell}
                                </div>
                            ))}
                        </div>
                    ))}
                </GlassCard>
            </motion.div>
        </motion.div>
    );
};

// 4. Info Slide (Nuestra Empresa)
export const InfoSlide: React.FC<SlideProps> = ({ data }) => {
  const { mainText, description, highlight } = data.content;
  
  // Split mainText into blocks if it contains newlines
  const textBlocks = mainText.split('\n\n');
  const icons = [Compass, Zap, Rocket];

  return (
    <motion.div className="flex flex-col justify-center items-center h-full max-w-6xl mx-auto px-6 py-8" initial="hidden" animate="show" variants={containerVariants}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
        {/* Left Column: 3 Blocks */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          {textBlocks.map((block: string, i: number) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div key={i} variants={itemVariants} className="h-full">
                <GlassCard className="h-full p-6 bg-white/90 border-white shadow-xl flex flex-col hover:-translate-y-2 transition-all duration-500">
                  <div className="mb-4">
                    <OrganicShape bg="bg-indigo-50" color="text-indigo-600" className="w-10 h-10">
                      <Icon size={20} />
                    </OrganicShape>
                  </div>
                  <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed tracking-tight">
                    {block.replace(/"/g, '')}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
          
          {/* Description Footer */}
          <motion.div variants={itemVariants} className="md:col-span-3">
            <GlassCard className="p-4 bg-white border-indigo-100 text-indigo-900 shadow-xl flex items-center gap-4">
              <div className="h-1 w-12 bg-indigo-600 rounded-full" />
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
                {description}
              </p>
            </GlassCard>
          </motion.div>
        </div>
        
        {/* Right Column: Highlight */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="h-full relative p-8 rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden group flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                
                <Sparkles className="text-indigo-400 mb-8 animate-pulse relative z-10" size={32} />
                
                <div className="relative z-10">
                    <p className="text-lg md:text-xl font-black text-white leading-[1.1] tracking-tighter font-display uppercase mb-8">
                        {highlight}
                    </p>
                    
                    <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                        <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg">fyo</div>
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-1">Compromiso</span>
                            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Soluciones a medida</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// 5. Culture Slide
export const TutorContentSlide: React.FC<SlideProps> = ({ data }) => {
  return (
    <motion.div className="flex flex-col justify-center h-full py-8 max-w-6xl mx-auto px-6" initial="hidden" animate="show" variants={containerVariants}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div className="lg:col-span-7">
          <motion.div variants={itemVariants}>
            <GlassCard className="p-1 bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 rounded-[2rem] shadow-2xl overflow-visible">
                <div className="bg-white rounded-[1.9rem] p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl -mr-24 -mt-24 opacity-50" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <OrganicShape bg="bg-indigo-600" color="text-white" className="w-10 h-10">
                                <Compass size={20} />
                            </OrganicShape>
                            <h3 className="text-slate-900 font-black text-[9px] uppercase tracking-[0.4em] font-display">Nuestra Cultura</h3>
                        </div>
                        <div className="text-sm md:text-base text-slate-700 font-bold leading-relaxed tracking-tight mb-6 italic border-l-4 border-indigo-100 pl-6 whitespace-pre-line">
                            {data.content.description}
                        </div>
                        
                        <div className="h-px w-full bg-slate-100 mb-6" />
                        
                        <div className="flex items-center gap-3 mb-3">
                            <OrganicShape bg="bg-emerald-500" color="text-white" className="w-7 h-7">
                                <Target size={14} />
                            </OrganicShape>
                            <h3 className="text-slate-900 font-black text-[8px] uppercase tracking-[0.4em] font-display">Visión de Futuro</h3>
                        </div>
                        <div className="relative">
                            <Quote size={32} className="absolute -top-3 -left-1 text-indigo-50 opacity-10" fill="currentColor" />
                            <p className="text-base md:text-lg font-black text-slate-900 leading-[1.1] tracking-tighter font-display uppercase relative z-10">
                                {data.content.vision}
                            </p>
                        </div>
                    </div>
                </div>
            </GlassCard>
          </motion.div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <motion.div variants={itemVariants} className="mb-6 pl-6 border-l-4 border-indigo-600">
            <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-1">ADN Organizacional</h4>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase font-display leading-none">Valores fyo</h2>
          </motion.div>
          {data.content.valores.map((valor: any, i: number) => {
            const Icon = IconMap[valor.icon] || Sparkles;
            const bubbleBg = valor.color || 'bg-indigo-50';
            const bubbleText = valor.color ? 'text-white' : 'text-indigo-600';
            return (
              <motion.div key={i} variants={itemVariants}>
                <div className="p-4 md:p-5 flex items-center gap-6 bg-white/95 backdrop-blur-3xl rounded-[2rem] shadow-xl hover:-translate-x-4 transition-all duration-700 group cursor-default border border-white/80 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <GlowIcon icon={Icon} color={bubbleText} bg={bubbleBg} size={24} />
                  </div>
                  <span className="text-lg md:text-xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors uppercase font-display relative z-10">
                    {valor.title}
                  </span>
                  <div className="absolute right-6 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                    <Icon size={60} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  );
};
;

// 6. Grid Slide (Companies)
export const GridSlide: React.FC<SlideProps> = ({ data }) => {
  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 py-8 h-full items-stretch max-w-7xl mx-auto px-6" initial="hidden" animate="show" variants={containerVariants}>
      {data.content.items.map((item: any, idx: number) => {
        const Icon = IconMap[item.icon] || Users;
        const colors = [
          { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', glow: 'shadow-indigo-500/20' },
          { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', glow: 'shadow-emerald-500/20' },
          { text: 'text-slate-900', bg: 'bg-slate-100', border: 'border-slate-200', glow: 'shadow-slate-500/20' }
        ];
        const style = colors[idx % colors.length];

        const titleParts = item.title.split(' ');
        const emoji = titleParts.length > 1 ? titleParts[titleParts.length - 1] : '';
        const cleanTitle = titleParts.length > 1 ? titleParts.slice(0, -1).join(' ') : item.title;

        return (
          <motion.div variants={itemVariants} key={idx} className="h-full">
            <GlassCard className={`p-8 flex flex-col h-full bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl group hover:-translate-y-4 transition-all duration-700 border border-white relative overflow-hidden`}>
              <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 ${style.bg}`} />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <GlowIcon icon={Icon} color={style.text} bg={style.bg} size={28} />
                <motion.span 
                    animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 4, delay: idx * 0.5 }}
                    className="text-3xl drop-shadow-md"
                >
                    {emoji}
                </motion.span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 mb-3 tracking-tighter font-display group-hover:text-indigo-600 transition-colors uppercase leading-[0.85]">
                {cleanTitle}
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 font-bold leading-relaxed mb-8 flex-grow tracking-tight opacity-80">
                {item.desc}
              </p>
              
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3 relative z-10">
                <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-black uppercase tracking-[0.4em] ${style.text} opacity-30 group-hover:opacity-100 transition-opacity`}>{item.link}</span>
                </div>
                <motion.a 
                    href={`https://${item.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl ${style.bg} ${style.text} flex items-center justify-center gap-2 font-black text-[9px] tracking-[0.2em] uppercase shadow-lg border border-white transition-all group-hover:bg-indigo-600 group-hover:text-white`}
                >
                    Visitar Web
                    <Rocket size={14} />
                </motion.a>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// 9. Ecosystem Circles Slide
export const EcosystemCirclesSlide: React.FC<SlideProps> = ({ data }) => {
    const { items } = data.content;
    const [radius, setRadius] = useState(180);
    
    useEffect(() => {
        const updateRadius = () => {
            const width = window.innerWidth;
            if (width > 1280) setRadius(180);
            else if (width > 768) setRadius(150);
            else setRadius(100);
        };
        updateRadius();
        window.addEventListener('resize', updateRadius);
        return () => window.removeEventListener('resize', updateRadius);
    }, []);

    return (
        <motion.div className="flex flex-col justify-center items-center h-full py-4 max-w-7xl mx-auto px-6" initial="hidden" animate="show" variants={containerVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center w-full">
                <div className="lg:col-span-4 space-y-4">
                    <motion.div variants={itemVariants}>
                        <div className="relative p-6 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white shadow-2xl overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-indigo-500/10 transition-colors duration-700" />
                            
                            <div className="relative z-10">
                                <Quote className="text-indigo-600/20 mb-3" size={24} fill="currentColor" />
                                <div className="text-base md:text-lg text-slate-700 font-bold leading-relaxed tracking-tight italic whitespace-pre-line">
                                    {data.subtitle}
                                </div>
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.3em]">Propuesta de Valor</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="lg:col-span-8 relative min-h-[350px] md:min-h-[450px] flex items-center justify-center overflow-visible">
                    {/* Background Decorative Rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                            className="w-[80%] h-[80%] border border-indigo-200/40 rounded-full border-dashed" 
                        />
                        <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                            className="w-[55%] h-[55%] border border-indigo-100/30 rounded-full border-dashed" 
                        />
                    </div>

                    {/* Central Hub */}
                    <motion.div 
                        variants={itemVariants}
                        className="relative z-20"
                    >
                        {/* Pulse Effect */}
                        <motion.div 
                            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl" 
                        />
                        
                        <div className="w-16 h-16 md:w-32 md:h-32 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs md:text-2xl shadow-[0_0_40px_rgba(79,70,229,0.4)] border-2 md:border-4 border-white relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <motion.span
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                fyo
                            </motion.span>
                        </div>
                    </motion.div>

                    {/* Static Nodes with Connecting Lines */}
                    {items.map((item: any, i: number) => {
                        const angle = (i * (360 / items.length) - 90) * (Math.PI / 180);
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                            <React.Fragment key={i}>
                                {/* Connecting Line - Organic Style */}
                                <motion.div 
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    animate={{ scaleX: 1, opacity: 0.4 }}
                                    transition={{ delay: 0.8 + (i * 0.1), duration: 1.5, ease: "circOut" }}
                                    style={{ 
                                        width: radius,
                                        left: '50%',
                                        top: '50%',
                                        transformOrigin: 'left center',
                                        rotate: `${(i * (360 / items.length) - 90)}deg`
                                    }}
                                    className="absolute h-[1px] bg-gradient-to-r from-indigo-600 via-indigo-400 to-transparent z-0"
                                >
                                    <motion.div 
                                        animate={{ x: [0, radius, 0], opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-400/30 rounded-full blur-sm"
                                    />
                                </motion.div>
                                
                                {/* Node */}
                                <motion.div
                                    variants={itemVariants}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1, x, y }}
                                    whileHover={{ scale: 1.1, y: y - 5, zIndex: 50 }}
                                    className="absolute z-30"
                                >
                                    <div className={`px-4 py-2 md:px-8 md:py-4 rounded-full ${item.color} text-white font-black text-[9px] md:text-[12px] shadow-xl border-2 border-white glass-border whitespace-nowrap uppercase tracking-tighter transition-all duration-500 hover:shadow-indigo-500/40`}>
                                        {item.name}
                                    </div>
                                </motion.div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

// 7. Activity Slide (Objectives Type)
export const ObjectivesSlide: React.FC<SlideProps> = ({ data }) => {
  return (
    <motion.div className="flex flex-col justify-center h-full py-8 max-w-6xl mx-auto px-6" initial="hidden" animate="show" variants={containerVariants}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <motion.div variants={itemVariants} className="flex-grow">
            <GlassCard className="h-full p-6 md:p-8 bg-white/40 border-white/60 shadow-xl rounded-[2rem] flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                    <OrganicShape bg="bg-slate-900" color="text-white" className="w-9 h-9">
                        <Target size={18} />
                    </OrganicShape>
                    <h3 className="text-slate-900 font-black text-[9px] uppercase tracking-[0.4em] font-display">Objetivo Principal</h3>
                </div>
                <p className="text-base md:text-lg text-slate-700 font-bold leading-relaxed tracking-tight font-display italic">
                {data.content.objective}
                </p>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard theme={data.theme} className="p-6 md:p-8 border-indigo-100 bg-indigo-600 text-white shadow-2xl rounded-[2rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <h3 className="text-white/60 font-black text-[9px] mb-4 flex items-center gap-2 uppercase tracking-[0.3em] relative z-10">
                <Lightbulb className="text-white" size={16} />
                Consigna de Trabajo
              </h3>
              <p className="text-white font-bold leading-relaxed text-sm md:text-base tracking-tight relative z-10">
                {data.content.consigna}
              </p>
            </GlassCard>
          </motion.div>
        </div>

        <div className="lg:col-span-5">
          <motion.div variants={itemVariants} className="h-full">
            <GlassCard theme={data.theme} className="h-full p-6 md:p-8 border-slate-100 bg-white shadow-2xl rounded-[2rem] flex flex-col">
              <h3 className="text-slate-400 font-black text-[9px] mb-6 uppercase tracking-[0.3em] flex items-center gap-3">
                <ClipboardCheck className="text-indigo-600" size={18} />
                Competencias a Evaluar
              </h3>
              <div className="space-y-2 flex-grow flex flex-col justify-center">
                {data.content.competencies.map((comp: string, i: number) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 8, backgroundColor: '#f8fafc' }}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm transition-all duration-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                    <span className="font-black text-slate-700 uppercase text-[9px] tracking-widest">{comp}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-[10px]">fyo</div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Assessment Center</span>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// 8. Closing Slide
export const ClosingSlide: React.FC<SlideProps> = ({ data, onJumpToSlide }) => {
    const { description } = data.content;
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = async () => {
        setIsPrinting(true);
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const slidesToPrint = [7, 8, 9]; // Indices for slides 8, 9, 10
            
            const printContainer = document.createElement('div');
            printContainer.style.position = 'absolute';
            printContainer.style.left = '-9999px';
            printContainer.style.top = '0';
            printContainer.style.width = '210mm';
            document.body.appendChild(printContainer);

            for (let i = 0; i < slidesToPrint.length; i++) {
                const slideIndex = slidesToPrint[i];
                const slideData = SLIDES[slideIndex];
                
                const slideElement = document.createElement('div');
                slideElement.style.width = '210mm';
                slideElement.style.minHeight = '297mm';
                slideElement.style.padding = '15mm 15mm';
                slideElement.style.backgroundColor = 'white';
                slideElement.style.color = '#111827';
                slideElement.style.fontFamily = 'Outfit, sans-serif';
                slideElement.style.display = 'flex';
                slideElement.style.flexDirection = 'column';
                slideElement.style.position = 'relative';
                slideElement.style.boxSizing = 'border-box';

                // Header
                const header = document.createElement('div');
                header.style.display = 'flex';
                header.style.justifyContent = 'space-between';
                header.style.alignItems = 'flex-start';
                header.style.marginBottom = '4mm';
                header.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 4mm;">
                        <div style="background: #111827; color: white; width: 14mm; height: 14mm; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16pt; letter-spacing: -1px;">fyo</div>
                        <div>
                            <div style="font-weight: 900; font-size: 18pt; text-transform: uppercase; letter-spacing: -0.5px; color: #111827; line-height: 1;">GUÍA DEL CANDIDATO</div>
                            <div style="font-weight: 800; font-size: 8pt; text-transform: uppercase; letter-spacing: 1px; color: #4F46E5; margin-top: 1mm;">ASSESSMENT CENTER | DINÁMICA 2: FASE ${i === 1 ? '2' : '1'}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 7pt; color: #9CA3AF; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2mm;">PÁGINA ${i + 1} DE ${slidesToPrint.length}</div>
                        <div style="background: ${i === 1 ? '#FEF2F2' : '#F3F4F6'}; color: ${i === 1 ? '#EF4444' : '#9CA3AF'}; padding: 1mm 4mm; border-radius: 4px; font-weight: 900; font-size: 7pt; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
                            ${i === 1 ? 'URGENTE' : 'CONFIDENCIAL'}
                        </div>
                    </div>
                `;
                slideElement.appendChild(header);

                // Thick Black Line
                const line = document.createElement('div');
                line.style.height = '1.2mm';
                line.style.backgroundColor = '#111827';
                line.style.width = '100%';
                line.style.marginBottom = '6mm';
                slideElement.appendChild(line);

                // Candidate Name Section
                const nameSection = document.createElement('div');
                nameSection.style.marginBottom = '8mm';
                nameSection.innerHTML = `
                    <div style="display: flex; align-items: flex-end; gap: 3mm;">
                        <span style="font-size: 8pt; font-weight: 900; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; white-space: nowrap;">NOMBRE DEL CANDIDATO:</span>
                        <div style="flex: 1; border-bottom: 1px solid #E5E7EB; height: 4mm;"></div>
                    </div>
                `;
                slideElement.appendChild(nameSection);
                
                // Content
                const contentDiv = document.createElement('div');
                contentDiv.style.flex = '1';
                
                if (slideData.type === 'interactive-dynamic') {
                    const phase = slideData.content.phase;
                    if (phase === 1) {
                        // Page 1: Construcción y Logística
                        contentDiv.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 3mm; margin-bottom: 8mm;">
                                <div style="width: 8mm; height: 8mm; background: #4F46E5; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                                </div>
                                <h2 style="font-size: 16pt; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; margin: 0; color: #111827;">CONSTRUCCIÓN Y LOGÍSTICA</h2>
                            </div>

                            <div style="background: #F9FAFB; border: 1px solid #F3F4F6; padding: 6mm 8mm; border-radius: 12px; margin-bottom: 8mm;">
                                <div style="display: flex; align-items: center; gap: 3mm; margin-bottom: 3mm;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2 2"/><path d="m7.8 16.2 2-2"/><path d="m12 12 4-4"/><path d="m12 12-4 4"/><path d="M12 7v2"/><path d="M12 15v2"/><path d="M17 12h-2"/><path d="M9 12H7"/></svg>
                                    <h3 style="font-size: 9pt; font-weight: 900; color: #4F46E5; text-transform: uppercase; letter-spacing: 1px; margin: 0;">CONSIGNA GENERAL</h3>
                                </div>
                                <p style="font-size: 11pt; line-height: 1.5; color: #374151; margin: 0; font-weight: 700; font-style: italic;">
                                    "${slideData.content.consigna}"
                                </p>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin-bottom: 8mm;">
                                ${slideData.content.roles.map((r: any) => `
                                    <div style="border: 1px solid #F3F4F6; padding: 5mm; border-radius: 12px; background: white;">
                                        <div style="display: flex; align-items: center; gap: 2mm; margin-bottom: 2mm;">
                                            <div style="width: 2mm; height: 2mm; background: #4F46E5; border-radius: 50%;"></div>
                                            <div style="font-weight: 900; font-size: 10pt; color: #111827; text-transform: uppercase;">${r.title}</div>
                                        </div>
                                        <p style="font-size: 8pt; color: #6B7280; margin: 0; line-height: 1.4; font-weight: 600;">${r.desc}</p>
                                    </div>
                                `).join('')}
                            </div>

                            <div style="background: #F9FAFB; border: 1px solid #F3F4F6; padding: 6mm 8mm; border-radius: 12px; margin-bottom: 8mm;">
                                <div style="display: flex; align-items: center; gap: 3mm; margin-bottom: 4mm;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                                    <h3 style="font-size: 9pt; font-weight: 900; color: #111827; text-transform: uppercase; letter-spacing: 1px; margin: 0;">RECOMENDACIONES PARA EL EQUIPO</h3>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6mm;">
                                    <div style="display: flex; gap: 2mm;">
                                        <div style="width: 1.5mm; height: 1.5mm; background: #4F46E5; border-radius: 50%; margin-top: 1.5mm; flex-shrink: 0;"></div>
                                        <p style="font-size: 8pt; color: #4B5563; font-weight: 700; line-height: 1.4; margin: 0;">El tiempo vuela. No se estanquen en elegir el nombre perfecto; el negocio tiene que avanzar.</p>
                                    </div>
                                    <div style="display: flex; gap: 2mm;">
                                        <div style="width: 1.5mm; height: 1.5mm; background: #4F46E5; border-radius: 50%; margin-top: 1.5mm; flex-shrink: 0;"></div>
                                        <p style="font-size: 8pt; color: #4B5563; font-weight: 700; line-height: 1.4; margin: 0;">Piensen en el cliente, pero protejan la rentabilidad de su agencia.</p>
                                    </div>
                                    <div style="display: flex; gap: 2mm;">
                                        <div style="width: 1.5mm; height: 1.5mm; background: #4F46E5; border-radius: 50%; margin-top: 1.5mm; flex-shrink: 0;"></div>
                                        <p style="font-size: 8pt; color: #4B5563; font-weight: 700; line-height: 1.4; margin: 0;">Escúchense. Un equipo desalineado pierde clientes.</p>
                                    </div>
                                </div>
                            </div>

                            <div style="margin-top: auto;">
                                <div style="display: flex; align-items: center; gap: 3mm; margin-bottom: 4mm; border-top: 1px dashed #E5E7EB; padding-top: 6mm;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    <h3 style="font-size: 8pt; font-weight: 900; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin: 0;">ESPACIO PARA ANOTACIONES PERSONALES</h3>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 8mm;">
                                    ${[1, 2, 3, 4, 5, 6].map(() => `<div style="border-bottom: 1px solid #F3F4F6; height: 2mm;"></div>`).join('')}
                                </div>
                            </div>
                        `;
                    } else {
                        // Page 2: Gestión de Crisis
                        contentDiv.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 3mm; margin-bottom: 8mm;">
                                <div style="width: 8mm; height: 8mm; background: #EF4444; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                </div>
                                <h2 style="font-size: 16pt; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; margin: 0; color: #EF4444;">GESTIÓN DE CRISIS</h2>
                            </div>

                            <div style="background: #FFF5F5; border: 1px solid #FEE2E2; padding: 6mm 8mm; border-radius: 12px; margin-bottom: 8mm;">
                                <div style="display: flex; align-items: center; gap: 3mm; margin-bottom: 3mm;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 10h3L11 22l2-10h-3l2-10z"/></svg>
                                    <h3 style="font-size: 9pt; font-weight: 900; color: #EF4444; text-transform: uppercase; letter-spacing: 1px; margin: 0;">CONTEXTO CRÍTICO</h3>
                                </div>
                                <p style="font-size: 11pt; line-height: 1.5; color: #374151; margin: 0; font-weight: 700; font-style: italic;">
                                    Durante esta fase, el equipo enfrentará situaciones imprevistas que pondrán a prueba su capacidad de reacción y toma de decisiones estratégica.
                                </p>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr; gap: 4mm; margin-bottom: 8mm;">
                                ${slideData.content.cards.map((c: any, idx: number) => `
                                    <div style="display: flex; gap: 6mm; align-items: center; border: 1px solid #F3F4F6; padding: 6mm; border-radius: 16px; background: white;">
                                        <div style="display: flex; flex-direction: column; align-items: center; gap: 2mm; width: 12mm;">
                                            <span style="font-weight: 900; font-size: 10pt; color: #EF4444;">${idx + 1}</span>
                                            <div style="width: 8mm; height: 8mm; background: #FFF5F5; color: #EF4444; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 10h3L11 22l2-10h-3l2-10z"/></svg>
                                            </div>
                                        </div>
                                        <div style="flex: 1;">
                                            <h4 style="font-weight: 900; font-size: 11pt; color: #111827; margin-bottom: 1.5mm; text-transform: uppercase;">${c.frontText}</h4>
                                            <p style="font-size: 9pt; color: #4B5563; margin: 0; line-height: 1.5; font-style: italic; font-weight: 600;">"${c.backText}"</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            <div style="margin-top: auto;">
                                <div style="display: flex; align-items: center; gap: 3mm; margin-bottom: 4mm; border-top: 1px dashed #E5E7EB; padding-top: 6mm;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    <h3 style="font-size: 8pt; font-weight: 900; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin: 0;">PLAN DE ACCIÓN Y RESOLUCIONES</h3>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 8mm;">
                                    ${[1, 2, 3, 4, 5, 6].map(() => `<div style="border-bottom: 1px solid #F3F4F6; height: 2mm;"></div>`).join('')}
                                </div>
                            </div>
                        `;
                    }
                } else if (slideData.type === 'investment') {
                    // Page 3: Ficha de Inversión
                    contentDiv.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 3mm; margin-bottom: 8mm;">
                            <div style="width: 8mm; height: 8mm; background: #10B981; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            </div>
                            <h2 style="font-size: 16pt; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; margin: 0; color: #111827;">FICHA DE INVERSIÓN</h2>
                        </div>

                        <div style="background: #F0FDF4; border: 1px solid #DCFCE7; padding: 6mm 8mm; border-radius: 12px; margin-bottom: 8mm; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 3mm; margin-bottom: 2mm;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                                    <h3 style="font-size: 9pt; font-weight: 900; color: #10B981; text-transform: uppercase; letter-spacing: 1px; margin: 0;">PRESUPUESTO ASIGNADO</h3>
                                </div>
                                <p style="font-size: 10pt; color: #374151; margin: 0; font-weight: 700;">Seleccione una opción por tópico marcando con una "X".</p>
                            </div>
                            <div style="background: #111827; color: white; padding: 4mm 8mm; border-radius: 12px; font-weight: 900; font-size: 18pt; letter-spacing: -1px;">
                                $${slideData.content.budget.toLocaleString()}
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr; gap: 6mm;">
                            ${slideData.content.topics.map((t: any) => `
                                <div style="border: 1px solid #F3F4F6; border-radius: 16px; overflow: hidden; background: white;">
                                    <div style="background: #F9FAFB; padding: 3mm 6mm; border-bottom: 1px solid #F3F4F6;">
                                        <h4 style="font-size: 9pt; font-weight: 900; color: #111827; text-transform: uppercase; letter-spacing: 1px; margin: 0;">${t.title}</h4>
                                    </div>
                                    <div style="padding: 4mm 6mm; display: grid; grid-template-columns: 1fr; gap: 3mm;">
                                        ${t.options.map((o: any) => `
                                            <div style="display: flex; align-items: center; gap: 4mm; padding: 2mm 0;">
                                                <div style="width: 6mm; height: 6mm; border: 2px solid #D1D5DB; border-radius: 4px; flex-shrink: 0; background: white;"></div>
                                                <div style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                                                    <div>
                                                        <span style="font-weight: 800; font-size: 10pt; color: #111827;">${o.name}</span>
                                                        <span style="font-size: 8pt; color: #9CA3AF; margin-left: 2mm; font-weight: 600;">${o.desc}</span>
                                                    </div>
                                                    <span style="font-weight: 900; font-size: 10pt; color: #4F46E5;">$${o.price.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div style="margin-top: auto; background: #111827; color: white; padding: 6mm 8mm; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; margin-top: 8mm;">
                            <div style="font-weight: 900; font-size: 11pt; text-transform: uppercase; letter-spacing: 1px;">TOTAL INVERTIDO: $ _______________</div>
                            <div style="font-weight: 900; font-size: 11pt; text-transform: uppercase; letter-spacing: 1px;">SALDO DISPONIBLE: $ _______________</div>
                        </div>
                    `;
                }

                slideElement.appendChild(contentDiv);

                // Footer
                const footer = document.createElement('div');
                footer.style.marginTop = '8mm';
                footer.style.borderTop = '1px solid #F3F4F6';
                footer.style.paddingTop = '4mm';
                footer.style.display = 'flex';
                footer.style.justifyContent = 'space-between';
                footer.style.fontSize = '7pt';
                footer.style.fontWeight = '800';
                footer.style.color = '#9CA3AF';
                footer.style.textTransform = 'uppercase';
                footer.style.letterSpacing = '1px';
                footer.innerHTML = `
                    <div>fyo Assessment Center | Dinámica 2 | Documento de Trabajo</div>
                    <div style="color: #111827;">Propiedad de fyo - Talentos</div>
                `;
                slideElement.appendChild(footer);

                printContainer.appendChild(slideElement);

                const canvas = await html2canvas(slideElement, { 
                    scale: 3,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    windowWidth: 1200
                });
                const imgData = canvas.toDataURL('image/png');
                
                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
                
                printContainer.removeChild(slideElement);
            }

            pdf.save('Guia_Candidato_fyo_2025.pdf');
            document.body.removeChild(printContainer);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsPrinting(false);
        }
    };
    return (
        <motion.div 
            className="flex flex-col justify-center items-center h-full text-center relative max-w-5xl mx-auto px-6 py-4 overflow-hidden" 
            initial="hidden" 
            animate="show" 
            variants={containerVariants}
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
            
            {/* Celebration Dots */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{ 
                        y: [0, -20, 0],
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 5
                    }}
                    className="absolute w-2 h-2 rounded-full bg-indigo-400/30"
                    style={{ 
                        top: `${Math.random() * 100}%`, 
                        left: `${Math.random() * 100}%` 
                    }}
                />
            ))}

            <motion.div variants={itemVariants} className="mb-8 relative z-10">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-2xl mx-auto border-4 border-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    fyo
                </div>
            </motion.div>

            <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9] font-display uppercase flex items-center justify-center gap-4"
            >
                {data.title || "¡MUCHAS GRACIAS!"}
            </motion.h1>

            <motion.div variants={itemVariants} className="flex items-center justify-center gap-6 mb-10 w-full">
                <div className="h-1 w-16 md:w-24 bg-indigo-600 rounded-full opacity-80" />
                <h2 className="text-lg md:text-2xl font-black text-indigo-600 tracking-[0.1em] font-display">
                    {data.subtitle || "equipo fyo"}
                </h2>
                <div className="h-1 w-16 md:w-24 bg-indigo-600 rounded-full opacity-80" />
            </motion.div>

            <motion.div variants={itemVariants} className="max-w-3xl mb-16">
                <p className="text-xl md:text-2xl text-slate-600 font-bold leading-relaxed tracking-tight italic">
                    {description}
                </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-6 w-full justify-center">
                <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onJumpToSlide && onJumpToSlide(0)}
                    className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white rounded-full font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 group"
                >
                    <RotateCcw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                    Reiniciar Presentación
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrint}
                    disabled={isPrinting}
                    className="w-full md:w-auto px-10 py-5 bg-white text-indigo-600 border-2 border-indigo-600 rounded-full font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPrinting ? (
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <FileDown size={18} className="group-hover:translate-y-1 transition-transform" />
                    )}
                    Imprimir Guía del Candidato
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

// 9. Interactive Dynamic Slide
const FlipCard = ({ color, frontText, backText, icon: Icon = Zap }: { color: string, frontText: string, backText: string, icon?: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-40 md:h-44 cursor-pointer group"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div 
          className={`absolute inset-0 rounded-2xl ${color} flex flex-col items-center justify-center p-4 shadow-md border border-white/10 transition-all group-hover:brightness-105`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-3 backdrop-blur-md border border-white/10">
            <Icon className="text-white" size={24} />
          </div>
          <span className="text-white font-black text-xs tracking-[0.2em] uppercase text-center leading-tight opacity-60">Descubrir</span>
          <div className="mt-4 px-3 py-1 bg-black/5 rounded-full text-[8px] text-white/40 font-bold tracking-[0.1em] uppercase border border-white/5">Click para girar</div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 rounded-2xl bg-white flex flex-col items-center justify-center p-5 shadow-md border border-slate-100 overflow-y-auto custom-scrollbar"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-widest mb-3 border-b border-slate-100 pb-2 w-full text-center">{frontText}</h4>
          <p className="text-slate-800 font-bold text-center text-[10px] md:text-[11px] leading-relaxed relative z-10">
            {backText}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const InteractiveDynamicSlide: React.FC<SlideProps> = ({ data }) => {
  const { phase, consigna, alertText, cards, roles, rolesIntro } = data.content;
  const [activeRole, setActiveRole] = useState<number | null>(null);

  return (
    <motion.div 
      className="w-full h-full flex flex-col items-center justify-center px-6 py-10 overflow-y-auto custom-scrollbar"
      initial="hidden" 
      animate="show" 
      variants={containerVariants}
    >
      {phase === 1 ? (
        <div className="w-full max-w-7xl flex flex-col items-center gap-8 md:gap-10">
          {/* Top Section: Consigna and Interactive Roles */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Consigna */}
            <GlassCard className="lg:col-span-5 p-8 bg-white shadow-xl rounded-[2rem] flex flex-col justify-center border-l-8 border-indigo-600">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm">
                    <ClipboardCheck size={28} />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.4em] font-display">Consigna de trabajo</h3>
              </div>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-bold italic">
                {consigna}
              </p>
            </GlassCard>

            {/* Interactive Roles Selector */}
            <div className="lg:col-span-7 bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-center relative z-10">{rolesIntro}</h4>
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                {roles?.map((role: any, idx: number) => {
                  const Icon = IconMap[role.icon] || Users;
                  const isActive = activeRole === idx;
                  return (
                    <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setActiveRole(isActive ? null : idx)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all duration-500 border-2 ${
                            isActive ? 'bg-indigo-600 border-indigo-400 shadow-indigo-500/20' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-700'}`}>
                                <Icon size={18} className="text-white" />
                            </div>
                            <span className="text-white font-black text-[10px] uppercase tracking-widest">{role.title}</span>
                        </div>
                        <AnimatePresence>
                            {isActive && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-[10px] text-indigo-100 mt-4 leading-relaxed font-medium">
                                        {role.desc}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cards Row (Products) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
            {cards.map((card: any) => (
              <FlipCard key={card.id} {...card} icon={Briefcase} />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-7xl flex flex-col items-center gap-8">
          {/* News Header - Top (Breaking News Style) */}
          <motion.div 
            variants={itemVariants}
            animate={{ 
                boxShadow: ["0 0 0px rgba(239, 68, 68, 0)", "0 0 40px rgba(239, 68, 68, 0.4)", "0 0 0px rgba(239, 68, 68, 0)"]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-full bg-red-600 text-white py-8 px-12 rounded-[2rem] flex items-center justify-between shadow-2xl border-b-8 border-red-800 overflow-hidden relative gap-8"
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
            <div className="flex items-center gap-8 relative z-10">
              <div className="bg-white text-red-600 p-4 rounded-2xl shadow-xl animate-bounce">
                <AlertCircle size={48} />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-70 block mb-2">Último Momento</span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic font-display leading-none">{alertText}</h2>
              </div>
            </div>
          </motion.div>

          {/* News Cards Row - Bottom */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl">
            {cards.map((card: any) => (
              <FlipCard key={card.id} {...card} icon={AlertCircle} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// 12. Investment Slide
export const InvestmentSlide: React.FC<SlideProps> = ({ data }) => {
  const { budget, topics } = data.content;
  const [selections, setSelections] = useState<Record<string, string | null>>({
    providers: null,
    support: null,
    insurance: null
  });

  const toggleSelection = (topicId: string, optionId: string) => {
    setSelections(prev => ({
      ...prev,
      [topicId]: prev[topicId] === optionId ? null : optionId
    }));
  };

  const totalSpent = Object.entries(selections).reduce((acc, [topicId, optionId]) => {
    if (!optionId) return acc;
    const topic = topics.find((t: any) => t.id === topicId);
    const option = topic?.options.find((o: any) => o.id === optionId);
    return acc + (option?.price || 0);
  }, 0);

  const remainingBudget = budget - totalSpent;
  const isOverBudget = remainingBudget < 0;

  return (
    <motion.div 
      className="flex flex-col h-full py-2 max-w-7xl mx-auto px-6 overflow-hidden" 
      initial="hidden" 
      animate="show" 
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full items-stretch">
        {/* Left Column: Topics and Options */}
        <div className="lg:col-span-8 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {topics.map((topic: any) => (
            <motion.div key={topic.id} variants={itemVariants} className="space-y-2">
              <h3 className="text-slate-900 font-black text-xs uppercase tracking-widest border-l-4 border-indigo-600 pl-3">
                {topic.title}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {topic.options.map((option: any) => {
                  const isSelected = selections[topic.id] === option.id;
                  return (
                    <GlassCard 
                      key={option.id}
                      onClick={() => toggleSelection(topic.id, option.id)}
                      className={`p-3 cursor-pointer transition-all duration-300 border-2 ${
                        isSelected 
                          ? 'bg-indigo-50 border-indigo-500 shadow-indigo-100' 
                          : 'bg-white border-slate-100 hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-grow">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check size={12} strokeWidth={4} />}
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-black text-[10px] md:text-xs uppercase tracking-tight ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                              {option.name}
                            </span>
                            <p className={`text-[9px] md:text-[10px] font-bold leading-tight ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`}>
                              {option.desc}
                            </p>
                          </div>
                        </div>
                        <div className={`text-xs md:text-sm font-black whitespace-nowrap ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                          ${option.price.toLocaleString()}
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <motion.div variants={itemVariants} className="h-full">
            <GlassCard className="h-full p-5 md:p-6 bg-white border-white/80 shadow-2xl rounded-[2rem] relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
              
              <div className="relative z-10 mb-6">
                <h3 className="text-slate-900 font-black text-base md:text-lg uppercase tracking-tighter leading-tight mb-1">
                  Resumen de Inversión
                </h3>
                <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest opacity-70">
                  Control de Presupuesto
                </p>
              </div>

              <div className="relative z-10 space-y-4 flex-grow">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Presupuesto Total</span>
                  <span className="text-xl font-black text-slate-900">${budget.toLocaleString()}</span>
                </div>

                <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block mb-1">Total Invertido</span>
                  <span className={`text-xl font-black ${isOverBudget ? 'text-red-600' : 'text-indigo-600'}`}>
                    ${totalSpent.toLocaleString()}
                  </span>
                </div>

                <div className={`p-3 rounded-2xl border ${isOverBudget ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${isOverBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isOverBudget ? 'Excedente' : 'Disponible'}
                  </span>
                  <span className={`text-xl font-black ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                    ${Math.abs(remainingBudget).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 relative z-10">
                {isOverBudget ? (
                  <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle size={18} />
                    <span className="text-[9px] font-black uppercase tracking-tight">Presupuesto excedido</span>
                  </div>
                ) : totalSpent === 0 ? (
                  <div className="flex items-center gap-3 text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Clock size={18} />
                    <span className="text-[9px] font-black uppercase tracking-tight">Esperando selección...</span>
                  </div>
                ) : null}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// 13. Candidate Guide Slide
export const CandidateGuideSlide: React.FC<SlideProps> = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Get data from other slides
  const phase1Data = SLIDES.find(s => s.id === 'dinamica-2')?.content;
  const investmentData = SLIDES.find(s => s.id === 'investment-sheet')?.content;
  const phase2Data = SLIDES.find(s => s.id === 'dinamica-2-crisis')?.content;

  const downloadPDF = async () => {
    console.log('Starting PDF generation...');
    setIsGenerating(true);
    
    try {
      const element = document.getElementById('pdf-content');
      if (!element) {
        throw new Error('PDF content element not found');
      }

      // Ensure all images are loaded
      const images = element.getElementsByTagName('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      }));

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pages = element.querySelectorAll('.pdf-page');
      console.log(`Found ${pages.length} pages to process`);
      
      for (let i = 0; i < pages.length; i++) {
        console.log(`Processing page ${i + 1}...`);
        const page = pages[i] as HTMLElement;
        
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: page.offsetWidth,
          height: page.offsetHeight,
          windowWidth: page.offsetWidth,
          windowHeight: page.offsetHeight
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      }
      
      console.log('Saving PDF...');
      pdf.save('Guia_del_Candidato_fyo.pdf');
      console.log('PDF saved successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: try to at least show what happened
      if (error instanceof Error) {
        alert('Error al generar PDF: ' + error.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full py-8 max-w-6xl mx-auto px-6" 
      initial="hidden" 
      animate="show" 
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        <div className="lg:col-span-5 space-y-8">
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 mb-6">
              <FileDown size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Material de apoyo</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6 uppercase font-display">
              Guía del <span className="text-indigo-600">Candidato</span>
            </h2>
            <p className="text-lg text-slate-600 font-bold leading-relaxed mb-8">
              Descarga la ficha técnica de la dinámica. Incluye la consigna, roles del equipo, ficha de inversión y el contexto de crisis para trabajar durante la jornada.
            </p>
            
            <div className="space-y-4 mb-10">
              {[
                'Consigna general y roles del equipo',
                'Ficha de inversión interactiva',
                'Contexto de crisis y resolución',
                'Espacio para anotaciones personales'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadPDF}
              disabled={isGenerating}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl transition-all ${
                isGenerating 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              {isGenerating ? (
                <>
                  <RotateCcw size={20} className="animate-spin" />
                  Generando PDF...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Descargar Guía (PDF)
                </>
              )}
            </motion.button>
          </motion.div>
        </div>

        <div className="lg:col-span-7">
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <GlassCard className="p-2 bg-white/40 border-white/60 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="aspect-[3/4] bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200 flex flex-col items-center justify-center p-12 text-center group-hover:bg-white transition-colors duration-500">
                <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-700">
                  <FileSignature size={48} />
                </div>
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Vista Previa</h4>
                <p className="text-sm text-slate-500 font-bold max-w-xs">
                  El documento se generará con el formato oficial de fyo para el Assessment Center.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Hidden PDF Content */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: '-10000px', 
          width: '210mm', 
          zIndex: -9999,
          pointerEvents: 'none',
          background: 'white'
        }}
      >
        <div id="pdf-content" className="w-[210mm] bg-white text-slate-900 font-sans">
          {/* Page 1: Phase 1 & Investment */}
          <div className="pdf-page w-[210mm] min-h-[297mm] p-[15mm] flex flex-col relative overflow-hidden bg-white">
            {/* Header */}
            <div className="flex justify-between items-start border-b-4 border-slate-900 pb-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 text-white px-4 py-2 font-black text-2xl rounded-lg">fyo</div>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Guía del Candidato</h1>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1">Assessment Center | Dinámica 2: Fase 1</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Página 1 de 2</p>
                <div className="mt-1 px-3 py-1 bg-slate-100 rounded text-[10px] font-black uppercase tracking-widest text-slate-500">Confidencial</div>
              </div>
            </div>

            {/* Candidate Name */}
            <div className="mb-10 border-b border-slate-200 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre del Candidato:</span>
              <div className="h-8 w-full border-b-2 border-slate-100 mt-1" />
            </div>

            {/* Section Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <Layers size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Construcción y Logística</h2>
            </div>

            {/* Consigna */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Compass size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Consigna General</span>
              </div>
              <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                "{phase1Data?.consigna}"
              </p>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {phase1Data?.roles.map((role: any) => (
                <div key={role.title} className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-900">{role.title}</span>
                  </div>
                  <p className="text-[9px] text-slate-500 leading-tight font-bold mb-2">{role.desc}</p>
                  <div className="mt-auto border-t border-slate-100 pt-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Nombre y Apellido:</span>
                    <div className="h-6 border-b border-slate-100" />
                  </div>
                </div>
              ))}
            </div>

            {/* Investment Sheet */}
            <div className="border-2 border-indigo-100 rounded-3xl p-6 bg-indigo-50/30 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-indigo-600" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Ficha de Inversión (Presupuesto: $200.000)</h3>
                </div>
              </div>
              <div className="space-y-4">
                {investmentData?.topics.map((topic: any) => (
                  <div key={topic.id} className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600">{topic.title}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {topic.options.map((opt: any) => (
                        <div key={opt.id} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-2">
                          <div className="w-4 h-4 border-2 border-indigo-600 rounded flex-shrink-0 flex items-center justify-center bg-indigo-50">
                            <Check size={10} className="text-indigo-600" strokeWidth={4} />
                          </div>
                          <div className="flex flex-col flex-grow">
                            <span className="text-[9px] font-black uppercase text-slate-900">{opt.name}</span>
                            <span className="text-[8px] text-slate-400 font-bold leading-none">{opt.desc}</span>
                          </div>
                          <span className="text-[10px] font-black text-indigo-600">${opt.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Recomendaciones para el equipo</span>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {phase1Data?.tips.map((tip: string, i: number) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-1 h-1 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                    <p className="text-[9px] font-bold text-slate-500 leading-tight">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Space for Notes */}
            <div className="mt-auto pt-8 border-t border-slate-100 border-dashed">
              <div className="flex items-center gap-2 mb-4">
                <PencilRuler size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Espacio para anotaciones personales</span>
              </div>
              <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-b border-slate-100 h-8" />
                ))}
              </div>
            </div>
          </div>

          {/* Page 2: Phase 2 (Crisis) */}
          <div className="pdf-page w-[210mm] min-h-[297mm] p-[15mm] flex flex-col relative overflow-hidden bg-white">
            {/* Header */}
            <div className="flex justify-between items-start border-b-4 border-slate-900 pb-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 text-white px-4 py-2 font-black text-2xl rounded-lg">fyo</div>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Guía del Candidato</h1>
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mt-1">Assessment Center | Dinámica 2: Fase 2</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Página 2 de 2</p>
                <div className="mt-1 px-3 py-1 bg-red-600 rounded text-[10px] font-black uppercase tracking-widest text-white">Urgente</div>
              </div>
            </div>

            {/* Section Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white">
                <AlertCircle size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-red-600">Gestión de Crisis</h2>
            </div>

            {/* Contexto Crítico */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} className="text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Contexto Crítico</span>
              </div>
              <p className="text-sm font-bold text-slate-700 leading-relaxed">
                Durante esta fase, el equipo enfrentará situaciones imprevistas que pondrán a prueba su capacidad de reacción y toma de decisiones estratégica.
              </p>
            </div>

            {/* Crisis Cards */}
            <div className="space-y-4 mb-10">
              {phase2Data?.cards.map((card: any, i: number) => (
                <div key={card.id} className="border border-slate-200 rounded-2xl p-6 flex items-start gap-6">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg font-black text-red-600">{i + 1}</span>
                    <Zap size={16} className="text-red-600 opacity-50" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">{card.frontText}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-bold italic">
                      "{card.backText}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Plan Section */}
            <div className="flex-grow flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <ClipboardCheck size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Plan de acción y resoluciones</span>
              </div>
              <div className="flex-grow space-y-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="border-b border-slate-100 h-8" />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-300">fyo Assessment Center JP 25-26 | Confidencial</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-red-600 italic">Crisis Management</p>
            </div>
          </div>

          {/* Page 3: Notes & Action Plan */}
          <div className="pdf-page w-[210mm] min-h-[297mm] p-[15mm] flex flex-col relative overflow-hidden bg-white">
            {/* Header */}
            <div className="flex justify-between items-start border-b-4 border-slate-900 pb-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 text-white px-4 py-2 font-black text-2xl rounded-lg">fyo</div>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Guía del Candidato</h1>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Assessment Center | Notas y Plan de Acción</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Página 3 de 3</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <PencilRuler size={16} className="text-indigo-600" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Notas y Observaciones</h3>
                </div>
                <div className="space-y-8">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="border-b border-slate-100 h-8" />
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-6">
                  <ClipboardCheck size={16} className="text-indigo-600" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Plan de Acción Final</h3>
                </div>
                <div className="space-y-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="border-b border-slate-100 h-8" />
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-auto pt-10 flex justify-between items-end">
              <div className="text-[8px] font-black uppercase tracking-widest text-slate-300">
                fyo | Talento & Cultura
              </div>
              <div className="w-48 border-t-2 border-slate-900 pt-2 text-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">Firma del Candidato</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

