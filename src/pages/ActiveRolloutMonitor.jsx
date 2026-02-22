import React, { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiX, FiRefreshCw, FiClock, FiDownload, FiCheck, FiAlertTriangle, FiInfo, FiActivity, FiZap, FiServer, FiShield, FiTrendingUp } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import TimelineView from '../components/dashboard/TimelineView';
import { useDeviceContext } from '../context/DeviceContext';

const ActiveRolloutMonitor = () => {
  const { activeRollout, setRollouts, setActiveRollout, devices: allDevices } = useDeviceContext();

  const [isCompleting, setIsCompleting] = useState(false);
  const [finalProgress, setFinalProgress] = useState(activeRollout?.progress || 0);

  const [animationState, setAnimationState] = useState(() => {
    const saved = localStorage.getItem('animatedRolloutIds');
    const animatedIds = saved ? JSON.parse(saved) : [];

    // If it's already animated or rollout is null, don't animate
    const hasAnimated = activeRollout ? animatedIds.includes(activeRollout.id) : false;

    return {
      isAnimating: false,
      hasAnimated: hasAnimated,
      progress: hasAnimated ? 100 : 0
    };
  });

  const [deviceCounts, setDeviceCounts] = useState({ completed: 0, failed: 0, inProgress: 0 });
  const [timelineEvents] = useState([
    { id: 1, timestamp: new Date(Date.now() - 3600000), message: 'Global update manifest synchronized with primary cluster', status: 'info' },
    { id: 2, timestamp: new Date(Date.now() - 3000000), message: 'Target devices initiated secure handshake protocols', status: 'info' },
    { id: 3, timestamp: new Date(Date.now() - 2400000), message: 'Multi-region secure tunnel established for payload delivery', status: 'info' },
    { id: 4, timestamp: new Date(Date.now() - 1800000), message: 'Phase 1 integrity verification successful', status: 'success' },
    { id: 5, timestamp: new Date(Date.now() - 1200000), message: 'Real-time telemetry streaming initiated', status: 'info' },
    { id: 6, timestamp: new Date(), message: 'Processing core cluster updates for North America region', status: 'info' },
  ]);

  useEffect(() => {
    if (activeRollout) {
      localStorage.setItem('activeRolloutProgress', JSON.stringify({
        rolloutId: activeRollout.id, progress: animationState.progress, hasAnimated: animationState.hasAnimated
      }));
    }
  }, [animationState.progress, animationState.hasAnimated, activeRollout?.id]);

  useEffect(() => {
    if (activeRollout && activeRollout.progress === 0 && !animationState.isAnimating && !animationState.hasAnimated) {
      setAnimationState(prev => ({ ...prev, isAnimating: true }));
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / 4000) * 100);
        setAnimationState(prev => ({ ...prev, progress }));

        if (progress < 100) {
          requestAnimationFrame(animate);
        } else {
          setAnimationState({ isAnimating: false, hasAnimated: true, progress: 100 });

          // Persistence: Store that this specific rollout ID has animated
          const saved = localStorage.getItem('animatedRolloutIds');
          const animatedIds = saved ? JSON.parse(saved) : [];
          if (!animatedIds.includes(activeRollout.id)) {
            localStorage.setItem('animatedRolloutIds', JSON.stringify([...animatedIds, activeRollout.id]));
          }
        }
      };
      requestAnimationFrame(animate);
    }
  }, [activeRollout]);

  useEffect(() => {
    if (activeRollout && activeRollout.progress >= 100 && !isCompleting) {
      setIsCompleting(true);
      const timer = setTimeout(() => {
        setFinalProgress(100);
        setRollouts(prev => prev.map(r => r.id === activeRollout.id ? { ...activeRollout, status: 'completed', progress: 100, lastUpdated: new Date().toISOString() } : r));
        setActiveRollout(null);
        localStorage.removeItem('activeRolloutProgress');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeRollout]);

  useEffect(() => {
    if (activeRollout && allDevices) {
      const matchingDevices = allDevices.filter(device => activeRollout.targetRegions?.includes(device.region) && activeRollout.targetGroups?.includes(device.deviceGroup) && device.osVersion === activeRollout.fromVersion);
      setDeviceCounts({
        completed: matchingDevices.filter(d => d.updateStatus === 'completed').length,
        failed: matchingDevices.filter(d => d.updateStatus === 'failed').length,
        inProgress: matchingDevices.filter(d => d.updateStatus === 'updating').length
      });
    }
  }, [activeRollout, allDevices]);

  if (!activeRollout) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-center mx-auto mb-10 group relative transition-all duration-700 hover:scale-110">
          <div className="absolute -inset-4 bg-primary-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <FiActivity className="w-16 h-16 text-gray-700 relative z-10" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter italic">Process <span className="text-gradient">Quiescent</span></h2>
        <p className="text-gray-500 mb-12 max-w-md mx-auto text-lg font-medium leading-relaxed">
          The deployment pipeline is currently idle. No active rollouts detected in the secure cluster.
        </p>
        <Button onClick={() => window.location.hash = '#/scheduler'} className="px-10 py-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          Initialize Rollout
        </Button>
      </div>
    );
  }

  const progressValue = isCompleting ? finalProgress : (animationState.isAnimating || animationState.hasAnimated ? animationState.progress : (activeRollout.progress || 0));

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Badge variant="success" className="animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.3)]">Mission Active</Badge>
            <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <FiZap /> Real-time Telemetry
            </span>
          </div>
          <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none italic">
            {activeRollout.name}
          </h1>
          <div className="flex flex-wrap items-center gap-8 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500">
            <span className="flex items-center gap-3 glass px-4 py-2 rounded-xl border border-white/5">
              <FiClock className="text-primary-500 w-4 h-4" />
              T-Zero: {new Date(activeRollout.startTime).toLocaleTimeString()}
            </span>
            <span className="flex items-center gap-3 glass px-4 py-2 rounded-xl border border-white/5">
              <FiServer className="text-primary-500 w-4 h-4" />
              Manifest: v{activeRollout.osVersion?.split(' ')[1] || '2.4'}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => { }}
            className="!rounded-2xl px-8 hover:bg-white/10 transition-all"
            disabled={progressValue >= 100}
          >
            <FiPause className="mr-2" /> Pause
          </Button>
          <Button
            variant="danger"
            onClick={() => { }}
            className="!rounded-2xl px-8 hover:scale-105 transition-all"
            disabled={progressValue >= 100}
          >
            <FiX className="mr-2" /> Abort
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Core Propulsion Panel */}
        <Card className="xl:col-span-3 p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-primary-500/10"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Propagation Velocity</p>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter">{progressValue.toFixed(1)}%</span>
                <span className="text-xs font-black text-primary-500 uppercase tracking-widest flex items-center gap-1 animate-pulse">
                  <FiTrendingUp className="w-3 h-3" /> Accelerating
                </span>
              </div>
            </div>

            <div className="flex gap-2 h-20 items-end px-4 glass-header rounded-2xl border border-white/5">
              {[35, 65, 45, 80, 55, 95, 40, 70, 50, 85].map((h, i) => (
                <div key={i} className="w-2 bg-primary-500/20 rounded-t-lg group relative hover:bg-primary-500 transition-all duration-300" style={{ height: `${h}%` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[8px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap z-30 shadow-2xl">
                    LATENCY: {h}ms
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ProgressBar value={progressValue} className="h-10 p-1.5" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-10 border-t border-white/5">
            {[
              { label: 'Validated Devices', val: deviceCounts.completed, color: 'text-green-500', icon: FiCheck },
              { label: 'Signal Anomalies', val: deviceCounts.failed, color: 'text-red-500', icon: FiAlertTriangle },
              { label: 'Synchronizing', val: deviceCounts.inProgress, color: 'text-primary-500', icon: FiActivity },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-5 p-4 rounded-[2rem] hover:bg-white/5 transition-colors group">
                <div className={`p-4 rounded-2xl bg-white/5 ${s.color} group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{s.label}</p>
                  <p className={`text-4xl font-black ${s.color} tracking-tighter`}>{s.val}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Phase Analysis Siderail */}
        <div className="space-y-8">
          <Card className="p-8 group">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-500 mb-8 border-b border-primary-500/20 pb-4">Strategic Phases</p>
            <div className="space-y-8">
              {[
                { l: 'Manifest Lockdown', p: 100, s: 'verified' },
                { l: 'Handshake Protocol', p: 85, s: 'active' },
                { l: 'Payload Osmosis', p: 62, s: 'active' },
                { l: 'Regional Validation', p: 0, s: 'queued' },
              ].map((p, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className={p.p === 100 ? 'text-green-500' : p.p > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-600'}>{p.l}</span>
                    <span className="text-gray-500">{p.p}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${p.p === 100 ? 'bg-green-500' : 'bg-primary-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
                      style={{ width: `${p.p}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-primary-500/20 transition-all">
            <FiShield className="absolute -right-6 -bottom-6 w-32 h-32 opacity-5 text-primary-500 group-hover:scale-110 transition-transform duration-700" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2">Fleet Impact Score</p>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">9.8</span>
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">OPTIMAL</span>
            </div>
            <div className="mt-6 flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <div key={i} className={`flex-1 h-1 rounded-full ${i <= 9 ? 'bg-green-500' : 'bg-white/10'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Stream */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8">
          <Card
            className="h-full"
            header={
              <div className="flex items-center justify-between w-full">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gradient">Secure Telemetry Feed</h3>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  Encrypted Stream Active
                </span>
              </div>
            }
          >
            <TimelineView events={timelineEvents} />
          </Card>
        </div>

        <div className="xl:col-span-4">
          <Card className="p-8 h-full bg-primary-900/5 border-primary-500/10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8 italic">Device Map Intelligence</h3>
            <div className="space-y-6">
              {[
                { r: 'North America', c: 'Optimal', p: 94 },
                { r: 'European Union', c: 'Throttled', p: 42 },
                { r: 'Asia Pacific', c: 'Standby', p: 12 },
                { r: 'Latin America', c: 'Optimal', p: 89 },
              ].map((reg, i) => (
                <div key={i} className="glass-header p-5 rounded-2xl border border-black/5 dark:border-white/5 hover:border-primary-500/20 transition-all group">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{reg.r}</p>
                    <Badge variant={reg.c === 'Optimal' ? 'success' : reg.c === 'Throttled' ? 'warning' : 'default'}>{reg.c}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500/50" style={{ width: `${reg.p}%` }}></div>
                    </div>
                    <span className="text-[10px] font-black text-gray-500 w-8">{reg.p}%</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full mt-10 text-[10px] py-4" onClick={() => { }}>Full Cluster Analysis</Button>
          </Card>
        </div>
      </div>

      {/* Anomaly Mitigation Protocol */}
      {deviceCounts.failed > 0 && (
        <div className="relative group overflow-hidden rounded-[3rem]">
          <div className="absolute inset-0 bg-red-500/10 backdrop-blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative p-10 border border-red-500/30 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-10">
              <div className="w-24 h-24 bg-red-500/20 rounded-[2rem] border border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                <FiAlertTriangle className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter">ANOMALY MITIGATION PROTOCOL</p>
                <p className="text-gray-400 font-medium max-w-xl">
                  {deviceCounts.failed} devices have failed core integrity checks. synchronization handshake aborted by local encryption policies.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" className="!rounded-2xl px-10 py-5 bg-white/5 border-white/10 hover:bg-white/10">Full Device Audit</Button>
              <Button variant="danger" className="!rounded-2xl px-12 py-5 shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:scale-105 transition-all">Initialize Recovery</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRolloutMonitor;
