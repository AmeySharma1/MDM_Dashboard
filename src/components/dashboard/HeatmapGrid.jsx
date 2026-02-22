import React, { useState } from 'react';
import Card from '../ui/Card';
import { FiGlobe, FiInfo } from 'react-icons/fi';

const HeatmapGrid = ({ heatmapData }) => {
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0, details: null });

  const intensityColors = {
    low: 'bg-green-500/10 dark:bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/20 dark:border-green-500/10',
    medium: 'bg-yellow-500/10 dark:bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 dark:border-yellow-500/10',
    high: 'bg-orange-500/10 dark:bg-orange-500/5 text-orange-600 dark:text-orange-400 border-orange-500/20 dark:border-orange-500/10',
    critical: 'bg-red-500/10 dark:bg-red-500/5 text-red-600 dark:text-red-400 border-red-500/20 dark:border-red-500/10'
  };

  const getStatusLevel = (value) => {
    if (value === 0) return 'low';
    if (value <= 5) return 'medium';
    if (value <= 15) return 'high';
    return 'critical';
  };

  const handleMouseEnter = (e, region, os, value) => {
    setTooltip({
      visible: true,
      content: `${region} • ${os}`,
      details: `${value} Synchronized Devices`,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, content: '', x: 0, y: 0, details: null });
  };

  return (
    <Card
      className="overflow-hidden"
      header={
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
            <FiGlobe className="text-primary-500 w-4 h-4" /> Global Device Distribution Matrix
          </h2>
          <div className="flex gap-1">
            {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-primary-500/30"></div>)}
          </div>
        </div>
      }
    >
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5">
              <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.25em] bg-black/[0.01] dark:bg-white/[0.02]">
                Strategic Region
              </th>
              {heatmapData.osVersions.map((os, index) => (
                <th
                  key={index}
                  className="px-4 py-6 text-center text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] bg-white/[0.01]"
                >
                  {os.split(' ')[0]} <span className="text-gray-600 block mt-1">{os.split(' ')[1] || ''}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {heatmapData.regions.map((region, regionIndex) => (
              <tr key={regionIndex} className="transition-all duration-300 group">
                <td className="px-8 py-5 whitespace-nowrap text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider border-r border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {region}
                  </div>
                </td>
                {heatmapData.osVersions.map((os, osIndex) => {
                  const value = heatmapData.data[regionIndex][osIndex] || 0;
                  const intensity = getStatusLevel(value);

                  return (
                    <td
                      key={osIndex}
                      className="px-2 py-4 text-center group/cell"
                      onMouseEnter={(e) => handleMouseEnter(e, region, os, value)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div
                        className={`inline-flex w-12 h-12 rounded-2xl items-center justify-center text-sm font-black border transition-all duration-500 cursor-cell ${intensityColors[intensity]} text-gray-900 dark:text-white`}
                      >
                        {value > 0 ? value : <span className="opacity-10">0</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend & Stats */}
      <div className="mt-10 p-6 glass-header rounded-[2rem] border border-white/5 flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Density Matrix:</span>
          <div className="flex items-center gap-6">
            {Object.entries({ 'Optimal': 'low', 'Nominal': 'medium', 'Alert': 'high', 'Critical': 'critical' }).map(([label, level]) => (
              <div key={level} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${intensityColors[level].split(' ')[0]} border border-black/10 dark:border-white/10`}></div>
                <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black text-primary-500/50 uppercase tracking-widest">
          <FiInfo className="w-3 h-3" /> Auto-syncing with global device manifest
        </div>
      </div>

      {/* Enhanced Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-6 py-4 glass-header border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none animate-in fade-in zoom-in duration-200"
          style={{
            left: tooltip.x + 20,
            top: tooltip.y - 20,
            transform: 'translateY(-100%)'
          }}
        >
          <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-1">{tooltip.content}</p>
          <p className="text-xl font-black text-white tracking-tighter">{tooltip.details}</p>
          <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 w-2/3 animate-pulse"></div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default React.memo(HeatmapGrid);
