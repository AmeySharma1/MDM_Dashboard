import React from 'react';
import { FiCalendar, FiClock, FiActivity } from 'react-icons/fi';

const RolloutStrategyStep = ({ data, onChange, errors }) => {
  const handleRolloutTypeChange = (type) => onChange({ ...data, rolloutType: type });

  const strategies = [
    { id: 'immediate', title: 'Immediate', desc: 'Deploy immediately', icon: FiActivity },
    { id: 'scheduled', title: 'Scheduled', desc: 'Deploy at T-minus', icon: FiCalendar },
    { id: 'phased', title: 'Phased', desc: 'Gradual escalation', icon: FiClock },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Update Schedule <span className="text-gradient">Protocol</span></h2>
        <p className="text-gray-400 mt-2 font-medium">Configure the deployment velocity and timing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {strategies.map(strategy => {
          const Icon = strategy.icon;
          const isActive = data.rolloutType === strategy.id;
          return (
            <div
              key={strategy.id}
              onClick={() => handleRolloutTypeChange(strategy.id)}
              className={`p-6 glass rounded-2xl border transition-all duration-500 cursor-pointer group hover:scale-[1.02] ${isActive ? 'border-primary-500 bg-primary-500/10 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.3)]' : 'border-white/5'
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 ${isActive ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-500 group-hover:text-gray-300'
                }`}>
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-widest uppercase mb-1">{strategy.title}</h4>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{strategy.desc}</p>
            </div>
          );
        })}
      </div>

      {data.rolloutType === 'scheduled' && (
        <div className="glass p-8 rounded-[2rem] border border-white/5 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Launch Date</label>
              <input
                type="date"
                value={data.scheduledDate}
                onChange={(e) => onChange({ ...data, scheduledDate: e.target.value })}
                className="w-full glass-header px-4 py-3 rounded-2xl border border-white/10 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Launch Time</label>
              <input
                type="time"
                value={data.scheduledTime}
                onChange={(e) => onChange({ ...data, scheduledTime: e.target.value })}
                className="w-full glass-header px-4 py-3 rounded-2xl border border-white/10 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      )}

      {data.rolloutType === 'phased' && (
        <div className="glass p-8 rounded-[2rem] border border-white/5 animate-in slide-in-from-bottom-4 duration-500 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Initial Pulse Strength</h3>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Defining the first wave intensity</p>
            </div>
            <span className="text-2xl font-black text-primary-500">{data.phasePercentage}%</span>
          </div>
          <input
            type="range" min="5" max="50" step="5"
            value={data.phasePercentage}
            onChange={(e) => onChange({ ...data, phasePercentage: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          />
          <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">
            <span>Low Impact (5%)</span>
            <span>Balanced (25%)</span>
            <span>High Capacity (50%)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolloutStrategyStep;
