const EXPRESS_BASE_URL = "http://10.0.0.106:5001"; // same IP as authApi/rentalApi

export const profileApi = {
  getProfile: async (email) => {
    const res = await fetch(`${EXPRESS_BASE_URL}/api/user/profile/${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error(`Failed to load profile: ${res.status}`);
    return res.json();
  },

  returnRental: async (id) => {
    const res = await fetch(`${EXPRESS_BASE_URL}/api/rentals/return/${id}`, { method: "PUT" });
    if (!res.ok) throw new Error(`Failed to return rental: ${res.status}`);
    return res.json();
  },
};