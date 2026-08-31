import mockOrders from "../data/mockOrders";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const USE_MOCKS =
  import.meta.env.VITE_USE_MOCKS === "true";

const STORAGE_KEY = "annam.orders";


/* ================================
   MOCK ORDER STORAGE
================================ */

const readMockOrders = () => {
  const storedOrders =
    localStorage.getItem(STORAGE_KEY);

  return storedOrders
    ? JSON.parse(storedOrders)
    : mockOrders;
};


const saveMockOrders = (orders) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(orders)
  );

  return orders;
};


/* ================================
   API REQUEST HELPER
================================ */

const request = async (
  path,
  options = {}
) => {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        ...options.headers
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status})`
    );
  }

  return response.json();
};


/* ================================
   GET ALL ORDERS
================================ */

export const getOrders = async () => {
  if (USE_MOCKS) {
    return readMockOrders();
  }

  return request("/orders/");
};


/* ================================
   GET ORDER BY ID
================================ */

export const getOrderById = async (
  orderId
) => {
  if (USE_MOCKS) {
    return (
      readMockOrders().find(
        (order) =>
          order.id === Number(orderId)
      ) || null
    );
  }

  return request(
    `/orders/${orderId}`
  );
};


/* ================================
   CREATE ORDER
================================ */

export const createOrder = async ({
  buyerId,
  productId,
  quantity
}) => {

  /*
    MOCK MODE
  */

  if (USE_MOCKS) {

    const newOrder = {
      id: Date.now(),

      buyer_id: buyerId,

      product_id: productId,

      quantity,

      status: "pending",

      created_at:
        new Date().toISOString()
    };

    const orders = [
      ...readMockOrders(),
      newOrder
    ];

    saveMockOrders(orders);

    return newOrder;
  }


  /*
    REAL BACKEND
  */

  return request(
    `/orders/?buyer_id=${buyerId}&product_id=${productId}&quantity=${quantity}`,
    {
      method: "POST"
    }
  );
};


/* ================================
   CANCEL ORDER
================================ */

export const cancelOrder = async (
  orderId
) => {

  if (USE_MOCKS) {

    const orders =
      readMockOrders().map(
        (order) =>
          order.id === orderId
            ? {
                ...order,
                status: "Cancelled"
              }
            : order
      );

    return saveMockOrders(
      orders
    ).find(
      (order) =>
        order.id === orderId
    );
  }

  return request(
    `/orders/${orderId}/cancel`,
    {
      method: "PUT"
    }
  );
};


/* ================================
   CREATE PAYMENT
================================ */

export const makePayment = async ({
  orderId,
  paymentMethod
}) => {

  if (USE_MOCKS) {

    const orders =
      readMockOrders().map(
        (order) =>
          order.id === orderId
            ? {
                ...order,
                paymentStatus: "Paid"
              }
            : order
      );

    saveMockOrders(orders);

    return {
      orderId,
      paymentMethod,
      paymentStatus: "Paid"
    };
  }


  /*
    Your FastAPI backend expects
    order_id and payment_method
    as query parameters.
  */

  return request(
    `/payments/?order_id=${orderId}&payment_method=${encodeURIComponent(
      paymentMethod
    )}`,
    {
      method: "POST"
    }
  );
};