import React, { useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';
import { IntersectionVisualizer } from '../components/IntersectionVisualizer';
import { ControlPanel } from '../components/ControlPanel';
import { DecisionEngine } from '../components/DecisionEngine';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { HistoryTable } from '../components/HistoryTable';
import { AlgorithmExplanation } from '../components/AlgorithmExplanation';
import { 
  TrafficCone, Github, ChevronRight, Activity, Zap, 
  Shield, Cpu, BarChart3, GitBranch, ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function SectionHeader({ number, title, subtitle, accent = 'primary' }: { 
  number: string; title: string; subtitle: string; accent?: string 
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mb-10"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-mono font-bold uppercase tracking-widest opacity-60">
          {number}
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-border/80 to-transparent" />
      </div>
      <h2 className="text-3xl lg:text-4xl font-bold">{title}</h2>
      <p className="text-muted-foreground mt-2 text-lg">{subtitle}</p>
    </motion.div>
  );
}

function StatCard({ value, label, icon, color }: { value: string; label: string; icon: React.ReactNode; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel rounded-xl p-5 flex items-center gap-4 border border-white/5 hover:border-white/15 transition-colors"
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}20`, color }}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold font-mono" style={{ color }}>{value}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const sim = useSimulation();

  const scrollToSim = () => {
    document.getElementById('simulation-workspace')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToAlgo = () => {
    document.getElementById('algorithm-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalCleared = sim.state.roads.reduce((a, r) => a + r.totalCleared, 0);
  const avgWait = sim.state.roads.length > 0
    ? (sim.state.roads.reduce((a, r) => a + r.waitingTime, 0) / sim.state.roads.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden scan-line grid-bg">
      
      {/* ===================== NAVBAR ===================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/[0.06] rounded-none"
        style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center box-glow"
              style={{ boxShadow: '0 0 12px rgba(0,212,255,0.4)' }}>
              <TrafficCone size={18} className="text-primary" />
              <motion.div
                className="absolute inset-0 rounded-lg border border-primary/60"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <span className="font-bold text-base tracking-wide">Nexus </span>
              <span className="text-primary font-normal">TrafficAI</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={scrollToSim} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Simulation
            </button>
            <button onClick={scrollToAlgo} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Algorithm
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-success/30 bg-success/10 text-success text-xs font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              SYSTEM ONLINE
            </div>
          </div>
        </div>
      </nav>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 opacity-30 bg-cover bg-center"
            style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-bg.png)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
            animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)' }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
            animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.2) 0%, transparent 70%)' }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8"
                style={{ boxShadow: '0 0 20px rgba(0,212,255,0.1)' }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                Live Browser Simulation — No Backend Required
              </motion.div>

              <h1 className="text-5xl xl:text-7xl font-bold leading-[1.05] mb-6 tracking-tight">
                Smart Traffic{' '}
                <span 
                  className="relative inline-block"
                  style={{
                    background: 'linear-gradient(135deg, #00d4ff 0%, #7b61ff 60%, #00ff88 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 30px rgba(0,212,255,0.4))',
                  }}
                >
                  Signal Optimizer
                </span>
              </h1>

              <p className="text-lg xl:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                AI-inspired adaptive traffic scheduling that dynamically minimizes 
                congestion and waiting time at 4-road intersections — a classic 
                system design interview challenge, built as a premium simulation.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-base font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  style={{ boxShadow: '0 0 30px rgba(0,212,255,0.4), 0 0 60px rgba(0,212,255,0.15)' }}
                  onClick={scrollToSim}
                >
                  <Zap size={18} className="mr-2" />
                  Start Simulation
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-14 px-8 text-base rounded-xl border-white/15 hover:bg-white/5 hover:border-primary/40"
                  onClick={scrollToAlgo}
                >
                  View Algorithm
                  <ChevronRight size={18} className="ml-2" />
                </Button>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-3 mt-10">
                {[
                  { icon: <Cpu size={12} />, label: 'Priority Scheduling' },
                  { icon: <Shield size={12} />, label: 'Starvation Prevention' },
                  { icon: <Activity size={12} />, label: 'Emergency Override' },
                  { icon: <BarChart3 size={12} />, label: 'Real-time Analytics' },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground">
                    <span className="text-primary">{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Live mini-dashboard preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="hidden lg:block relative"
            >
              <div className="absolute -inset-4 rounded-3xl blur-[60px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.12) 0%, transparent 70%)' }} />

              <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
                {/* Header bar */}
                <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-2 text-xs font-mono text-primary">
                    <Activity size={12} />
                    SYSTEM_STATUS: ONLINE
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/80" />
                    <div className="w-3 h-3 rounded-full bg-warning/80" />
                    <div className="w-3 h-3 rounded-full bg-success/80" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {['North', 'East', 'South', 'West'].map((road, i) => {
                    const pcts = [82, 45, 95, 30];
                    const colors = ['#00d4ff', '#7b61ff', '#00ff88', '#ffd700'];
                    return (
                      <div key={road} className="space-y-1.5">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span className="font-mono" style={{ color: colors[i] }}>{road}</span>
                          <span className="font-mono">{pcts[i]}%</span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${colors[i]}, ${colors[i]}88)` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pcts[i]}%` }}
                            transition={{ duration: 1.5, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-2 border-t border-white/5">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { v: '4', l: 'Roads' },
                        { v: '60s', l: 'Max Green' },
                        { v: '∞', l: 'Fairness' },
                      ].map(s => (
                        <div key={s.l} className="text-center">
                          <div className="text-lg font-bold font-mono text-primary">{s.v}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll CTA */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground cursor-pointer"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            onClick={scrollToSim}
          >
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <ArrowDown size={16} />
          </motion.div>
        </div>
      </section>

      {/* ===================== LIVE STATS BAR ===================== */}
      <div className="border-y border-white/5 bg-black/30 backdrop-blur-sm py-4 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="4" label="Road Intersections" icon={<GitBranch size={18}/>} color="#00d4ff" />
          <StatCard value={`${sim.state.cycleNumber}`} label="Cycles Completed" icon={<Activity size={18}/>} color="#00ff88" />
          <StatCard value={`${totalCleared}`} label="Vehicles Cleared" icon={<Zap size={18}/>} color="#ffd700" />
          <StatCard value={`${avgWait}s`} label="Avg Wait Time" icon={<Shield size={18}/>} color="#7b61ff" />
        </div>
      </div>

      {/* ===================== MAIN SIMULATION WORKSPACE ===================== */}
      <section id="simulation-workspace" className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-[1440px] mx-auto">
          
          <SectionHeader 
            number="01 // CONTROL CENTER" 
            title="Live Traffic Simulation" 
            subtitle="Watch the priority algorithm dynamically assign green lights in real-time based on queue lengths, wait times, and emergency events."
          />

          {/* Visualizer + Decision Engine */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
            {/* Intersection Visualizer */}
            <div className="xl:col-span-7 glass-panel rounded-2xl overflow-hidden border border-white/6">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <h3 className="font-bold text-base">Live Intersection Feed</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xs font-mono text-muted-foreground bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                    CYCLE{' '}
                    <span className="text-primary font-bold">#{String(sim.state.cycleNumber).padStart(3, '0')}</span>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                    T+<span className="text-accent font-bold">{sim.state.totalTimeElapsed}s</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center p-4 min-h-[540px]">
                <IntersectionVisualizer 
                  roads={sim.state.roads}
                  activeRoadId={sim.state.currentGreenRoad}
                  greenRemaining={sim.state.greenTimeRemaining}
                  greenDuration={sim.state.greenDuration}
                />
              </div>
            </div>

            {/* Decision Engine Panel */}
            <div className="xl:col-span-5">
              <DecisionEngine 
                roads={sim.state.roads} 
                currentGreen={sim.state.currentGreenRoad} 
              />
            </div>
          </div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <ControlPanel 
              roads={sim.state.roads}
              isRunning={sim.state.isRunning}
              speed={sim.state.speed}
              onToggle={sim.toggleSimulation}
              onReset={sim.resetSimulation}
              onSetSpeed={sim.setSpeed}
              onUpdateRoad={sim.updateRoad}
              onPreset={sim.applyPreset}
            />
          </motion.div>

          {/* Analytics + History */}
          <SectionHeader
            number="02 // TELEMETRY"
            title="Real-time Analytics"
            subtitle="Monitor priority score trends, vehicle throughput, and the decision history as the simulation runs."
          />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-24" style={{ minHeight: 520 }}>
            <div className="xl:col-span-8">
              <AnalyticsDashboard state={sim.state} />
            </div>
            <div className="xl:col-span-4 h-full" style={{ minHeight: 520 }}>
              <HistoryTable history={sim.state.history} />
            </div>
          </div>

          {/* Algorithm Explanation */}
          <div id="algorithm-section">
            <SectionHeader
              number="03 // ALGORITHM"
              title="How the Algorithm Works"
              subtitle="A deep dive into the priority scheduling formula, starvation prevention, and why this beats fixed-timer systems."
            />
            <AlgorithmExplanation />
          </div>

        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-white/5 bg-black/30 backdrop-blur-sm py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <TrafficCone size={16} className="text-primary" />
            </div>
            <div>
              <span className="font-bold text-sm">Nexus TrafficAI</span>
              <span className="text-muted-foreground text-xs ml-2">© {new Date().getFullYear()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {['React', 'TypeScript', 'Framer Motion', 'Recharts', 'Tailwind CSS'].map(t => (
              <span key={t} className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-default">
                {t}
              </span>
            ))}
          </div>

          <div className="text-xs text-muted-foreground text-center md:text-right">
            Portfolio-grade simulation.<br/>
            <span className="text-primary">All computation runs in-browser.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
