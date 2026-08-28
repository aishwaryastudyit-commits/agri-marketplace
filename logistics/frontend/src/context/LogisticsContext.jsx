import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_WORKERS,
  INITIAL_JOBS,
  INITIAL_POOL_ORDERS,
  INITIAL_SHORTAGES,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';
import { checkWorkerCompatibility } from '../utils/compatibility';
import { calculateShortage, createShortageReport } from '../utils/shortageCalculator';
import { optimizeRoute } from '../utils/routeOptimizer';
import { buildDeliveryJobFromGroup } from '../utils/orderGrouper';

const LogisticsContext = createContext(null);

export function LogisticsProvider({ children }) {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [workers, setWorkers] = useState(INITIAL_WORKERS);
  const [shortages, setShortages] = useState(INITIAL_SHORTAGES);
  const [poolOrders, setPoolOrders] = useState(INITIAL_POOL_ORDERS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeJobModal, setActiveJobModal] = useState(null);
  const [activeWorkerModal, setActiveWorkerModal] = useState(null);
  const [isRegisterWorkerOpen, setIsRegisterWorkerOpen] = useState(false);
  const [activeDriverJobId, setActiveDriverJobId] = useState('JOB-1024');

  // Stats calculation
  const stats = {
    activeDeliveries: jobs.filter(j => ['GOING TO PICKUP', 'PICKING UP', 'PICKED UP', 'OUT FOR DELIVERY'].includes(j.status)).length,
    availableJobs: jobs.filter(j => j.status === 'AVAILABLE').length,
    inProgress: jobs.filter(j => ['GOING TO PICKUP', 'PICKING UP', 'PICKED UP'].includes(j.status)).length,
    deliveredToday: jobs.filter(j => j.status === 'DELIVERED').length + 18, // plus base daily count
    totalWorkers: workers.length,
    availableWorkers: workers.filter(w => w.availability === 'Available').length,
    totalShortages: shortages.length,
    unreadNotifications: notifications.filter(n => !n.read).length
  };

  /**
   * Assign a worker to a job with capacity compatibility check
   */
  const assignWorkerToJob = (jobId, workerId) => {
    const targetJob = jobs.find(j => j.id === jobId || j.jobId === jobId);
    const targetWorker = workers.find(w => w.id === workerId);

    if (!targetJob || !targetWorker) return { success: false, message: 'Job or worker not found' };

    const comp = checkWorkerCompatibility(targetWorker, targetJob);
    if (!comp.isCompatible) {
      return { success: false, message: comp.message };
    }

    // Update job
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId || job.jobId === jobId) {
        return {
          ...job,
          assignedWorker: targetWorker.name,
          assignedWorkerId: targetWorker.id,
          workerPhone: targetWorker.phone,
          vehicleType: targetWorker.vehicleType,
          vehicleNumber: targetWorker.vehicleNumber,
          status: 'ASSIGNED'
        };
      }
      return job;
    }));

    // Update worker status
    setWorkers(prevWorkers => prevWorkers.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          availability: 'On Route',
          currentStatus: `Assigned to ${targetJob.jobId}`,
          activeDelivery: targetJob.jobId
        };
      }
      return w;
    }));

    // Add notification
    addNotification({
      title: 'Worker Assigned',
      message: `${targetWorker.name} (${targetWorker.vehicleNumber}) assigned to ${targetJob.jobId}.`,
      type: 'success',
      jobId: targetJob.jobId
    });

    return { success: true, message: 'Worker successfully assigned.' };
  };

  /**
   * Update Job Status through workflow
   * AVAILABLE -> ASSIGNED -> GOING TO PICKUP -> PICKING UP -> PICKED UP -> OUT FOR DELIVERY -> DELIVERED
   * Or ASSIGNED -> CANCELLED -> AVAILABLE
   */
  const updateJobStatus = (jobId, newStatus) => {
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId || job.jobId === jobId) {
        let updatedJob = { ...job, status: newStatus };

        // Handle cancellation
        if (newStatus === 'CANCELLED') {
          // Free up assigned worker if any
          if (job.assignedWorkerId) {
            setWorkers(prevWorkers => prevWorkers.map(w => {
              if (w.id === job.assignedWorkerId) {
                return {
                  ...w,
                  availability: 'Available',
                  currentStatus: 'Ready for Dispatch',
                  activeDelivery: null
                };
              }
              return w;
            }));
          }
          updatedJob.assignedWorker = 'Unassigned';
          updatedJob.assignedWorkerId = null;
          updatedJob.status = 'CANCELLED';
        }

        // If delivered, mark worker available
        if (newStatus === 'DELIVERED' && job.assignedWorkerId) {
          setWorkers(prevWorkers => prevWorkers.map(w => {
            if (w.id === job.assignedWorkerId) {
              return {
                ...w,
                availability: 'Available',
                currentStatus: 'Trip Completed (At Destination Hub)',
                activeDelivery: null,
                completedTrips: (w.completedTrips || 0) + 1
              };
            }
            return w;
          }));
        }

        return updatedJob;
      }
      return job;
    }));

    addNotification({
      title: 'Status Updated',
      message: `Job ${jobId} status transitioned to ${newStatus}.`,
      type: newStatus === 'DELIVERED' ? 'success' : newStatus === 'CANCELLED' ? 'warning' : 'info',
      jobId
    });
  };

  /**
   * Update specific pickup stop details and compute shortage
   */
  const updatePickupStop = (jobId, stopId, { actualQuantity, status, notes }) => {
    let recordedShortage = null;

    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId || job.jobId === jobId) {
        const updatedStops = (job.pickupStops || []).map(stop => {
          if (stop.id === stopId) {
            const actual = actualQuantity !== undefined && actualQuantity !== null ? Number(actualQuantity) : stop.actualQuantity;
            const expected = Number(stop.expectedQuantity || 0);
            const calc = calculateShortage(expected, actual !== null ? actual : expected);

            if (calc.hasShortage && actual !== null) {
              recordedShortage = createShortageReport({
                jobId: job.jobId,
                orderId: job.orderId,
                farmerName: stop.farmerName,
                farmerLocation: stop.location,
                product: stop.product || job.product,
                expectedQuantity: expected,
                actualQuantity: actual,
                notes: notes || `Farm-gate shortage logged for ${stop.farmerName}`
              });
            }

            return {
              ...stop,
              actualQuantity: actual,
              shortage: calc.shortage,
              status: status || stop.status,
              notes: notes || stop.notes
            };
          }
          return stop;
        });

        const completedCount = updatedStops.filter(s => s.status === 'Completed').length;
        const allCompleted = completedCount === updatedStops.length;

        return {
          ...job,
          pickupStops: updatedStops,
          completedStops: completedCount,
          status: allCompleted ? 'PICKED UP' : job.status
        };
      }
      return job;
    }));

    if (recordedShortage) {
      setShortages(prev => [recordedShortage, ...prev]);
      addNotification({
        title: 'Shortage Warning',
        message: `Shortage of ${recordedShortage.shortage} KG reported at ${recordedShortage.farmer} (${recordedShortage.location})`,
        type: 'warning',
        jobId
      });
    }
  };

  /**
   * Register a new worker
   */
  const registerWorker = (workerData) => {
    const newId = `WRK-${Math.floor(108 + Math.random() * 890)}`;
    const newWorker = {
      id: newId,
      name: workerData.name,
      phone: workerData.phone,
      email: workerData.email || `${workerData.name.toLowerCase().replace(/\s+/g, '.')}@annam-agri.in`,
      licenseNumber: workerData.licenseNumber,
      vehicleType: workerData.vehicleType || 'Truck',
      vehicleNumber: workerData.vehicleNumber,
      vehicleCapacity: Number(workerData.vehicleCapacity) || 1000,
      availability: workerData.availability || 'Available',
      currentStatus: 'Ready for Dispatch',
      activeDelivery: null,
      rating: 5.0,
      completedTrips: 0,
      baseHub: workerData.baseHub || 'Coimbatore South Depot'
    };

    setWorkers(prev => [newWorker, ...prev]);
    addNotification({
      title: 'New Worker Registered',
      message: `${newWorker.name} registered with ${newWorker.vehicleType} (${newWorker.vehicleCapacity} KG capacity).`,
      type: 'success'
    });

    return newWorker;
  };

  /**
   * Run smart route optimization on a job
   */
  const optimizeJobRoute = (jobId) => {
    let optResult = null;

    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId || job.jobId === jobId) {
        optResult = optimizeRoute({
          currentLocation: job.currentLocation || 'Coimbatore Depot',
          pickupStops: job.pickupStops || [],
          deliveryLocation: job.deliveryLocation || 'Chennai Wholesale Koyambedu',
          vehicleCapacity: job.requiredVehicleCapacity || 1000
        });

        return {
          ...job,
          pickupStops: optResult.optimizedStops,
          distanceKm: optResult.totalDistanceKm,
          etaMinutes: Math.round(optResult.estimatedTimeHrs * 60),
          isRouteOptimized: true,
          distanceSavedKm: optResult.distanceSavedKm
        };
      }
      return job;
    }));

    if (optResult && optResult.distanceSavedKm > 0) {
      addNotification({
        title: 'Route Optimized',
        message: `Nearest-valid-stop algorithm reordered stops on ${jobId}, saving ${optResult.distanceSavedKm} KM!`,
        type: 'success',
        jobId
      });
    }

    return optResult;
  };

  /**
   * Group selected pool orders into a unified Delivery Job
   */
  const createOrderGroupBatch = ({ groupName, orderIds, assignedWorkerId, priority = 'HIGH' }) => {
    const selectedOrders = poolOrders.filter(o => orderIds.includes(o.id || o.orderId));
    if (selectedOrders.length === 0) return { success: false, message: 'No orders selected' };

    const worker = workers.find(w => w.id === assignedWorkerId);
    const newGroupJob = buildDeliveryJobFromGroup({
      groupName,
      orders: selectedOrders,
      assignedWorker: worker,
      priority
    });

    // Add to jobs
    setJobs(prev => [newGroupJob, ...prev]);

    // Remove pooled orders from available pool
    setPoolOrders(prev => prev.filter(o => !orderIds.includes(o.id || o.orderId)));

    // If worker assigned, update worker status
    if (worker) {
      setWorkers(prev => prev.map(w => {
        if (w.id === worker.id) {
          return {
            ...w,
            availability: 'On Route',
            currentStatus: `Assigned to Pooled Group ${newGroupJob.jobId}`,
            activeDelivery: newGroupJob.jobId
          };
        }
        return w;
      }));
    }

    addNotification({
      title: 'Order Group Created',
      message: `Group job ${newGroupJob.jobId} created with ${selectedOrders.length} pooled orders (${newGroupJob.quantity} KG total).`,
      type: 'success',
      jobId: newGroupJob.jobId
    });

    return { success: true, job: newGroupJob };
  };

  /**
   * Notification helpers
   */
  const addNotification = ({ title, message, type = 'info', jobId = null }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      jobId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <LogisticsContext.Provider
      value={{
        jobs,
        workers,
        shortages,
        poolOrders,
        notifications,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        stats,
        activeJobModal,
        setActiveJobModal,
        activeWorkerModal,
        setActiveWorkerModal,
        isRegisterWorkerOpen,
        setIsRegisterWorkerOpen,
        activeDriverJobId,
        setActiveDriverJobId,
        assignWorkerToJob,
        updateJobStatus,
        updatePickupStop,
        registerWorker,
        optimizeJobRoute,
        createOrderGroupBatch,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
}

export function useLogistics() {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
}
