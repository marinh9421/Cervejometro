import React, { useState, useMemo } from 'react';
import { ConsumptionLog, TimeFilter } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, Filter } from 'lucide-react';
import { FILTER_OPTIONS } from '../constants';

interface ConsumptionChartProps {
  logs: ConsumptionLog[];
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ logs }) => {
  const [filter, setFilter] = useState<TimeFilter>('ALL');

  const filteredData = useMemo(() => {
    const now = new Date();
    // Helper to clear time for date comparison
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Simple filter logic
    const filteredLogs = logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      
      if (filter === 'TODAY') {
        return logTime >= todayStart;
      }
      if (filter === 'WEEK') {
        const oneWeekAgo = todayStart - (7 * 24 * 60 * 60 * 1000);
        return logTime >= oneWeekAgo;
      }
      if (filter === 'MONTH') {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).getTime();
        return logTime >= oneMonthAgo;
      }
      return true;
    });

    // Aggregating by user
    const userMap: Record<string, number> = {};
    filteredLogs.forEach(log => {
      if (!userMap[log.userName]) userMap[log.userName] = 0;
      userMap[log.userName] += log.equivalentUnits;
    });

    // Convert to array
    return Object.entries(userMap)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

  }, [logs, filter]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-12">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Consumo por Pessoa</h2>
          </div>
          
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
             {FILTER_OPTIONS.map((opt) => (
               <button
                  key={opt.id}
                  onClick={() => setFilter(opt.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    filter === opt.id 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
               >
                 {opt.label}
               </button>
             ))}
          </div>
        </div>

        <div className="h-[300px] w-full">
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value.toFixed(2)} latas`, 'Consumo']}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-slate-400 text-sm">
               Sem dados para o período selecionado.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumptionChart;