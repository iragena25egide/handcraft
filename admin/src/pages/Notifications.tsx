import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Check, BellRing } from "lucide-react"

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const data = await apiFetch("/notifications")
      setNotifications(data)
    } catch (e) {
      console.error(e)
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

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1A1A2E" }}>All Notifications</h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifications.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#8B8FA8", background: "#fff", borderRadius: 16 }}>
            No notifications yet
          </div>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} style={{
              background: notification.isRead ? "#fff" : "#F4F5FF",
              border: notification.isRead ? "1px solid #E2E4F6" : "1px solid rgba(108,92,231,0.2)",
              padding: "20px 24px",
              borderRadius: 16,
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              boxShadow: notification.isRead ? "none" : "0 4px 12px rgba(108,92,231,0.06)"
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: notification.isRead ? "#F0F2FF" : "#6C5CE7",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0
              }}>
                <BellRing style={{ width: 18, height: 18, color: notification.isRead ? "#8B8FA8" : "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 4 }}>{notification.title}</h3>
                <p style={{ fontSize: 13, color: "#4A4D68", lineHeight: 1.5 }}>{notification.message}</p>
                <p style={{ fontSize: 11, color: "#8B8FA8", marginTop: 8 }}>
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 10,
                    background: "transparent",
                    border: "1px solid #6C5CE7",
                    color: "#6C5CE7",
                    fontSize: 12, fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  <Check style={{ width: 14, height: 14 }} />
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
