import React from 'react';

const ProgressBar = ({ value, label, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-end mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</span>
          <span className="text-sm font-black text-white">{value.toFixed(1)}%</span>
        </div>
      )}
      <div className="w-full h-3 bg-white/5 rounded-full p-0.5 border border-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;