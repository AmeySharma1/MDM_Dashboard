import React, { useState } from 'react';
import { FiPlus, FiX, FiShield } from 'react-icons/fi';
import Badge from '../ui/Badge';

const TargetingRulesStep = ({ data, onChange, errors }) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'];
  const deviceGroups = ['Workstations', 'Laptops', 'Servers', 'Desktops', 'Mobile Devices', 'Development Machines'];

  const addRegion = () => {
    if (selectedRegion && !data.selectedRegions.includes(selectedRegion)) {
      onChange({ ...data, selectedRegions: [...data.selectedRegions, selectedRegion] });
      setSelectedRegion('');
    }
  };

  const addGroup = () => {
    if (selectedGroup && !data.selectedGroups.includes(selectedGroup)) {
      onChange({ ...data, selectedGroups: [...data.selectedGroups, selectedGroup] });
      setSelectedGroup('');
    }
  };

  const removeRegion = (region) => onChange({ ...data, selectedRegions: data.selectedRegions.filter(r => r !== region) });
  const removeGroup = (group) => onChange({ ...data, selectedGroups: data.selectedGroups.filter(g => g !== group) });

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Targeting <span className="text-gradient">Rules</span></h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Define the blast radius and deployment scope</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Regional Scope</h3>
            {errors.regions && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{errors.regions}</span>}
          </div>
          <div className="flex gap-2">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="flex-1 glass px-2 py-1 rounded-2xl border border-black/5 dark:border-white/5 outline-none text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Select Region...</option>
              {regions.filter(r => !data.selectedRegions.includes(r)).map(r => <option key={r} value={r} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">{r}</option>)}
            </select>
            <button onClick={addRegion} className="p-3 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 transition-colors"><FiPlus className="w-6 h-6" /></button>
          </div>
          <div className="flex flex-wrap gap-3">
            {data.selectedRegions.map(r => (
              <div key={r} className="group glass-header flex items-center gap-2 px-4 py-2 rounded-xl border border-black/5 dark:border-white/10 hover:border-primary-500/30 transition-all">
                <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{r}</span>
                <button onClick={() => removeRegion(r)} className="text-gray-500 hover:text-red-500 transition-colors"><FiX className="w-3 h-3" /></button>
              </div>
            ))}
            {data.selectedRegions.length === 0 && <span className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-700 tracking-widest">Global scope not defined</span>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Asset Groups</h3>
            {errors.groups && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{errors.groups}</span>}
          </div>
          <div className="flex gap-1">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="flex-1 glass px-1 py-1 rounded-2xl border border-black/5 dark:border-white/5 outline-none text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Select Group...</option>
              {deviceGroups.filter(g => !data.selectedGroups.includes(g)).map(g => <option key={g} value={g} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">{g}</option>)}
            </select>
            <button onClick={addGroup} className="p-3 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 transition-colors"><FiPlus className="w-6 h-6" /></button>
          </div>
          <div className="flex flex-wrap gap-3">
            {data.selectedGroups.map(g => (
              <div key={g} className="group glass-header flex items-center gap-2 px-4 py-2 rounded-xl border border-black/5 dark:border-white/10 hover:border-primary-500/30 transition-all">
                <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{g}</span>
                <button onClick={() => removeGroup(g)} className="text-gray-500 hover:text-red-500 transition-colors"><FiX className="w-3 h-3" /></button>
              </div>
            ))}
            {data.selectedGroups.length === 0 && <span className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-700 tracking-widest">Asset segments not selected</span>}
          </div>
        </div>
      </div>

      <div className={`p-8 rounded-[2rem] border transition-all duration-700 relative overflow-hidden group ${data.excludeRisky ? 'bg-primary-500/10 border-primary-500/30 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/5'
        }`}>
        <div className="flex items-start justify-between relative z-10">
          <div className="flex gap-6">
            <div>
              <FiShield className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Safe Deployment Shield</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-md">Exclude critical assets and devices with recent telemetry anomalies from this cycle.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={data.excludeRisky} onChange={(e) => onChange({ ...data, excludeRisky: e.target.checked })} className="sr-only peer" />
            <div className="w-14 h-7 bg-black/10 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default TargetingRulesStep;
