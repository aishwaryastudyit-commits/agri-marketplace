import React from 'react';
import {
  Clock,
  UserCheck,
  Navigation,
  PackageCheck,
  Boxes,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';

const FLOW_STEPS = [
  { key: 'AVAILABLE', label: 'Available', icon: Clock, desc: 'Job created in system' },
  { key: 'ASSIGNED', label: 'Assigned', icon: UserCheck, desc: 'Worker assigned' },
  { key: 'GOING TO PICKUP', label: 'Going to Pickup', icon: Navigation, desc: 'Driver en route to farm' },
  { key: 'PICKING UP', label: 'Picking Up', icon: PackageCheck, desc: 'Loading & verification' },
  { key: 'PICKED UP', label: 'Picked Up', icon: Boxes, desc: 'All farm stops loaded' },
  { key: 'OUT FOR DELIVERY', label: 'Out for Delivery', icon: Truck, desc: 'En route to buyer hub' },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, desc: 'Received & verified' }
];

export default function DeliveryTimeline({ currentStatus = 'AVAILABLE', onStatusChange = null, allowInteractive = false }) {
  const isCancelled = currentStatus === 'CANCELLED';

  const getCurrentIndex = (status) => {
    if (status === 'CANCELLED') return -1;
    const idx = FLOW_STEPS.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const currentIndex = getCurrentIndex(currentStatus);

  return (
    <div style={{ padding: '16px 0' }}>
      {isCancelled ? (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <XCircle size={24} color="#dc2626" />
            <div>
              <h4 style={{ color: '#991b1b', fontSize: '0.95rem' }}>Delivery Cancelled</h4>
              <p style={{ color: '#b91c1c', fontSize: '0.82rem' }}>Assignment was revoked and job returned to pool.</p>
            </div>
          </div>
          {allowInteractive && onStatusChange && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onStatusChange('AVAILABLE')}
            >
              Reopen as Available
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflowX: 'auto',
          padding: '10px 0'
        }}>
          {FLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isFuture = idx > currentIndex;

            return (
              <React.Fragment key={step.key}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '100px',
                    textAlign: 'center',
                    cursor: allowInteractive && onStatusChange ? 'pointer' : 'default',
                    opacity: isFuture ? 0.45 : 1,
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => {
                    if (allowInteractive && onStatusChange) {
                      onStatusChange(step.key);
                    }
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? '#16a34a' : isPassed ? '#dcfce7' : '#f1f5f9',
                      color: isCurrent ? '#ffffff' : isPassed ? '#15803d' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isCurrent ? '3px solid #bbf7d0' : isPassed ? '1px solid #86efac' : '1px solid #cbd5e1',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(22, 163, 74, 0.2)' : 'none',
                      marginBottom: '8px'
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: isCurrent ? '700' : '600',
                    color: isCurrent ? '#14532d' : isPassed ? '#0f172a' : '#94a3b8'
                  }}>
                    {step.label}
                  </span>
                </div>

                {idx < FLOW_STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: '3px',
                      backgroundColor: idx < currentIndex ? '#16a34a' : '#e2e8f0',
                      minWidth: '24px',
                      margin: '0 4px 24px',
                      transition: 'background-color 0.3s ease'
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
