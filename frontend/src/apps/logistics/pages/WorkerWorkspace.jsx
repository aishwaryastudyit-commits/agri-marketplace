import React, { useState } from 'react';
import {
  Smartphone,
  Truck,
  Navigation,
  Package,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  User,
  Phone,
  Shield,
  XCircle,
  Sparkles,
  ChevronRight,
  Boxes
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { calculateShortage } from '../utils/shortageCalculator';

export default function WorkerWorkspace() {
  const {
    jobs,
    workers,
    updateJobStatus,
    updatePickupStop,
    setActiveTab,
    assignWorkerToJob
  } = useLogistics();

  // Simulated logged-in driver (default Arun Kumar, WRK-101)
  const [activeDriverId, setActiveDriverId] = useState('WRK-101');
  const [activeJobId, setActiveJobId] = useState('JOB-1024');

  // Input states for stop weighing
  const [stopWeights, setStopWeights] = useState({});

  const activeDriver = workers.find(w => w.id === activeDriverId) || workers[0];
  const assignedJobs = jobs.filter(j => j.assignedWorkerId === activeDriverId || j.assignedWorker === activeDriver.name);
  const availableJobs = jobs.filter(j => j.status === 'AVAILABLE');

  // Currently focused job on driver terminal
  const currentJob = jobs.find(j => j.jobId === activeJobId) || assignedJobs[0] || availableJobs[0] || jobs[0];

  const handleAcceptJob = (job) => {
    assignWorkerToJob(job.jobId, activeDriver.id);
    setActiveJobId(job.jobId);
  };

  const handleStatusStep = (nextStatus) => {
    if (!currentJob) return;
    updateJobStatus(currentJob.jobId, nextStatus);
  };

  const handleCancelDelivery = () => {
    if (!currentJob) return;
    updateJobStatus(currentJob.jobId, 'CANCELLED');
  };

  const handleUpdateStopWeight = (stopId, expectedQty) => {
    const val = stopWeights[stopId] !== undefined ? stopWeights[stopId] : expectedQty;
    updatePickupStop(currentJob.jobId, stopId, {
      actualQuantity: Number(val),
      status: 'Completed'
    });
  };

  return (
    <div className="page-container" style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={24} color="#15803d" />
            <h2>Delivery Driver Mobile Terminal</h2>
          </div>
          <p>On-the-road driver interface: accept jobs, farm gate loading, quantity weighing & GPS status advancing</p>
        </div>

        <div className="page-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Simulate Driver:</span>
            <select
              value={activeDriverId}
              onChange={(e) => setActiveDriverId(e.target.value)}
              className="form-control"
              style={{ width: 'auto', fontWeight: '700' }}
            >
              {workers.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.vehicleType} • {w.vehicleCapacity} KG)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Driver Status Card */}
      <div style={{
        background: 'linear-gradient(135deg, #092c1d 0%, #15803d 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ffffff', color: '#092c1d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.2rem' }}>
            {activeDriver.name[0]}
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{activeDriver.name}</h3>
            <div style={{ fontSize: '0.84rem', color: '#d1fae5' }}>
              Vehicle: <strong>{activeDriver.vehicleType}</strong> ({activeDriver.vehicleNumber}) • Capacity: <strong>{activeDriver.vehicleCapacity} KG</strong>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: '700' }}>Current Fleet Duty</div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>{activeDriver.availability}</div>
        </div>
      </div>

      {/* Driver Workspace Split View: Mobile Console + Job Queues */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Mobile-Style Trip Console */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '2px solid #e2e8f0',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          {currentJob ? (
            <>
              {/* Trip Terminal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Active Consignment</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>{currentJob.jobId}</div>
                </div>

                <StatusBadge status={currentJob.status} />
              </div>

              {/* Consignment Commodity & Weight */}
              <div style={{
                background: '#f8fafc',
                padding: '14px',
                borderRadius: '14px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Cargo Produce</span>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{currentJob.product}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Total Weight</span>
                  <div style={{ fontWeight: '800', color: '#15803d', fontSize: '1.05rem' }}>{currentJob.quantity} KG</div>
                </div>
              </div>

              {/* Corridor Locations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#15803d" />
                  <span><strong>Pickup:</strong> {currentJob.pickupLocations}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#7c3aed" />
                  <span><strong>Dropoff:</strong> {currentJob.deliveryLocation}</span>
                </div>
              </div>

              {/* STEP-BY-STEP WORKER INTERACTION BUTTONS */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#14532d', textTransform: 'uppercase' }}>
                  Driver Action Controls:
                </div>

                {/* Workflow Transitions */}
                {currentJob.status === 'AVAILABLE' && (
                  <Button
                    variant="primary"
                    size="lg"
                    icon={CheckCircle2}
                    onClick={() => handleAcceptJob(currentJob)}
                    fullWidth={true}
                  >
                    Accept Consignment (AVAILABLE &rarr; ASSIGNED)
                  </Button>
                )}

                {currentJob.status === 'ASSIGNED' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Button
                      variant="primary"
                      size="lg"
                      icon={Navigation}
                      onClick={() => handleStatusStep('GOING TO PICKUP')}
                      fullWidth={true}
                    >
                      Start Trip (ASSIGNED &rarr; GOING TO PICKUP)
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      onClick={handleCancelDelivery}
                      fullWidth={true}
                    >
                      Cancel Delivery (ASSIGNED &rarr; CANCELLED)
                    </Button>
                  </div>
                )}

                {currentJob.status === 'GOING TO PICKUP' && (
                  <Button
                    variant="primary"
                    size="lg"
                    icon={MapPin}
                    onClick={() => handleStatusStep('PICKING UP')}
                    fullWidth={true}
                  >
                    Mark Arrival at Farm Gate (GOING TO PICKUP &rarr; PICKING UP)
                  </Button>
                )}

                {currentJob.status === 'PICKING UP' && (
                  <Button
                    variant="primary"
                    size="lg"
                    icon={Boxes}
                    onClick={() => handleStatusStep('PICKED UP')}
                    fullWidth={true}
                  >
                    Complete Loading (PICKING UP &rarr; PICKED UP)
                  </Button>
                )}

                {currentJob.status === 'PICKED UP' && (
                  <Button
                    variant="primary"
                    size="lg"
                    icon={Truck}
                    onClick={() => handleStatusStep('OUT FOR DELIVERY')}
                    fullWidth={true}
                  >
                    Start Highway Delivery (PICKED UP &rarr; OUT FOR DELIVERY)
                  </Button>
                )}

                {currentJob.status === 'OUT FOR DELIVERY' && (
                  <Button
                    variant="primary"
                    size="lg"
                    icon={CheckCircle2}
                    onClick={() => handleStatusStep('DELIVERED')}
                    fullWidth={true}
                  >
                    Complete Delivery at Buyer Hub (OUT FOR DELIVERY &rarr; DELIVERED)
                  </Button>
                )}

                {currentJob.status === 'DELIVERED' && (
                  <div style={{ textAlign: 'center', padding: '10px', color: '#047857', fontWeight: '800' }}>
                    ✓ Delivery Completed & Verified by Wholesale Buyer!
                  </div>
                )}

                {currentJob.status === 'CANCELLED' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ textAlign: 'center', padding: '6px', color: '#dc2626', fontWeight: '700' }}>
                      ✕ Delivery Assignment Cancelled
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusStep('AVAILABLE')}
                      fullWidth={true}
                    >
                      Return to Pool (AVAILABLE)
                    </Button>
                  </div>
                )}
              </div>

              {/* Multi-Farmer Pickup Stops Weighing Form inside Driver App */}
              {currentJob.pickupStops && currentJob.pickupStops.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>
                    Farm-Gate Quantity Entry ({currentJob.pickupStops.length} Stops)
                  </h4>

                  {currentJob.pickupStops.map((stop, idx) => {
                    const expected = Number(stop.expectedQuantity || 0);
                    const enteredVal = stopWeights[stop.id] !== undefined ? stopWeights[stop.id] : (stop.actualQuantity || '');
                    const shortageInfo = enteredVal !== '' ? calculateShortage(expected, Number(enteredVal)) : null;

                    return (
                      <div
                        key={stop.id || idx}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                            #{idx + 1} {stop.farmerName}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: stop.status === 'Completed' ? '#047857' : '#d97706', fontWeight: '700' }}>
                            {stop.status || 'Pending'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Expected: <strong>{expected} KG</strong>
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '700' }}>Actual:</label>
                            <input
                              type="number"
                              value={enteredVal}
                              onChange={(e) => setStopWeights(prev => ({ ...prev, [stop.id]: e.target.value }))}
                              placeholder={`${expected}`}
                              style={{ width: '80px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: '700' }}
                            />
                            <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>KG</span>
                          </div>
                        </div>

                        {shortageInfo && shortageInfo.hasShortage && (
                          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '700', background: '#fef2f2', padding: '4px 8px', borderRadius: '6px' }}>
                            ⚠ Shortage Detected: -{shortageInfo.shortage} KG ({shortageInfo.shortagePercentage}%)
                          </div>
                        )}

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateStopWeight(stop.id, expected)}
                        >
                          Verify & Save Stop #{idx + 1}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <p>No active job selected.</p>
            </div>
          )}
        </div>

        {/* Right Column: Driver Job Queues */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Assigned Jobs List */}
          <div className="section-card">
            <div className="section-header" style={{ marginBottom: '12px' }}>
              <div className="section-title" style={{ fontSize: '1rem' }}>
                <Truck size={18} color="#15803d" />
                <span>My Assigned Consignments ({assignedJobs.length})</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {assignedJobs.map(job => (
                <div
                  key={job.jobId}
                  onClick={() => setActiveJobId(job.jobId)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${job.jobId === activeJobId ? '#15803d' : '#e2e8f0'}`,
                    backgroundColor: job.jobId === activeJobId ? '#f0fdf4' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{job.jobId}</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{job.product} ({job.quantity} KG)</div>
                  </div>

                  <StatusBadge status={job.status} size="sm" />
                </div>
              ))}

              {assignedJobs.length === 0 && (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                  No active assignments. Check available jobs below.
                </div>
              )}
            </div>
          </div>

          {/* Available Jobs to Accept */}
          <div className="section-card">
            <div className="section-header" style={{ marginBottom: '12px' }}>
              <div className="section-title" style={{ fontSize: '1rem' }}>
                <Package size={18} color="#0284c7" />
                <span>Available Jobs to Accept ({availableJobs.length})</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {availableJobs.map(job => {
                const canFit = activeDriver.vehicleCapacity >= job.quantity;

                return (
                  <div
                    key={job.jobId}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: canFit ? 1 : 0.6
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong>{job.jobId}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: '700' }}>{job.product}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                        Load: <strong>{job.quantity} KG</strong> • Route: {job.pickupLocations} &rarr; {job.deliveryLocation}
                      </div>
                    </div>

                    <div>
                      {canFit ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAcceptJob(job)}
                        >
                          Accept
                        </Button>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: '700' }}>
                          Exceeds Capacity
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {availableJobs.length === 0 && (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                  No available jobs waiting in queue.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
