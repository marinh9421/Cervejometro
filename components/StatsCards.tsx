import React from 'react';
import { DashboardStats } from '../types';
import { TrendingUp, Users, Trophy, CalendarDays } from 'lucide-react';

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Group */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total do Grupo</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalGroupUnits.toFixed(1)}</h3>
            <p className="text-xs text-amber-600 mt-1 font-medium">latinhas 269ml</p>
          </div>
          <div className="p-2 bg-amber-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Average */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Média / Pessoa</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.averagePerPerson.toFixed(1)}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">unidades</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        {/* Individual Record */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Recorde Individual</p>
            <h3 className="text-xl font-bold text-slate-800 truncate max-w-[120px]">
              {stats.individualRecord ? stats.individualRecord.user : '-'}
            </h3>
            <p className="text-xs text-green-600 mt-1 font-medium">
              {stats.individualRecord ? `${stats.individualRecord.amount.toFixed(1)} uni.` : 'Sem dados'}
            </p>
          </div>
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
        </div>

        {/* Daily Record */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Recorde do Dia</p>
            <h3 className="text-xl font-bold text-slate-800">
               {stats.dailyRecord ? new Date(stats.dailyRecord.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}) : '-'}
            </h3>
            <p className="text-xs text-purple-600 mt-1 font-medium">
              {stats.dailyRecord ? `${stats.dailyRecord.amount.toFixed(1)} total` : 'Sem dados'}
            </p>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <CalendarDays className="w-5 h-5 text-purple-600" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatsCards;