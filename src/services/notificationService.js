// src/services/notificationService.js
import axios from "axios";

const API_BASE = "https://runpro9ja-pxqoa.ondigitalocean.app/api/notifications";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchNotifications = async () => {
  const res = await axios.get(`${API_BASE}?limit=10`, getAuthHeaders());
  return res.data.notifications;
};

export const markAsRead = async (id) => {
  await axios.patch(`${API_BASE}/${id}/read`, {}, getAuthHeaders());
};

export const markAllAsRead = async () => {
  await axios.patch(`${API_BASE}/read-all`, {}, getAuthHeaders());
};

export const getUnreadCount = async () => {
  const res = await axios.get(`${API_BASE}/unread-count`, getAuthHeaders());
  return res.data.unreadCount;
};
