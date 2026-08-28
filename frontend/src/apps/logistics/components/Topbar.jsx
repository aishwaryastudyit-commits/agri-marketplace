import React from 'react';
import {
  Search,
  Bell,
  Smartphone,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';

export default function Topbar() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    stats,
    notifications
  } = useLogistics();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Logistics Command Dashboard';
      case 'delivery-jobs':
        return 'Delivery Job Management';
      case 'workers':
        return 'Worker & Vehicle Fleet Management';
      case 'pickups':
        return 'Multi-Farmer Farm-Gate Pickups';
      case 'routes':
        return 'Route Visualization & Smart Optimization';
      case 'order-groups':
        return 'Order Grouping & Batch Pooling';
      case 'shortages':
        return 'Shortage Discrepancy Registry';
      case 'reports':
        return 'Logistics Analytics & KPIs';
      case 'notifications':
        return 'System Notifications & Live Alerts';
      case 'settings':
        return 'Logistics Configuration & Depot Settings';
      case 'worker-workspace':
        return 'Delivery Driver Mobile Workspace';
      default:
        return 'Logistics Hub';
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-page-title">{getPageTitle()}</h2>
      </div>

      <div className="topbar-search">
        <Search size={16} className="topbar-search-icon" />
        <input
          type="text"
          placeholder="Search jobs, orders, farmers, drivers, commodities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="topbar-right">
        {/* Quick Driver App Mode Toggle Button */}
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setActiveTab(activeTab === 'worker-workspace' ? 'dashboard' : 'worker-workspace')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Smartphone size={15} />
          <span>{activeTab === 'worker-workspace' ? 'Exit Driver Mode' : 'Driver View'}</span>
        </button>

        {/* Notifications Icon Button */}
        <button
          className="topbar-action-btn"
          onClick={() => setActiveTab('notifications')}
          title="Notifications"
        >
          <Bell size={18} />
          {stats.unreadNotifications > 0 && <span className="topbar-badge-dot" />}
        </button>

        {/* User Profile Pill */}
        <div className="topbar-profile" onClick={() => setActiveTab('settings')}>
          <div className="topbar-avatar">M5</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="topbar-user-name">Member 5 Logistics</span>
            <span className="topbar-user-role">Operations Dispatcher</span>
          </div>
        </div>
      </div>
    </header>
  );
}
