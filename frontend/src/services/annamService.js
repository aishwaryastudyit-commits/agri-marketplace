import API_BASE_URL from "./api";

async function request(path, options = {}) {
  const token = localStorage.getItem("annam-access-token");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${response.status})`);
  }
  return response.json();
}

const query = (values) => new URLSearchParams(
  Object.entries(values).filter(([, value]) => value !== undefined && value !== null && value !== "")
).toString();

export const upsertBuyer = (buyer) => request(`/buyers/?${query({
  full_name: buyer.full_name,
  phone: buyer.phone,
  location: buyer.location,
  buyer_type: buyer.buyer_type,
})}`, { method: "POST" });

export const upsertFarmer = (farmer) => request("/farmers/", {
  method: "POST", body: JSON.stringify(farmer),
});

export const getFarmerProducts = (farmerId) => request(`/products/?farmer_id=${farmerId}`);
export const getFarmerUpcomingHarvests = (farmerId) => request(`/upcoming-harvests/?farmer_id=${farmerId}`);
export const createFarmerProduct = (product) => request("/products/", {
  method: "POST", body: JSON.stringify(product),
});
export const createFarmerUpcomingHarvest = (harvest) => request("/upcoming-harvests/", {
  method: "POST", body: JSON.stringify(harvest),
});
export const getUpcomingHarvests = () => request("/upcoming-harvests/");
export const reserveUpcomingHarvest = (harvestId, reservation) => request(`/upcoming-harvests/${harvestId}/reserve`, { method: "POST", body: JSON.stringify(reservation) });
export const getHarvestReservations = (buyerId) => request(`/upcoming-harvests/reservations/buyer/${buyerId}`);
export const publishFarmerHarvest = (harvestId, farmerId) => request(`/upcoming-harvests/${harvestId}/publish?${query({ farmer_id: farmerId })}`, { method: "POST" });
export const updateFarmer = (farmerId, farmer) => request(`/farmers/${farmerId}`, {
  method: "PATCH", body: JSON.stringify(farmer),
});
export const getFarmerOrders = (farmerId) => request(`/farmers/${farmerId}/orders`);
export const getFarmerWallet = (farmerId) => request(`/farmers/${farmerId}/wallet`);
export const getAllProducts = () => request("/products/");

export const getCart = (buyerId) => request(`/cart/${buyerId}`);
export const addCartItem = (buyerId, productId, quantity = 1) => request(`/cart/${buyerId}/items`, {
  method: "POST", body: JSON.stringify({ product_id: productId, quantity }),
});
export const updateCartItem = (buyerId, productId, quantity) => request(`/cart/${buyerId}/items/${productId}`, {
  method: "PATCH", body: JSON.stringify({ product_id: productId, quantity }),
});
export const removeCartItem = (buyerId, productId) => request(`/cart/${buyerId}/items/${productId}`, { method: "DELETE" });
export const clearCart = (buyerId) => request(`/cart/${buyerId}`, { method: "DELETE" });
export const checkoutCart = (buyerId) => request(`/cart/${buyerId}/checkout`, { method: "POST" });

export const getNotifications = (userId) => request(`/notifications/user/${userId}`);
export const markNotificationRead = (notificationId) => request(`/notifications/${notificationId}/read`, { method: "PATCH" });

export const createBulkOrder = (buyerId, items) => request("/bulk-orders/", {
  method: "POST", body: JSON.stringify({ buyer_id: buyerId, items }),
});
export const getBulkOrders = (buyerId) => request(`/bulk-orders/buyer/${buyerId}`);
export const createPayment = (orderId, paymentMethod = "UPI") => request(`/payments/?${query({ order_id: orderId, payment_method: paymentMethod })}`, { method: "POST" });
export const confirmPayment = (paymentId) => request(`/payments/${paymentId}/success`, { method: "PUT" });
export const getBuyerPayments = (buyerId) => request(`/payments/?buyer_id=${buyerId}`);
export const getBuyerDeliveries = (buyerId) => request(`/logistics/?buyer_id=${buyerId}`);
export const getDeliveries = () => request("/logistics/");
export const markFarmerReadyForPickup = (deliveryId, farmerId) => request(`/logistics/${deliveryId}/farmer-ready?${query({ farmer_id: farmerId })}`, { method: "POST" });
export const updateDeliveryLocation = (deliveryId, currentLocation, route) => request(`/logistics/${deliveryId}/location?${query({ current_location: currentLocation, route })}`, { method: "PUT" });
export const assignDelivery = (deliveryId, assignedDriver, route) => request(`/logistics/${deliveryId}/assign?${query({ assigned_driver: assignedDriver, route })}`, { method: "PUT" });
export const updateDeliveryStatus = (deliveryId, status) => request(`/logistics/${deliveryId}/status?${query({ delivery_status: status })}`, { method: "PUT" });
export const getLogisticsWorkers = () => request("/logistics/workers");
export const registerLogisticsWorker = (worker) => request("/logistics/workers", { method: "POST", body: JSON.stringify(worker) });
export const startWorkerSession = async ({ full_name, phone }) => {
  // The current OTP screen is a demo flow.  Its verified phone is used to
  // create/sign in to the corresponding worker account so dispatch requests
  // remain authenticated instead of being public.
  const password = `annam-worker-${phone}`;
  const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name, phone, password, role: "worker" }),
  });
  if (!registerResponse.ok && registerResponse.status !== 400) {
    const body = await registerResponse.json().catch(() => ({}));
    throw new Error(body.detail || "Could not create the worker account");
  }
  const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });
  if (!loginResponse.ok) {
    const body = await loginResponse.json().catch(() => ({}));
    throw new Error(body.detail || "Could not sign in to the worker account");
  }
  const session = await loginResponse.json();
  localStorage.setItem("annam-access-token", session.access_token);
  return session.user;
};
export const dispatchDelivery = (deliveryId, workerId, vehicleId) => request(`/logistics/${deliveryId}/dispatch`, { method: "POST", body: JSON.stringify({ worker_id: workerId, vehicle_id: vehicleId }) });
export const planDeliveryRoute = (deliveryId, stops) => request(`/logistics/${deliveryId}/route`, { method: "POST", body: JSON.stringify(stops) });
export const transitionDelivery = (deliveryId, status) => request(`/logistics/${deliveryId}/transition/${status}`, { method: "POST" });
export const sendDriverGps = (deliveryId, latitude, longitude) => request(`/logistics/${deliveryId}/gps`, { method: "POST", body: JSON.stringify({ latitude, longitude, recorded_at: new Date().toISOString() }) });

export { request };
