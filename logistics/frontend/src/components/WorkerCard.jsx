import React from 'react';
import {
  Truck,
  Phone,
  Mail,
  Shield,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Navigation,
  Weight
} from 'lucide-react';
import Button from './Button';
import { checkWorkerCompatibility } from '../utils/compatibility';

export default function WorkerCard({
  worker,
  selectedForJob = null, // if passed, shows live compatibility evaluation
  onAssign = null,
  onViewDetails = null
}) {
  const compatibility = selectedForJob ? checkWorkerCompatibility(worker, selectedForJob) : null;
  const isAvailable = worker.availability === 'Available';
  const isEligible = !selectedForJob || (compatibility && compatibility.isCompatible);

  const getVehicleIcon = (type) => {
    return <Truck size={20} color="#15803d" />;
  };

  return (
    <div className="worker-card" style={{ opacity: selectedForJob && !isEligible ? 0.65 : 1 }}>
      {/* Header */}
      <div className="worker-card-header">
        <div className="worker-avatar-large">
          {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
              {worker.name}
            </h3>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '9999px',
              background: isAvailable ? '#ecfdf5' : '#fef3c7',
              color: isAvailable ? '#047857' : '#92400e',
              border: `1px solid ${isAvailable ? '#a7f3d0' : '#fde68a'}`
            }}>
              {worker.availability}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.82rem', marginTop: '2px' }}>
            <Phone size={13} />
            <span>{worker.phone}</span>
          </div>
        </div>
      </div>

      {/* Vehicle Specs Grid */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '14px',
        border: '1px solid #f1f5f9',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        fontSize: '0.85rem'
      }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Vehicle Type</span>
          <div style={{ fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            {getVehicleIcon(worker.vehicleType)}
            <span>{worker.vehicleType}</span>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Registration No.</span>
          <div style={{ fontWeight: '700', color: '#0f172a', fontFamily: 'monospace', marginTop: '2px' }}>
            {worker.vehicleNumber}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Payload Capacity</span>
          <div style={{ fontWeight: '800', color: '#15803d', fontSize: '0.95rem', marginTop: '2px' }}>
            {worker.vehicleCapacity} KG
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Completed Trips</span>
          <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
            {worker.completedTrips || 0} Runs
          </div>
        </div>
      </div>

      {/* Compatibility Badge if evaluated in Assign Mode */}
      {selectedForJob && compatibility && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '10px',
          backgroundColor: compatibility.isCompatible ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${compatibility.isCompatible ? '#a7f3d0' : '#fecaca'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {compatibility.isCompatible ? (
              <CheckCircle2 size={18} color="#059669" />
            ) : (
              <XCircle size={18} color="#dc2626" />
            )}
            <div>
              <div style={{
                fontWeight: '700',
                fontSize: '0.82rem',
                color: compatibility.isCompatible ? '#047857' : '#991b1b'
              }}>
                {compatibility.badgeText}
              </div>
              <div style={{ fontSize: '0.72rem', color: compatibility.isCompatible ? '#065f46' : '#b91c1c' }}>
                Required: {compatibility.requiredQuantity} KG • Vehicle: {compatibility.workerCapacity} KG
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info / Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
          Base: <strong>{worker.baseHub || 'Hub Depot'}</strong>
        </div>

        {onAssign && (
          <Button
            variant={isEligible && isAvailable ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onAssign(worker.id)}
            disabled={!isEligible || !isAvailable}
          >
            {!isAvailable ? 'Worker Busy' : !isEligible ? 'Incompatible' : 'Assign to Job'}
          </Button>
        )}

        {onViewDetails && !onAssign && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(worker)}
          >
            View Details
          </Button>
        )}
      </div>
    </div>
  );
}
