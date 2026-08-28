import React from 'react';
import {
  Eye,
  UserPlus,
  Sparkles,
  MapPin,
  Truck,
  ArrowRight,
  MoreVertical
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import Button from './Button';

export default function DeliveryTable({
  jobs = [],
  onViewJob = null,
  onAssignWorker = null,
  onOptimizeRoute = null,
  onStatusChange = null,
  limit = null
}) {
  const displayJobs = limit ? jobs.slice(0, limit) : jobs;

  if (displayJobs.length === 0) {
    return (
      <div style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
        <p style={{ fontSize: '0.95rem' }}>No delivery jobs found matching criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Order ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Pickup Locations</th>
            <th>Destination</th>
            <th>Assigned Worker</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayJobs.map((job) => {
            const hasAssignedWorker = job.assignedWorker && job.assignedWorker !== 'Unassigned';

            return (
              <tr key={job.id || job.jobId}>
                <td>
                  <span className="job-code">{job.jobId}</span>
                </td>
                <td>
                  <span className="order-code">{job.orderId}</span>
                </td>
                <td>
                  <div className="product-cell">{job.product}</div>
                  {job.isGroupJob && (
                    <span style={{ fontSize: '0.7rem', color: '#047857', background: '#dcfce7', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                      Pooled Group
                    </span>
                  )}
                </td>
                <td>
                  <span className="quantity-badge">{job.quantity} KG</span>
                </td>
                <td>
                  <div className="location-cell">
                    <MapPin size={14} color="#15803d" />
                    <span>{job.pickupLocations}</span>
                  </div>
                  {job.pickupStops && job.pickupStops.length > 1 && (
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      ({job.pickupStops.length} Farm Stops)
                    </span>
                  )}
                </td>
                <td>
                  <div className="location-cell">
                    <MapPin size={14} color="#7c3aed" />
                    <span>{job.deliveryLocation}</span>
                  </div>
                </td>
                <td>
                  {hasAssignedWorker ? (
                    <div>
                      <div style={{ fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Truck size={14} color="#15803d" />
                        {job.assignedWorker}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {job.vehicleNumber}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>
                      Unassigned
                    </span>
                  )}
                </td>
                <td>
                  <StatusBadge status={job.status} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {onViewJob && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => onViewJob(job)}
                        title="View Details"
                      >
                        View
                      </Button>
                    )}

                    {onAssignWorker && job.status === 'AVAILABLE' && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={UserPlus}
                        onClick={() => onAssignWorker(job)}
                        title="Assign Compatible Worker"
                      >
                        Assign
                      </Button>
                    )}

                    {onOptimizeRoute && job.pickupStops && job.pickupStops.length > 1 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Sparkles}
                        onClick={() => onOptimizeRoute(job.jobId || job.id)}
                        title="Optimize Route"
                        style={{ color: '#047857' }}
                      >
                        Route
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
