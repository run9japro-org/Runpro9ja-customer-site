import { useMemo } from "react";

export const ALLOWED_ROLES = new Set(["super_admin", "admin_head,admin_customer_service,admin_agent_service"]);

export function useAuth() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userJson = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userJson ? JSON.parse(userJson) : null;

  const isAuthenticated = !!token && !!user;
  const isAuthorized = !!user && ALLOWED_ROLES.has(user.role);
  return useMemo(() => ({ token, user, isAuthenticated, isAuthorized }), [token, user, isAuthenticated, isAuthorized]);
}
