import React from 'react';
import { FiClock, FiCheck, FiX, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const TimelineView = ({ events = [] }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'success':
        return { icon: FiCheck, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
      case 'warning':
        return { icon: FiAlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
      case 'error':
        return { icon: FiX, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
      case 'info':
      default:
        return { icon: FiInfo, color: 'text-primary-500', bg: 'bg-primary-500/10', border: 'border-primary-500/20' };
    }
  };

  return (
    <div className="space-y-4">
      {events.length > 0 ? (
        events.map((event, i) => {
          const config = getStatusConfig(event.status);
          const Icon = config.icon;
          return (
            <div
              key={event.id || i}
              className={`flex items-start gap-4 p-4 glass rounded-2xl border ${config.border} hover:bg-white/5 transition-all group`}
            >
              <div className={`p-2 rounded-xl ${config.bg} ${config.color} shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed">
                  {event.message}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : 'Recent'}
                  </span>
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${config.border} ${config.color}`}>
                    {event.status || 'system'}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-12 glass rounded-3xl border border-white/5">
          <FiClock className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-50" />
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
            Telemetry quiescent
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(TimelineView);

