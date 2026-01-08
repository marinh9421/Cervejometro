import React from 'react';
import { UserStats } from '../types';
import { Medal, Crown, Star } from 'lucide-react';

interface LeaderboardProps {
  data: UserStats[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.totalEquivalent - a.totalEquivalent);
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-slate-400 fill-slate-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-700 fill-amber-600" />;
      default: return <span className="font-bold text-slate-400 w-6 text-center">{rank}</span>;
    }
  };

  const getRowStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-white border-yellow-200';
    if (rank <= 3) return 'bg-white border-slate-100';
    return 'bg-white border-slate-50';
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-amber-100 p-2 rounded-lg">
          <Star className="w-5 h-5 text-amber-700" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Ranking Oficial</h2>
      </div>

      <div className="space-y-3">
        {sortedData.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 border-dashed text-slate-400">
            Nenhum dado registrado ainda. Seja o primeiro!
          </div>
        ) : (
          sortedData.map((user, index) => {
            const rank = index + 1;
            return (
              <div 
                key={user.userName}
                className={`relative flex items-center p-4 rounded-xl border shadow-sm transition-all hover:shadow-md ${getRowStyle(rank)}`}
              >
                {/* Rank */}
                <div className="flex-shrink-0 mr-4 flex items-center justify-center w-8">
                  {getRankIcon(rank)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-lg font-bold text-slate-800 truncate">{user.userName}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200 truncate">
                      {user.title}
                    </span>
                  </div>
                  {rank === 1 && (
                     <p className="text-xs text-yellow-600 mt-0.5 font-medium">Líder Supremo da Rodada 👑</p>
                  )}
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-right pl-4">
                  <span className="block text-2xl font-black text-slate-800 leading-none">
                    {user.totalEquivalent.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Latinhas</span>
                </div>
                
                {/* Progress Bar (Visual flair) */}
                <div className="absolute bottom-0 left-0 h-1 bg-amber-500 rounded-bl-xl opacity-20" style={{ width: `${(user.totalEquivalent / (sortedData[0].totalEquivalent || 1)) * 100}%` }}></div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;