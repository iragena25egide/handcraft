import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Trash2,
  Bell,
  X,
  Inbox,
} from "lucide-react";

const baseItems = [
  { title: "Dashboard", url: "/", icon: Home, desc: "Overview & stats" },
  {
    title: "Products",
    url: "/products",
    icon: Package,
    desc: "Manage listings",
  },
  { title: "Orders", url: "/orders", icon: ShoppingCart, desc: "Track orders" },
  { title: "Requests", url: "/requests", icon: Inbox, desc: "Product inquiries" },
];

const adminItems = [
  { title: "Users", url: "/users", icon: Users, desc: "Roles & accounts" },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    desc: "System alerts",
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    desc: "Analytics & sales",
  },
  { title: "Trash Bin", url: "/trash", icon: Trash2, desc: "Deleted products" },
];

const sellerItems = [
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    desc: "System alerts",
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    desc: "Analytics & sales",
  },
];

export function AppSidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const location = useLocation();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("admin_user");
    if (userData) {
      const user = JSON.parse(userData);
      setRole(user.role);
    }
  }, []);

  const items =
    role === "SUPER_ADMIN"
      ? [...baseItems, ...adminItems]
      : role === "SELLER"
        ? [...baseItems, ...sellerItems]
        : baseItems;

  return (
    <>
      <div
        className={`admin-sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <aside
        className={`admin-sidebar imigongo-bg ${isOpen ? "open" : ""}`}
        style={{
          width: 260,
          minHeight: "100vh",
          borderRight: "1px solid rgba(26,26,46,0.08)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "28px 24px 20px",
            borderBottom: "1px solid rgba(26,26,46,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>
              <p
                style={{
                  color: "#1A1A2E",
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: "-0.3px",
                  lineHeight: 1.1,
                }}
              >
                Handcraft Admin
              </p>
              <p
                style={{
                  color: "#8B8FA8",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                {role === "SUPER_ADMIN" ? "Admin Portal" : "Seller Portal"}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              className="md:hidden"
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#1A1A2E",
              }}
            >
              <X style={{ width: 24, height: 24 }} />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <p
            style={{
              color: "#AAADCC",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "4px 12px 12px",
            }}
          >
            Navigation
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {items.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      borderRadius: 14,
                      background: isActive ? "#F3F4FF" : "transparent",
                      border: isActive
                        ? "1px solid #E2E4F6"
                        : "1px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        flexShrink: 0,
                        background: isActive ? "#1A1A2E" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.18s ease",
                      }}
                    >
                      <item.icon
                        style={{
                          width: 16,
                          height: 16,
                          color: isActive ? "#fff" : "#AAADCC",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: isActive ? 700 : 600,
                          color: isActive ? "#1A1A2E" : "#5A5B7A",
                          lineHeight: 1.2,
                          transition: "color 0.18s ease",
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: isActive ? "#5A5B7A" : "#8B8FA8",
                          marginTop: 1,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                    {isActive && (
                      <div
                        style={{
                          marginLeft: "auto",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#1A1A2E",
                        }}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: "16px 12px",
            borderTop: "1px solid rgba(26,26,46,0.06)",
          }}
        >
          <div
            style={{
              background: "#F8F9FF",
              borderRadius: 14,
              padding: "14px 16px",
              border: "1px solid #E2E4F6",
            }}
          >
            <p
              style={{
                color: "#8B8FA8",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              Platform Status
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#00B894",
                  boxShadow: "0 0 6px rgba(0,184,148,0.4)",
                }}
              />
              <p style={{ color: "#1A1A2E", fontSize: 13, fontWeight: 600 }}>
                All systems online
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
