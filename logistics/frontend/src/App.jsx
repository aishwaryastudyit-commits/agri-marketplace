import React from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import DeliveryJobs from './pages/DeliveryJobs';
import Workers from './pages/Workers';
import Pickups from './pages/Pickups';
import Routes from './pages/Routes';
import OrderGroups from './pages/OrderGroups';
import Shortages from './pages/Shortages';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import WorkerWorkspace from './pages/WorkerWorkspace';

function AppContent() {
  const { activeTab } = useLogistics();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'delivery-jobs':
        return <DeliveryJobs />;
      case 'workers':
        return <Workers />;
      case 'pickups':
        return <Pickups />;
      case 'routes':
        return <Routes />;
      case 'order-groups':
        return <OrderGroups />;
      case 'shortages':
        return <Shortages />;
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      case 'worker-workspace':
        return <WorkerWorkspace />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Topbar />
        <main>{renderActivePage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LogisticsProvider>
      <AppContent />
    </LogisticsProvider>
  );
}
