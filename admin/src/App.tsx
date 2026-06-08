import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import Orders from "./pages/Orders"
import Users from "./pages/Users"
import Reports from "./pages/Reports"
import Trash from "./pages/Trash"
import Login from "./pages/Login"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/trash" element={<Trash />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
