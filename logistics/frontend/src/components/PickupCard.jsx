import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Edit3
} from 'lucide-react';
import Button from './Button';
import { calculateShortage } from '../utils/shortageCalculator';

export default function PickupCard({
  stop,
  stopIndex = 1,
  totalStops = 1,
  jobId,
  onUpdateStop,
  onReportShortage
}) {
  const [actualInput, setActualInput] = useState(stop.actualQuantity !== null && stop.actualQuantity !== undefined ? stop.actualQuantity : '');
  const [isEditing, setIsEditing] = useState(false);
  const [stopNotes, setStopNotes] = useState(stop.notes || '');

  const expected = Number(stop.expectedQuantity || 0);
  const actual = actualInput !== '' ? Number(actualInput) : null;
  const shortageInfo = actual !== null ? calculateShortage(expected, actual) : null;

  const handleSaveQuantity = () => {
    if (actual !== null) {
      onUpdateStop(jobId, stop.id, {
        actualQuantity: actual,
        status: stop.status === 'Pending' ? 'In Progress' : stop.status,
        notes: stopNotes
      });
      setIsEditing(false);
    }
  };

  const handleMarkArrived = () => {
    onUpdateStop(jobId, stop.id, {
      status: 'Arrived at Farm'
    });
  };

  const handleStartPickup = () => {
    onUpdateStop(jobId, stop.id, {
      status: 'Loading & Verifying'
    });
  };

  const handleCompletePickup = () => {
    const finalActual = actual !== null ? actual : expected;
    onUpdateStop(jobId, stop.id, {
      actualQuantity: finalActual,
      status: 'Completed',
      notes: stopNotes
    });
    setIsEditing(false);
  };

  const getStopStatusBadge = (st) => {
    switch (st) {
      case 'Completed':
        return <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700' }}>✓ Completed</span>;
      case 'In Progress':
      case 'Loading & Verifying':
        return <span style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700' }}>⟳ In Progress</span>;
      case 'Arrived at Farm':
        return <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700' }}>📍 Arrived</span>;
      default:
        return <span style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700' }}>⏳ Pending Stop</span>;
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '0.9rem'
          }}>
            #{stopIndex}
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
              {stop.farmerName}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.82rem', marginTop: '2px' }}>
              <MapPin size={14} color="#15803d" />
              <span>{stop.location} {stop.address ? `• ${stop.address}` : ''}</span>
            </div>
          </div>
        </div>

        <div>
          {getStopStatusBadge(stop.status)}
        </div>
      </div>

      {/* Product & Quantity Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        background: '#f8fafc',
        padding: '14px',
        borderRadius: '12px',
        border: '1px solid #f1f5f9'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Product</span>
          <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{stop.product || 'Agri Produce'}</div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Expected Qty</span>
          <div style={{ fontWeight: '700', color: '#15803d', fontSize: '0.95rem' }}>{expected} KG</div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Actual Qty</span>
          <div style={{ fontWeight: '700', color: actual !== null ? '#0f172a' : '#94a3b8', fontSize: '0.95rem' }}>
            {actual !== null ? `${actual} KG` : 'Not verified yet'}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Difference</span>
          <div style={{
            fontWeight: '700',
            fontSize: '0.95rem',
            color: shortageInfo && shortageInfo.hasShortage ? '#dc2626' : '#059669'
          }}>
            {shortageInfo && shortageInfo.hasShortage
              ? `-${shortageInfo.shortage} KG (Shortage)`
              : shortageInfo && shortageInfo.isSurplus
              ? `+${Math.abs(shortageInfo.difference)} KG (Surplus)`
              : '0 KG'}
          </div>
        </div>
      </div>

      {/* Shortage Warning Banner if shortage detected */}
      {shortageInfo && shortageInfo.hasShortage && (
        <div className="shortage-alert-box danger">
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Shortage Detected: {shortageInfo.shortage} KG ({shortageInfo.shortagePercentage}%)</strong>
            <p style={{ fontSize: '0.8rem', marginTop: '2px' }}>
              Expected {expected} KG, but only {actual} KG is loaded at {stop.farmerName}. Shortage report automatically triggered for logistics records.
            </p>
          </div>
        </div>
      )}

      {/* Actual Quantity Input Control */}
      <div style={{
        background: '#ffffff',
        border: '1px dashed #cbd5e1',
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package size={18} color="#15803d" />
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
            Farm-gate Weighed Quantity:
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="number"
              value={actualInput}
              onChange={(e) => setActualInput(e.target.value)}
              placeholder={`${expected}`}
              style={{
                width: '100px',
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontWeight: '700',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>KG</span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleSaveQuantity}
        >
          Save Verified Weight
        </Button>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        paddingTop: '6px',
        borderTop: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkArrived}
            disabled={stop.status === 'Completed'}
          >
            Mark Arrived
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleStartPickup}
            disabled={stop.status === 'Completed'}
          >
            Start Pickup
          </Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onReportShortage && onReportShortage(stop)}
          >
            Report Shortage
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={CheckCircle2}
            onClick={handleCompletePickup}
            disabled={stop.status === 'Completed'}
          >
            {stop.status === 'Completed' ? 'Pickup Completed ✓' : 'Complete Pickup'}
          </Button>
        </div>
      </div>
    </div>
  );
}
