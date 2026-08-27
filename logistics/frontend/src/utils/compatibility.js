/**
 * Worker and Vehicle Compatibility Engine
 * 
 * Rule: Vehicle Capacity >= Required Delivery Quantity
 * Only compatible workers are eligible for job assignment.
 */

/**
 * Checks if a worker's vehicle capacity can satisfy the required delivery quantity.
 * @param {Object} worker - Worker object with vehicleCapacity (in KG)
 * @param {number|Object} jobOrQuantity - Job object with quantity or numeric quantity in KG
 * @returns {Object} Compatibility result with isCompatible, diffKg, and message
 */
export function checkWorkerCompatibility(worker, jobOrQuantity) {
  if (!worker) {
    return {
      isCompatible: false,
      reason: 'No worker selected',
      diffKg: 0,
      badgeText: '✕ Incompatible'
    };
  }

  const capacity = Number(worker.vehicleCapacity || 0);
  const requiredQty = typeof jobOrQuantity === 'object' && jobOrQuantity !== null
    ? Number(jobOrQuantity.quantity || jobOrQuantity.totalQuantity || 0)
    : Number(jobOrQuantity || 0);

  const diffKg = capacity - requiredQty;
  const isCompatible = capacity >= requiredQty && capacity > 0 && requiredQty > 0;

  return {
    isCompatible,
    workerCapacity: capacity,
    requiredQuantity: requiredQty,
    diffKg,
    badgeText: isCompatible ? 'Compatible ✓' : 'Not Compatible ✕',
    message: isCompatible
      ? `Vehicle Capacity (${capacity} KG) is sufficient for ${requiredQty} KG (${diffKg} KG spare capacity)`
      : `Vehicle Capacity (${capacity} KG) is lower than required ${requiredQty} KG (Short by ${Math.abs(diffKg)} KG)`
  };
}

/**
 * Filters the list of available workers and separates them into compatible and incompatible lists.
 * @param {Array} workers - List of workers
 * @param {number|Object} jobOrQuantity - Job or required quantity
 * @returns {{ compatible: Array, incompatible: Array }}
 */
export function filterCompatibleWorkers(workers = [], jobOrQuantity) {
  const compatible = [];
  const incompatible = [];

  workers.forEach(worker => {
    const comp = checkWorkerCompatibility(worker, jobOrQuantity);
    const enrichedWorker = { ...worker, compatibility: comp };
    if (comp.isCompatible) {
      compatible.push(enrichedWorker);
    } else {
      incompatible.push(enrichedWorker);
    }
  });

  return { compatible, incompatible };
}
