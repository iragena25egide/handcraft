import { useEffect, useState } from "react"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { io } from "socket.io-client"
import { toast } from "sonner"

export default function Dashboard() {
  const [role, setRole] = useState<string>("")
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)

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

        let users: any[] = []
        if (currentRole === "SUPER_ADMIN") {
          users = await apiFetch("/users")
        }

        const productsPath = currentRole === "SELLER" ? `/products/seller/${userId}` : "/products"
        const [products, orders] = await Promise.all([
          apiFetch(productsPath),
          apiFetch("/orders"),
        ])

        const revenue = orders.reduce((acc: number, order: any) => acc + Number(order.total), 0)
        setStats({ users: users.length, products: products.length, orders: orders.length, revenue })
      } catch (error) {
        console.error("Failed to load dashboard stats", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    const token = localStorage.getItem("admin_token")
    if (token) {
      const socket = io(BACKEND_URL, { auth: { token } })
      socket.on("active_staff", (data: { message: string }) => {
        toast.info(data.message, {
          duration: 5000, position: "top-right",
          style: { background: "#1A1A2E", color: "white", border: "1px solid rgba(108,92,231,0.4)" }
        })
      })
      return () => { socket.disconnect() }
    }
  }, [])

  const statCards = [
    {
      label: "Total Revenue",
      value: `RWF ${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      colorClass: "stat-card-purple",
      iconClass: "icon-badge-purple",
      delay: "",
      show: true,
    },
    {
      label: "Active Users",
      value: stats.users,
      icon: Users,
      colorClass: "stat-card-teal",
      iconClass: "icon-badge-teal",
      delay: "animate-fade-up-delay-1",
      show: role === "SUPER_ADMIN",
    },
    {
      label: "Total Products",
      value: stats.products,
      icon: Package,
      colorClass: "stat-card-amber",
      iconClass: "icon-badge-amber",
      delay: "animate-fade-up-delay-2",
      show: true,
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: ShoppingCart,
      colorClass: "stat-card-pink",
      iconClass: "icon-badge-pink",
      delay: "animate-fade-up-delay-3",
      show: true,
    },
  ].filter(s => s.show)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-up">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5" style={{ color: "#6C5CE7" }} />
          <span className="page-header-crumb">Workspace</span>
          <span className="page-header-crumb">/</span>
          <span className="page-header-crumb font-semibold" style={{ color: "#6C5CE7" }}>Dashboard</span>
        </div>
        <h1 className="page-header-title">Dashboard Overview</h1>
        <p className="page-header-crumb mt-1">
          {role === "SELLER" ? "Your product & order performance at a glance." : "Platform-wide analytics and key metrics."}
        </p>
      </div>

      {/* Stat Cards */}
      <div className={`grid gap-5 ${role === "SELLER" ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}>
        {loading
          ? Array.from({ length: role === "SELLER" ? 3 : 4 }).map((_, i) => (
              <div key={i} className="stat-card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-32" />
              </div>
            ))
          : statCards.map((card, i) => (
              <div key={card.label} className={`stat-card ${card.colorClass} animate-fade-up animate-fade-up-delay-${i}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#8B8FA8", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>
                      {card.label}
                    </p>
                    <p style={{ fontSize: 34, fontWeight: 800, color: "#1A1A2E", lineHeight: 1.1, letterSpacing: "-0.5px" }}>
                      {card.value}
                    </p>
                    <div className="flex items-center gap-1 mt-3">
                      <ArrowUpRight style={{ width: 14, height: 14, color: "#00B894" }} />
                      <span style={{ fontSize: 12, color: "#00B894", fontWeight: 600 }}>Live data</span>
                    </div>
                  </div>
                  <div className={`${card.iconClass} w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))
        }
      </div>

      {/* Quick Info Banner */}
      <div className="animate-fade-up animate-fade-up-delay-4" style={{
        backgroundColor: "#6C5CE7",
        borderRadius: 20, padding: "28px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 8px 30px rgba(108,92,231,0.25)"
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            {role === "SELLER" ? "Seller Portal" : "Admin Portal"} — Handcraft Platform
          </p>
          <p style={{ color: "#fff", fontSize: 20, fontWeight: 800, letterSpacing: "-0.3px" }}>
            {role === "SELLER"
              ? `Managing ${stats.products} products · ${stats.orders} orders`
              : `${stats.users} users · ${stats.products} products · ${stats.orders} orders`}
          </p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 16, padding: "16px 24px", textAlign: "center", backdropFilter: "blur(10px)" }}>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Total Revenue</p>
          <p style={{ color: "#fff", fontSize: 28, fontWeight: 900, letterSpacing: "-0.5px" }}>RWF {stats.revenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
