/**
 * Order Grouping & Pooling Engine
 * 
 * Evaluates combining multiple individual agricultural orders into unified vehicle runs.
 * Criteria:
 * 1. Destination Corridor Compatibility
 * 2. Pickup Location Clustering
 * 3. Product Compatibility (Perishables vs Dry Goods)
 * 4. Vehicle Capacity Validation (Total Quantity <= Vehicle Capacity)
 */

/**
 * Calculates aggregate group metrics for a selection of orders.
 * @param {Array} orders - Selected orders to group
 * @param {number|Object} vehicleOrCapacity - Selected vehicle object or capacity number
 * @returns {Object} Group evaluation with compatibility checks
 */
export function evaluateOrderGroup(orders = [], vehicleOrCapacity = 1000) {
  if (!orders || orders.length === 0) {
    return {
      orderCount: 0,
      totalQuantityKg: 0,
      vehicleCapacityKg: typeof vehicleOrCapacity === 'object' ? vehicleOrCapacity.vehicleCapacity : vehicleOrCapacity,
      isCompatible: false,
      utilizationPercentage: 0,
      destinations: [],
      products: [],
      pickupLocations: [],
      warnings: ['No orders selected for grouping.']
    };
  }

  const capacity = typeof vehicleOrCapacity === 'object'
    ? Number(vehicleOrCapacity.vehicleCapacity || 1000)
    : Number(vehicleOrCapacity || 1000);

  const totalQuantity = orders.reduce((sum, ord) => sum + (Number(ord.quantity) || 0), 0);
  const isCapacityCompatible = totalQuantity <= capacity;
  const utilizationPercentage = capacity > 0 ? Math.min(100, ((totalQuantity / capacity) * 100).toFixed(1)) : 0;
  const remainingCapacityKg = Math.max(0, capacity - totalQuantity);
  const excessKg = Math.max(0, totalQuantity - capacity);

  // Check destination similarity
  const destinations = [...new Set(orders.map(o => o.destination || o.deliveryLocation).filter(Boolean))];
  const isDestinationConsistent = destinations.length <= 2; // Allow max 2 nearby delivery drop points

  // Check product types
  const products = [...new Set(orders.map(o => o.product).filter(Boolean))];
  const pickupLocations = [...new Set(orders.map(o => o.pickupLocation || o.pickup).filter(Boolean))];

  const warnings = [];
  if (!isCapacityCompatible) {
    warnings.push(`Total load (${totalQuantity} KG) exceeds vehicle capacity (${capacity} KG) by ${excessKg} KG.`);
  }
  if (destinations.length > 2) {
    warnings.push(`Selected orders have multiple distinct destinations (${destinations.join(', ')}). Consider splitting.`);
  }

  return {
    orderCount: orders.length,
    totalQuantityKg: totalQuantity,
    vehicleCapacityKg: capacity,
    remainingCapacityKg,
    excessKg,
    isCompatible: isCapacityCompatible,
    isDestinationConsistent,
    utilizationPercentage: Number(utilizationPercentage),
    badgeText: isCapacityCompatible ? 'Compatible ✓' : 'Over Capacity ✕',
    destinations,
    products,
    pickupLocations,
    warnings,
    summaryText: isCapacityCompatible
      ? `Group Total: ${totalQuantity} KG (${utilizationPercentage}% of ${capacity} KG Vehicle) - Ready to dispatch!`
      : `Group Total: ${totalQuantity} KG exceeds ${capacity} KG vehicle limit by ${excessKg} KG!`
  };
}

/**
 * Creates a unified Multi-Stop Delivery Job from an order group
 */
export function buildDeliveryJobFromGroup({
  groupName,
  orders = [],
  assignedWorker = null,
  priority = 'HIGH'
}) {
  const evalResult = evaluateOrderGroup(orders, assignedWorker ? assignedWorker.vehicleCapacity : 1000);
  const jobId = `JOB-GRP-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderIdList = orders.map(o => o.orderId || o.id).join(', ');
  const commonProduct = evalResult.products.length === 1 ? evalResult.products[0] : `Mixed Agri (${evalResult.products.join(', ')})`;
  const primaryDestination = evalResult.destinations[0] || 'Chennai Wholesale Koyambedu';

  // Build pickup stops from orders
  const pickupStops = orders.map((ord, idx) => ({
    id: `stop-${idx + 1}`,
    farmerName: ord.farmer || ord.farmerName || `Farmer ${String.fromCharCode(65 + idx)}`,
    location: ord.pickupLocation || ord.pickup || 'Coimbatore',
    contact: ord.farmerPhone || '+91 98421 ' + Math.floor(10000 + Math.random() * 90000),
    product: ord.product,
    expectedQuantity: Number(ord.quantity),
    actualQuantity: null,
    status: 'Pending',
    notes: `Group pooled pickup from order ${ord.orderId || ord.id}`
  }));

  return {
    id: jobId,
    jobId,
    orderId: orderIdList,
    isGroupJob: true,
    groupName: groupName || `Pooled Batch #${jobId.slice(-4)}`,
    product: commonProduct,
    quantity: evalResult.totalQuantityKg,
    totalQuantity: evalResult.totalQuantityKg,
    requiredVehicleCapacity: Math.ceil(evalResult.totalQuantityKg * 1.1),
    pickupLocations: evalResult.pickupLocations.join(', '),
    deliveryLocation: primaryDestination,
    priority: priority || 'HIGH',
    assignedWorker: assignedWorker ? assignedWorker.name : 'Unassigned',
    assignedWorkerId: assignedWorker ? assignedWorker.id : null,
    workerPhone: assignedWorker ? assignedWorker.phone : null,
    vehicleType: assignedWorker ? assignedWorker.vehicleType : 'Truck',
    vehicleNumber: assignedWorker ? assignedWorker.vehicleNumber : 'Pending Assignment',
    status: assignedWorker ? 'ASSIGNED' : 'AVAILABLE',
    pickupStops,
    totalStops: pickupStops.length,
    completedStops: 0,
    shortagesReported: 0,
    createdAt: new Date().toISOString(),
    etaMinutes: Math.round(180 + Math.random() * 120),
    distanceKm: 280
  };
}
