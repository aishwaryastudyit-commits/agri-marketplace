import React from 'react';
import {
  Navigation,
  MapPin,
  Sparkles,
  ArrowRight,
  Clock,
  Milestone,
  CheckCircle2,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import Button from './Button';

export default function RouteMap({
  job,
  onOptimize = null,
  isOptimizing = false
}) {
  if (!job) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
        <Navigation size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
        <h4 style={{ color: '#475569', fontSize: '1rem' }}>No Job Selected for Route Visualization</h4>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Select a delivery job to inspect the multi-stop geographic sequence.</p>
      </div>
    );
  }

  const origin = job.currentLocation || 'Coimbatore Hub';
  const stops = job.pickupStops || [];
  const destination = job.deliveryLocation || 'Chennai Wholesale Koyambedu';
  const totalDistance = job.distanceKm || 450;
  const etaMinutes = job.etaMinutes || 280;
  const hours = Math.floor(etaMinutes / 60);
  const minutes = etaMinutes % 60;

  return (
    <div className="route-visualizer-container">
      {/* Route Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
              Route Sequence for {job.jobId}
            </h3>
            {job.isRouteOptimized && (
              <span style={{
                background: '#ecfdf5',
                color: '#047857',
                border: '1px solid #a7f3d0',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={12} /> Heuristic Optimized
              </span>
            )}
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '3px' }}>
            Product: <strong>{job.product}</strong> ({job.quantity} KG) • Driver: <strong>{job.assignedWorker || 'Unassigned'}</strong> ({job.vehicleNumber || 'N/A'})
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>
              <Milestone size={16} color="#15803d" />
              <span>{totalDistance} KM</span>
            </div>
            <div style={{ height: '18px', width: '1px', backgroundColor: '#cbd5e1' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>
              <Clock size={16} color="#0284c7" />
              <span>{hours > 0 ? `${hours}h ` : ''}{minutes}m</span>
            </div>
          </div>

          {onOptimize && (
            <Button
              variant="primary"
              icon={Sparkles}
              onClick={() => onOptimize(job.jobId || job.id)}
              disabled={isOptimizing || stops.length <= 1}
            >
              {job.isRouteOptimized ? 'Re-Optimize Route' : 'Optimize Route'}
            </Button>
          )}
        </div>
      </div>

      {/* Distance Savings Banner if optimized */}
      {job.distanceSavedKm > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)',
          border: '1px solid #86efac',
          borderRadius: '12px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingDown size={20} color="#059669" />
            <div>
              <strong style={{ color: '#065f46', fontSize: '0.9rem' }}>
                Smart Route Optimization Saved {job.distanceSavedKm} KM!
              </strong>
              <p style={{ color: '#047857', fontSize: '0.8rem' }}>
                Reordered pickup stops using Nearest-Valid-Stop heuristic to minimize fuel expenditure & transit time.
              </p>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#047857', background: '#ffffff', padding: '4px 10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            ⚡ Fast Transit
          </span>
        </div>
      )}

      {/* Visual Route Diagram */}
      <div className="route-diagram">
        {/* Node 1: Current Location / Depot Origin */}
        <div className="route-stop-node">
          <div className="stop-pin origin">
            <Navigation size={22} />
          </div>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '700', color: '#2563eb' }}>
            Current Location
          </div>
          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a', marginTop: '2px' }}>
            {origin}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Trip Start</span>
        </div>

        {/* Connector to first stop */}
        <div className="route-connector-line">
          <div className="connector-pulse" />
          <span style={{ position: 'absolute', top: '-18px', fontSize: '0.72rem', fontWeight: '700', color: '#64748b' }}>
            Leg 1
          </span>
        </div>

        {/* Pickup Stops in Sequence */}
        {stops.map((stop, idx) => {
          const stopNum = idx + 1;
          const isCompleted = stop.status === 'Completed';

          return (
            <React.Fragment key={stop.id || idx}>
              <div className="route-stop-node">
                <div
                  className="stop-pin pickup"
                  style={{
                    backgroundColor: isCompleted ? '#059669' : '#10b981',
                    border: isCompleted ? '3px solid #86efac' : 'none'
                  }}
                >
                  {isCompleted ? <CheckCircle2 size={22} /> : stopNum}
                </div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '700', color: '#047857' }}>
                  Stop #{stopNum} • Farm Pickup
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a', marginTop: '2px' }}>
                  {stop.farmerName}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>
                  {stop.location} ({stop.expectedQuantity} KG)
                </span>
                {stop.actualQuantity && (
                  <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: '700' }}>
                    Loaded: {stop.actualQuantity} KG
                  </span>
                )}
              </div>

              {/* Connector to next stop or destination */}
              <div className="route-connector-line">
                <div className="connector-pulse" />
                <span style={{ position: 'absolute', top: '-18px', fontSize: '0.72rem', fontWeight: '700', color: '#64748b' }}>
                  Leg {idx + 2}
                </span>
              </div>
            </React.Fragment>
          );
        })}

        {/* Node Final: Destination Buyer Hub */}
        <div className="route-stop-node">
          <div className="stop-pin destination">
            <MapPin size={22} />
          </div>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '700', color: '#7c3aed' }}>
            Final Buyer Dropoff
          </div>
          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a', marginTop: '2px' }}>
            {destination}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>End of Route</span>
        </div>
      </div>

      {/* Stop Sequence Breakdown List */}
      <div style={{ marginTop: '20px', background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#334155', marginBottom: '12px' }}>
          Itinerary Breakdown ({stops.length} Pickup Stops + 1 Buyer Dropoff)
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', padding: '8px 12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: '600', color: '#2563eb' }}>0. Start: {origin}</span>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Vehicle Departure</span>
          </div>

          {stops.map((s, i) => (
            <div key={s.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', padding: '8px 12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>
                {i + 1}. {s.farmerName} • <span style={{ color: '#15803d' }}>{s.location}</span> ({s.expectedQuantity} KG {s.product})
              </span>
              <span style={{ fontSize: '0.8rem', color: s.status === 'Completed' ? '#047857' : '#d97706', fontWeight: '700' }}>
                {s.status === 'Completed' ? '✓ Collected' : 'Pending Loading'}
              </span>
            </div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', padding: '8px 12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: '600', color: '#7c3aed' }}>{stops.length + 1}. Final Dropoff: {destination}</span>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Wholesale Unloading & Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
