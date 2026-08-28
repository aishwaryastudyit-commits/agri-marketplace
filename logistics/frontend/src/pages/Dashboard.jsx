import React, { useState } from 'react';
import {
  Truck,
  Package,
  Clock,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Users,
  Navigation,
  Activity,
  Layers
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import StatCard from '../components/StatCard';
import DeliveryTable from '../components/DeliveryTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import Button from '../components/Button';
import DeliveryTimeline from '../components/DeliveryTimeline';
import { filterCompatibleWorkers } from '../utils/compatibility';

export default function Dashboard() {
  const {
    jobs,
    workers,
    stats,
    setActiveTab,
    assignWorkerToJob,
    updateJobStatus,
    optimizeJobRoute
  } = useLogistics();

  const [selectedJob, setSelectedJob] = useState(null);
  const [assigningJob, setAssigningJob] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Status counts for overview flow
  const statusCounts = {
    AVAILABLE: jobs.filter(j => j.status === 'AVAILABLE').length,
    ASSIGNED: jobs.filter(j => j.status === 'ASSIGNED').length,
    'GOING TO PICKUP': jobs.filter(j => j.status === 'GOING TO PICKUP').length,
    'PICKING UP': jobs.filter(j => j.status === 'PICKING UP').length,
    'PICKED UP': jobs.filter(j => j.status === 'PICKED UP').length,
    'OUT FOR DELIVERY': jobs.filter(j => j.status === 'OUT FOR DELIVERY').length,
    DELIVERED: jobs.filter(j => j.status === 'DELIVERED').length
  };

  const statusNodes = [
    { key: 'AVAILABLE', label: 'Available', color: '#1d4ed8', bg: '#eff6ff' },
    { key: 'ASSIGNED', label: 'Assigned', color: '#a16207', bg: '#fefce8' },
    { key: 'GOING TO PICKUP', label: 'Going to Pickup', color: '#7e22ce', bg: '#faf5ff' },
    { key: 'PICKING UP', label: 'Picking Up', color: '#c2410c', bg: '#fff7ed' },
    { key: 'PICKED UP', label: 'Picked Up', color: '#0f766e', bg: '#f0fdfa' },
    { key: 'OUT FOR DELIVERY', label: 'Out for Delivery', color: '#0369a1', bg: '#f0f9ff' },
    { key: 'DELIVERED', label: 'Delivered', color: '#047857', bg: '#ecfdf5' }
  ];

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

  // Filtered jobs for table
  const filteredJobs = statusFilter === 'ALL'
    ? jobs
    : jobs.filter(j => j.status === statusFilter);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Logistics Operations Command</h2>
          <p>Real-time agricultural dispatch, multi-farmer pickup routing & vehicle compatibility monitoring</p>
        </div>

        <div className="page-header-actions">
          <Button
            variant="secondary"
            icon={Layers}
            onClick={() => setActiveTab('order-groups')}
          >
            Order Pooling
          </Button>

          <Button
            variant="primary"
            icon={Truck}
            onClick={() => setActiveTab('delivery-jobs')}
          >
            Manage All Jobs ({jobs.length})
          </Button>
        </div>
      </div>

      {/* 4 Required Top Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Active Deliveries"
          value={stats.activeDeliveries || 12}
          subtitle="Vehicles en-route"
          icon={Truck}
          iconBg="rgba(16, 185, 129, 0.12)"
          iconColor="#15803d"
          trend="+12% this week"
          trendType="up"
          onClick={() => setActiveTab('delivery-jobs')}
        />

        <StatCard
          title="Available Jobs"
          value={stats.availableJobs || 8}
          subtitle="Ready for worker dispatch"
          icon={Package}
          iconBg="rgba(59, 130, 246, 0.12)"
          iconColor="#2563eb"
          trend="8 awaiting driver"
          trendType="neutral"
          onClick={() => {
            setStatusFilter('AVAILABLE');
            setActiveTab('delivery-jobs');
          }}
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress || 5}
          subtitle="Pickups & Farm Loading"
          icon={Clock}
          iconBg="rgba(245, 158, 11, 0.12)"
          iconColor="#d97706"
          trend="Active farm gates"
          trendType="neutral"
          onClick={() => setActiveTab('pickups')}
        />

        <StatCard
          title="Delivered Today"
          value={stats.deliveredToday || 24}
          subtitle="Successful wholesale drops"
          icon={CheckCircle2}
          iconBg="rgba(4, 120, 87, 0.12)"
          iconColor="#047857"
          trend="+18% vs yesterday"
          trendType="up"
          onClick={() => setActiveTab('reports')}
        />
      </div>

      {/* DELIVERY OVERVIEW: Status Statistics Flow */}
      <div className="status-overview-card">
        <div className="status-overview-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
              Delivery Status Lifecycle Overview
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '2px' }}>
              Live distribution of Member 5 consignments across the 7 stages of agricultural logistics
            </p>
          </div>

          {statusFilter !== 'ALL' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setStatusFilter('ALL')}
            >
              Reset Filter (Showing {statusFilter})
            </button>
          )}
        </div>

        <div className="status-flow-container">
          {statusNodes.map((node, index) => {
            const count = statusCounts[node.key] || 0;
            const isSelected = statusFilter === node.key;

            return (
              <React.Fragment key={node.key}>
                <div
                  className={`status-node ${isSelected ? 'active-filter' : ''}`}
                  onClick={() => setStatusFilter(isSelected ? 'ALL' : node.key)}
                  title={`Filter table by ${node.label}`}
                >
                  <div className="status-node-count" style={{ color: node.color }}>
                    {count}
                  </div>
                  <div className="status-node-label">{node.label}</div>
                  <div
                    className="status-node-indicator"
                    style={{ backgroundColor: node.color }}
                  />
                </div>

                {index < statusNodes.length - 1 && (
                  <span className="status-arrow-sep">↓</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* RECENT DELIVERY JOBS TABLE */}
      <div className="section-card">
        <div className="section-header">
          <div>
            <div className="section-title">
              <Activity size={20} color="#15803d" />
              <span>Recent Delivery Jobs</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '3px' }}>
              Monitoring active consignments, commodity quantities, farm pickup locations and driver statuses
            </p>
          </div>

          <div className="section-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('delivery-jobs')}
            >
              View Full Table
            </Button>
          </div>
        </div>

        <DeliveryTable
          jobs={filteredJobs}
          limit={6}
          onViewJob={(job) => setSelectedJob(job)}
          onAssignWorker={(job) => handleOpenAssignModal(job)}
          onOptimizeRoute={(jobId) => {
            optimizeJobRoute(jobId);
            setActiveTab('routes');
          }}
        />
      </div>

      {/* Quick Access Operational Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Worker fleet availability snapshot */}
        <div className="section-card">
          <div className="section-header" style={{ marginBottom: '14px' }}>
            <div className="section-title" style={{ fontSize: '1.05rem' }}>
              <Users size={18} color="#15803d" />
              <span>Fleet Availability ({workers.filter(w => w.availability === 'Available').length}/{workers.length} Ready)</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('workers')}>
              View Fleet
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {workers.slice(0, 4).map(w => (
              <div
                key={w.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#15803d', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem' }}>
                    {w.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#0f172a' }}>{w.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{w.vehicleType} • {w.vehicleNumber}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#15803d' }}>{w.vehicleCapacity} KG</div>
                  <span style={{ fontSize: '0.72rem', color: w.availability === 'Available' ? '#047857' : '#92400e', fontWeight: '600' }}>
                    {w.availability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shortages summary snippet */}
        <div className="section-card">
          <div className="section-header" style={{ marginBottom: '14px' }}>
            <div className="section-title" style={{ fontSize: '1.05rem' }}>
              <AlertOctagon size={18} color="#ef4444" />
              <span>Farm Shortage Registry</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('shortages')}>
              View All ({stats.totalShortages})
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="shortage-alert-box" style={{ padding: '12px' }}>
              <div>
                <strong>Automated Shortage Detection Active</strong>
                <p style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                  When drivers enter actual pickup weights less than expected, shortages are logged instantly.
                </p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Recent Logged Shortage:</span>
                <span style={{ fontWeight: '700', color: '#dc2626' }}>-20 KG (Farmer Ramasamy)</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                Job: JOB-1024 • Tomatoes • Coimbatore
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: View Job Details */}
      {selectedJob && (
        <Modal
          isOpen={Boolean(selectedJob)}
          onClose={() => setSelectedJob(null)}
          title={`Consignment Details: ${selectedJob.jobId}`}
          subtitle={`Order Reference: ${selectedJob.orderId}`}
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
            {/* Status Timeline */}
            <div>
              <h4 style={{ fontSize: '0.88rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Live Delivery Progress
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

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Product</span>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>{selectedJob.product}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Required Weight</span>
                <div style={{ fontWeight: '800', color: '#15803d', fontSize: '1rem' }}>{selectedJob.quantity} KG</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Vehicle Need</span>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>{selectedJob.requiredVehicleCapacity || selectedJob.quantity} KG min</div>
              </div>
            </div>

            {/* Assigned Driver & Route Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Assigned Fleet Worker</h5>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>{selectedJob.assignedWorker || 'Unassigned'}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedJob.vehicleType} • {selectedJob.vehicleNumber}</div>
                {selectedJob.workerPhone && <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '2px' }}>{selectedJob.workerPhone}</div>}
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Destination Hub</h5>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#7c3aed' }}>{selectedJob.deliveryLocation}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Estimated Distance: {selectedJob.distanceKm || 450} KM</div>
              </div>
            </div>

            {/* Pickup Stops */}
            {selectedJob.pickupStops && (
              <div>
                <h4 style={{ fontSize: '0.88rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Pickup Farm Stops ({selectedJob.pickupStops.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedJob.pickupStops.map((stop, i) => (
                    <div key={stop.id || i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                      <div>
                        <strong>Stop #{i + 1}: {stop.farmerName}</strong>
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

      {/* MODAL: Assign Worker with Live Compatibility Filtering */}
      {assigningJob && (
        <Modal
          isOpen={Boolean(assigningJob)}
          onClose={() => setAssigningJob(null)}
          title={`Assign Worker to ${assigningJob.jobId}`}
          subtitle={`Consignment: ${assigningJob.product} (${assigningJob.quantity} KG required)`}
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
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                <strong>Compatibility Rule:</strong> Vehicle Capacity &ge; Required Delivery Quantity ({assigningJob.quantity} KG).
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '600' }}>Select Fleet Worker:</label>

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
                      cursor: isCompatible && w.availability === 'Available' ? 'pointer' : 'not-allowed',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => {}}
                        disabled={!isCompatible || w.availability !== 'Available'}
                      />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0f172a' }}>
                          {w.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {w.vehicleType} ({w.vehicleNumber}) • Base: {w.baseHub}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', fontSize: '0.9rem', color: isCompatible ? '#15803d' : '#b91c1c' }}>
                        {w.vehicleCapacity} KG Capacity
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        color: isCompatible ? '#047857' : '#b91c1c'
                      }}>
                        {isCompatible ? 'Compatible ✓' : `Not Compatible ✕ (Short by ${assigningJob.quantity - w.vehicleCapacity} KG)`}
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
