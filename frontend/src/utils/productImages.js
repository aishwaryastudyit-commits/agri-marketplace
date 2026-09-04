const images = {
  rice: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=85",
  basmati: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=85",
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=85",
  tomato: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1200&q=85",
  carrot: "https://images.unsplash.com/photo-1447175008436-1701707536e0?auto=format&fit=crop&w=1200&q=85",
  onion: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=1200&q=85",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=85",
  mango: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=85",
  banana: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=1200&q=85",
  default: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
};

export const productImageFor = (productName = "") => {
  const name = productName.toLowerCase();
  const key = Object.keys(images).find((candidate) => candidate !== "default" && name.includes(candidate));
  return images[key || "default"];
};
