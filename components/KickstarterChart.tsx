import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type KickstarterProject } from '../types';

interface KickstarterChartProps {
  projects: KickstarterProject[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        // Find payload by dataKey for robustness
        const pledgedPayload = payload.find(p => p.dataKey === 'pledged');
        const goalPayload = payload.find(p => p.dataKey === 'goal');

        return (
            <div className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/10">
                <p className="font-bold text-slate-100 mb-2">{label}</p>
                {pledgedPayload && (
                    <p className="text-sm text-indigo-400 font-semibold">
                        {`Pledged: $${pledgedPayload.value.toLocaleString()}`}
                    </p>
                )}
                {goalPayload && (
                    <p className="text-sm text-slate-400">
                        {`Goal: $${goalPayload.value.toLocaleString()}`}
                    </p>
                )}
            </div>
        );
    }
    return null;
};

const KickstarterChart: React.FC<KickstarterChartProps> = ({ projects }) => {
  const formatYAxis = (tick: number) => {
    return `$${(tick / 1000)}k`;
  };

  return (
    <div className="glass-card p-6 h-[450px]">
        <h3 className="font-semibold text-slate-100 mb-4">Kickstarter Funding: Pledged vs. Goal</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={projects}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fontSize: 12, fill: 'rgba(255, 255, 255, 0.7)' }} />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: 'rgba(255, 255, 255, 0.7)' }} />
          <Tooltip 
            cursor={{ fill: 'rgba(129, 140, 248, 0.1)' }}
            content={<CustomTooltip />}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => <span className="text-slate-300">{value}</span>} />
          <Bar dataKey="goal" fill="#a5b4fc" name="Goal" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pledged" fill="#6366f1" name="Pledged" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KickstarterChart;