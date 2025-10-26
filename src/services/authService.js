import axios from "axios";

export const API_BASE = "https://runpro9ja-pxqoa.ondigitalocean.app"; // change if needed

// services/authService.js
export const loginAdmin = async (identifier, password) => {
  try {
    console.log("🔐 Sending login request with:", { identifier, password });
    
    const response = await fetch("https://runpro9ja-pxqoa.ondigitalocean.app/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: identifier.trim(),
        password: password.trim()
      }),
    });

    console.log("📥 Response status:", response.status);
    
    const data = await response.json();
    console.log("📥 Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("❌ Auth service error:", error);
    throw error;
  }
};
// Optional: verify token server-side (recommended for real apps)
export const verifyToken = async (token) => {
  const res = await axios.get(`${API_BASE}/api/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // whatever your backend returns
};
