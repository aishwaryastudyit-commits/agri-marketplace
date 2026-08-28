import React from 'react';
import {
  LayoutDashboard,
  Truck,
  Users,
  PackageCheck,
  Route,
  Layers,
  AlertOctagon,
  BarChart3,
  Bell,
  Settings,
  Smartphone,
  Sprout,
  ShieldCheck
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, stats, shortages, notifications } = useLogistics();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'delivery-jobs', label: 'Delivery Jobs', icon: Truck, badge: stats.availableJobs > 0 ? `${stats.availableJobs} new` : null },
    { id: 'workers', label: 'Workers', icon: Users, badge: `${stats.availableWorkers} avail` },
    { id: 'pickups', label: 'Pickups', icon: PackageCheck, badge: null },
    { id: 'routes', label: 'Routes', icon: Route, badge: null },
    { id: 'order-groups', label: 'Order Groups', icon: Layers, badge: 'Pool' },
    { id: 'shortages', label: 'Shortages', icon: AlertOctagon, badge: stats.totalShortages > 0 ? stats.totalShortages : null, isAlert: true },
    { id: 'reports', label: 'Reports', icon: BarChart3, badge: null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: stats.unreadNotifications > 0 ? stats.unreadNotifications : null, isAlert: stats.unreadNotifications > 0 },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-logo-container">
          <Sprout size={26} strokeWidth={2.5} />
        </div>
        <div className="brand-info">
          <h1>ANNAM</h1>
          <span className="brand-badge">Logistics Hub • Member 5</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-category">Operations</div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-item-left">
                <Icon size={19} className="nav-icon" />
                <span className="nav-item-text">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`nav-pill ${item.isAlert ? 'badge-alert' : ''}`}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / Driver Mode Workspace quick toggle */}
      <div className="sidebar-footer">
        <div className="worker-mode-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
            <Smartphone size={16} color="#34d399" />
            <h4>Driver Workspace</h4>
          </div>
          <p>Switch to driver mobile mode to simulate on-the-road workflow.</p>
          <button
            className="btn btn-primary btn-sm"
            style={{ width: '100%', fontSize: '0.8rem' }}
            onClick={() => setActiveTab('worker-workspace')}
          >
            {activeTab === 'worker-workspace' ? 'Active in Driver Mode' : 'Launch Driver App'}
          </button>
        </div>
      </div>
    </aside>
  );
}
