const AI_BASE_URL = import.meta.env.VITE_AI_ENGINE_URL || "http://127.0.0.1:8001";

async function aiRequest(path, options = {}) {
  const response = await fetch(`${AI_BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) throw new Error("AI insights are temporarily unavailable");
  return response.json();
}

export const getTrendingProducts = (location) => aiRequest(
  `/forecast/top/${encodeURIComponent(location || "Coimbatore")}?top_n=3`
);

export const getBulkSupplyMatch = (product, location, quantity) => aiRequest("/match", {
  method: "POST",
  body: JSON.stringify({ product, location, required_qty_kg: Number(quantity) }),
});

export const getAiSummary = (product, location, quantity = 1000) => aiRequest("/summary", {
  method: "POST",
  body: JSON.stringify({
    product,
    location: location || "Coimbatore",
    required_qty_kg: Number(quantity),
  }),
});
