import React, { useState } from 'react';
import {
  PackageCheck,
  MapPin,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import PickupCard from '../components/PickupCard';
import Button from '../components/Button';
import Modal from '../components/Modal';

export default function Pickups() {
  const {
    jobs,
    updatePickupStop,
    setActiveTab,
    optimizeJobRoute
  } = useLogistics();

  // Multi-Stop jobs
  const [selectedJobId, setSelectedJobId] = useState('JOB-1027');
  const [shortageReportModalStop, setShortageReportModalStop] = useState(null);
  const [shortageReason, setShortageReason] = useState('');

  // Active selected job
  const activeJob = jobs.find(j => j.jobId === selectedJobId) || jobs[0];

  const handleManualShortageSubmit = () => {
    if (shortageReportModalStop && activeJob) {
      updatePickupStop(activeJob.jobId, shortageReportModalStop.id, {
        actualQuantity: shortageReportModalStop.actualQuantity || (shortageReportModalStop.expectedQuantity - 20),
        status: 'In Progress',
        notes: shortageReason || 'Manual shortage reported during farm-gate verification'
      });
      setShortageReportModalStop(null);
      setShortageReason('');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Farm-Gate Pickup Management</h2>
          <p>Sequential multi-farmer collection tracking, loading verification, and automated shortage logging</p>
        </div>

        <div className="page-header-actions">
          <Button
            variant="outline"
            icon={Sparkles}
            onClick={() => {
              if (activeJob) {
                optimizeJobRoute(activeJob.jobId);
                setActiveTab('routes');
              }
            }}
          >
            Optimize Stops Sequence
          </Button>

          <Button
            variant="primary"
            icon={Truck}
            onClick={() => setActiveTab('delivery-jobs')}
          >
            All Consignments
          </Button>
        </div>
      </div>

      {/* Consignment Selector Bar */}
      <div style={{
        background: '#ffffff',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>
            Select Active Consignment:
          </span>

          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '280px', fontWeight: '600' }}
          >
            {jobs.map(job => (
              <option key={job.jobId} value={job.jobId}>
                {job.jobId} • {job.product} ({job.quantity} KG) - {job.pickupStops?.length || 1} Stop(s)
              </option>
            ))}
          </select>
        </div>

        {activeJob && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Driver: <strong>{activeJob.assignedWorker || 'Unassigned'}</strong> ({activeJob.vehicleNumber || 'N/A'})
            </span>
            <span style={{
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #bbf7d0',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: '700'
            }}>
              {activeJob.status}
            </span>
          </div>
        )}
      </div>

      {/* Multi-Farmer Pickup Sequence Container */}
      {activeJob && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary Overview Card */}
          <div style={{
            background: 'linear-gradient(135deg, #092c1d 0%, #12432d 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: '700' }}>
                Multi-Farmer Consignment
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '2px' }}>
                {activeJob.jobId}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#d1fae5', marginTop: '4px' }}>
                {activeJob.product}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: '700' }}>
                Total Expected Payload
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399', marginTop: '2px' }}>
                {activeJob.pickupStops
                  ? activeJob.pickupStops.reduce((sum, s) => sum + Number(s.expectedQuantity || 0), 0)
                  : activeJob.quantity} KG
              </div>
              <div style={{ fontSize: '0.85rem', color: '#d1fae5', marginTop: '4px' }}>
                Across {activeJob.pickupStops?.length || 1} farm stop(s)
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: '700' }}>
                Actual Verified Loaded
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
                {activeJob.pickupStops
                  ? activeJob.pickupStops.reduce((sum, s) => sum + (s.actualQuantity !== null ? Number(s.actualQuantity) : 0), 0)
                  : 0} KG
              </div>
              <div style={{ fontSize: '0.85rem', color: '#d1fae5', marginTop: '4px' }}>
                Farm-gate weighed
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: '700' }}>
                Final Drop Destination
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginTop: '2px' }}>
                {activeJob.deliveryLocation}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#a7f3d0', marginTop: '4px' }}>
                Wholesale Hub
              </div>
            </div>
          </div>

          {/* Sequential Stops List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                Sequential Pickup Stops ({activeJob.pickupStops?.length || 1} Farm Gates)
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Follow itinerary order: Driver arrives &rarr; weighs &rarr; verifies &rarr; reports discrepancy
              </span>
            </div>

            {activeJob.pickupStops && activeJob.pickupStops.length > 0 ? (
              activeJob.pickupStops.map((stop, index) => (
                <PickupCard
                  key={stop.id || index}
                  stop={stop}
                  stopIndex={index + 1}
                  totalStops={activeJob.pickupStops.length}
                  jobId={activeJob.jobId}
                  onUpdateStop={updatePickupStop}
                  onReportShortage={(st) => setShortageReportModalStop(st)}
                />
              ))
            ) : (
              <div style={{ padding: '36px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <p>No pickup stops registered for this consignment.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Report Farm Shortage */}
      {shortageReportModalStop && (
        <Modal
          isOpen={Boolean(shortageReportModalStop)}
          onClose={() => setShortageReportModalStop(null)}
          title={`Report Farm Shortage for ${shortageReportModalStop.farmerName}`}
          subtitle={`Location: ${shortageReportModalStop.location} • Expected: ${shortageReportModalStop.expectedQuantity} KG`}
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setShortageReportModalStop(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleManualShortageSubmit}>
                Confirm Shortage Log
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="shortage-alert-box danger">
              <AlertTriangle size={20} />
              <div>
                <strong>Shortage Discrepancy Protocol</strong>
                <p style={{ fontSize: '0.82rem', marginTop: '2px' }}>
                  The logistics system logs the farm-gate weight variance into Member 5 Shortage registry for buyer reconciliation.
                </p>
              </div>
            </div>

            <div className="form-group">
              <label>Reason / Observation at Farm Gate</label>
              <textarea
                rows={3}
                className="form-control"
                placeholder="e.g. 20 KG discarded due to rain damage / sorting at farm gate..."
                value={shortageReason}
                onChange={(e) => setShortageReason(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
