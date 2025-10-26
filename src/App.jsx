import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Delivery from "./pages/Delivery";
import ServiceProviders from "./pages/ServiceProviders";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatBox from "./pages/Complaint";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Logout handler function
  const handleLogout = async () => {// Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // If you're using cookies, clear them too
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Redirect to login page using navigate
    navigate("/");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-100">
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  onLogout={handleLogout}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />

                  <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/delivery" element={<Delivery />} />
                      <Route path="/providers" element={<ServiceProviders />} />
                      <Route path="/support" element={<ChatBox />} />
                      
                      {/* Default redirect to dashboard */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;