import React, { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const VersionSelectionStep = ({ data, onChange, errors }) => {
  const [compatibilityCheck, setCompatibilityCheck] = useState({
    isChecking: false,
    isCompatible: null,
    message: ''
  });

  // Available OS versions
  const osVersions = [
    'Windows 10 21H2', 'Windows 10 22H2', 'Windows 11 21H2', 'Windows 11 22H2', 'Windows 11 23H2',
    'Ubuntu 20.04 LTS', 'Ubuntu 22.04 LTS', 'Ubuntu 24.04 LTS',
    'macOS Monterey 12.6', 'macOS Ventura 13.5', 'macOS Sonoma 14.2'
  ];

  const handleFromVersionChange = (version) => {
    const updatedData = { ...data, fromVersion: version };
    onChange(updatedData);
    if (data.toVersion) checkCompatibility(version, data.toVersion);
  };

  const handleToVersionChange = (version) => {
    const updatedData = { ...data, toVersion: version };
    onChange(updatedData);
    if (data.fromVersion) checkCompatibility(data.fromVersion, version);
  };

  const checkCompatibility = (fromVersion, toVersion) => {
    setCompatibilityCheck({ isChecking: true, isCompatible: null, message: '' });
    setTimeout(() => {
      const fromOS = fromVersion.split(' ')[0];
      const toOS = toVersion.split(' ')[0];
      const fromVersionNum = parseFloat(fromVersion.split(' ')[1]);
      const toVersionNum = parseFloat(toVersion.split(' ')[1]);

      let isCompatible = true;
      let message = 'Versions are compatible for upgrade.';

      if (fromOS !== toOS) {
        isCompatible = false;
        message = 'Cross-OS updates are restricted.';
      } else if (toVersionNum < fromVersionNum) {
        isCompatible = false;
        message = 'Version regression is not allowed.';
      }

      setCompatibilityCheck({ isChecking: false, isCompatible, message });
      onChange({ ...data, fromVersion, toVersion, isCompatible, compatibilityMessage: message });
    }, 1200);
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Version <span className="text-gradient">Selection</span></h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Define the trajectory of this update cycle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-3">Origin Version</label>
          <select
            value={data.fromVersion || ''}
            onChange={(e) => handleFromVersionChange(e.target.value)}
            className={`w-full glass px-4 py-3 rounded-2xl border transition-all focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white ${errors.fromVersion ? 'border-red-500/50' : 'border-white/5'
              }`}
          >
            <option value="" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Select baseline...</option>
            {osVersions.map(v => <option key={v} value={v} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">{v}</option>)}
          </select>
          {errors.fromVersion && <p className="mt-2 text-[10px] font-black uppercase text-red-500 tracking-widest">{errors.fromVersion}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-3">Target Version</label>
          <select
            value={data.toVersion || ''}
            onChange={(e) => handleToVersionChange(e.target.value)}
            disabled={!data.fromVersion}
            className={`w-full glass px-4 py-3 rounded-2xl border transition-all focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white ${!data.fromVersion ? 'opacity-30 cursor-not-allowed' : ''
              } ${errors.toVersion || errors.version || errors.compatibility ? 'border-red-500/50' : 'border-white/5'}`}
          >
            <option value="" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Select target...</option>
            {osVersions.filter(v => !data.fromVersion || v.split(' ')[0] === data.fromVersion.split(' ')[0]).map(v => (
              <option key={v} value={v} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">{v}</option>
            ))}
          </select>
          {(errors.toVersion || errors.version || errors.compatibility) && (
            <p className="mt-2 text-[10px] font-black uppercase text-red-500 tracking-widest">
              {errors.toVersion || errors.version || errors.compatibility}
            </p>
          )}
        </div>
      </div>

      {data.fromVersion && data.toVersion && (
        <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${compatibilityCheck.isCompatible === true ? 'bg-green-500/5 border-green-500/20' :
          compatibilityCheck.isCompatible === false ? 'bg-red-500/5 border-red-500/20' :
            'bg-primary-500/5 border-primary-500/20'
          }`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${compatibilityCheck.isCompatible === true ? 'bg-green-500/20 text-green-500' :
              compatibilityCheck.isCompatible === false ? 'bg-red-500/20 text-red-500' :
                'bg-primary-500/20 text-primary-500'
              }`}>
              {compatibilityCheck.isChecking ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> :
                compatibilityCheck.isCompatible === true ? <FiCheckCircle className="w-6 h-6" /> :
                  compatibilityCheck.isCompatible === false ? <FiAlertTriangle className="w-6 h-6" /> :
                    <FiInfo className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">
                {compatibilityCheck.isChecking ? 'Analysis in Progress' : 'Compatibility Matrix'}
              </h3>
              <p className={`text-sm font-medium mt-1 ${compatibilityCheck.isCompatible === true ? 'text-green-400' :
                compatibilityCheck.isCompatible === false ? 'text-red-400' : 'text-primary-400'
                }`}>
                {compatibilityCheck.message || 'Processing architectural requirements...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionSelectionStep;
