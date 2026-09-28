const EXPRESS_BASE_URL = "http://localhost:5001";

export const profileApi = {
  getProfile: async (email, token) => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${EXPRESS_BASE_URL}/api/user/profile/${encodeURIComponent(email)}`, {
      method: "GET",
      headers: headers,
    });

    if (!res.ok) throw new Error(`Failed to load profile: ${res.status}`);
    return res.json();
  },

  returnRental: async (id, token) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${EXPRESS_BASE_URL}/api/rentals/return/${id}`, { 
      method: "PUT",
      headers: headers
    });
    if (!res.ok) throw new Error(`Failed to return rental: ${res.status}`);
    return res.json();
  },
};