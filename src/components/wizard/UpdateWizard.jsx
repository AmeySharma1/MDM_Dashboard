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

  // Initialize wizard data from context
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
      rolloutType: 'immediate', // immediate, scheduled, phased
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

  // Sync local state with context when context changes
  useEffect(() => {
    if (contextWizardData) {
      setLocalWizardData(contextWizardData);
    }
  }, [contextWizardData]);

  // Sync local state to context when it changes
  useEffect(() => {
    setContextWizardData(localWizardData);
  }, [localWizardData, setContextWizardData]);

  // Reset wizard when navigating away and returning
  useEffect(() => {
    const handleRouteChange = () => {
      // Reset to first step when navigating away
      setCurrentStep(0);
    };

    return handleRouteChange;
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
      case 0: // Version Selection
        if (!localWizardData.versionSelection.fromVersion) {
          errors.fromVersion = 'From version is required';
        }
        if (!localWizardData.versionSelection.toVersion) {
          errors.toVersion = 'To version is required';
        }
        if (localWizardData.versionSelection.fromVersion && localWizardData.versionSelection.toVersion) {
          // Prevent downgrading
          const fromVersion = parseFloat(localWizardData.versionSelection.fromVersion.split(' ')[1]);
          const toVersion = parseFloat(localWizardData.versionSelection.toVersion.split(' ')[1]);
          if (toVersion < fromVersion) {
            errors.version = 'Downgrading OS version is not allowed';
          }
          // Check if compatibility check has been done and passed
          if (localWizardData.versionSelection.isCompatible === false) {
            errors.compatibility = 'Selected versions are not compatible';
          }
          // Don't allow proceeding if compatibility check is still running
          if (localWizardData.versionSelection.isCompatible === null &&
            localWizardData.versionSelection.fromVersion &&
            localWizardData.versionSelection.toVersion) {
            errors.compatibility = 'Please wait for compatibility check to complete';
          }
        }
        break;

      case 1: // Targeting Rules
        if (localWizardData.targetingRules.selectedRegions.length === 0) {
          errors.regions = 'At least one region must be selected';
        }
        if (localWizardData.targetingRules.selectedGroups.length === 0) {
          errors.groups = 'At least one device group must be selected';
        }
        break;

      case 2: // Rollout Strategy
        if (localWizardData.rolloutStrategy.rolloutType === 'scheduled') {
          if (!localWizardData.rolloutStrategy.scheduledDate) {
            errors.date = 'Scheduled date is required';
          }
          if (!localWizardData.rolloutStrategy.scheduledTime) {
            errors.time = 'Scheduled time is required';
          }
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
    // Handle final confirmation and submission
    console.log('Update scheduled:', localWizardData);

    // Create rollout with proper OS version synchronization
    updateDevicesForRollout(localWizardData);

    setIsModalOpen(false);

    // Reset wizard after successful scheduling
    setCurrentStep(0);
    setContextWizardStep(0);
    setLocalWizardData({
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

    // Navigate to active rollout monitor to show the created rollout
    navigate('/active-monitor');
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <VersionSelectionStep
            data={localWizardData.versionSelection}
            onChange={(data) => setLocalWizardData(prev => ({
              ...prev,
              versionSelection: data
            }))}
            errors={validationErrors}
          />
        );
      case 1:
        return (
          <TargetingRulesStep
            data={localWizardData.targetingRules}
            onChange={(data) => setLocalWizardData(prev => ({
              ...prev,
              targetingRules: data
            }))}
            errors={validationErrors}
          />
        );
      case 2:
        return (
          <RolloutStrategyStep
            data={localWizardData.rolloutStrategy}
            onChange={(data) => setLocalWizardData(prev => ({
              ...prev,
              rolloutStrategy: data
            }))}
            errors={validationErrors}
          />
        );
      case 3:
        return (
          <ReviewConfirmStep
            wizardData={localWizardData}
            setWizardData={setLocalWizardData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Deployment <span className="text-gradient">Wizard</span>
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
            Step-by-step update schedule system
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 glass px-4 py-2 rounded-2xl border border-black/5 dark:border-white/5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">System Ready</span>
        </div>
      </div>

      {/* Enhanced Progress Steps */}
      <div className="glass p-6 rounded-[2rem] border border-white/5">
        <div className="flex items-start justify-between relative max-w-4xl mx-auto px-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${isActive
                    ? 'bg-primary-500/20 border-primary-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110'
                    : isCompleted
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-black/5 dark:bg-white/5 text-gray-400 dark:text-gray-600 border-black/10 dark:border-white/10'
                    }`}
                >
                  {isCompleted ? <FiCheck className="w-6 h-6" /> : (
                    <span className={`text-lg font-black ${isActive ? 'text-primary-500' : 'text-gray-500'}`}>
                      {step.icon}
                    </span>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${isActive ? 'text-primary-500' : 'text-gray-500 dark:text-gray-500'
                    }`}>
                    {step.title}
                  </span>
                </div>

                {/* Connector line - simplified logic for better visual integration */}
                {index < steps.length - 1 && (
                  <div className={`absolute top-6 left-[calc(100%-1rem)] w-[calc(220%-2rem)] h-0.5 -z-10 transition-colors duration-500 ${index < currentStep ? 'bg-primary-500' : 'bg-white/10'
                    }`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Content Content */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-400 opacity-20 blur-2xl group-hover:opacity-30 transition duration-1000"></div>
        <Card className="relative p-0 overflow-hidden ring-1 ring-white/5">
          <div className="p-10">
            {getStepContent()}
          </div>
        </Card>
      </div>

      {/* High-Impact Navigation Bar */}
      <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-xl p-4 rounded-3xl">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-8"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Previous Step
        </Button>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Step {currentStep + 1} of {steps.length}</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentStep ? 'bg-primary-500' : 'bg-white/10'}`}></div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleNext}
            className="px-10 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-primary-500/50"
          >
            {currentStep === steps.length - 1 ? 'Execute Rollout' : 'Continue'}
            {currentStep < steps.length - 1 && <FiArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
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
