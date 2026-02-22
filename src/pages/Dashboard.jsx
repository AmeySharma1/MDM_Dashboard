import { FiMonitor, FiCalendar, FiActivity, FiAlertCircle, FiArrowUpRight, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StatsCard from '../components/dashboard/StatsCard';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Devices',
      value: '1,248',
      change: 12.5,
      trend: 'from last month',
      icon: FiMonitor,
      color: 'primary'
    },
    {
      title: 'Pending Updates',
      value: '142',
      change: -3.2,
      trend: 'from last week',
      icon: FiCalendar,
      color: 'warning'
    },
    {
      title: 'Active Rollouts',
      value: '7',
      change: 8.1,
      trend: 'currently running',
      icon: FiActivity,
      color: 'success'
    },
    {
      title: 'Critical Anomalies',
      value: '3',
      change: -25.0,
      trend: 'resolved this cycle',
      icon: FiAlertCircle,
      color: 'danger'
    }
  ];

  const recentDevices = [
    { id: 1, name: 'Device-001', status: 'Online', lastSeen: '2m ago', os: 'Windows 11' },
    { id: 2, name: 'Core-002', status: 'Updating', lastSeen: '5m ago', os: 'Ubuntu 22.04' },
    { id: 3, name: 'Edge-003', status: 'Offline', lastSeen: '1h ago', os: 'macOS Sonoma' },
    { id: 4, name: 'Alpha-004', status: 'Online', lastSeen: '3m ago', os: 'Windows 10' },
  ];

  const statusVariants = {
    'Online': 'success',
    'Updating': 'warning',
    'Offline': 'danger'
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic pr-2">
            MDM <span className="text-gradient">Control</span>
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400 font-medium text-lg leading-relaxed">
            Real-time device inventory visualization.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="primary" className="px-10 shadow-lg shadow-primary-500/20">
            <FiRefreshCw className="mr-2" /> Resync Devices
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Recent Devices */}
        <div className="xl:col-span-2">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Live Device Pulse</h2>
                <button className="text-[10px] font-black text-primary-500 hover:text-primary-400 transition-colors uppercase tracking-[0.2em] flex items-center gap-1">
                  Full Registry <FiArrowUpRight />
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              {recentDevices.map((device) => (
                <div key={device.id} className="group flex items-center justify-between p-6 glass-header hover:bg-white/[0.04] border border-white/5 rounded-3xl transition-all duration-500 cursor-pointer">
                  <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:border-primary-500/30 transition-all duration-500">
                      <FiMonitor className="w-6 h-6 text-gray-400 group-hover:text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 dark:text-white text-lg tracking-tight uppercase">{device.name}</h3>
                      <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">{device.os} • CLUSTER_A</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-right">
                    <div className="space-y-1">
                      <Badge variant={statusVariants[device.status] || 'default'}>
                        {device.status}
                      </Badge>
                      <p className="text-[9px] font-black text-gray-500 dark:text-gray-500 uppercase tracking-widest italic">{device.lastSeen}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Strategic Directives */}
        <div className="space-y-8">
          <Card
            header={
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Scheduled Operations</h2>
            }
          >
            <div className="space-y-5">
              {[
                { title: 'Update Schedule', desc: 'Global manifest deployment', icon: FiCalendar, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/scheduler' },
                { title: 'Active Rollout', desc: 'Monitor live propagation', icon: FiActivity, color: 'text-green-500', bg: 'bg-green-500/10', path: '/active-monitor' },
                { title: 'View Rollback', desc: 'Rollback and history', icon: FiRefreshCw, color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/monitor' },
              ].map((act, i) => (
                <Link key={i} to={act.path} className="block w-full text-left p-6 glass-header hover:bg-white/10 border border-white/5 rounded-3xl transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:bg-primary-500/5 transition-all duration-700"></div>
                  <div className="flex items-center relative z-10">
                    <div className={`w-12 h-12 rounded-2xl ${act.bg} flex items-center justify-center mr-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <act.icon className={`w-6 h-6 ${act.color}`} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{act.title}</h3>
                      <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">{act.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Quick Uptime Widget */}
          <div className="p-8 glass rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl"></div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter">99.9<span className="text-primary-500">%</span></p>
                <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mt-1">Cluster Uptime</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5">
                <FiActivity className="w-5 h-5 text-primary-500 animate-pulse" />
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-16 w-full">
              {[40, 75, 55, 90, 65, 80, 45, 95, 70, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-white/5 rounded-full relative group/bar overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full bg-primary-500/40 rounded-full transition-all duration-1000 group-hover:bg-primary-500" style={{ height: `${h}%` }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
