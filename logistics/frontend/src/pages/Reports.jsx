import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  Percent,
  Download
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import Button from '../components/Button';

export default function Reports() {
  const { jobs, workers, shortages } = useLogistics();

  const districtTonnage = [
    { district: 'Coimbatore', tonnage: 4.8, trips: 18, fillRate: 94 },
    { district: 'Erode', tonnage: 3.6, trips: 14, fillRate: 91 },
    { district: 'Salem', tonnage: 3.2, trips: 12, fillRate: 88 },
    { district: 'Tiruppur', tonnage: 2.9, trips: 11, fillRate: 92 },
    { district: 'Dindigul / Madurai', tonnage: 2.4, trips: 9, fillRate: 86 },
    { district: 'Chennai Wholesale', tonnage: 14.5, trips: 45, fillRate: 96 }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Logistics Analytics & KPIs</h2>
          <p>Performance metrics on dispatch efficiency, vehicle capacity utilization, and farm-to-buyer turnaround</p>
        </div>

        <div className="page-header-actions">
          <Button
            variant="secondary"
            icon={Download}
            onClick={() => alert('Monthly Logistics Performance Report downloaded.')}
          >
            Download KPI Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card-title">On-Time Delivery Rate</span>
          <div className="stat-card-value" style={{ color: '#15803d' }}>98.4%</div>
          <div className="stat-card-footer">
            <span className="stat-trend-badge stat-trend-up">+1.2% this month</span>
            <span>Target: &gt; 95%</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">Vehicle Capacity Fill Rate</span>
          <div className="stat-card-value" style={{ color: '#0284c7' }}>91.8%</div>
          <div className="stat-card-footer">
            <span className="stat-trend-badge stat-trend-up">+4.5% via Pooling</span>
            <span>Optimized loading</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">Avg. Pickup Turnaround</span>
          <div className="stat-card-value" style={{ color: '#d97706' }}>24 min</div>
          <div className="stat-card-footer">
            <span className="stat-trend-badge stat-trend-up">-6 min vs target</span>
            <span>Farm gate loading</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">Shortage Incidence Rate</span>
          <div className="stat-card-value" style={{ color: '#7c3aed' }}>2.1%</div>
          <div className="stat-card-footer">
            <span className="stat-trend-badge stat-trend-neutral">Within 3% margin</span>
            <span>Harvest variance</span>
          </div>
        </div>
      </div>

      {/* District Tonnage Distribution */}
      <div className="section-card">
        <div className="section-header">
          <div className="section-title">
            <BarChart3 size={20} color="#15803d" />
            <span>Regional Corridor Volume & Fill Rate</span>
          </div>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Tamil Nadu Agricultural Corridors</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {districtTonnage.map((item) => (
            <div key={item.district} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>
                  {item.district} ({item.trips} Dispatches)
                </span>
                <span style={{ fontWeight: '700', color: '#15803d' }}>
                  {item.tonnage} Tonnes • {item.fillRate}% Vehicle Utilization
                </span>
              </div>

              <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(item.tonnage / 15) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981 0%, #047857 100%)',
                    borderRadius: '9999px'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
