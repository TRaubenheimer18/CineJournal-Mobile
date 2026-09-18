const EXPRESS_BASE_URL = "http://10.0.0.106:5001"; // same IP you used for rentalApi

async function request(path, options) {
  const res = await fetch(`${EXPRESS_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data;
}

export const authApi = {
  login: (email, password) =>
    request("/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  register: (email, username, password) =>
    request("/register", { method: "POST", body: JSON.stringify({ email, username, password }) }),
};