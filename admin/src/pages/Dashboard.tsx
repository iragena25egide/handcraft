import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { io } from "socket.io-client"
import { toast } from "sonner"

export default function Dashboard() {
  const [role, setRole] = useState<string>("")
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userData = localStorage.getItem("admin_user")
        let currentRole = "SUPER_ADMIN"
        let userId = null

        if (userData) {
          const user = JSON.parse(userData)
          currentRole = user.role
          userId = user.id
          setRole(currentRole)
        }

        let users = []
        if (currentRole === "SUPER_ADMIN") {
          users = await apiFetch("/users")
        }

        const productsPath = currentRole === "SELLER" ? `/products/seller/${userId}` : "/products"
        
        const [products, orders] = await Promise.all([
          apiFetch(productsPath),
          apiFetch("/orders"),
        ]);

        const revenue = orders.reduce((acc: number, order: any) => acc + Number(order.total), 0);

        setStats({
          users: users.length,
          products: products.length,
          orders: orders.length,
          revenue,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    };

    fetchStats();

    // Setup Socket.IO for active staff notification
    const token = localStorage.getItem("admin_token");
    if (token) {
      const socket = io("http://localhost:5000", {
        auth: { token }
      });

      socket.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket.on("active_staff", (data: { message: string }) => {
        toast.info(data.message, {
          duration: 5000,
          position: 'top-right',
          style: { background: '#0A0F1C', color: 'white', border: 'none' }
        });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      </div>
      
      <div className={`grid gap-6 ${role === 'SELLER' ? 'md:grid-cols-3 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
        <Card className="shadow-lg shadow-slate-200/40 border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</CardTitle>
            <div className="w-10 h-10 rounded-full bg-blue-100/50 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-extrabold text-slate-900">${stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-2 font-medium">From completed orders</p>
          </CardContent>
        </Card>

        {role === "SUPER_ADMIN" && (
          <Card className="shadow-lg shadow-slate-200/40 border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Users</CardTitle>
              <div className="w-10 h-10 rounded-full bg-green-100/50 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-extrabold text-slate-900">{stats.users}</div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Registered accounts</p>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg shadow-slate-200/40 border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Products</CardTitle>
            <div className="w-10 h-10 rounded-full bg-purple-100/50 flex items-center justify-center">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-extrabold text-slate-900">{stats.products}</div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Available in store</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-slate-200/40 border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</CardTitle>
            <div className="w-10 h-10 rounded-full bg-orange-100/50 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-extrabold text-slate-900">{stats.orders}</div>
            <p className="text-xs text-slate-500 mt-2 font-medium">All time orders</p>
          </CardContent>
        </Card>
      </div>
      
    </div>
  )
}
