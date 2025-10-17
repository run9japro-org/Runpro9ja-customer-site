import axios from "axios";

export const API_BASE = "https://runpro9ja-pxqoa.ondigitalocean.app"; // change if needed

export const loginAdmin = async (identifier, password) => {
  const res = await axios.post(`${API_BASE}/api/auth/login`, { identifier, password });
  return res.data; // expecting { token, user }
};

// Optional: verify token server-side (recommended for real apps)
export const verifyToken = async (token) => {
  const res = await axios.get(`${API_BASE}/api/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // whatever your backend returns
};
