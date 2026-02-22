import React from 'react';
import Card from '../ui/Card';
import { FiMonitor, FiAlertTriangle, FiClock, FiXCircle, FiTrendingUp } from 'react-icons/fi';

const KPICards = ({ kpiData }) => {
  const kpiItems = [
    {
      title: 'Total Devices',
      value: kpiData.totalDevices,
      icon: FiMonitor,
      color: 'text-primary-500',
      bgColor: 'bg-primary-500/10 border-primary-500/20',
      trend: '+12% from baseline'
    },
    {
      title: 'Outdated Manifests',
      value: kpiData.outdatedDevices,
      icon: FiAlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10 border-yellow-500/20',
      trend: 'Action Required'
    },
    {
      title: 'Inactive (7D+)',
      value: kpiData.inactiveDevices,
      icon: FiClock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      trend: 'Low Latency'
    },
    {
      title: 'Terminal Failures',
      value: kpiData.failedUpdates,
      icon: FiXCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10 border-red-500/20',
      trend: 'Stability critical'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="hover:scale-[1.03] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.05] transition-all duration-700"></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 group-hover:text-primary-500 transition-colors">
                  {item.title}
                </p>
                <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                  {item.value}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${item.color} px-2 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5`}>
                    {item.trend}
                  </span>
                </div>
              </div>
              <div className={`p-4 rounded-[1.25rem] border ${item.bgColor} shadow-lg shadow-black/20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default React.memo(KPICards);
