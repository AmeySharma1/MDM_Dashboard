import React, { useState, useEffect } from 'react';
import { FiActivity, FiCheckCircle, FiAlertTriangle, FiClock, FiRefreshCw, FiTrash2, FiX, FiChevronRight, FiShield, FiTrendingUp } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { useDeviceContext } from '../context/DeviceContext';

const RolloutMonitor = () => {
  const { rollouts, devices, deleteRollout } = useDeviceContext();
  const [selectedRollout, setSelectedRollout] = useState(null);
  const [deletingRollout, setDeletingRollout] = useState(null);

  const displayRollouts = rollouts && rollouts.length > 0 ? rollouts : [];

  // Removed progressAnimations state as progress is now 100% by default

  const handleDelete = (rolloutId) => {
    setDeletingRollout(rolloutId);
    setTimeout(() => {
      deleteRollout(rolloutId);
      setDeletingRollout(null);
      if (selectedRollout === rolloutId) setSelectedRollout(null);
    }, 400);
  };

  // Removed useEffect hooks for progress animations

  const statusConfig = {
    active: { label: 'In Flight', variant: 'warning', icon: FiActivity, color: 'text-yellow-500' },
    completed: { label: 'Verified', variant: 'success', icon: FiCheckCircle, color: 'text-green-500' },
    scheduled: { label: 'Queued', variant: 'info', icon: FiClock, color: 'text-primary-500' }
  };

  const currentRollout = displayRollouts.find(r => r.id === selectedRollout);

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
            Rollout <span className="text-gradient">Monitor</span>
          </h1>
          <p className="mt-3 text-gray-400 font-medium text-lg max-w-xl">
            Real-time fleet rollout management and deployment intelligence. monitor, analyze, and manage mission-critical updates.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center px-6 py-3 glass rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Synchronize
          </button>
          <Button onClick={() => window.location.hash = '#/scheduler'} className="px-8 py-4 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 transition-all">
            Initiate Deployment
          </Button>
        </div>
      </div>

      {/* Global Status Mesh */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Live Sessions', value: displayRollouts.filter(r => r.status === 'active').length, icon: FiActivity, color: 'text-primary-500' },
          { label: 'Fleet Impact', value: displayRollouts.reduce((sum, r) => sum + (r.completedDevices || 0), 0), icon: FiShield, color: 'text-green-500' },
          { label: 'Provisioning', value: displayRollouts.reduce((sum, r) => sum + (r.inProgressDevices || 0), 0), icon: FiTrendingUp, color: 'text-yellow-500' },
          { label: 'Anomalies', value: displayRollouts.reduce((sum, r) => sum + (r.failedDevices || 0), 0), icon: FiAlertTriangle, color: 'text-red-500' },
        ].map((stat, i) => (
          <div key={i} className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
            <stat.icon className={`absolute -right-4 -top-4 w-24 h-24 opacity-5 ${stat.color} group-hover:scale-110 transition-transform duration-700`} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">{stat.label}</p>
            <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Rollout Registry */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Operation Registry</h3>
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{displayRollouts.length} Active Targets</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayRollouts.map((rollout) => {
              const config = statusConfig[rollout.status] || statusConfig.scheduled;
              const Icon = config.icon;
              const displayProgress = 100; // Permanently frozen at 100%
              const isSelected = selectedRollout === rollout.id;

              return (
                <div
                  key={rollout.id}
                  onClick={() => setSelectedRollout(isSelected ? null : rollout.id)}
                  className={`relative glass p-6 rounded-3xl border transition-all duration-500 cursor-pointer group hover:bg-white/[0.02] ${isSelected ? 'border-primary-500/50 bg-primary-500/5 shadow-[0_20px_50px_-10px_rgba(59,130,246,0.2)]' : 'border-white/5'
                    } ${deletingRollout === rollout.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(rollout.id); }}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-300 z-20"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-start justify-between mb-8">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{rollout.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Target Version</span>
                        <Badge variant="primary" className="px-2 py-0.5">{rollout.osVersion}</Badge>
                      </div>
                    </div>
                    <div className={`p-3 rounded-2xl bg-white/5 ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <ProgressBar value={displayProgress} label="Propagation" className="mb-6" />

                  <div className="grid grid-cols-3 gap-2 p-3 glass-header rounded-2xl border border-white/5 h-16">
                    <div className="text-center flex flex-col justify-center border-r border-white/5">
                      <p className="text-[11px] font-black text-gray-900 dark:text-white leading-none mb-1.5">{rollout.totalDevices}</p>
                      <p className="text-[7px] font-black text-gray-500 uppercase tracking-widest leading-none">Target</p>
                    </div>
                    <div className="text-center flex flex-col justify-center border-r border-white/5">
                      <p className={`text-[9px] font-black leading-none mb-1.5 ${rollout.excludeRisky ? 'text-green-500' : 'text-gray-500'}`}>
                        {rollout.excludeRisky ? 'ENABLED' : 'DISABLED'}
                      </p>
                      <p className="text-[6.5px] font-black text-gray-500 uppercase tracking-tighter leading-none">Risk Mitigation</p>
                    </div>
                    <div className="text-center flex flex-col justify-center">
                      <p className="text-[9px] font-black text-primary-500 uppercase leading-none mb-1.5 tracking-tighter">{rollout.rolloutType}</p>
                      <p className="text-[7px] font-black text-gray-500 uppercase tracking-widest leading-none">Protocol</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Telemetry Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Live Telemetry</h3>
            {selectedRollout && <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest animate-pulse">Filtering: {currentRollout?.name}</span>}
          </div>

          <div className="glass rounded-[2rem] border border-white/5 overflow-hidden flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {selectedRollout ? (
                <>
                  <div className="p-6 glass-header rounded-2xl border border-white/10 mb-6 space-y-6">
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 border-b border-white/5 pb-2">Mission Intelligence</h5>
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2 group/item hover:bg-white/5 p-2 rounded-xl transition-all">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Propagation Path</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white italic tracking-tighter">
                            {currentRollout?.fromVersion} <span className="text-primary-500 mx-2">→</span> {currentRollout?.toVersion}
                          </span>
                        </div>
                        <div className="flex justify-between items-center group/item hover:bg-white/5 p-2 rounded-xl transition-all">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Regions</span>
                          <span className="text-[11px] font-black text-primary-500 uppercase tracking-[0.2em] text-right">{currentRollout?.targetRegions?.join(', ')}</span>
                        </div>
                        <div className="flex justify-between items-center group/item hover:bg-white/5 p-2 rounded-xl transition-all">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Risk Mitigation</span>
                          <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full ${currentRollout?.excludeRisky ? 'text-green-500 bg-green-500/10' : 'text-gray-400 bg-white/5'}`}>
                            {currentRollout?.excludeRisky ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center group/item hover:bg-white/5 p-2 rounded-xl transition-all">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Type</span>
                          <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em] bg-primary-400/10 px-3 py-1 rounded-full">
                            {currentRollout?.rolloutType?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {[
                    { msg: 'Regional handshake established', time: '12s ago', type: 'info' },
                    { msg: 'Metric validation cycle 42 complete', time: '1m ago', type: 'success' },
                    { msg: 'Intermittent latency on EMEA devices', time: '3m ago', type: 'warning' },
                    { msg: 'Bulk manifest updated to v2.4', time: '15m ago', type: 'info' },
                  ].map((log, i) => (
                    <div key={i} className="group p-4 glass-header rounded-2xl border border-white/5 hover:border-primary-500/20 transition-all">
                      <p className="text-[11px] font-bold text-gray-900 dark:text-white group-hover:text-primary-400 transition-colors leading-relaxed">{log.msg}</p>
                      <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-2">{log.time}</p>
                    </div>
                  ))}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                  <FiActivity className="w-16 h-16 text-gray-700 mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 max-w-[150px]">Select an operation for telemetry extraction</p>
                </div>
              )}
            </div>
            {selectedRollout && (
              <div className="p-4 border-t border-white/5">
                <Button variant="secondary" className="w-full text-[10px] py-3" onClick={() => setSelectedRollout(null)}>Desynchronize Output</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolloutMonitor;
