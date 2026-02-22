import React from 'react';
import { FiX, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import Button from '../ui/Button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, wizardData }) => {
  if (!isOpen) return null;

  const riskLevel = wizardData.summary.affectedDevices > 1000 ? 'high' : wizardData.summary.affectedDevices > 500 ? 'medium' : 'low';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl glass rounded-[2.5rem] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-10 space-y-8">
          <div className="flex items-start justify-between">
            <div className={`p-4 rounded-2xl ${riskLevel === 'high' ? 'bg-red-500/20 text-red-500' :
              riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-primary-500/20 text-primary-500'
              }`}>
              {riskLevel === 'low' ? <FiCheckCircle className="w-8 h-8" /> : <FiAlertTriangle className="w-8 h-8" />}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-gray-500 transition-colors"><FiX className="w-6 h-6" /></button>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">Deployment Authorization</h3>
            <p className="text-gray-400 mt-2 font-medium">Verify the mission parameters before final execution.</p>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Asset Scope', value: `${wizardData.summary.affectedDevices} Devices`, color: 'text-gray-900 dark:text-white' },
              { label: 'Protocol', value: wizardData.rolloutStrategy.rolloutType.toUpperCase(), color: 'text-primary-400' },
              { label: 'Risk Vector', value: riskLevel.toUpperCase(), color: riskLevel === 'high' ? 'text-red-500' : 'text-green-500' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between py-4 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{row.label}</span>
                <span className={`text-sm font-black uppercase tracking-widest ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="secondary" onClick={onClose} className="flex-1 py-4">Abort Mission</Button>
            <Button
              variant={riskLevel === 'high' ? 'danger' : 'primary'}
              onClick={onConfirm}
              className="flex-1 py-4 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-primary-500/50"
            >
              Authorize Rollout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
