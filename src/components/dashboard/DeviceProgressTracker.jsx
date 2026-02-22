import React, { useState } from 'react';
import { FiClock, FiDownload, FiAlertTriangle, FiCheck, FiPause, FiPlay } from 'react-icons/fi';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

const DeviceProgressTracker = ({ devices }) => {
  const [expandedDevice, setExpandedDevice] = useState(null);

  const getStatusIcon = (stage, status) => {
    // Handle both old and new data structures
    const actualStage = stage || status;
    switch (actualStage) {
      case 'not_started':
        return <FiClock className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
      case 'downloading':
        return <FiDownload className="w-4 h-4 text-blue-500" />;
      case 'installing':
        return <FiAlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <FiCheck className="w-4 h-4 text-green-500" />;
      case 'idle':
        return <FiClock className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
      case 'failed':
        return <FiAlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <FiClock className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getStatusVariant = (status) => {
    // Handle both old and new data structures
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'failed':
        return 'danger';
      case 'pending':
        return 'default';
      case 'paused':
        return 'warning';
      case 'updating':
        return 'info';
      case 'up-to-date':
        return 'success';
      case 'offline':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const toggleExpandDevice = (deviceId) => {
    setExpandedDevice(expandedDevice === deviceId ? null : deviceId);
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Device Progress Tracker
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {devices.map((device) => (
          <div key={device.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpandDevice(device.id)}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(device.stage, device.status)}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{device.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(device.stage || device.updateStage || device.status).replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant={getStatusVariant(device.status)}>
                  {device.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {(device.progress || device.updateProgress || 0).toFixed(1)}%
                </span>
              </div>
            </div>
            
            {expandedDevice === device.id && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="mb-3">
                  <ProgressBar value={device.progress || device.updateProgress || 0} />
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
                      {device.status || device.updateStatus || 'unknown'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Stage:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
                      {device.stage || device.updateStage || 'idle'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {(device.lastUpdated || device.lastSeen) ? new Date(device.lastUpdated || device.lastSeen).toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">ID:</span>
                    <span className="ml-2 font-mono text-gray-900 dark:text-white">
                      {device.id}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  {device.status === 'paused' && (
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center">
                      <FiPlay className="w-3 h-3 mr-1" />
                      Resume
                    </button>
                  )}
                  {device.status === 'in-progress' && (
                    <button className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors flex items-center">
                      <FiPause className="w-3 h-3 mr-1" />
                      Pause
                    </button>
                  )}
                  {(device.status === 'failed' || device.status === 'pending') && (
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center">
                      <FiPlay className="w-3 h-3 mr-1" />
                      Start
                    </button>
                  )}
                  <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors flex items-center">
                    <FiAlertTriangle className="w-3 h-3 mr-1" />
                    Details
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DeviceProgressTracker;