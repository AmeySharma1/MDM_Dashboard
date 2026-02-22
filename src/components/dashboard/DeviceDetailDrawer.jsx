import React from 'react';
import { FiX, FiCalendar, FiMapPin, FiHardDrive, FiRefreshCw, FiInfo } from 'react-icons/fi';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const DeviceDetailDrawer = ({ device, isOpen, onClose }) => {
  if (!isOpen || !device) return null;

  const statusVariants = {
    'Up to date': 'success',
    'Outdated': 'warning',
    'Failed': 'danger',
    'Inactive': 'default'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md animate-in slide-in-from-right duration-700">
          <div className="h-full flex flex-col glass-sidebar shadow-2xl border-l border-black/5 dark:border-white/10">
            {/* Header */}
            <div className="px-8 py-10 glass-header relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                    Node <span className="text-gradient">Intelligence</span>
                  </h2>
                  <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-[0.3em]">
                    Signature: {device.id}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="h-10 w-10 rounded-2xl flex items-center justify-center bg-black/5 dark:bg-white/5 text-gray-500 hover:text-red-500 transition-all border border-black/5 dark:border-white/10"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
              {/* Device Overview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                    {device.name}
                  </h3>
                  <Badge variant={statusVariants[device.updateStatus] || 'default'}>
                    {device.updateStatus}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: FiHardDrive, label: 'OS Version', value: device.osVersion },
                    { icon: FiMapPin, label: 'Region', value: device.region },
                    { icon: FiCalendar, label: 'Last Seen', value: device.lastSeen },
                    { icon: FiRefreshCw, label: 'Status', value: device.updateStatus },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center p-4 glass rounded-2xl border border-black/5 dark:border-white/5 group">
                      <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500 mr-4">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{item.label}</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white mt-1 uppercase tracking-tight">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Information */}
              <Card
                header={
                  <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 flex items-center">
                    <FiInfo className="w-4 h-4 mr-2 text-primary-500" />
                    System Telemetry
                  </h3>
                }
              >
                <div className="space-y-4">
                  {[
                    { label: 'Model', value: device.model },
                    { label: 'IP Address', value: device.ip },
                    { label: 'Location', value: device.location },
                    { label: 'Last Update', value: device.lastUpdate || 'Never' },
                  ].map((info, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-black/5 dark:border-white/5 last:border-0">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{info.label}</span>
                      <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight italic">{info.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card
                header={
                  <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                    Neural Stream
                  </h3>
                }
              >
                <div className="space-y-5">
                  {(device.recentActivity || [
                    { action: 'SOP Handshake Initiated', timestamp: '2 min ago', status: 'success' },
                    { action: 'Telemetry extraction payload sent', timestamp: '5 min ago', status: 'success' },
                    { action: 'Protocol verification warning', timestamp: '12 min ago', status: 'warning' },
                  ]).map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-yellow-500' :
                          activity.status === 'danger' ? 'bg-red-500' : 'bg-gray-400'
                        } shadow-[0_0_10px_rgba(34,197,94,0.3)]`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide truncate">
                          {activity.action}
                        </p>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Footer */}
            <div className="px-8 py-8 glass-header border-t border-black/5 dark:border-white/10">
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="btn btn-secondary flex-1"
                >
                  Dismiss
                </button>
                <button
                  className="btn btn-primary flex-1"
                >
                  Override
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailDrawer;