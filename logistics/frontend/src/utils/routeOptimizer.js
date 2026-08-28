/**
 * Smart Route Optimizer (Nearest-Valid-Stop Heuristic Algorithm)
 * 
 * Flow: Current Location -> Best Next Pickup Stop (evaluating distance & priority) -> ... -> Final Buyer Destination
 * Rule: Deterministic nearest-valid-stop algorithm without ML.
 */

// Geographic coordinate reference points for Tamil Nadu agricultural supply chain hubs
export const TN_GEO_COORDINATES = {
  'Coimbatore': { lat: 11.0168, lng: 76.9558, district: 'Coimbatore' },
  'Pollachi': { lat: 10.6609, lng: 77.0048, district: 'Coimbatore' },
  'Tiruppur': { lat: 11.1085, lng: 77.3411, district: 'Tiruppur' },
  'Palladam': { lat: 10.9996, lng: 77.2798, district: 'Tiruppur' },
  'Erode': { lat: 11.3410, lng: 77.7172, district: 'Erode' },
  'Bhavani': { lat: 11.4485, lng: 77.6833, district: 'Erode' },
  'Salem': { lat: 11.6643, lng: 78.1460, district: 'Salem' },
  'Namakkal': { lat: 11.2189, lng: 78.1674, district: 'Namakkal' },
  'Dharmapuri': { lat: 12.1211, lng: 78.1582, district: 'Dharmapuri' },
  'Madurai': { lat: 9.9252, lng: 78.1198, district: 'Madurai' },
  'Dindigul': { lat: 10.3673, lng: 77.9803, district: 'Dindigul' },
  'Trichy': { lat: 10.7905, lng: 78.7047, district: 'Trichy' },
  'Vellore': { lat: 12.9165, lng: 79.1325, district: 'Vellore' },
  'Kanchipuram': { lat: 12.8342, lng: 79.7036, district: 'Kanchipuram' },
  'Chennai': { lat: 13.0827, lng: 80.2707, district: 'Chennai' },
  'Chennai Koyambedu': { lat: 13.0694, lng: 80.1948, district: 'Chennai' }
};

/**
 * Calculates straight-line Haversine distance in KM between two coordinate pairs.
 */
export function getDistanceKm(coordA, coordB) {
  if (!coordA || !coordB) return 50; // Fallback sensible average

  const R = 6371; // Earth radius in KM
  const dLat = ((coordB.lat - coordA.lat) * Math.PI) / 180;
  const dLon = ((coordB.lng - coordA.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coordA.lat * Math.PI) / 180) *
      Math.cos((coordB.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1.25); // 1.25 factor for road detour factor
}

/**
 * Helper to resolve coordinates from location name or stop object
 */
export function resolveCoordinates(loc) {
  if (!loc) return TN_GEO_COORDINATES['Coimbatore'];
  if (typeof loc === 'object' && loc.lat && loc.lng) return loc;
  
  const locStr = String(loc).toLowerCase();
  for (const [key, coords] of Object.entries(TN_GEO_COORDINATES)) {
    if (locStr.includes(key.toLowerCase())) {
      return coords;
    }
  }
  return TN_GEO_COORDINATES['Coimbatore'];
}

/**
 * Priority weighting penalty (Higher priority gets lower score to be visited earlier)
 */
const PRIORITY_WEIGHTS = {
  'URGENT': 0.6,
  'HIGH': 0.75,
  'MEDIUM': 1.0,
  'NORMAL': 1.0,
  'LOW': 1.2
};

/**
 * Runs Nearest-Valid-Stop Heuristic optimization on a delivery job's pickup stops.
 * 
 * @param {Object} params
 * @param {string|Object} params.currentLocation - Starting origin (e.g. Worker depot or current GPS)
 * @param {Array} params.pickupStops - Array of farmer pickup stop objects
 * @param {string|Object} params.deliveryLocation - Final destination (e.g. Chennai Wholesale Hub)
 * @param {number} params.vehicleCapacity - Max vehicle capacity in KG
 * @returns {Object} Optimized route result with reordered stops, totalDistance, travelTime, and savings
 */
export function optimizeRoute({
  currentLocation = 'Coimbatore',
  pickupStops = [],
  deliveryLocation = 'Chennai Koyambedu',
  vehicleCapacity = 1000
}) {
  if (!pickupStops || pickupStops.length <= 1) {
    const defaultDist = calculateRouteTotalDistance(currentLocation, pickupStops, deliveryLocation);
    return {
      optimizedStops: pickupStops || [],
      originalStops: pickupStops || [],
      totalDistanceKm: defaultDist,
      estimatedTimeHrs: (defaultDist / 45).toFixed(1),
      distanceSavedKm: 0,
      timeSavedMins: 0,
      isOptimized: true,
      stopsSequence: pickupStops.map(s => s.farmerName || s.farmer || s.location)
    };
  }

  const originalStops = [...pickupStops];
  const originalDistance = calculateRouteTotalDistance(currentLocation, originalStops, deliveryLocation);

  const unvisited = [...pickupStops];
  const optimizedStops = [];
  let currentPos = resolveCoordinates(currentLocation);
  let currentLoad = 0;

  while (unvisited.length > 0) {
    let bestIndex = -1;
    let lowestScore = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const stop = unvisited[i];
      const stopCoords = resolveCoordinates(stop.location || stop.farmerLocation || stop.city);
      const dist = getDistanceKm(currentPos, stopCoords);
      const priority = (stop.priority || 'MEDIUM').toUpperCase();
      const pWeight = PRIORITY_WEIGHTS[priority] || 1.0;

      // Candidate stop score = distance * priority weighting
      const candidateScore = dist * pWeight;

      // Check capacity constraint
      const stopQuantity = Number(stop.expectedQuantity || stop.quantity || 0);
      const canFit = (currentLoad + stopQuantity) <= (vehicleCapacity * 1.1); // Allow 10% tolerance or mark as valid

      if (canFit && candidateScore < lowestScore) {
        lowestScore = candidateScore;
        bestIndex = i;
      }
    }

    // If no stop fits capacity strictly, pick the closest one
    if (bestIndex === -1) {
      bestIndex = 0;
    }

    const selectedStop = unvisited.splice(bestIndex, 1)[0];
    const selectedCoords = resolveCoordinates(selectedStop.location || selectedStop.farmerLocation || selectedStop.city);
    currentLoad += Number(selectedStop.expectedQuantity || selectedStop.quantity || 0);
    currentPos = selectedCoords;

    optimizedStops.push({
      ...selectedStop,
      stopOrder: optimizedStops.length + 1
    });
  }

  const optimizedDistance = calculateRouteTotalDistance(currentLocation, optimizedStops, deliveryLocation);
  const distanceSaved = Math.max(0, originalDistance - optimizedDistance);
  const timeSavedMins = Math.round((distanceSaved / 45) * 60);

  return {
    optimizedStops,
    originalStops,
    totalDistanceKm: optimizedDistance,
    originalDistanceKm: originalDistance,
    estimatedTimeHrs: (optimizedDistance / 45).toFixed(1),
    distanceSavedKm: distanceSaved,
    timeSavedMins,
    isOptimized: true,
    routeLegs: buildRouteLegs(currentLocation, optimizedStops, deliveryLocation),
    stopsSequence: [
      currentLocation,
      ...optimizedStops.map(s => s.farmerName || s.farmer || s.location),
      deliveryLocation
    ]
  };
}

/**
 * Calculates total route distance from origin -> all stops in order -> destination
 */
export function calculateRouteTotalDistance(origin, stops = [], destination) {
  let totalKm = 0;
  let curr = resolveCoordinates(origin);

  for (const stop of stops) {
    const next = resolveCoordinates(stop.location || stop.farmerLocation || stop.city);
    totalKm += getDistanceKm(curr, next);
    curr = next;
  }

  const dest = resolveCoordinates(destination);
  totalKm += getDistanceKm(curr, dest);

  return Math.round(totalKm);
}

/**
 * Builds formatted leg breakdown for visual route map
 */
function buildRouteLegs(origin, stops, destination) {
  const legs = [];
  let currName = typeof origin === 'string' ? origin : 'Origin Hub';
  let currCoord = resolveCoordinates(origin);

  stops.forEach((stop, idx) => {
    const nextName = stop.farmerName ? `${stop.farmerName} (${stop.location})` : stop.location;
    const nextCoord = resolveCoordinates(stop.location || stop.farmerLocation);
    const dist = getDistanceKm(currCoord, nextCoord);

    legs.push({
      from: currName,
      to: nextName,
      type: 'pickup',
      stopNumber: idx + 1,
      quantity: stop.expectedQuantity || stop.quantity,
      product: stop.product,
      distanceKm: dist,
      estMinutes: Math.round((dist / 45) * 60)
    });

    currName = nextName;
    currCoord = nextCoord;
  });

  const finalDestName = typeof destination === 'string' ? destination : 'Buyer Hub';
  const finalDestCoord = resolveCoordinates(destination);
  const finalDist = getDistanceKm(currCoord, finalDestCoord);

  legs.push({
    from: currName,
    to: finalDestName,
    type: 'dropoff',
    stopNumber: stops.length + 1,
    distanceKm: finalDist,
    estMinutes: Math.round((finalDist / 55) * 60)
  });

  return legs;
}
