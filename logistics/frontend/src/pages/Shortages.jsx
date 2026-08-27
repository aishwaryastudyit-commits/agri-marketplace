import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Calendar,
  MapPin,
  CheckCircle2,
  Package,
  TrendingDown
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import ShortageCard from '../components/ShortageCard';
import Button from '../components/Button';

export default function Shortages() {
  const { shortages, stats } = useLogistics();

  const [searchFilter, setSearchFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const totalShortageKg = shortages.reduce((sum, s) => sum + Number(s.shortage || 0), 0);
  const totalExpectedKg = shortages.reduce((sum, s) => sum + Number(s.expected || 0), 0);
  const totalActualKg = shortages.reduce((sum, s) => sum + Number(s.actual || 0), 0);

  const filteredShortages = shortages.filter(s => {
    const q = searchFilter.toLowerCase();
    return !q ||
      s.reportId.toLowerCase().includes(q) ||
      s.orderId.toLowerCase().includes(q) ||
      s.farmer.toLowerCase().includes(q) ||
      (s.location && s.location.toLowerCase().includes(q)) ||
      (s.product && s.product.toLowerCase().includes(q));
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Farm-Gate Shortage Registry</h2>
          <p>Discrepancy audit log: <code>shortage = expectedQuantity - actualQuantity</code> reported during farm collections</p>
        </div>

        <div className="page-header-actions">
          <Button
            variant="secondary"
            icon={Download}
            onClick={() => alert('Shortage audit log downloaded as CSV.')}
          >
            Export Audit Log
          </Button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card" style={{ padding: '16px 20px', borderLeft: '4px solid #ef4444' }}>
          <span className="stat-card-title">Total Shortages Logged</span>
          <div className="stat-card-value" style={{ fontSize: '1.8rem', color: '#dc2626' }}>
            {totalShortageKg} KG
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Cumulative Farm Variance</span>
        </div>

        <div className="stat-card" style={{ padding: '16px 20px' }}>
          <span className="stat-card-title">Expected Farm Quantities</span>
          <div className="stat-card-value" style={{ fontSize: '1.8rem' }}>
            {totalExpectedKg} KG
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Initial order estimates</span>
        </div>

        <div className="stat-card" style={{ padding: '16px 20px' }}>
          <span className="stat-card-title">Actual Weighed & Loaded</span>
          <div className="stat-card-value" style={{ fontSize: '1.8rem', color: '#15803d' }}>
            {totalActualKg} KG
          </div>
          <span style={{ fontSize: '0.78rem', color: '#047857' }}>Physically received payload</span>
        </div>

        <div className="stat-card" style={{ padding: '16px 20px' }}>
          <span className="stat-card-title">Discrepancy Incident Count</span>
          <div className="stat-card-value" style={{ fontSize: '1.8rem', color: '#d97706' }}>
            {shortages.length} Cases
          </div>
          <span style={{ fontSize: '0.78rem', color: '#b45309' }}>Registered reports</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search shortages by Report ID (SR-xxx), Order ID, Farmer name, or Location..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('table')}
          >
            Table View
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('cards')}
          >
            Card View
          </button>
        </div>
      </div>

      {/* Required Shortages Table */}
      {viewMode === 'table' ? (
        <div className="section-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Order ID</th>
                  <th>Farmer</th>
                  <th>Expected (KG)</th>
                  <th>Actual (KG)</th>
                  <th>Shortage (KG)</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredShortages.map((s) => (
                  <tr key={s.reportId}>
                    <td>
                      <span className="job-code" style={{ color: '#991b1b', background: '#fee2e2' }}>
                        {s.reportId}
                      </span>
                    </td>
                    <td>
                      <span className="order-code">{s.orderId}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{s.farmer}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.location}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#15803d' }}>{s.expected} KG</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#0f172a' }}>{s.actual} KG</span>
                    </td>
                    <td>
                      <span style={{
                        fontWeight: '800',
                        color: '#dc2626',
                        background: '#fef2f2',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        border: '1px solid #fecaca'
                      }}>
                        -{s.shortage} KG
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{s.date}</span>
                    </td>
                    <td>
                      <span style={{
                        background: '#fef2f2',
                        color: '#b91c1c',
                        border: '1px solid #fecaca',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: '700'
                      }}>
                        {s.status || 'Reported'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {filteredShortages.map((s) => (
            <ShortageCard key={s.reportId} report={s} />
          ))}
        </div>
      )}

      {filteredShortages.length === 0 && (
        <div style={{ padding: '48px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <CheckCircle2 size={36} color="#15803d" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ color: '#0f172a' }}>No Shortages Logged</h4>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>All farm-gate collections matched 100% of expected harvest weights.</p>
        </div>
      )}
    </div>
  );
}
