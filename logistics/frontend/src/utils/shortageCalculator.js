/**
 * Shortage Calculation and Discrepancy Tracking
 * 
 * Formula: shortage = expectedQuantity - actualQuantity
 * If actual < expected => Shortage warning is triggered & logged.
 */

/**
 * Calculates shortage and status based on expected vs actual quantities.
 * @param {number} expectedQty - Expected pickup quantity in KG
 * @param {number} actualQty - Actual measured pickup quantity in KG
 * @returns {Object} Shortage calculation results
 */
export function calculateShortage(expectedQty, actualQty) {
  const expected = Math.max(0, Number(expectedQty) || 0);
  const actual = Math.max(0, Number(actualQty) || 0);
  
  const difference = expected - actual;
  const hasShortage = difference > 0;
  const isSurplus = difference < 0;
  const isExact = difference === 0;
  const shortagePercentage = expected > 0 ? ((difference / expected) * 100).toFixed(1) : 0;

  let status = 'Accurate';
  let severity = 'low';

  if (hasShortage) {
    status = 'Shortage Reported';
    severity = difference > 50 || Number(shortagePercentage) > 20 ? 'high' : 'medium';
  } else if (isSurplus) {
    status = 'Surplus Recorded';
    severity = 'info';
  }

  return {
    expected,
    actual,
    shortage: hasShortage ? difference : 0,
    difference,
    hasShortage,
    isSurplus,
    isExact,
    shortagePercentage: Number(shortagePercentage),
    status,
    severity,
    warningText: hasShortage
      ? `Shortage of ${difference} KG (${shortagePercentage}%) detected for this farmer pickup!`
      : isSurplus
      ? `Surplus of ${Math.abs(difference)} KG logged`
      : 'Full quantity collected accurately.'
  };
}

/**
 * Generates a structured shortage report record
 * @param {Object} params - { jobId, orderId, farmerName, location, expectedQuantity, actualQuantity, reportedBy, notes }
 * @returns {Object} Shortage record
 */
export function createShortageReport({
  jobId,
  orderId,
  farmerName,
  farmerLocation,
  product,
  expectedQuantity,
  actualQuantity,
  reportedBy = 'Logistics System',
  notes = ''
}) {
  const calc = calculateShortage(expectedQuantity, actualQuantity);
  const timestamp = new Date().toISOString();
  const id = `SR-${Math.floor(100 + Math.random() * 900)}`;

  return {
    reportId: id,
    jobId,
    orderId,
    farmer: farmerName,
    location: farmerLocation,
    product,
    expected: calc.expected,
    actual: calc.actual,
    shortage: calc.shortage,
    shortagePercentage: calc.shortagePercentage,
    date: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    rawDate: timestamp,
    status: 'Reported',
    severity: calc.severity,
    reportedBy,
    notes: notes || `Logged during farm-gate pickup verification. Short by ${calc.shortage} KG.`
  };
}
