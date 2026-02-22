import React, { useState } from 'react';
import { FiFilter, FiDownload, FiRefreshCw, FiSearch, FiMonitor, FiChevronRight } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import KPICards from '../components/dashboard/KPICards';
import HeatmapGrid from '../components/dashboard/HeatmapGrid';
import DeviceDetailDrawer from '../components/dashboard/DeviceDetailDrawer';

const Devices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mock data
  const kpiData = {
    totalDevices: 1248,
    outdatedDevices: 342,
    inactiveDevices: 87,
    failedUpdates: 23
  };

  const heatmapData = {
    regions: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'],
    osVersions: ['Windows 11', 'Windows 10', 'macOS Sonoma', 'Ubuntu 22.04', 'CentOS 8'],
    data: [
      [120, 85, 45, 67, 23],
      [95, 110, 34, 56, 18],
      [180, 145, 78, 92, 41],
      [67, 52, 28, 34, 12],
      [45, 38, 19, 27, 8]
    ]
  };

  const devices = [
    {
      id: 'DEV-001',
      name: 'Laptop-001',
      ip: '192.168.1.101',
      osVersion: 'Windows 11 23H2',
      region: 'North America',
      lastSeen: '2 min ago',
      updateStatus: 'Up to date',
      location: 'Building A, Floor 2',
      model: 'Dell XPS 15',
    },
    {
      id: 'DEV-002',
      name: 'Server-002',
      ip: '192.168.1.102',
      osVersion: 'Ubuntu 20.04 LTS',
      region: 'Europe',
      lastSeen: '5 min ago',
      updateStatus: 'Outdated',
      location: 'Server Room 1',
      model: 'HP ProLiant DL380',
    },
    {
      id: 'DEV-003',
      name: 'Desktop-003',
      ip: '192.168.1.103',
      osVersion: 'macOS Ventura',
      region: 'Asia Pacific',
      lastSeen: '8 days ago',
      updateStatus: 'Inactive',
      location: 'Building B, Floor 1',
      model: 'iMac 27"',
    },
    {
      id: 'DEV-004',
      name: 'Workstation-004',
      ip: '192.168.1.104',
      osVersion: 'Windows 10 22H2',
      region: 'North America',
      lastSeen: '3 min ago',
      updateStatus: 'Outdated',
      location: 'Building A, Floor 3',
      model: 'Lenovo ThinkStation',
    },
    {
      id: 'DEV-005',
      name: 'Laptop-005',
      ip: '192.168.1.105',
      osVersion: 'macOS Sonoma',
      region: 'Latin America',
      lastSeen: '1 min ago',
      updateStatus: 'Up to date',
      location: 'Building C, Floor 1',
      model: 'MacBook Pro 16"',
    }
  ];

  const statusVariants = {
    'Up to date': 'success',
    'Outdated': 'warning',
    'Failed': 'danger',
    'Inactive': 'default'
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.osVersion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.region.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || device.updateStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (device) => {
    setSelectedDevice(device);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDevice(null);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Device <span className="text-gradient">Inventory</span>
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
            Projected metrics and fleet-wide status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" className="flex items-center">
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary" className="flex items-center">
            <FiDownload className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Search Area - Full Width */}
      <div className="p-8 glass rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-primary-500/50" />
          </div>
          <input
            type="text"
            className="block w-full pl-16 pr-6 py-5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 focus:border-primary-500/50 rounded-3xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-8 focus:ring-primary-500/5 transition-all text-lg font-medium"
            placeholder="Search by device ID, name, IP, OS, or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* KPI Cards - Full Width */}
      <KPICards kpiData={kpiData} />

      {/* Distribution Matrix - Full Width */}
      <Card
        className="w-full"
        header={
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary-600 dark:text-primary-500 italic">Cluster Device Distribution Matrix</h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Live Telemetry</span>
            </div>
          </div>
        }
      >
        <HeatmapGrid heatmapData={heatmapData} />
      </Card>

      {/* Table Area - Full Width */}
      <Card className="p-0 overflow-hidden border-white/5 shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/[0.02] to-transparent pointer-events-none"></div>
        <div className="overflow-x-auto relative z-10">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02]">
                <th className="px-10 py-7 text-left text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em]">
                  DEVICE IDENTITY
                </th>
                <th className="px-10 py-7 text-left text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em]">
                  ENVIRONMENT
                </th>
                <th className="px-10 py-7 text-left text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em]">
                  REGION
                </th>
                <th className="px-10 py-7 text-left text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em]">
                  LAST SEEN
                </th>
                <th className="px-10 py-7 text-left text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em]">
                  UPDATE STATUS
                </th>
                <th className="px-10 py-7 text-right text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em]">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDevices.map((device) => (
                <tr
                  key={device.id}
                  className="group hover:bg-white/[0.04] cursor-pointer transition-all duration-300"
                  onClick={() => handleRowClick(device)}
                >
                  <td className="px-10 py-8">
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider group-hover:text-primary-500 transition-colors">{device.id}</p>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">{device.name}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{device.osVersion}</p>
                  </td>
                  <td className="px-10 py-8 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tighter">
                    {device.region}
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 italic">{device.lastSeen}</p>
                  </td>
                  <td className="px-10 py-8">
                    <Badge variant={statusVariants[device.updateStatus] || 'default'}>
                      {device.updateStatus}
                    </Badge>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-[0.2em] hover:bg-primary-500/10">Log</Button>
                      <Button variant="primary" size="sm" className="text-[9px] font-black uppercase tracking-[0.2em] shadow-none">Manage</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDevices.length === 0 && (
          <div className="text-center py-32 bg-white/[0.02]">
            <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform border border-black/5 dark:border-white/5">
              <FiSearch className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase">No Devices Detected</h3>
            <p className="text-sm text-gray-500 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
              The current search parameters yield zero active signatures in the monitored cluster. Verify filters or expand parameters.
            </p>
            <Button variant="ghost" size="sm" className="mt-10 px-8 py-4 border border-white/10" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
              Reset System Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Device Detail Drawer */}
      <DeviceDetailDrawer
        device={selectedDevice}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
    </div>
  );
};

export default Devices;
