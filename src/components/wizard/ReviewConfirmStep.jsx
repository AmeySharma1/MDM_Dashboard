import React, { useEffect, useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiCpu, FiGlobe, FiLayers, FiShield } from 'react-icons/fi';
import Badge from '../ui/Badge';

const ReviewConfirmStep = ({ wizardData, setWizardData }) => {
  const [summary, setSummary] = useState(wizardData.summary || { totalDevices: 0, affectedDevices: 0, highRiskCount: 0, rolloutType: '', scheduleInfo: '' });
  const [isLoading, setIsLoading] = useState(!wizardData.summary?.totalDevices);

  useEffect(() => {
    if (wizardData.summary?.totalDevices > 0) return;

    const calculateSummary = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const regionMultiplier = wizardData.targetingRules.selectedRegions.length * 150;
      const groupMultiplier = wizardData.targetingRules.selectedGroups.length * 80;
      const riskExclusion = wizardData.targetingRules.excludeRisky ? 0.85 : 1;
      const totalDevices = Math.floor((regionMultiplier + groupMultiplier) * riskExclusion);
      const affectedDevices = wizardData.targetingRules.excludeRisky ? Math.floor(totalDevices * 0.9) : totalDevices;
      const highRiskCount = Math.floor(totalDevices * (wizardData.targetingRules.excludeRisky ? 0.1 : 0.15));
      const newSummary = { totalDevices, affectedDevices, highRiskCount, rolloutType: wizardData.rolloutStrategy.rolloutType, scheduleInfo: getScheduleInfo() };

      setSummary(newSummary);
      setWizardData(prev => ({ ...prev, summary: newSummary }));
      setIsLoading(false);
    };
    calculateSummary();
  }, [wizardData.targetingRules, wizardData.rolloutStrategy]); // Removed summary and functions from dependencies

  const getScheduleInfo = () => {
    const { rolloutType: type, scheduledDate: date, scheduledTime: time, phasePercentage: ps } = wizardData.rolloutStrategy;
    if (type === 'immediate') return 'Execution on confirmation';
    if (type === 'scheduled') return `Queued for ${date} at ${time}`;
    return `Phased pulses at ${ps}% intensity`;
  };

  const riskLevel = summary.affectedDevices > 1000 ? 'high' : summary.affectedDevices > 500 ? 'medium' : 'low';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(59,130,246,0.1)]"></div>
        <p className="mt-6 text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-[0.3em] animate-pulse">Analyzing Payload Impact...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Final <span className="text-gradient">Verification</span></h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Review the operational parameters before initiation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Asset Payload', value: summary.affectedDevices, icon: FiCpu, color: 'text-primary-500' },
          { label: 'Operational Risk', value: riskLevel.toUpperCase(), icon: FiAlertTriangle, color: riskLevel === 'high' ? 'text-red-500' : 'text-green-500' },
          { label: 'Protocol', value: summary.rolloutType.toUpperCase(), icon: FiLayers, color: 'text-primary-400' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-black/5 dark:border-white/5 relative overflow-hidden group">
            <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-5 ${stat.color} group-hover:scale-110 transition-transform duration-700`} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2">{stat.label}</p>
            <p className={`text-2xl font-black tracking-tight ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-[2rem] border border-gray-200 dark:border-gray-800 space-y-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-700 dark:text-gray-300">Target Configuration</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Version Transition</span>
                <span className="text-sm font-black text-gray-900 dark:text-white">{wizardData.versionSelection.fromVersion} → {wizardData.versionSelection.toVersion}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Deployment Window</span>
                <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">{summary.scheduleInfo}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Geographic & Asset Scope</h4>
            <div className="flex flex-wrap gap-2">
              {wizardData.targetingRules.selectedRegions.map(r => <Badge key={r} variant="primary">{r}</Badge>)}
              {wizardData.targetingRules.selectedGroups.map(g => <Badge key={g} variant="secondary">{g}</Badge>)}
            </div>
            <div className="flex items-center gap-3 glass-header p-4 rounded-2xl border border-black/5 dark:border-white/5">
              <FiShield className={wizardData.targetingRules.excludeRisky ? 'text-green-500' : 'text-gray-500'} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">
                Risk Mitigation: {wizardData.targetingRules.excludeRisky ? 'ENABLED' : 'BYPASSED'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewConfirmStep;
