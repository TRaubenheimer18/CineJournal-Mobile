// src/api/rentalApi.js
const EXPRESS_BASE_URL = "http://10.0.0.106:5001";

export const rentalApi = {
  checkout: async (items, userEmail) => {
    const payload = {
      userEmail,
      items: items.map((i) => ({
        id: i.movie.id,
        title: i.movie.title,
        poster_path: i.movie.poster_path,
        price: i.movie.price,
      })),
    };
    const res = await fetch(`${EXPRESS_BASE_URL}/rentals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Checkout failed: ${res.status}`);
    return res.json();
  },

  getRentals: async () => {
    const res = await fetch(`${EXPRESS_BASE_URL}/rentals`);
    if (!res.ok) throw new Error(`Failed to load rentals: ${res.status}`);
    return res.json();
  },
};