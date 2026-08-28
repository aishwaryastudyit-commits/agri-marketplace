import React from 'react';
import { AlertCircle, Calendar, MapPin, User, Package, ArrowDownRight } from 'lucide-react';

export default function ShortageCard({ report, onAcknowledge = null }) {
  const isHighSeverity = report.severity === 'high' || Number(report.shortage) > 30;

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderLeft: `5px solid ${isHighSeverity ? '#ef4444' : '#f59e0b'}`,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontFamily: 'monospace',
            fontWeight: '800',
            fontSize: '0.88rem',
            background: isHighSeverity ? '#fee2e2' : '#fef3c7',
            color: isHighSeverity ? '#991b1b' : '#92400e',
            padding: '4px 10px',
            borderRadius: '6px'
          }}>
            {report.reportId}
          </span>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Job: <strong>{report.jobId || 'N/A'}</strong> | Order: <strong>{report.orderId}</strong>
          </span>
        </div>

        <span style={{
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
          padding: '3px 10px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '700'
        }}>
          {report.status || 'Reported'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontWeight: '600', fontSize: '0.92rem' }}>
          <User size={16} color="#15803d" />
          <span>{report.farmer}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
          <MapPin size={16} color="#64748b" />
          <span>{report.location}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
          <Calendar size={16} color="#64748b" />
          <span>{report.date}</span>
        </div>
      </div>

      {/* Numerical Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: '10px',
        background: '#f8fafc',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid #f1f5f9'
      }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Product</span>
          <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{report.product || 'Agri Commodity'}</div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Expected Qty</span>
          <div style={{ fontWeight: '700', color: '#15803d', fontSize: '0.9rem' }}>{report.expected} KG</div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Actual Loaded</span>
          <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{report.actual} KG</div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: '#dc2626', textTransform: 'uppercase', fontWeight: '700' }}>Shortage</span>
          <div style={{ fontWeight: '800', color: '#dc2626', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowDownRight size={16} />
            {report.shortage} KG
          </div>
        </div>
      </div>

      {report.notes && (
        <div style={{ fontSize: '0.82rem', color: '#475569', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
          <strong>Logistics Notes:</strong> {report.notes}
        </div>
      )}
    </div>
  );
}
