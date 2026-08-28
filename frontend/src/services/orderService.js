import mockOrders from "../data/mockOrders";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";
const STORAGE_KEY = "annam.orders";

const readMockOrders = () => {
  const storedOrders = localStorage.getItem(STORAGE_KEY);
  return storedOrders ? JSON.parse(storedOrders) : mockOrders;
};

const saveMockOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  return orders;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers }
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
};

export const getOrders = async () => {
  if (USE_MOCKS) return readMockOrders();
  return request("/orders");
};

export const getOrderById = async (orderId) => {
  if (USE_MOCKS) return readMockOrders().find((order) => order.id === orderId) || null;
  return request(`/orders/${orderId}`);
};

export const cancelOrder = async (orderId) => {
  if (USE_MOCKS) {
    const orders = readMockOrders().map((order) =>
      order.id === orderId ? { ...order, status: "Cancelled" } : order
    );
    return saveMockOrders(orders).find((order) => order.id === orderId);
  }
  return request(`/orders/${orderId}/cancel`, { method: "PUT" });
};

export const makePayment = async ({ orderId, paymentMethod }) => {
  if (USE_MOCKS) {
    const orders = readMockOrders().map((order) =>
      order.id === orderId ? { ...order, paymentStatus: "Paid" } : order
    );
    saveMockOrders(orders);
    return { orderId, paymentMethod, paymentStatus: "Paid" };
  }
  return request("/payments", {
    method: "POST",
    body: JSON.stringify({ order_id: orderId, payment_method: paymentMethod })
  });
};