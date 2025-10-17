import React, { useEffect, useState } from "react";
import { Lock, Mail, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginAdmin } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { isAuthenticated, isAuthorized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in and authorized, go to dashboard
  

  // If redirected back with state.error, show it
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(identifier, password);
      // Expecting { token, user }
      const { token, user } = data;

      if (!user || !token) {
        setError("Invalid response from server.");
        setLoading(false);
        return;
      }

      // Only allow SUPER_ADMIN or ADMIN_HEAD
      if (!["super_admin", "admin_head"].includes(user.role)) {
        setError("Access denied: You are not authorized to use this portal.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel (hidden on small screens) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white items-center justify-center p-10">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-white rounded-xl flex items-center justify-center text-emerald-700 font-bold text-2xl">R</div>
          <h1 className="text-3xl font-bold">RunPro Admin Portal</h1>
          <p className="max-w-xs text-emerald-100">
            Manage services, deliveries, providers and payments — all from a single dashboard.
          </p>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative">
          <h2 className="text-2xl font-semibold text-emerald-700 text-center mb-2">Welcome back</h2>
          <p className="text-center text-sm text-gray-500 mb-6">Sign in to your admin account</p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  type="email"
                  placeholder="your.email@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-emerald-600" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-emerald-600 hover:underline text-sm">Forgot?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} RunPro Admin
          </p>

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
              <div className="bg-white p-3 rounded-full shadow">
                <Loader2 className="animate-spin text-emerald-600" size={28} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
