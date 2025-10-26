import { useMemo } from "react";

// ❌ WRONG - this creates a Set with ONE string
// export const ALLOWED_ROLES = new Set(["super_admin", "admin_head,admin_customer_service,admin_agent_service"]);

// ✅ CORRECT - separate array elements
export const ALLOWED_ROLES = new Set([
  "super_admin", 
  "admin_head",
  "admin_customer_service", 
  "admin_agent_service"
]);

export function useAuth() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userJson = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userJson ? JSON.parse(userJson) : null;

  const isAuthenticated = !!token && !!user;
  const isAuthorized = !!user && ALLOWED_ROLES.has(user.role);
  
  console.log("🔐 Auth state:", { 
    token: !!token, 
    user: user?.role, 
    isAuthenticated, 
    isAuthorized,
    allowedRoles: Array.from(ALLOWED_ROLES)
  });
  
  return useMemo(() => ({ token, user, isAuthenticated, isAuthorized }), [token, user, isAuthenticated, isAuthorized]);
}