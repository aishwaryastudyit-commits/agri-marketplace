import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  MapPin,
  Truck,
  Shield,
  Bell,
  Save,
  CheckCircle2
} from 'lucide-react';
import Button from '../components/Button';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [hubName, setHubName] = useState('Coimbatore Central Logistics Terminal');
  const [hubLocation, setHubLocation] = useState('NH-544 Bypass, Coimbatore South');
  const [shortageThreshold, setShortageThreshold] = useState(5); // 5%
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Logistics System Settings</h2>
          <p>Depot hub parameters, vehicle assignment thresholds, and automated routing rules</p>
        </div>

        <div className="page-header-actions">
          <Button
            variant="primary"
            icon={Save}
            onClick={handleSave}
          >
            {saved ? 'Saved Successfully ✓' : 'Save Preferences'}
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Depot Configuration */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">
              <MapPin size={20} color="#15803d" />
              <span>Primary Depot Hub Base</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label>Depot Name</label>
              <input
                type="text"
                value={hubName}
                onChange={(e) => setHubName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Address & Highway Node</label>
              <input
                type="text"
                value={hubLocation}
                onChange={(e) => setHubLocation(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Depot Operational District</label>
              <select className="form-control" defaultValue="Coimbatore">
                <option value="Coimbatore">Coimbatore (West Cluster)</option>
                <option value="Erode">Erode (Central Hub)</option>
                <option value="Salem">Salem (North-Central Corridor)</option>
                <option value="Chennai">Chennai (Wholesale Terminal)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dispatch Rules */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">
              <Truck size={20} color="#15803d" />
              <span>Fleet Dispatch Automation Rules</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Auto Heuristic Route Optimization</strong>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Reorder multi-farm stops on job creation</p>
              </div>
              <input
                type="checkbox"
                checked={autoOptimize}
                onChange={(e) => setAutoOptimize(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#15803d' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Driver SMS Dispatch Pings</strong>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Send route GPS links to driver phone</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#15803d' }}
              />
            </div>

            <div className="form-group">
              <label>Shortage Alert Sensitivity (% threshold)</label>
              <input
                type="number"
                value={shortageThreshold}
                onChange={(e) => setShortageThreshold(Number(e.target.value))}
                className="form-control"
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Trigger high-priority alert when farm variance exceeds this percent.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
