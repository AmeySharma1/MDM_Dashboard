import React from 'react';
import Card from '../ui/Card';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatsCard = ({ title, value, change, icon: Icon, trend }) => {
  const isPositive = change >= 0;

  return (
    <Card className="hover:scale-[1.03] transition-all duration-500 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
            {value}
          </p>

          <div className={`mt-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit text-[10px] font-black ${isPositive
            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
            : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
            {isPositive ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{change}%</span>
          </div>

          <p className="mt-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 italic opacity-70">
            {trend}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-gray-400 group-hover:text-primary-500 group-hover:bg-primary-500/10 group-hover:border-primary-500/20 transition-all duration-500 shadow-inner">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default React.memo(StatsCard);
