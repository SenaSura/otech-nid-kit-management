import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/"
        element={<Dashboard />}
      />

      {/* Redirect unknown routes */}

      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>
  )
}