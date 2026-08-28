## ANNAM frontend

This Vite + React app contains the orders and payments module. It runs in mock mode by default, so the UI is usable before the FastAPI service or database is configured.

### Node.js setup

Install Node.js 20 or newer, then from this folder run:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173/orders`. Validate a production bundle with `npm run build`.

To use the Python API instead of browser mock data, copy `.env.example` to `.env`, set `VITE_USE_MOCKS=false`, and set `VITE_API_URL` to the API origin.

### Routes

- `/orders` lists orders and supports cancellation.
- `/orders/ORD1001` shows order details.
- `/payment/ORD1002` opens checkout.
- `/payment/success` and `/payment/failed` show payment outcomes.
