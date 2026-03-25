import React from 'react';
import { Road } from '../types';
import { PRESETS } from '../lib/constants';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw, FastForward, Settings2, Siren } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  roads: Road[];
  isRunning: boolean;
  speed: number;
  onToggle: () => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
  onUpdateRoad: (id: string, updates: Partial<Road>) => void;
  onPreset: (preset: any) => void;
}

export const ControlPanel: React.FC<Props> = ({ 
  roads, isRunning, speed, onToggle, onReset, onSetSpeed, onUpdateRoad, onPreset 
}) => {
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Settings2 className="text-primary" /> Simulation Controls
        </h3>
        <div className="flex gap-2">
          {Object.keys(PRESETS).map(key => (
            <Button 
              key={key} 
              variant="outline" 
              size="sm"
              onClick={() => onPreset(PRESETS[key as keyof typeof PRESETS])}
              className="text-xs uppercase hover:bg-primary hover:text-primary-foreground border-primary/20"
            >
              {key.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-card/50 p-4 rounded-xl border border-primary/10">
        <div className="flex gap-3">
          <Button 
            onClick={onToggle} 
            size="lg"
            className={clsx(
              "w-40 font-bold tracking-wide shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all",
              isRunning ? "bg-warning hover:bg-warning/80 text-warning-foreground" : "bg-primary hover:bg-primary/80"
            )}
          >
            {isRunning ? <><Pause className="mr-2" /> PAUSE</> : <><Play className="mr-2" /> START</>}
          </Button>
          <Button onClick={onReset} variant="outline" size="lg" className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground">
            <RotateCcw className="mr-2" /> RESET
          </Button>
        </div>

        <div className="flex items-center gap-4 border-l border-border/50 pl-6">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest"><FastForward size={16} className="inline mr-1" /> Speed</span>
          <div className="flex bg-background rounded-lg border border-border p-1">
            {[0.5, 1, 2, 5].map(s => (
              <button
                key={s}
                onClick={() => onSetSpeed(s)}
                className={clsx(
                  "px-3 py-1 rounded-md text-sm font-mono transition-colors",
                  speed === s ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Road Specific Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {roads.map(road => (
          <div key={road.id} className="bg-background/50 border border-border/50 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-lg text-primary">{road.name} Road</h4>
              <div className={clsx(
                "px-2 py-0.5 rounded text-xs font-bold font-mono",
                road.hasEmergency ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-secondary text-muted-foreground"
              )}>
                {road.hasEmergency ? 'EMERGENCY' : 'NORMAL'}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Initial Queue</span>
                  <span className="font-mono text-primary">{road.queueLength}</span>
                </div>
                <Slider 
                  value={[road.queueLength]} 
                  max={50} step={1}
                  onValueChange={(v) => onUpdateRoad(road.id, { queueLength: v[0] })}
                  disabled={isRunning}
                  className="[&_[role=slider]]:border-primary"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Arrival Rate (/s)</span>
                  <span className="font-mono text-primary">{road.arrivalRate.toFixed(1)}</span>
                </div>
                <Slider 
                  value={[road.arrivalRate]} 
                  max={5} step={0.1}
                  onValueChange={(v) => onUpdateRoad(road.id, { arrivalRate: v[0] })}
                  className="[&_[role=slider]]:border-primary"
                />
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Siren size={16} className={road.hasEmergency ? "text-destructive" : "text-muted-foreground"}/>
                  Emergency Override
                </span>
                <Switch 
                  checked={road.hasEmergency}
                  onCheckedChange={(c) => onUpdateRoad(road.id, { hasEmergency: c })}
                  className="data-[state=checked]:bg-destructive"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
