import React from 'react';
import { CycleRecord } from '../types';
import { History } from 'lucide-react';
import { clsx } from 'clsx';

export const HistoryTable: React.FC<{ history: CycleRecord[] }> = ({ history }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <History className="text-primary" /> Cycle History Logs
      </h3>
      
      <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="w-full h-32 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border/50 rounded-xl">
             No history yet. Start simulation.
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((record, i) => (
              <div key={i} className="bg-background/40 border border-border/40 p-4 rounded-xl flex flex-col gap-2 hover:bg-background/60 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/20 text-primary font-mono text-xs font-bold px-2 py-1 rounded">
                      #{record.cycle}
                    </span>
                    <span className="font-bold text-success">{record.selectedRoad} Green</span>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {record.greenDuration}s Duration
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground italic text-xs border-l-2 border-accent pl-2">
                    {record.reason}
                  </span>
                  <div className="flex gap-2 font-mono text-xs opacity-70">
                    <span className={record.selectedRoad === 'North' ? 'text-primary font-bold opacity-100' : ''}>N:{record.scores['A']?.toFixed(0)}</span>
                    <span className={record.selectedRoad === 'East' ? 'text-primary font-bold opacity-100' : ''}>E:{record.scores['B']?.toFixed(0)}</span>
                    <span className={record.selectedRoad === 'South' ? 'text-primary font-bold opacity-100' : ''}>S:{record.scores['C']?.toFixed(0)}</span>
                    <span className={record.selectedRoad === 'West' ? 'text-primary font-bold opacity-100' : ''}>W:{record.scores['D']?.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
