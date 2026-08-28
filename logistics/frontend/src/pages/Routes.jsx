import React, { useState } from 'react';
import {
  Route,
  Sparkles,
  Navigation,
  MapPin,
  Clock,
  Milestone,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import RouteMap from '../components/RouteMap';
import Button from '../components/Button';
import { optimizeRoute } from '../utils/routeOptimizer';

export default function Routes() {
  const { jobs, optimizeJobRoute, setActiveTab } = useLogistics();

  const [selectedJobId, setSelectedJobId] = useState('JOB-1027');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComparison, setOptimizationComparison] = useState(null);

  const activeJob = jobs.find(j => j.jobId === selectedJobId) || jobs[0];

  const handleRunOptimizer = () => {
    if (!activeJob) return;

    setIsOptimizing(true);
    setTimeout(() => {
      const res = optimizeJobRoute(activeJob.jobId);
      setOptimizationComparison(res);
      setIsOptimizing(false);
    }, 400);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Route Visualization & Smart Optimizer</h2>
          <p>Nearest-Valid-Stop heuristic sequencing: evaluates distance, order priority, vehicle payload & transit corridors</p>
        </div>

        <div className="page-header-actions">
          <Button
            variant="primary"
            icon={Sparkles}
            onClick={handleRunOptimizer}
            disabled={isOptimizing || !activeJob || (activeJob.pickupStops?.length || 0) <= 1}
          >
            {isOptimizing ? 'Optimizing Corridor...' : 'Run Smart Route Optimizer'}
          </Button>
        </div>
      </div>

      {/* Corridor Selector Bar */}
      <div style={{
        background: '#ffffff',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>
            Select Route Consignment:
          </span>

          <select
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              setOptimizationComparison(null);
            }}
            className="form-control"
            style={{ width: 'auto', minWidth: '320px', fontWeight: '600' }}
          >
            {jobs.map(job => (
              <option key={job.jobId} value={job.jobId}>
                {job.jobId} • {job.product} ({job.pickupStops?.length || 1} Stops &rarr; {job.deliveryLocation})
              </option>
            ))}
          </select>
        </div>

        {activeJob && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Driver: <strong>{activeJob.assignedWorker || 'Unassigned'}</strong>
            </span>
            <span style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: '700' }}>
              Payload: {activeJob.quantity} KG
            </span>
          </div>
        )}
      </div>

      {/* Main Interactive Route Visualization */}
      <RouteMap
        job={activeJob}
        onOptimize={handleRunOptimizer}
        isOptimizing={isOptimizing}
      />

      {/* Heuristic Algorithm Explanation & Comparison Box */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={22} color="#15803d" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
            Smart Nearest-Valid-Stop Algorithm Process
          </h3>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.6' }}>
          The Member 5 routing engine evaluates the starting location, calculates straight-line & road-factor distances between farm coordinates, prioritizes perishable/express consignments, validates vehicle capacity fit, and outputs the optimal sequential path to the buyer wholesale terminal.
        </p>

        {/* Algorithm Process Step-by-Step Flow */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#15803d', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', margin: '0 auto 6px', fontSize: '0.8rem' }}>1</div>
            <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>Current Location</strong>
            <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Depot / Driver GPS origin</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#15803d', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', margin: '0 auto 6px', fontSize: '0.8rem' }}>2</div>
            <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>Consider Distance</strong>
            <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Compute KM to all candidate farms</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#15803d', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', margin: '0 auto 6px', fontSize: '0.8rem' }}>3</div>
            <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>Consider Priority</strong>
            <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Weigh urgent crop perishability</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#15803d', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', margin: '0 auto 6px', fontSize: '0.8rem' }}>4</div>
            <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>Move & Repeat</strong>
            <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Loop through remaining farm gates</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#7c3aed', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', margin: '0 auto 6px', fontSize: '0.8rem' }}>5</div>
            <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>Final Buyer Drop</strong>
            <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Direct transit to wholesale market</p>
          </div>
        </div>

        {/* Example Original vs Optimized Demonstration Box */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ fontSize: '0.9rem', color: '#14532d', fontWeight: '800', marginBottom: '8px' }}>
            Optimization Benchmark Example:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.85rem' }}>
            <div style={{ padding: '10px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Original Sequence:</span>
              <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '3px' }}>
                Worker &rarr; Farmer A &rarr; Farmer C &rarr; Farmer B &rarr; Buyer Hub
              </div>
              <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>544 KM • 8.1 Hours</span>
            </div>

            <div style={{ padding: '10px', background: '#ffffff', borderRadius: '8px', border: '1px solid #86efac' }}>
              <span style={{ color: '#047857', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Optimized Sequence:</span>
              <div style={{ fontWeight: '700', color: '#15803d', marginTop: '3px' }}>
                Worker &rarr; Farmer B &rarr; Farmer A &rarr; Farmer C &rarr; Buyer Hub
              </div>
              <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '700' }}>510 KM • 7.4 Hours (34 KM Saved!)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
