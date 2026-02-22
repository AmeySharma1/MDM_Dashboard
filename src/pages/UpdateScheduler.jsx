import React from 'react';
import UpdateWizard from '../components/wizard/UpdateWizard';

const UpdateScheduler = () => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto py-4">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
          Update <span className="text-gradient">Scheduler</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
          Configure mission-critical OS deployments across your global fleet with our precision wizard.
        </p>
      </div>

      <div className="glass p-1 rounded-[2.5rem] border border-white/5 bg-white/5">
        <UpdateWizard />
      </div>
    </div>
  );
};

export default UpdateScheduler;