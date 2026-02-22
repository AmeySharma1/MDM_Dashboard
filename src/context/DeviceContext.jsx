import React, { createContext, useContext, useState, useEffect } from 'react';

const DeviceContext = createContext();

// Generate initial mock data for 1250 devices
const generateInitialDevices = () => {
  const devices = [];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'];
  const osVersions = ['Windows 10 21H2', 'Windows 10 22H2', 'Windows 11 21H2', 'Windows 11 22H2', 'Windows 11 23H2', 'Ubuntu 20.04 LTS', 'Ubuntu 22.04 LTS', 'macOS Monterey', 'macOS Ventura', 'macOS Sonoma'];
  const deviceGroups = ['Workstations', 'Laptops', 'Servers', 'Desktops', 'Mobile Devices', 'Development Machines'];

  for (let i = 1; i <= 1250; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const os = osVersions[Math.floor(Math.random() * osVersions.length)];
    const group = deviceGroups[Math.floor(Math.random() * deviceGroups.length)];

    devices.push({
      id: `DEV-${String(i).padStart(4, '0')}`,
      name: `Device-${i}`,
      region,
      osVersion: os,
      deviceGroup: group,
      status: Math.random() > 0.85 ? 'offline' : 'online', // 15% offline
      lastSeen: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(), // Last seen in last 7 days
      lastUpdate: null,
      updateStatus: 'up-to-date',
      isUpdating: false,
      updateProgress: 0,
      updateStage: 'idle' // idle, downloading, installing, completed, failed
    });
  }

  return devices;
};

// Generate initial rollouts
const generateInitialRollouts = () => {
  return [
    {
      id: 1,
      name: 'Windows 11 23H2 Deployment',
      status: 'active',
      progress: 37.5,
      totalDevices: 1200,
      completedDevices: 450,
      failedDevices: 12,
      pausedDevices: 5,
      inProgressDevices: 283,
      startTime: '2024-01-15T09:00:00Z',
      estimatedCompletion: '2024-01-17T15:30:00Z',
      targetRegions: ['North America', 'Europe'],
      targetGroups: ['Workstations', 'Laptops'],
      fromVersion: 'Windows 10 22H2',
      toVersion: 'Windows 11 23H2',
      excludeRisky: true,
      rolloutType: 'phased'
    }
  ];
};

export const DeviceProvider = ({ children }) => {
  const [devices, setDevices] = useState(() => {
    const saved = localStorage.getItem('devices');
    return saved ? JSON.parse(saved) : generateInitialDevices();
  });

  const [rollouts, setRollouts] = useState(() => {
    const saved = localStorage.getItem('rollouts');
    return saved ? JSON.parse(saved) : generateInitialRollouts();
  });

  const [activeRollout, setActiveRollout] = useState(() => {
    const saved = localStorage.getItem('activeRollout');
    return saved ? JSON.parse(saved) : null;
  });

  const [wizardData, setWizardData] = useState(() => {
    const saved = localStorage.getItem('updateWizardData');
    return saved ? JSON.parse(saved) : null;
  });

  const [wizardStep, setWizardStep] = useState(() => {
    const saved = localStorage.getItem('updateWizardStep');
    return saved ? parseInt(saved) : 0;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('rollouts', JSON.stringify(rollouts));
  }, [rollouts]);

  useEffect(() => {
    localStorage.setItem('activeRollout', JSON.stringify(activeRollout));
  }, [activeRollout]);

  useEffect(() => {
    if (wizardData) {
      localStorage.setItem('updateWizardData', JSON.stringify(wizardData));
    } else {
      localStorage.removeItem('updateWizardData');
    }
  }, [wizardData]);

  useEffect(() => {
    localStorage.setItem('updateWizardStep', wizardStep.toString());
  }, [wizardStep]);

  // Function to update devices based on rollout targets
  const updateDevicesForRollout = (rolloutData) => {
    setDevices(prevDevices => {
      return prevDevices.map(device => {
        const matchesRegion = rolloutData.targetingRules.selectedRegions.includes(device.region);
        const matchesGroup = rolloutData.targetingRules.selectedGroups.includes(device.deviceGroup);
        const shouldUpdate = matchesRegion && matchesGroup;

        if (shouldUpdate && device.osVersion === rolloutData.versionSelection.fromVersion) {
          return {
            ...device,
            isUpdating: true,
            updateStatus: 'updating',
            updateStage: 'not_started',
            updateProgress: 0,
            targetOsVersion: rolloutData.versionSelection.toVersion
          };
        }
        return device;
      });
    });

    // Create a new rollout entry
    const newRollout = {
      id: Date.now(),
      name: `${rolloutData.versionSelection.fromVersion} → ${rolloutData.versionSelection.toVersion}`,
      status: 'active',
      progress: 0,
      totalDevices: 0, // Will be calculated based on matching devices
      completedDevices: 0,
      failedDevices: 0,
      pausedDevices: 0,
      inProgressDevices: 0,
      startTime: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      targetRegions: rolloutData.targetingRules.selectedRegions,
      targetGroups: rolloutData.targetingRules.selectedGroups,
      fromVersion: rolloutData.versionSelection.fromVersion,
      toVersion: rolloutData.versionSelection.toVersion,
      excludeRisky: rolloutData.targetingRules.excludeRisky,
      rolloutType: rolloutData.rolloutStrategy.rolloutType,
      lastUpdated: new Date().toISOString()
    };

    // Calculate total devices that match the criteria
    const matchingDevices = devices.filter(device => {
      const matchesRegion = rolloutData.targetingRules.selectedRegions.includes(device.region);
      const matchesGroup = rolloutData.targetingRules.selectedGroups.includes(device.deviceGroup);
      const hasCorrectVersion = device.osVersion === rolloutData.versionSelection.fromVersion;
      return matchesRegion && matchesGroup && hasCorrectVersion;
    }).length;

    newRollout.totalDevices = matchingDevices;

    setRollouts(prev => [...prev, newRollout]);
    setActiveRollout(newRollout);

    // Clear wizard data after creating rollout
    setWizardData(null);
  };

  // Function to update rollout progress based on device states
  const updateRolloutProgress = (rolloutId) => {
    setRollouts(prev => {
      return prev.map(rollout => {
        if (rollout.id !== rolloutId) return rollout;

        const devicesForRollout = devices.filter(device => {
          const matchesRegion = rollout.targetRegions.includes(device.region);
          const matchesGroup = rollout.targetGroups.includes(device.deviceGroup);
          const hasCorrectVersion = device.osVersion === rollout.fromVersion;
          return matchesRegion && matchesGroup && hasCorrectVersion;
        });

        const totalDevices = devicesForRollout.length;
        const completedDevices = devicesForRollout.filter(d => d.updateStage === 'completed').length;
        const failedDevices = devicesForRollout.filter(d => d.updateStage === 'failed').length;
        const inProgressDevices = devicesForRollout.filter(d =>
          d.updateStage === 'downloading' || d.updateStage === 'installing'
        ).length;
        const pausedDevices = devicesForRollout.filter(d => d.updateStage === 'paused').length;

        const progress = totalDevices > 0 ? (completedDevices / totalDevices) * 100 : 0;

        return {
          ...rollout,
          totalDevices,
          completedDevices,
          failedDevices,
          inProgressDevices,
          pausedDevices,
          progress,
          lastUpdated: new Date().toISOString()
        };
      });
    });
  };

  // Function to delete a rollout
  const deleteRollout = (rolloutId) => {
    setRollouts(prev => prev.filter(rollout => rollout.id !== rolloutId));
    // If deleting the active rollout, clear it
    if (activeRollout && activeRollout.id === rolloutId) {
      setActiveRollout(null);
    }
  };

  // Function to simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update active rollouts
      setRollouts(prevRollouts => {
        let changed = false;
        const newRollouts = prevRollouts.map(rollout => {
          if (rollout.status !== 'active') return rollout;

          const devicesForRollout = devices.filter(device => {
            const matchesRegion = rollout.targetRegions.includes(device.region);
            const matchesGroup = rollout.targetGroups.includes(device.deviceGroup);
            const hasCorrectVersion = device.osVersion === rollout.fromVersion;
            return matchesRegion && matchesGroup && hasCorrectVersion;
          });

          const totalDevices = devicesForRollout.length;
          const completedDevices = devicesForRollout.filter(d => d.updateStage === 'completed').length;
          const failedDevices = devicesForRollout.filter(d => d.updateStage === 'failed').length;
          const inProgressDevices = devicesForRollout.filter(d =>
            d.updateStage === 'downloading' || d.updateStage === 'installing'
          ).length;
          const pausedDevices = devicesForRollout.filter(d => d.updateStage === 'paused').length;

          const progress = totalDevices > 0 ? (completedDevices / totalDevices) * 100 : 0;

          if (rollout.progress !== progress) changed = true;

          return {
            ...rollout,
            totalDevices,
            completedDevices,
            failedDevices,
            inProgressDevices,
            pausedDevices,
            progress,
            lastUpdated: new Date().toISOString()
          };
        });
        return changed ? newRollouts : prevRollouts;
      });

      // Update device progress for active rollouts
      setDevices(prevDevices => {
        let changed = false;
        const newDevices = prevDevices.map(device => {
          if (!device.isUpdating || device.updateStage === 'completed' || device.updateStage === 'failed') {
            return device;
          }

          changed = true;
          if (device.updateStage === 'not_started' || device.updateStage === 'downloading') {
            const newProgress = Math.min(100, device.updateProgress + Math.random() * 5);

            let newStage = device.updateStage;
            if (newProgress >= 100 && device.updateStage === 'downloading') {
              newStage = 'installing';
            } else if (newProgress >= 70 && device.updateStage === 'downloading') {
              newStage = 'installing';
            } else if (Math.random() > 0.98 && device.updateStage !== 'failed') { // Reduced failure chance for smoother experience
              newStage = 'failed';
            }

            return {
              ...device,
              updateProgress: newProgress,
              updateStage: newStage,
              lastUpdated: new Date().toISOString()
            };
          } else if (device.updateStage === 'installing') {
            const newProgress = Math.min(100, device.updateProgress + Math.random() * 3);

            if (newProgress >= 100) {
              return {
                ...device,
                updateProgress: 100,
                updateStage: 'completed',
                osVersion: device.targetOsVersion,
                lastUpdate: new Date().toISOString(),
                isUpdating: false,
                updateStatus: 'up-to-date',
                lastUpdated: new Date().toISOString()
              };
            }

            return {
              ...device,
              updateProgress: newProgress,
              updateStage: 'installing',
              lastUpdated: new Date().toISOString()
            };
          }

          return device;
        });
        return changed ? newDevices : prevDevices;
      });
    }, 4000); // Slightly slower interval for performance

    return () => clearInterval(interval);
  }, [devices.length]); // Only reset if population size changes

  const value = {
    devices,
    setDevices,
    rollouts,
    setRollouts,
    activeRollout,
    setActiveRollout,
    wizardData,
    setWizardData,
    wizardStep,
    setWizardStep,
    updateDevicesForRollout,
    updateRolloutProgress,
    deleteRollout
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceContext = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDeviceContext must be used within a DeviceProvider');
  }
  return context;
};