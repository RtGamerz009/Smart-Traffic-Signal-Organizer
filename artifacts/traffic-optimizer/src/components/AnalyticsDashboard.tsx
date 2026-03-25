import React, { useMemo } from 'react';
import { Road, SimulationState } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface Props {
  state: SimulationState;
}

export const AnalyticsDashboard: React.FC<Props> = ({ state }) => {
  const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)'];

  // Data for Pie Chart (Total Cleared)
  const clearedData = useMemo(() => {
    return state.roads.map(r => ({ name: r.name, value: r.totalCleared || 1 })); // fallback to 1 so chart renders
  }, [state.roads]);

  // Data for History Chart (Priority Trends)
  const historyData = useMemo(() => {
    return state.history.slice().reverse().map(h => ({
      cycle: `Cycle ${h.cycle}`,
      North: h.scores['A'] || 0,
      East: h.scores['B'] || 0,
      South: h.scores['C'] || 0,
      West: h.scores['D'] || 0,
    }));
  }, [state.history]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/90 backdrop-blur-md border border-border p-3 rounded-lg shadow-xl">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm flex items-center justify-between gap-4">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-mono font-bold">{entry.value.toFixed(1)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Chart 1 */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Activity className="text-accent" /> Priority Score Trends
        </h3>
        <div className="flex-1 min-h-[250px]">
          {historyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="cycle" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="North" stroke={COLORS[0]} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="East" stroke={COLORS[1]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="South" stroke={COLORS[2]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="West" stroke={COLORS[3]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border/50 rounded-xl">
               Run simulation to collect data
             </div>
          )}
        </div>
      </div>

      {/* Chart 2 */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <PieChartIcon className="text-success" /> Total Vehicles Cleared
        </h3>
        <div className="flex-1 min-h-[250px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={clearedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {clearedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(20,20,30,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
              />
              <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-foreground">
                {state.roads.reduce((acc, r) => acc + r.totalCleared, 0)}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
