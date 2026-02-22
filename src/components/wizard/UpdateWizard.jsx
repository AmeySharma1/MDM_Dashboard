import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import VersionSelectionStep from './VersionSelectionStep';
import TargetingRulesStep from './TargetingRulesStep';
import RolloutStrategyStep from './RolloutStrategyStep';
import ReviewConfirmStep from './ReviewConfirmStep';
import ConfirmationModal from './ConfirmationModal';
import { useDeviceContext } from '../../context/DeviceContext';

const UpdateWizard = () => {
  const { wizardData: contextWizardData, setWizardData: setContextWizardData, wizardStep: contextWizardStep, setWizardStep: setContextWizardStep } = useDeviceContext();
  const [currentStep, setCurrentStep] = useState(contextWizardStep || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [localWizardData, setLocalWizardData] = useState(contextWizardData || {
    versionSelection: {
      fromVersion: '',
      toVersion: '',
      isCompatible: null,
      compatibilityMessage: ''
    },
    targetingRules: {
      selectedRegions: [],
      selectedGroups: [],
      excludeRisky: false
    },
    rolloutStrategy: {
      rolloutType: 'immediate',
      scheduledDate: '',
      scheduledTime: '',
      phasePercentage: 25
    },
    summary: {
      totalDevices: 0,
      affectedDevices: 0,
      rolloutType: '',
      scheduleInfo: ''
    }
  });

  useEffect(() => {
    if (contextWizardData) {
      setLocalWizardData(contextWizardData);
    }
  }, [contextWizardData]);

  useEffect(() => {
    setContextWizardData(localWizardData);
  }, [localWizardData, setContextWizardData]);

  useEffect(() => {
    return () => setCurrentStep(0);
  }, [location]);

  const [validationErrors, setValidationErrors] = useState({});

  const steps = [
    { id: 'version', title: 'Version Selection', icon: '1' },
    { id: 'targeting', title: 'Targeting Rules', icon: '2' },
    { id: 'strategy', title: 'Rollout Strategy', icon: '3' },
    { id: 'review', title: 'Review & Confirm', icon: '4' }
  ];

  const validateStep = (stepIndex) => {
    const errors = {};
    switch (stepIndex) {
      case 0:
        if (!localWizardData.versionSelection.fromVersion) errors.fromVersion = 'From version is required';
        if (!localWizardData.versionSelection.toVersion) errors.toVersion = 'To version is required';
        break;
      case 1:
        if (localWizardData.targetingRules.selectedRegions.length === 0) errors.regions = 'At least one region must be selected';
        if (localWizardData.targetingRules.selectedGroups.length === 0) errors.groups = 'At least one device group must be selected';
        break;
      case 2:
        if (localWizardData.rolloutStrategy.rolloutType === 'scheduled') {
          if (!localWizardData.rolloutStrategy.scheduledDate) errors.date = 'Scheduled date is required';
          if (!localWizardData.rolloutStrategy.scheduledTime) errors.time = 'Scheduled time is required';
        }
        break;
      default:
        break;
    }
    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setContextWizardStep(newStep);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      setContextWizardStep(newStep);
    }
  };

  const { updateDevicesForRollout } = useDeviceContext();

  const handleConfirm = () => {
    updateDevicesForRollout(localWizardData);
    setIsModalOpen(false);
    setCurrentStep(0);
    setContextWizardStep(0);
    navigate('/active-monitor');
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return <VersionSelectionStep data={localWizardData.versionSelection} onChange={(data) => setLocalWizardData(prev => ({ ...prev, versionSelection: data }))} errors={validationErrors} />;
      case 1:
        return <TargetingRulesStep data={localWizardData.targetingRules} onChange={(data) => setLocalWizardData(prev => ({ ...prev, targetingRules: data }))} errors={validationErrors} />;
      case 2:
        return <RolloutStrategyStep data={localWizardData.rolloutStrategy} onChange={(data) => setLocalWizardData(prev => ({ ...prev, rolloutStrategy: data }))} errors={validationErrors} />;
      case 3:
        return <ReviewConfirmStep wizardData={localWizardData} setWizardData={setLocalWizardData} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-6">
      <div>
        <h1 className="pt-4 pl-1 text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Deployment <span className="text-gradient">Wizard</span>
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium pl-1">
          Step-by-step update schedule system
        </p>
      </div>

      {/* ===== FIXED PROGRESS STEPPER ===== */}
      <div className="glass p-2 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-white/5 overflow-x-auto">
        <div className="flex items-start justify-between gap-3 sm:gap-0 relative max-w-4xl mx-auto px-2 sm:px-4 min-w-[320px]">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                    isActive
                      ? 'bg-primary-500/20 border-primary-500 scale-110'
                      : isCompleted
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-black/5 dark:bg-white/5 text-gray-400 border-black/10 dark:border-white/10'
                  }`}
                >
                  {isCompleted ? <FiCheck className="w-5 h-5 sm:w-6 sm:h-6" /> : (
                    <span className={`text-base sm:text-lg font-black ${isActive ? 'text-primary-500' : 'text-gray-500'}`}>
                      {step.icon}
                    </span>
                  )}
                </div>

                <span className={`mt-3 text-[8px] sm:text-[10px] whitespace-nowrap font-black ${isActive ? 'text-primary-500' : 'text-gray-500'}`}>
                  {step.title}
                </span>

                {/* FIXED CONNECTOR */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-1/2 left-full hidden sm:block w-full h-0.5 -translate-y-1/2 transition-colors duration-500 ${
                      index < currentStep ? 'bg-primary-500' : 'bg-white/10'
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card className="p-4 sm:p-6 md:p-8 lg:p-10">
        {getStepContent()}
      </Card>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl">
        <Button variant="secondary" onClick={handleBack} disabled={currentStep === 0} className="px-6 sm:px-8 py-2">
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Previous Step
        </Button>

        <Button onClick={handleNext} className="px-4 sm:px-6 md:px-8 py-2">
          {currentStep === steps.length - 1 ? 'Execute Rollout' : 'Continue'}
          {currentStep < steps.length - 1 && <FiArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        wizardData={localWizardData}
      />
    </div>
  );
};

export default UpdateWizard;