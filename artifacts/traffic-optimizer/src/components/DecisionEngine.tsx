import React from 'react';
import { Road } from '../types';
import { calculatePriority } from '../lib/priorityCalculator';
import { BrainCircuit, Clock, Car, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';

export const DecisionEngine: React.FC<{ roads: Road[], currentGreen: string | null }> = ({ roads, currentGreen }) => {
  // Sort roads by current priority to show ranking
  const sortedRoads = [...roads].sort((a, b) => (a.priorityScore || calculatePriority(a)) - (b.priorityScore || calculatePriority(b))).reverse();

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <BrainCircuit className="text-accent" /> Smart Decision Engine
      </h3>

      <div className="flex-1 flex flex-col gap-4">
        {sortedRoads.map((road, idx) => {
          const isGreen = road.id === currentGreen;
          const score = road.priorityScore || calculatePriority(road);
          const maxScore = Math.max(...sortedRoads.map(r => r.priorityScore || calculatePriority(r)), 100);
          const percent = Math.min((score / maxScore) * 100, 100);

          return (
            <div 
              key={road.id} 
              className={clsx(
                "relative overflow-hidden rounded-xl p-4 border transition-all duration-300",
                isGreen 
                  ? "bg-success/10 border-success shadow-[0_0_15px_rgba(0,255,136,0.15)]" 
                  : road.hasEmergency 
                    ? "bg-destructive/10 border-destructive shadow-[0_0_15px_rgba(255,0,68,0.15)]"
                    : "bg-background/40 border-border/50"
              )}
            >
              {/* Progress Bar Background */}
              <div 
                className={clsx(
                  "absolute inset-0 opacity-10 transition-all duration-500 ease-out",
                  isGreen ? "bg-success" : road.hasEmergency ? "bg-destructive" : "bg-primary"
                )}
                style={{ width: `${percent}%` }}
              />

              <div className="relative z-10 flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    isGreen ? "bg-success text-success-foreground" : "bg-secondary text-secondary-foreground"
                  )}>
                    {idx + 1}
                  </span>
                  <span className="font-bold text-lg">{road.name}</span>
                  {isGreen && <span className="text-xs font-bold text-success uppercase tracking-widest ml-2 px-2 py-0.5 bg-success/20 rounded">Active</span>}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-glow" style={{ color: isGreen ? 'var(--color-success)' : road.hasEmergency ? 'var(--color-destructive)' : 'var(--color-primary)' }}>
                    {score.toFixed(1)}
                  </div>
                  <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Priority Score</div>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-2 mt-4 text-sm">
                <div className="flex flex-col gap-1 p-2 bg-black/20 rounded-lg border border-white/5">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Car size={12}/> Queue</span>
                  <span className="font-mono font-bold">{road.queueLength} <span className="text-[10px] font-sans font-normal text-muted-foreground opacity-50">cars</span></span>
                </div>
                <div className="flex flex-col gap-1 p-2 bg-black/20 rounded-lg border border-white/5">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Clock size={12}/> Wait</span>
                  <span className="font-mono font-bold">{road.waitingTime} <span className="text-[10px] font-sans font-normal text-muted-foreground opacity-50">sec</span></span>
                </div>
                <div className="flex flex-col gap-1 p-2 bg-black/20 rounded-lg border border-white/5">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><TrendingUp size={12}/> Rate</span>
                  <span className="font-mono font-bold">{road.arrivalRate.toFixed(1)} <span className="text-[10px] font-sans font-normal text-muted-foreground opacity-50">/s</span></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
