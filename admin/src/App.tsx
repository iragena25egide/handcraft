import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import Orders from "./pages/Orders"
import Requests from "./pages/Requests"
import Users from "./pages/Users"
import Reports from "./pages/Reports"
import Notifications from "./pages/Notifications"
import Trash from "./pages/Trash"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected routes for authenticated Admin and Seller */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reports" element={<Reports />} />

            {/* SUPER_ADMIN restricted routes */}
            <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
              <Route path="/users" element={<Users />} />
              <Route path="/trash" element={<Trash />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all redirect to Dashboard / Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
