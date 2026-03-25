import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Road } from '../types';
import { MAX_QUEUE_VISUAL } from '../lib/constants';
import { cn } from '../lib/utils';

interface Props {
  roads: Road[];
  activeRoadId: string | null;
  greenRemaining: number;
  greenDuration: number;
}

type Direction = 'north' | 'east' | 'south' | 'west';

const ROAD_CONFIG: Record<string, { direction: Direction; label: string; color: string }> = {
  A: { direction: 'north', label: 'NORTH', color: '#00d4ff' },
  B: { direction: 'east',  label: 'EAST',  color: '#7b61ff' },
  C: { direction: 'south', label: 'SOUTH', color: '#00ff88' },
  D: { direction: 'west',  label: 'WEST',  color: '#ffd700' },
};

const SIGNAL_COLORS = {
  green:  { bg: '#00ff88', glow: 'rgba(0,255,136,0.8)',  shadow: '0 0 20px 8px rgba(0,255,136,0.6), 0 0 40px 15px rgba(0,255,136,0.25)' },
  yellow: { bg: '#ffd700', glow: 'rgba(255,215,0,0.8)',   shadow: '0 0 20px 8px rgba(255,215,0,0.6)' },
  red:    { bg: '#ff2c56', glow: 'rgba(255,44,86,0.8)',   shadow: '0 0 12px 4px rgba(255,44,86,0.4)' },
};

function TrafficSignal({ isGreen, isWarning }: { isGreen: boolean; isWarning: boolean }) {
  const sig = isGreen ? SIGNAL_COLORS.green : isWarning ? SIGNAL_COLORS.yellow : SIGNAL_COLORS.red;
  return (
    <div className="flex flex-col items-center gap-1.5 bg-black/70 border border-white/10 rounded-lg p-2 backdrop-blur-sm">
      {/* Red */}
      <motion.div
        animate={{ opacity: !isGreen && !isWarning ? 1 : 0.15 }}
        className="w-4 h-4 rounded-full"
        style={{ 
          background: !isGreen && !isWarning ? SIGNAL_COLORS.red.bg : '#330a10',
          boxShadow: !isGreen && !isWarning ? SIGNAL_COLORS.red.shadow : 'none',
        }}
      />
      {/* Yellow */}
      <motion.div
        animate={{ opacity: isWarning ? 1 : 0.15 }}
        className="w-4 h-4 rounded-full"
        style={{ 
          background: isWarning ? SIGNAL_COLORS.yellow.bg : '#2a2000',
          boxShadow: isWarning ? SIGNAL_COLORS.yellow.shadow : 'none',
        }}
      />
      {/* Green */}
      <motion.div
        animate={{ 
          opacity: isGreen ? 1 : 0.15,
          boxShadow: isGreen ? [
            SIGNAL_COLORS.green.shadow,
            '0 0 30px 12px rgba(0,255,136,0.8), 0 0 60px 20px rgba(0,255,136,0.35)',
            SIGNAL_COLORS.green.shadow,
          ] : 'none',
        }}
        transition={{ 
          boxShadow: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="w-4 h-4 rounded-full"
        style={{ 
          background: isGreen ? SIGNAL_COLORS.green.bg : '#003318',
        }}
      />
    </div>
  );
}

function VehicleBlock({ isEmergency, delay }: { isEmergency: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "rounded-sm flex items-center justify-center text-[8px] font-bold shrink-0",
        isEmergency 
          ? "w-6 h-4 bg-red-500/80 border border-red-400 text-white" 
          : "w-5 h-3 bg-cyan-500/30 border border-cyan-400/50 text-cyan-300"
      )}
      style={{
        boxShadow: isEmergency 
          ? '0 0 8px rgba(255,44,86,0.8)' 
          : '0 0 4px rgba(0,212,255,0.3)',
      }}
    >
      {isEmergency ? '🚑' : ''}
    </motion.div>
  );
}

function RoadArm({ 
  road, 
  isActive, 
  greenRemaining, 
  greenDuration 
}: { 
  road: Road; 
  isActive: boolean; 
  greenRemaining: number;
  greenDuration: number;
}) {
  const cfg = ROAD_CONFIG[road.id];
  const visibleCars = Math.min(road.queueLength, 8);
  const isNorthSouth = cfg.direction === 'north' || cfg.direction === 'south';
  const isWarning = isActive && greenRemaining <= 5;

  const progressPct = greenDuration > 0 ? (greenRemaining / greenDuration) * 100 : 0;

  const vehicles = Array.from({ length: visibleCars }, (_, i) => ({
    key: `${road.id}-v${i}`,
    isEmergency: road.hasEmergency && i === 0,
  }));

  const armStyle = {
    north: 'flex-col-reverse items-center pb-0 pt-0',
    south: 'flex-col items-center pb-0 pt-0',
    east:  'flex-row items-center',
    west:  'flex-row-reverse items-center',
  }[cfg.direction];

  const signalPosition = {
    north: 'absolute bottom-2 left-1/2 -translate-x-1/2',
    south: 'absolute top-2 left-1/2 -translate-x-1/2',
    east:  'absolute left-2 top-1/2 -translate-y-1/2',
    west:  'absolute right-2 top-1/2 -translate-y-1/2',
  }[cfg.direction];

  const labelPosition = {
    north: 'absolute -top-8 left-1/2 -translate-x-1/2',
    south: 'absolute -bottom-8 left-1/2 -translate-x-1/2',
    east:  'absolute top-1/2 -translate-y-1/2 -right-12',
    west:  'absolute top-1/2 -translate-y-1/2 -left-12',
  }[cfg.direction];

  const queueDir = {
    north: 'flex-col-reverse items-center gap-1.5 pb-2',
    south: 'flex-col items-center gap-1.5 pt-2',
    east:  'flex-row items-center gap-1.5 pl-2',
    west:  'flex-row-reverse items-center gap-1.5 pr-2',
  }[cfg.direction];

  const roadDimension = isNorthSouth 
    ? 'w-20 h-36' 
    : 'h-20 w-36';

  return (
    <div className={cn('relative flex', armStyle)}>
      {/* Road surface */}
      <motion.div 
        className={cn('relative rounded-sm border border-white/5', roadDimension)}
        animate={{
          borderColor: isActive ? `rgba(0,255,136,0.3)` : 'rgba(255,255,255,0.05)',
          boxShadow: isActive 
            ? `0 0 20px rgba(0,255,136,0.12), inset 0 0 20px rgba(0,255,136,0.05)` 
            : road.hasEmergency
              ? '0 0 15px rgba(255,44,86,0.2)'
              : 'none',
        }}
        transition={{ duration: 0.5 }}
        style={{
          background: isActive 
            ? 'linear-gradient(135deg, rgba(0,255,136,0.04) 0%, rgba(13,14,22,0.95) 50%, rgba(0,255,136,0.04) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(13,14,22,0.95) 50%, rgba(255,255,255,0.02) 100%)',
        }}
      >
        {/* Road lane markers */}
        <div 
          className={cn(
            'absolute opacity-20',
            isNorthSouth ? 'inset-y-0 left-1/2 w-px' : 'inset-x-0 top-1/2 h-px'
          )}
          style={{
            background: isNorthSouth 
              ? 'repeating-linear-gradient(to bottom, rgba(255,210,0,0.6) 0px, rgba(255,210,0,0.6) 6px, transparent 6px, transparent 14px)'
              : 'repeating-linear-gradient(to right, rgba(255,210,0,0.6) 0px, rgba(255,210,0,0.6) 6px, transparent 6px, transparent 14px)',
          }}
        />

        {/* Traffic Signal */}
        <div className={signalPosition} style={{ zIndex: 20 }}>
          <TrafficSignal isGreen={isActive} isWarning={isWarning} />
        </div>

        {/* Progress bar for green time */}
        {isActive && (
          <motion.div
            className={cn(
              'absolute opacity-30',
              isNorthSouth ? 'bottom-0 left-0 right-0 h-1' : 'left-0 top-0 bottom-0 w-1'
            )}
            initial={false}
            animate={isNorthSouth ? { width: `${progressPct}%` } : { height: `${progressPct}%` }}
            style={{ 
              background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
              width: isNorthSouth ? undefined : '4px',
            }}
          />
        )}

        {/* Road label */}
        <div className={cn(labelPosition, 'text-[10px] font-bold tracking-widest whitespace-nowrap pointer-events-none')}
          style={{ color: isActive ? SIGNAL_COLORS.green.bg : 'rgba(255,255,255,0.4)', zIndex: 10 }}
        >
          {cfg.label}
        </div>
      </motion.div>

      {/* Vehicle queue */}
      <div className={cn('flex', queueDir)}>
        <AnimatePresence mode="popLayout">
          {vehicles.map((v, i) => (
            <VehicleBlock key={v.key} isEmergency={v.isEmergency} delay={i * 0.03} />
          ))}
        </AnimatePresence>
        {road.queueLength > 8 && (
          <motion.div 
            className="text-[10px] font-mono text-muted-foreground px-1 py-0.5 bg-black/40 rounded border border-white/10"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            +{road.queueLength - 8}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export const IntersectionVisualizer: React.FC<Props> = ({ roads, activeRoadId, greenRemaining, greenDuration }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (activeRoadId) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(t);
    }
  }, [activeRoadId]);

  const roadMap = useMemo(() => {
    const m: Record<string, Road> = {};
    roads.forEach(r => { m[r.id] = r; });
    return m;
  }, [roads]);

  const progressPct = greenDuration > 0 ? (greenRemaining / greenDuration) * 100 : 0;
  const progressColor = progressPct > 50 ? '#00ff88' : progressPct > 20 ? '#ffd700' : '#ff2c56';

  return (
    <div className="relative w-full flex items-center justify-center select-none py-8">
      <div className="relative" style={{ width: 520, height: 520 }}>

        {/* Ambient glow behind intersection */}
        <motion.div
          className="absolute inset-0 rounded-full blur-[80px] pointer-events-none"
          animate={{
            opacity: activeRoadId ? [0.3, 0.5, 0.3] : 0.1,
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)' }}
        />

        {/* Grid texture */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />

        {/* NORTH arm */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0" style={{ top: 10 }}>
          <RoadArm 
            road={roadMap['A']} 
            isActive={activeRoadId === 'A'} 
            greenRemaining={greenRemaining}
            greenDuration={greenDuration}
          />
        </div>

        {/* SOUTH arm */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center gap-0" style={{ bottom: 10 }}>
          <RoadArm 
            road={roadMap['C']} 
            isActive={activeRoadId === 'C'}
            greenRemaining={greenRemaining}
            greenDuration={greenDuration}
          />
        </div>

        {/* EAST arm */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-row-reverse items-center gap-0" style={{ right: 10 }}>
          <RoadArm 
            road={roadMap['B']} 
            isActive={activeRoadId === 'B'}
            greenRemaining={greenRemaining}
            greenDuration={greenDuration}
          />
        </div>

        {/* WEST arm */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-row items-center gap-0" style={{ left: 10 }}>
          <RoadArm 
            road={roadMap['D']} 
            isActive={activeRoadId === 'D'}
            greenRemaining={greenRemaining}
            greenDuration={greenDuration}
          />
        </div>

        {/* Central Intersection Box */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: 160, height: 160 }}>
          <motion.div 
            className="w-full h-full rounded-2xl border flex flex-col items-center justify-center relative overflow-hidden"
            animate={{
              borderColor: activeRoadId ? 'rgba(0,255,136,0.4)' : 'rgba(255,255,255,0.1)',
              boxShadow: activeRoadId 
                ? '0 0 40px rgba(0,255,136,0.15), 0 0 80px rgba(0,255,136,0.06), inset 0 0 40px rgba(0,0,0,0.6)'
                : 'inset 0 0 40px rgba(0,0,0,0.6)',
            }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'linear-gradient(135deg, rgba(13,14,22,0.98) 0%, rgba(20,25,40,0.98) 100%)',
            }}
          >
            {/* Corner road markers */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/10" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/10" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/10" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/10" />

            {/* Countdown */}
            <AnimatePresence mode="wait">
              <motion.div
                key={greenRemaining}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-5xl font-mono font-bold leading-none"
                style={{ 
                  color: progressColor,
                  textShadow: `0 0 20px ${progressColor}, 0 0 40px ${progressColor}66`,
                }}
              >
                {greenRemaining > 0 ? greenRemaining : '--'}
              </motion.div>
            </AnimatePresence>
            <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1">seconds</div>

            {/* Circular progress ring */}
            {activeRoadId && (
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 160 160"
                style={{ transform: 'rotate(-90deg)' }}
              >
                <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <motion.circle 
                  cx="80" cy="80" r="72" 
                  fill="none" 
                  stroke={progressColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 72}`}
                  strokeDashoffset={`${2 * Math.PI * 72 * (1 - progressPct / 100)}`}
                  style={{ opacity: 0.7 }}
                />
              </svg>
            )}

            {/* Active road label */}
            {activeRoadId && (
              <div className="absolute bottom-3 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-success uppercase tracking-widest">
                  {ROAD_CONFIG[activeRoadId]?.label}
                </span>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
};
