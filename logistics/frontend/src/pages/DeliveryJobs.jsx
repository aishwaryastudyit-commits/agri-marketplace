import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Filter,
  Search,
  Sparkles,
  UserPlus,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  MapPin,
  Layers
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import DeliveryTimeline from '../components/DeliveryTimeline';
import { filterCompatibleWorkers } from '../utils/compatibility';

export default function DeliveryJobs() {
  const {
    jobs,
    workers,
    assignWorkerToJob,
    updateJobStatus,
    optimizeJobRoute,
    setActiveTab
  } = useLogistics();

  const [selectedJob, setSelectedJob] = useState(null);
  const [assigningJob, setAssigningJob] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filterStatus === 'ALL' || job.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || job.priority === filterPriority;
    const q = searchFilter.toLowerCase();
    const matchesSearch = !q ||
      job.jobId.toLowerCase().includes(q) ||
      job.orderId.toLowerCase().includes(q) ||
      job.product.toLowerCase().includes(q) ||
      (job.assignedWorker && job.assignedWorker.toLowerCase().includes(q)) ||
      job.pickupLocations.toLowerCase().includes(q) ||
      job.deliveryLocation.toLowerCase().includes(q);

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleOpenAssignModal = (job) => {
    setAssigningJob(job);
    const { compatible } = filterCompatibleWorkers(workers, job);
    if (compatible.length > 0) {
      setSelectedWorkerId(compatible[0].id);
    } else {
      setSelectedWorkerId('');
    }
  };

  const handleConfirmAssignment = () => {
    if (assigningJob && selectedWorkerId) {
      assignWorkerToJob(assigningJob.jobId, selectedWorkerId);
      setAssigningJob(null);
    }
  };

  const handleNextStatus = (job) => {
    const statusFlow = [
      'AVAILABLE',
      'ASSIGNED',
      'GOING TO PICKUP',
      'PICKING UP',
      'PICKED UP',
      'OUT FOR DELIVERY',
      'DELIVERED'
    ];
    const currentIndex = statusFlow.indexOf(job.status);
    if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1];
      updateJobStatus(job.jobId, nextStatus);
      if (selectedJob && selectedJob.jobId === job.jobId) {
        setSelectedJob(prev => ({ ...prev, status: nextStatus }));
      }
    }
  };

  const handleCancelJob = (job) => {
    updateJobStatus(job.jobId, 'CANCELLED');
    if (selectedJob && selectedJob.jobId === job.jobId) {
      setSelectedJob(prev => ({ ...prev, status: 'CANCELLED' }));
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Delivery Jobs Registry</h2>
          <p>End-to-end management of all active, assigned, and pending agricultural consignments</p>
        </div>

        <div className="page-header-actions">
          <Button
            variant="secondary"
            icon={Layers}
            onClick={() => setActiveTab('order-groups')}
          >
            Create Pooled Batch
          </Button>

          <Button
            variant="primary"
            icon={Sparkles}
            onClick={() => setActiveTab('routes')}
          >
            Optimize Corridors
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by Job ID, Order ID, Product, Farmer, or Destination..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748b' }}>Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '7px 12px', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Statuses ({jobs.length})</option>
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="GOING TO PICKUP">Going to Pickup</option>
              <option value="PICKING UP">Picking Up</option>
              <option value="PICKED UP">Picked Up</option>
              <option value="OUT FOR DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748b' }}>Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '7px 12px', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="NORMAL">Normal Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complete Jobs Grid / Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredJobs.map((job) => {
          const isAssigned = job.assignedWorker && job.assignedWorker !== 'Unassigned';
          const stopsCount = job.pickupStops ? job.pickupStops.length : 1;

          return (
            <div
              key={job.id || job.jobId}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '22px 24px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Job Header Line */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="job-code" style={{ fontSize: '1rem', padding: '4px 10px' }}>
                    {job.jobId}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Order ID: <strong>{job.orderId}</strong>
                  </span>
                  {job.isGroupJob && (
                    <span style={{ fontSize: '0.72rem', color: '#047857', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '9999px', fontWeight: '700' }}>
                      Pooled Delivery Group
                    </span>
                  )}
                  {job.priority === 'HIGH' && (
                    <span style={{ fontSize: '0.72rem', color: '#b91c1c', background: '#fee2e2', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '9999px', fontWeight: '700' }}>
                      High Priority
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusBadge status={job.status} />
                </div>
              </div>

              {/* Specifications Matrix */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '14px',
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #f1f5f9'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Commodity Product</span>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.98rem' }}>{job.product}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Consignment Quantity</span>
                  <div style={{ fontWeight: '800', color: '#15803d', fontSize: '1.05rem' }}>{job.quantity} KG</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Required Vehicle Capacity</span>
                  <div style={{ fontWeight: '700', color: '#334155', fontSize: '0.95rem' }}>{job.requiredVehicleCapacity || job.quantity} KG min</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Assigned Fleet Worker</span>
                  <div style={{ fontWeight: '700', color: isAssigned ? '#0f172a' : '#94a3b8', fontSize: '0.95rem' }}>
                    {isAssigned ? `${job.assignedWorker} (${job.vehicleNumber})` : 'Unassigned'}
                  </div>
                </div>
              </div>

              {/* Locations Corridor Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                  <MapPin size={16} color="#15803d" />
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>Pickup: {job.pickupLocations}</span>
                  {stopsCount > 1 && (
                    <span style={{ fontSize: '0.75rem', color: '#047857', background: '#dcfce7', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                      {stopsCount} Farm Stops
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                  <ArrowRight size={16} color="#94a3b8" />
                  <span style={{ fontWeight: '600', color: '#7c3aed' }}>Destination: {job.deliveryLocation}</span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Eye}
                    onClick={() => setSelectedJob(job)}
                  >
                    View Details
                  </Button>

                  {job.status === 'AVAILABLE' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={UserPlus}
                      onClick={() => handleOpenAssignModal(job)}
                    >
                      Assign Worker
                    </Button>
                  )}

                  {job.pickupStops && job.pickupStops.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Sparkles}
                      onClick={() => {
                        optimizeJobRoute(job.jobId);
                        setActiveTab('routes');
                      }}
                    >
                      Optimize Route
                    </Button>
                  )}
                </div>

                {/* Quick status stepper button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {job.status !== 'DELIVERED' && job.status !== 'CANCELLED' && job.status !== 'AVAILABLE' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleNextStatus(job)}
                    >
                      Advance Status &rarr;
                    </Button>
                  )}

                  {job.status === 'ASSIGNED' && (
                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      onClick={() => handleCancelJob(job)}
                    >
                      Cancel Assignment
                    </Button>
                  )}

                  {job.status === 'CANCELLED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateJobStatus(job.jobId, 'AVAILABLE')}
                    >
                      Re-open as Available
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredJobs.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <Truck size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ color: '#334155' }}>No Delivery Jobs Match Current Filter</h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Try adjusting your search criteria or resetting filters.</p>
          </div>
        )}
      </div>

      {/* Modal: Job Details with Full Interactive Status Stepper */}
      {selectedJob && (
        <Modal
          isOpen={Boolean(selectedJob)}
          onClose={() => setSelectedJob(null)}
          title={`Delivery Job: ${selectedJob.jobId}`}
          subtitle={`Product: ${selectedJob.product} (${selectedJob.quantity} KG)`}
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              {selectedJob.status === 'AVAILABLE' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleOpenAssignModal(selectedJob);
                    setSelectedJob(null);
                  }}
                >
                  Assign Worker
                </Button>
              )}
              <Button variant="secondary" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Delivery Workflow Status Transition:
              </h4>
              <DeliveryTimeline
                currentStatus={selectedJob.status}
                allowInteractive={true}
                onStatusChange={(newStatus) => {
                  updateJobStatus(selectedJob.jobId, newStatus);
                  setSelectedJob(prev => ({ ...prev, status: newStatus }));
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Farm Pickups</span>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem', marginTop: '3px' }}>{selectedJob.pickupLocations}</div>
              </div>

              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Wholesale Destination</span>
                <div style={{ fontWeight: '700', color: '#7c3aed', fontSize: '0.95rem', marginTop: '3px' }}>{selectedJob.deliveryLocation}</div>
              </div>
            </div>

            {selectedJob.pickupStops && (
              <div>
                <h4 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Stops Itinerary ({selectedJob.pickupStops.length} Stops)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedJob.pickupStops.map((stop, idx) => (
                    <div key={stop.id || idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <strong>Stop {idx + 1}: {stop.farmerName}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{stop.location} • {stop.expectedQuantity} KG {stop.product}</div>
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: stop.status === 'Completed' ? '#047857' : '#d97706' }}>
                        {stop.status || 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal: Assign Worker */}
      {assigningJob && (
        <Modal
          isOpen={Boolean(assigningJob)}
          onClose={() => setAssigningJob(null)}
          title={`Assign Worker to ${assigningJob.jobId}`}
          subtitle={`Consignment: ${assigningJob.product} (${assigningJob.quantity} KG)`}
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setAssigningJob(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmAssignment}
                disabled={!selectedWorkerId}
              >
                Confirm Assignment
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                <strong>Vehicle Capacity Rule:</strong> Only drivers with vehicle capacity &ge; {assigningJob.quantity} KG are eligible.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {workers.map(w => {
                const comp = filterCompatibleWorkers([w], assigningJob);
                const isCompatible = comp.compatible.length > 0;
                const isSelected = selectedWorkerId === w.id;

                return (
                  <div
                    key={w.id}
                    onClick={() => isCompatible && w.availability === 'Available' && setSelectedWorkerId(w.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? '#15803d' : isCompatible ? '#e2e8f0' : '#fee2e2'}`,
                      backgroundColor: isSelected ? '#f0fdf4' : !isCompatible ? '#fef2f2' : '#ffffff',
                      opacity: !isCompatible || w.availability !== 'Available' ? 0.6 : 1,
                      cursor: isCompatible && w.availability === 'Available' ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => {}}
                        disabled={!isCompatible || w.availability !== 'Available'}
                      />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0f172a' }}>{w.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{w.vehicleType} • {w.vehicleNumber}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', color: isCompatible ? '#15803d' : '#b91c1c', fontSize: '0.9rem' }}>
                        {w.vehicleCapacity} KG
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: isCompatible ? '#047857' : '#b91c1c' }}>
                        {isCompatible ? 'Compatible ✓' : `✕ Short by ${assigningJob.quantity - w.vehicleCapacity} KG`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
