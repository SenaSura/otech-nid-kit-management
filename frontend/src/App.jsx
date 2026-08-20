import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const isAuthenticated = Boolean(localStorage.getItem("otech_user"));

  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      {/* Redirect unknown routes */}

      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>
  )
}