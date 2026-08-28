import React from 'react';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  Truck,
  Sparkles,
  Clock
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import Button from '../components/Button';

export default function Notifications() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab
  } = useLogistics();

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={18} color="#dc2626" />;
      case 'success':
        return <CheckCircle2 size={18} color="#15803d" />;
      default:
        return <Info size={18} color="#0284c7" />;
    }
  };

  const getBg = (type, read) => {
    if (read) return '#ffffff';
    switch (type) {
      case 'warning':
        return '#fff7ed';
      case 'success':
        return '#f0fdf4';
      default:
        return '#eff6ff';
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Notifications & Dispatch Activity</h2>
          <p>Real-time telemetry pings, vehicle compatibility warnings & farm-gate shortages</p>
        </div>

        <div className="page-header-actions">
          <Button
            variant="secondary"
            icon={CheckCheck}
            onClick={markAllNotificationsAsRead}
          >
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationAsRead(n.id)}
            style={{
              background: getBg(n.type, n.read),
              border: `1px solid ${n.read ? '#e2e8f0' : n.type === 'warning' ? '#fed7aa' : n.type === 'success' ? '#bbf7d0' : '#bfdbfe'}`,
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '14px',
              cursor: 'pointer',
              boxShadow: n.read ? 'none' : 'var(--shadow-sm)',
              transition: 'all 0.18s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ marginTop: '2px' }}>
                {getIcon(n.type)}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                    {n.title}
                  </h4>
                  {!n.read && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }} />
                  )}
                </div>

                <p style={{ fontSize: '0.86rem', color: '#475569', marginTop: '3px' }}>
                  {n.message}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                  <Clock size={12} />
                  <span>{n.timestamp}</span>
                  {n.jobId && <span>• Job: {n.jobId}</span>}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {n.jobId && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('delivery-jobs');
                  }}
                  style={{ fontSize: '0.75rem' }}
                >
                  View Consignment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
