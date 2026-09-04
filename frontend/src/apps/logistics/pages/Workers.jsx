import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Truck,
  Phone,
  Mail,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import WorkerCard from '../components/WorkerCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { checkWorkerCompatibility } from '../utils/compatibility';

export default function Workers() {
  const { workers, registerWorker, stats } = useLogistics();

  const [searchFilter, setSearchFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('ALL');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedWorkerDetails, setSelectedWorkerDetails] = useState(null);

  // Interactive Live Compatibility Testing Sandbox
  const [testRequiredCapacity, setTestRequiredCapacity] = useState(700);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    licenseNumber: '',
    vehicleType: 'Truck',
    vehicleNumber: '',
    vehicleCapacity: 1000,
    availability: 'Available',
    baseHub: 'Coimbatore South Depot'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicleCapacity' ? Number(value) : value
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.vehicleNumber) {
      alert('Please fill out Name, Phone, and Vehicle Number.');
      return;
    }

    try {
      await registerWorker(formData);
      setIsRegisterModalOpen(false);
    } catch (error) {
      alert(error.message || 'Could not register the worker.');
      return;
    }
    setFormData({
      name: '',
      phone: '',
      email: '',
      licenseNumber: '',
      vehicleType: 'Truck',
      vehicleNumber: '',
      vehicleCapacity: 1000,
      availability: 'Available',
      baseHub: 'Coimbatore South Depot'
    });
  };

  const filteredWorkers = workers.filter(w => {
    const matchesAvail = availabilityFilter === 'ALL' || w.availability === availabilityFilter;
    const matchesVehicle = vehicleTypeFilter === 'ALL' || w.vehicleType === vehicleTypeFilter;
    const q = searchFilter.toLowerCase();
    const matchesSearch = !q ||
      w.name.toLowerCase().includes(q) ||
      w.phone.toLowerCase().includes(q) ||
      w.vehicleNumber.toLowerCase().includes(q) ||
      w.vehicleType.toLowerCase().includes(q);

    return matchesAvail && matchesVehicle && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h2>Worker & Fleet Management</h2>
          <p>Driver onboarding, vehicle capacity profiling, and real-time load compatibility validation</p>
        </div>

        <div className="page-header-actions">
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => setIsRegisterModalOpen(true)}
          >
            Register Worker
          </Button>
        </div>
      </div>

      {/* Fleet Stats Overview Bar */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card" style={{ padding: '16px 20px' }}>
          <span className="stat-card-title">Total Registered Fleet</span>
          <div className="stat-card-value" style={{ fontSize: '1.8rem' }}>{workers.length}</div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Certified Logistics Drivers</span>
        </div>

        <div className="stat-card" style={{ padding: '16px 20px' }}>
          <span className="stat-card-title">Available for Dispatch</span>
          <div className="stat-card-value" style={{ fontSize: '1.8rem', color: '#15803d' }}>
            {workers.filter(w => w.availability === 'Available').length}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#047857' }}>Ready at depots</span>
        </div>

        <div className="stat-card" style={{ padding: '16px 20px' }}>
          <span className="stat-card-title">Currently On Route</span>
          <div className="stat-card-value" style={{ fontSize: '1.8rem', color: '#d97706' }}>
            {workers.filter(w => w.availability === 'On Route').length}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#b45309' }}>In transit with cargo</span>
        </div>

        <div className="stat-card" style={{ padding: '16px 20px' }}>
          <span className="stat-card-title">Total Fleet Capacity</span>
          <div className="stat-card-value" style={{ fontSize: '1.8rem', color: '#0284c7' }}>
            {(workers.reduce((sum, w) => sum + (Number(w.vehicleCapacity) || 0), 0) / 1000).toFixed(1)} T
          </div>
          <span style={{ fontSize: '0.78rem', color: '#0369a1' }}>Metric Tons Payload</span>
        </div>
      </div>

      {/* WORKER COMPATIBILITY INTERACTIVE SIMULATOR */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        border: '1px solid #bbf7d0',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={20} color="#15803d" />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                Live Vehicle Capacity Compatibility Test
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#475569' }}>
                Rule: <code>Vehicle Capacity &ge; Required Delivery Quantity</code>. Only compatible workers are eligible for assignment.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>
              Required Delivery Load:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                step="50"
                min="50"
                max="5000"
                value={testRequiredCapacity}
                onChange={(e) => setTestRequiredCapacity(Number(e.target.value))}
                className="form-control"
                style={{ width: '110px', textAlign: 'center', fontWeight: '800', fontSize: '0.95rem', color: '#15803d' }}
              />
              <span style={{ fontWeight: '700', color: '#15803d' }}>KG</span>
            </div>
          </div>
        </div>

        {/* Quick Example Scenarios Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '6px', borderTop: '1px solid #dcfce7' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b' }}>Quick Test Cases:</span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setTestRequiredCapacity(300)}
            style={{ fontSize: '0.75rem', padding: '3px 8px' }}
          >
            300 KG (Small Batch)
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setTestRequiredCapacity(700)}
            style={{ fontSize: '0.75rem', padding: '3px 8px' }}
          >
            700 KG (Medium Load)
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setTestRequiredCapacity(1000)}
            style={{ fontSize: '0.75rem', padding: '3px 8px' }}
          >
            1000 KG (1 Tonne Full Load)
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setTestRequiredCapacity(2500)}
            style={{ fontSize: '0.75rem', padding: '3px 8px' }}
          >
            2500 KG (Heavy Consignment)
          </button>
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
            placeholder="Search workers by name, phone, vehicle plate, or type..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748b' }}>Availability:</span>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '7px 12px', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Statuses ({workers.length})</option>
              <option value="Available">Available</option>
              <option value="On Route">On Route</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748b' }}>Vehicle:</span>
            <select
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '7px 12px', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Vehicle Types</option>
              <option value="Truck">Truck</option>
              <option value="Mini Truck">Mini Truck</option>
              <option value="Pickup Van">Pickup Van</option>
              <option value="Tempo Traveller">Tempo Traveller</option>
              <option value="Heavy Truck">Heavy Truck</option>
              <option value="Medium Truck">Medium Truck</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="workers-grid">
        {filteredWorkers.map((worker) => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            selectedForJob={testRequiredCapacity}
            onViewDetails={(w) => setSelectedWorkerDetails(w)}
          />
        ))}

        {filteredWorkers.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <Users size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ color: '#334155' }}>No Workers Found</h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Try changing the search filter or register a new worker.</p>
          </div>
        )}
      </div>

      {/* MODAL: Register Worker */}
      {isRegisterModalOpen && (
        <Modal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          title="Register Logistics Fleet Worker"
          subtitle="Onboard a certified driver and vehicle into the Member 5 logistics pool"
          footer={
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setIsRegisterModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleRegisterSubmit}>
                Complete Registration
              </Button>
            </div>
          }
        >
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Worker Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Arun Kumar"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Mobile Contact Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98421 12345"
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="driver@annam-agri.in"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Driving License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="TN38-20210045981"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Truck">Truck</option>
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Pickup Van">Pickup Van</option>
                  <option value="Tempo Traveller">Tempo Traveller</option>
                  <option value="Heavy Truck">Heavy Truck</option>
                  <option value="Medium Truck">Medium Truck</option>
                </select>
              </div>

              <div className="form-group">
                <label>Vehicle Registration Number *</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  placeholder="TN 38 AB 1234"
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Payload Capacity (KG) *</label>
                <input
                  type="number"
                  name="vehicleCapacity"
                  value={formData.vehicleCapacity}
                  onChange={handleInputChange}
                  placeholder="1000"
                  min="100"
                  step="50"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Initial Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Available">Available (Ready for Dispatch)</option>
                  <option value="On Route">On Route</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Assigned Depot Hub Base</label>
              <select
                name="baseHub"
                value={formData.baseHub}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="Coimbatore South Depot">Coimbatore South Depot</option>
                <option value="Erode Central Hub">Erode Central Hub</option>
                <option value="Salem Terminal Hub">Salem Terminal Hub</option>
                <option value="Tiruppur Agri Cluster">Tiruppur Agri Cluster</option>
                <option value="Pollachi Coconut Hub">Pollachi Coconut Hub</option>
                <option value="Trichy Wholesale Terminal">Trichy Wholesale Terminal</option>
              </select>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: Worker Details */}
      {selectedWorkerDetails && (
        <Modal
          isOpen={Boolean(selectedWorkerDetails)}
          onClose={() => setSelectedWorkerDetails(null)}
          title={`Fleet Profile: ${selectedWorkerDetails.name}`}
          subtitle={`Driver ID: ${selectedWorkerDetails.id}`}
          footer={
            <Button variant="secondary" onClick={() => setSelectedWorkerDetails(null)}>
              Close
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
              <div className="worker-avatar-large" style={{ width: '60px', height: '60px', fontSize: '1.3rem' }}>
                {selectedWorkerDetails.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>{selectedWorkerDetails.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{selectedWorkerDetails.phone} • {selectedWorkerDetails.email}</div>
                <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: '700', marginTop: '2px' }}>
                  Base: {selectedWorkerDetails.baseHub}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Vehicle Model & Plate</span>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{selectedWorkerDetails.vehicleType}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace' }}>{selectedWorkerDetails.vehicleNumber}</div>
              </div>

              <div style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Capacity & Rating</span>
                <div style={{ fontWeight: '800', color: '#15803d', fontSize: '1.05rem' }}>{selectedWorkerDetails.vehicleCapacity} KG</div>
                <div style={{ fontSize: '0.82rem', color: '#0f172a' }}>Rating: 4.9 ★ ({selectedWorkerDetails.completedTrips || 0} Trips)</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
