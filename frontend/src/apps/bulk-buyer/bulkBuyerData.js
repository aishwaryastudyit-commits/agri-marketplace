const REQUIREMENTS_KEY = "annam-bulk-requirements";
const ORDERS_KEY = "annam-bulk-orders";
const PAYMENTS_KEY = "annam-bulk-payments";
const CART_KEY = "annam-bulk-cart";

const readList = (key, fallback = []) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
};

const writeList = (key, items) => localStorage.setItem(key, JSON.stringify(items));

export const getRequirements = () => readList(REQUIREMENTS_KEY);
export const getOrders = () => readList(ORDERS_KEY);
export const getPayments = () => readList(PAYMENTS_KEY);
export const getCart = (buyerId) => readList(`${CART_KEY}-${buyerId}`);
export const saveCart = (buyerId, items) => writeList(`${CART_KEY}-${buyerId}`, items);

export const saveRequirement = (requirement) => {
  const item = {
    ...requirement,
    id: requirement.id || `REQ-${Date.now()}`,
    status: requirement.status || "Confirmed",
    createdAt: requirement.createdAt || new Date().toISOString(),
  };
  writeList(REQUIREMENTS_KEY, [item, ...getRequirements()]);
  return item;
};

export const saveOrder = (order) => {
  const item = {
    ...order,
    id: order.id || `ORD-${Date.now()}`,
    status: order.status || "Payment Pending",
    createdAt: order.createdAt || new Date().toISOString(),
  };
  writeList(ORDERS_KEY, [item, ...getOrders()]);
  return item;
};

export const savePayment = (payment) => {
  const item = {
    ...payment,
    id: payment.id || `PAY-${Date.now()}`,
    status: payment.status || "Successful",
    date: payment.date || new Date().toLocaleDateString("en-IN"),
  };
  writeList(PAYMENTS_KEY, [item, ...getPayments()]);
  return item;
};

export const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;
