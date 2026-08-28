import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { evaluateOrderGroup } from '../utils/orderGrouper';

export default function OrderGroups() {
  const {
    poolOrders,
    workers,
    createOrderGroupBatch,
    setActiveTab,
    jobs
  } = useLogistics();

  const [selectedOrderIds, setSelectedOrderIds] = useState(['ORD-201', 'ORD-202', 'ORD-203']);
  const [selectedWorkerId, setSelectedWorkerId] = useState('WRK-103'); // Suresh Raina with 500 KG capacity
  const [groupName, setGroupName] = useState('Coimbatore-Chennai Tomato Fast-Track');
  const [priority, setPriority] = useState('HIGH');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdGroupJob, setCreatedGroupJob] = useState(null);

  const selectedOrders = poolOrders.filter(o => selectedOrderIds.includes(o.id || o.orderId));
  const selectedWorker = workers.find(w => w.id === selectedWorkerId);
  const vehicleCapacity = selectedWorker ? selectedWorker.vehicleCapacity : 500;

  // Real-time evaluation
  const evaluation = evaluateOrderGroup(selectedOrders, vehicleCapacity);

  const handleToggleOrder = (orderId) => {
    setSelectedOrderIds(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleCreateGroup = () => {
    if (selectedOrders.length === 0) {
      alert('Please select at least one order to group.');
      return;
    }
    if (!evaluation.isCompatible) {
      alert(`Cannot create group: Total quantity (${evaluation.totalQuantityKg} KG) exceeds vehicle capacity (${vehicleCapacity} KG).`);
      return;
    }

    const res = createOrderGroupBatch({
      groupName,
      orderIds: selectedOrderIds,
      assignedWorkerId: selectedWorkerId,
      priority
    });

    if (res.success) {
      setCreatedGroupJob(res.job);
      setIsSuccessModalOpen(true);
      setSelectedOrderIds([]);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Order Grouping & Supply Pooling</h2>
          <p>Consolidate smallholder farm consignments along shared corridors into optimized full-vehicle runs</p>
        </div>

        <div className="page-header-actions">
          <Button
            variant="outline"
            icon={Truck}
            onClick={() => setActiveTab('delivery-jobs')}
          >
            Active Consignments
          </Button>
        </div>
      </div>

      {/* Interactive Group Builder Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        {/* Left Column: Pool Orders Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="section-card">
            <div className="section-header" style={{ marginBottom: '14px' }}>
              <div>
                <h3 className="section-title">
                  <PackageCheck size={20} color="#15803d" />
                  <span>Available Individual Orders for Grouping ({poolOrders.length})</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Select multiple farm orders to combine payloads and check vehicle fit
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedOrderIds(poolOrders.map(o => o.id || o.orderId))}
                >
                  Select All
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedOrderIds([])}
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {poolOrders.map(order => {
                const isSelected = selectedOrderIds.includes(order.id || order.orderId);

                return (
                  <div
                    key={order.id || order.orderId}
                    onClick={() => handleToggleOrder(order.id || order.orderId)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? '#15803d' : '#e2e8f0'}`,
                      backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{ width: '18px', height: '18px', accentColor: '#15803d' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.92rem' }}>
                            {order.orderId}
                          </span>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#15803d' }}>
                            {order.product}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            ({order.farmer})
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                          <span>📍 Pickup: {order.pickupLocation}</span>
                          <span>&rarr;</span>
                          <span>🏢 Drop: {order.destination}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.05rem' }}>
                        {order.quantity} KG
                      </div>
                      <span style={{ fontSize: '0.72rem', color: isSelected ? '#15803d' : '#64748b', fontWeight: '700' }}>
                        {isSelected ? '✓ Selected' : '+ Click to add'}
                      </span>
                    </div>
                  </div>
                );
              })}

              {poolOrders.length === 0 && (
                <div style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                  <p>All pool orders have been grouped into active delivery jobs!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Group Real-Time Evaluation & Dispatch Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="section-card" style={{ border: `2px solid ${evaluation.isCompatible ? '#86efac' : '#fecaca'}` }}>
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <div className="section-title">
                <Sparkles size={20} color="#15803d" />
                <span>Group Evaluation</span>
              </div>

              <span className={`compatibility-badge ${evaluation.isCompatible ? 'compatible' : 'incompatible'}`}>
                {evaluation.badgeText}
              </span>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Group Batch Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="form-control"
                  placeholder="e.g. Coimbatore Tomato Fast-Track"
                />
              </div>

              <div className="form-group">
                <label>Select Assigned Vehicle & Driver</label>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="form-control"
                >
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} • {w.vehicleType} ({w.vehicleCapacity} KG Capacity) - {w.availability}
                    </option>
                  ))}
                </select>
              </div>

              {/* Real-time Calculation Matrix */}
              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: '#64748b' }}>Selected Orders:</span>
                  <strong>{selectedOrders.length} Orders</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: '#64748b' }}>Total Consignment Load:</span>
                  <strong style={{ color: '#0f172a', fontSize: '1rem' }}>{evaluation.totalQuantityKg} KG</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: '#64748b' }}>Selected Vehicle Payload:</span>
                  <strong style={{ color: '#15803d', fontSize: '1rem' }}>{vehicleCapacity} KG</strong>
                </div>

                {/* Progress Bar of Capacity */}
                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                    <span>Payload Utilization</span>
                    <span>{evaluation.utilizationPercentage}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, evaluation.utilizationPercentage)}%`,
                        height: '100%',
                        backgroundColor: evaluation.isCompatible ? '#16a34a' : '#ef4444',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: evaluation.isCompatible ? '#ecfdf5' : '#fef2f2',
                  color: evaluation.isCompatible ? '#047857' : '#991b1b',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  marginTop: '4px'
                }}>
                  {evaluation.summaryText}
                </div>
              </div>

              {/* Grouping Rule Checklist */}
              <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#15803d" />
                  <span>Destination Corridor: {evaluation.destinations.join(', ') || 'Auto-matched'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#15803d" />
                  <span>Pickup Stops: {evaluation.pickupLocations.join(', ') || 'Auto-clustered'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#15803d" />
                  <span>Product Compatibility: {evaluation.products.join(', ') || 'Verified'}</span>
                </div>
              </div>

              {/* Create Delivery Group Action */}
              <Button
                variant="primary"
                size="lg"
                icon={Layers}
                onClick={handleCreateGroup}
                disabled={!evaluation.isCompatible || selectedOrders.length === 0}
                style={{ width: '100%', marginTop: '6px' }}
              >
                Create Delivery Group Consignment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Success Confirmation */}
      {isSuccessModalOpen && createdGroupJob && (
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title="Delivery Group Created Successfully!"
          subtitle={`Consignment ID: ${createdGroupJob.jobId}`}
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setIsSuccessModalOpen(false)}>
                Dismiss
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setActiveTab('delivery-jobs');
                }}
              >
                View in Delivery Jobs &rarr;
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={28} color="#059669" />
              <div>
                <strong style={{ color: '#065f46' }}>Pooled Consignment Dispatched to Fleet!</strong>
                <p style={{ color: '#047857', fontSize: '0.84rem', marginTop: '2px' }}>
                  {createdGroupJob.groupName} ({createdGroupJob.quantity} KG) has been scheduled with {createdGroupJob.pickupStops?.length} farm stops.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '10px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Assigned Driver:</span>
                <div style={{ fontWeight: '700', color: '#0f172a' }}>{createdGroupJob.assignedWorker}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Status:</span>
                <div style={{ fontWeight: '700', color: '#15803d' }}>{createdGroupJob.status}</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
