import { useEffect, useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { AppSidebar } from "@/components/AppSidebar"
import { LogOut, Bell, ChevronDown, Check } from "lucide-react"
import { io, Socket } from "socket.io-client"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/orders": "Orders",
  "/requests": "Requests",
  "/users": "User Management",
  "/reports": "Reports",
  "/trash": "Trash Bin",
}

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<{ name: string; role: string; email?: string } | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    const userData = localStorage.getItem("admin_user")

    if (!token) {
      navigate("/login")
      return
    }
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      if (parsedUser.role === "SUPER_ADMIN" || parsedUser.role === "SELLER") {
        fetchNotifications()
      }
    }

    const socket: Socket = io("http://localhost:5000")
    socket.on("connect", () => { socket.emit("authenticate", token) })
    socket.on("active_staff", (data: { message: string }) => {
      toast.info(data.message, {
        position: "top-right", duration: 5000,
        style: { background: "#1A1A2E", color: "white", border: "1px solid rgba(108,92,231,0.4)" }
      })
    })
    socket.on("notification", (data: { title: string; message: string }) => {
      toast.success(data.title, {
        description: data.message,
        position: "top-right", duration: 6000,
        style: { background: "#FFFFFF", color: "#1A1A2E", border: "1px solid #E2E4F6" }
      })
      const parsedUser = JSON.parse(localStorage.getItem("admin_user") || "{}")
      if (parsedUser.role === "SUPER_ADMIN" || parsedUser.role === "SELLER") {
        fetchNotifications()
      }
    })
    return () => { socket.disconnect() }
  }, [navigate])

  const fetchNotifications = async () => {
    try {
      const data = await apiFetch("/notifications")
      setNotifications(data)
    } catch (e) {
      console.error("Failed to fetch notifications", e)
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "PUT" })
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
    navigate("/login")
  }

  if (!localStorage.getItem("admin_token")) return null

  const pageTitle = PAGE_TITLES[location.pathname] || "Dashboard"
  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"
  const roleLabel = user?.role === "SUPER_ADMIN" ? "Super Admin" : user?.role === "SELLER" ? "Seller" : "User"

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0F2FF", fontFamily: "'Inter', sans-serif" }}>
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="admin-main-content" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Nav */}
        <header className="admin-top-nav" style={{
          height: 68,
          background: "#FFFFFF",
          borderBottom: "1px solid rgba(1A,1A,2E,0.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px",
          position: "sticky", top: 0, zIndex: 40,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button 
              className="md:hidden" 
              onClick={() => setIsSidebarOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#1A1A2E", display: "flex", alignItems: "center" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="hidden md:block">
              <p style={{ fontSize: 11, color: "#8B8FA8", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>
                Workspace
              </p>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.3px" }}>
                {pageTitle}
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Notification Bell */}
            {(user?.role === "SUPER_ADMIN" || user?.role === "SELLER") && (
              <div style={{ position: "relative" }}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: "#F0F2FF",
                    border: "1.5px solid #E4E6FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", position: "relative",
                    transition: "all 0.18s ease",
                  }}
                >
                  <Bell style={{ width: 18, height: 18, color: "#6C5CE7" }} />
                  {notifications.some(n => !n.isRead) && (
                    <span style={{
                      position: "absolute", top: 8, right: 8,
                      width: 8, height: 8, borderRadius: "50%",
                      background: "#FF7675",
                      border: "2px solid #FFFFFF",
                    }} />
                  )}
                </button>

                {showNotifications && (
                  <div style={{
                    position: "absolute", top: 48, right: 0,
                    width: 320, background: "#fff",
                    borderRadius: 16, border: "1px solid #E2E4F6", 
                    overflow: "hidden", zIndex: 100
                  }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>Notifications</h3>
                      <button onClick={() => navigate("/notifications")} style={{ fontSize: 12, color: "#6C5CE7", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View All</button>
                    </div>
                    <div style={{ maxHeight: 300, overflowY: "auto" }}>
                      {notifications.length === 0 ? (
                        <p style={{ padding: 20, textAlign: "center", fontSize: 13, color: "#8B8FA8" }}>No notifications</p>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div key={n.id} style={{
                            padding: "12px 20px", borderBottom: "1px solid #F0F2FF",
                            background: n.isRead ? "#fff" : "#F8F9FF",
                            display: "flex", justifyContent: "space-between", gap: 12
                          }}>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: n.isRead ? 500 : 700, color: "#1A1A2E" }}>{n.title}</p>
                              <p style={{ fontSize: 12, color: "#8B8FA8", marginTop: 2, lineHeight: 1.4 }}>{n.message}</p>
                            </div>
                            {!n.isRead && (
                              <button onClick={() => handleMarkAsRead(n.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6C5CE7", padding: 4 }}>
                                <Check style={{ width: 14, height: 14 }} />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            <div style={{ width: 1, height: 28, background: "#E4E6FF" }} />

            {/* User Pill */}
            {user && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#F7F8FF",
                border: "1.5px solid #E4E6FF",
                borderRadius: 14, padding: "6px 14px 6px 8px",
                cursor: "pointer",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: "#1A1A2E",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 12, fontWeight: 800,
                }}>
                  {initials}
                </div>
                <div className="hidden md:block">
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E", lineHeight: 1.2 }}>{user.name}</p>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#6C5CE7", textTransform: "uppercase", letterSpacing: "0.06em" }}>{roleLabel}</p>
                </div>
                <ChevronDown style={{ width: 14, height: 14, color: "#8B8FA8" }} />
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: "#FFF5F5",
                border: "1.5px solid #FFE5E5",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              <LogOut style={{ width: 16, height: 16, color: "#FF7675" }} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
