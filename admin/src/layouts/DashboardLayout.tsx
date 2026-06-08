import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { LogOut } from "lucide-react"
import { io, Socket } from "socket.io-client"
import { toast } from "sonner"

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{name: string, role: string} | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    const userData = localStorage.getItem("admin_user")
    
    if (!token) {
      navigate("/login")
      return
    } else if (userData) {
      setUser(JSON.parse(userData))
    }

    // Connect Socket.io
    const socket: Socket = io("http://localhost:5000")
    
    socket.on("connect", () => {
      socket.emit("authenticate", token)
    })

    socket.on("active_staff", (data: { message: string }) => {
      toast.info(data.message, {
        position: "top-right",
        duration: 5000,
        className: "bg-blue-50 text-blue-900 border-blue-200"
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
    navigate("/login")
  }

  if (!localStorage.getItem("admin_token")) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-full min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
        <div className="w-full px-6 py-4 flex items-center justify-between bg-[#0A0F1C] text-white shadow-md">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:text-slate-300 hover:bg-white/10 transition-colors" />
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1 rounded text-xs font-bold tracking-wider">RC</div>
              <h1 className="font-bold text-lg tracking-tight">Admin Portal</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {user && (
              <div className="text-sm">
                <span className="text-slate-400 mr-2">Logged in as:</span>
                <span className="font-semibold">{user.name}</span>
                <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs uppercase tracking-wider">{user.role}</span>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
        <div className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
