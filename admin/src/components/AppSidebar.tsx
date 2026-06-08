import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Package, ShoppingCart, Users, FileText, Trash2 } from "lucide-react"

const baseItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Products", url: "/products", icon: Package },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
]

const adminItems = [
  { title: "Users", url: "/users", icon: Users },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Trash Bin", url: "/trash", icon: Trash2 },
]

export function AppSidebar() {
  const location = useLocation()
  const [role, setRole] = useState<string>("")

  useEffect(() => {
    const userData = localStorage.getItem("admin_user")
    if (userData) {
      const user = JSON.parse(userData)
      setRole(user.role)
    }
  }, [])

  const items = role === "SUPER_ADMIN" ? [...baseItems, ...adminItems] : baseItems

  return (
    <Sidebar className="border-r-slate-100 bg-white">
      <SidebarContent className="bg-white">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Handcraft<span className="text-blue-600">.</span>
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{role === "SUPER_ADMIN" ? "Admin Portal" : "Seller Portal"}</p>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-6">
              {items.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} 
                      className={`h-11 rounded-xl transition-all ${
                        isActive 
                          ? "bg-slate-900 text-white font-semibold shadow-md shadow-slate-900/10 hover:bg-slate-800 hover:text-white" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                      }`}
                    >
                      <Link to={item.url} className="flex items-center">
                        <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-slate-400"}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
