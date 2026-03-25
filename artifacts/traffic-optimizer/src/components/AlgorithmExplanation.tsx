import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AlgorithmExplanation: React.FC = () => {
  return (
    <div className="glass-panel rounded-3xl p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-glow text-white">The Smart Priority Algorithm</h2>
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          Unlike traditional fixed-timer traffic lights that waste cycle time on empty roads, our system recalculates priorities dynamically every cycle using a weighted formula.
        </p>

        <div className="bg-black/40 border border-primary/30 p-6 lg:p-8 rounded-2xl mb-12 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Core Calculation Formula</h4>
          <div className="text-xl lg:text-3xl font-mono text-center text-white/90 leading-loose break-words">
            Score = 
            <span className="text-success"> (α × Q) </span> + 
            <span className="text-warning"> (β × W) </span> + 
            <span className="text-accent"> (γ × R) </span> + 
            <span className="text-destructive"> (δ × E) </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-background/50 border border-border/50 p-5 rounded-xl hover:border-success/50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-success/20 text-success flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calculator size={20} />
            </div>
            <h4 className="font-bold text-lg mb-2 text-white">Q: Queue Length</h4>
            <p className="text-sm text-muted-foreground">The primary driver. Longer lines naturally demand higher priority. <span className="text-success font-mono">Weight (α) = 1.5</span></p>
          </div>

          <div className="bg-background/50 border border-border/50 p-5 rounded-xl hover:border-warning/50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-warning/20 text-warning flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-bold text-lg mb-2 text-white">W: Wait Time</h4>
            <p className="text-sm text-muted-foreground">Prevents starvation. A low-traffic road will eventually get a green light as its wait time grows. <span className="text-warning font-mono">Weight (β) = 0.8</span></p>
          </div>

          <div className="bg-background/50 border border-border/50 p-5 rounded-xl hover:border-accent/50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-accent/20 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap size={20} />
            </div>
            <h4 className="font-bold text-lg mb-2 text-white">R: Arrival Rate</h4>
            <p className="text-sm text-muted-foreground">Predictive measure. Roads with rapidly forming lines get preemptive priority bumps. <span className="text-accent font-mono">Weight (γ) = 1.2</span></p>
          </div>

          <div className="bg-background/50 border border-border/50 p-5 rounded-xl hover:border-destructive/50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 text-destructive flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AlertTriangle size={20} />
            </div>
            <h4 className="font-bold text-lg mb-2 text-white">E: Emergency</h4>
            <p className="text-sm text-muted-foreground">Absolute override. Ambulances or fire trucks immediately force the score to maximum. <span className="text-destructive font-mono">Weight (δ) = 10k</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
