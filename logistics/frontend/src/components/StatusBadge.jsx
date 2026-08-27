import React from 'react';

/**
 * StatusBadge Component
 * Renders color-coded status badge for all 7 delivery states and special statuses
 */
export default function StatusBadge({ status, size = 'md' }) {
  const normalized = (status || 'AVAILABLE').toUpperCase().replace(/\s+/g, ' ');
  const cssClass = normalized.replace(/\s+/g, '_');

  const getStatusLabel = (st) => {
    switch (st) {
      case 'GOING TO PICKUP':
        return 'Going to Pickup';
      case 'PICKING UP':
        return 'Picking Up';
      case 'PICKED UP':
        return 'Picked Up';
      case 'OUT FOR DELIVERY':
        return 'Out for Delivery';
      case 'AVAILABLE':
        return 'Available';
      case 'ASSIGNED':
        return 'Assigned';
      case 'DELIVERED':
        return 'Delivered';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return st;
    }
  };

  const isSmall = size === 'sm';

  return (
    <span
      className={`status-badge ${cssClass}`}
      style={{
        padding: isSmall ? '3px 8px' : '5px 12px',
        fontSize: isSmall ? '0.72rem' : '0.76rem'
      }}
    >
      <span className="status-dot" />
      {getStatusLabel(normalized)}
    </span>
  );
}
