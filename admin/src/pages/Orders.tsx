import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Trash2, Edit, X, AlertTriangle, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

const STATUS_STYLES: Record<string, string> = {
  Pending: "badge-pending",
  Processing: "badge-processing",
  Delivered: "badge-delivered",
  Cancelled: "badge-cancelled",
}

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingOrder, setEditingOrder] = useState<any | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [deletingOrder, setDeletingOrder] = useState<any | null>(null)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const data = await apiFetch("/orders")
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingOrder) return
    try {
      await apiFetch(`/orders/${deletingOrder.id}`, { method: "DELETE" })
      setOrders(orders.filter(o => o.id !== deletingOrder.id))
      setDeletingOrder(null)
      toast.success("Order moved to trash")
    } catch { toast.error("Error deleting order") }
  }

  const handleUpdateStatus = async () => {
    if (!editingOrder) return
    try {
      await apiFetch(`/orders/${editingOrder.id}/status`, { method: "PUT", body: JSON.stringify({ status: newStatus }) })
      setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, status: newStatus } : o))
      setEditingOrder(null)
      toast.success("Order status updated")
    } catch { toast.error("Error updating status") }
  }

  const shortId = (id: string) => id?.split("-")[0]?.toUpperCase() || id

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Page Header ── */}
      <div>
        <h1 className="page-header-title">Order Management</h1>
        <p className="page-header-crumb" style={{ marginTop: 4 }}>Workspace / Orders</p>
      </div>

      {/* ── Table ── */}
      <div className="admin-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr className="admin-table-head">
              <th style={{ textAlign: "left" }}>Order ID</th>
              <th style={{ textAlign: "left" }}>Customer</th>
              <th style={{ textAlign: "left" }}>Status</th>
              <th style={{ textAlign: "left" }}>Total</th>
              <th style={{ textAlign: "left" }}>Date</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="admin-table-row">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j}><div style={{ height: 14, background: "#F0F2FF", borderRadius: 6, width: "65%" }} /></td>
                  ))}
                </tr>
              ))
              : orders.length === 0
                ? <tr><td colSpan={6}><div style={{ textAlign: "center", padding: "60px 0", color: "#8B8FA8" }}><ShoppingCart style={{ width: 40, height: 40, margin: "0 auto 12px", opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>No orders found</p></div></td></tr>
                : orders.map(order => (
                  <tr key={order.id} className="admin-table-row">
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#6C5CE7", background: "#EDE7FF", padding: "3px 10px", borderRadius: 8, display: "inline-block" }}>
                        #{shortId(order.id)}
                      </span>
                    </td>
                    <td>
                      <p style={{ fontWeight: 600, color: "#1A1A2E" }}>{order.user?.name || order.guestName || "Guest"}</p>
                      {order.user?.email && <p style={{ fontSize: 12, color: "#8B8FA8", marginTop: 1 }}>{order.user.email}</p>}
                    </td>
                    <td><span className={`badge ${STATUS_STYLES[order.status] || "badge-pending"}`}>{order.status}</span></td>
                    <td><p style={{ fontWeight: 800, color: "#1A1A2E", fontSize: 15 }}>${Number(order.total).toFixed(2)}</p></td>
                    <td><p style={{ fontSize: 13, color: "#8B8FA8" }}>{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <button className="btn-icon-edit" onClick={() => { setEditingOrder(order); setNewStatus(order.status) }}><Edit style={{ width: 14, height: 14 }} /></button>
                        <button className="btn-icon-delete" onClick={() => setDeletingOrder(order)}><Trash2 style={{ width: 14, height: 14 }} /></button>
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* ══ UPDATE STATUS MODAL ══ */}
      {editingOrder && (
        <div className="admin-modal-overlay" onClick={() => setEditingOrder(null)}>
          <div className="admin-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            {/* Dark header */}
            <div className="admin-modal-header">
              <div className="admin-modal-header-icon">
                <Edit style={{ width: 16, height: 16, color: "#a29bfe" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p className="admin-modal-title">Update Order Status</p>
                <p className="admin-modal-subtitle">Order #{shortId(editingOrder.id)}</p>
              </div>
              <button className="admin-modal-close-btn" onClick={() => setEditingOrder(null)}>
                <X style={{ width: 14, height: 14, color: "rgba(255,255,255,0.6)" }} />
              </button>
            </div>

            {/* White body */}
            <div className="admin-modal-body">
              <div>
                <label className="admin-label">Order Status *</label>
                <select className="admin-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>

              {/* Live preview strip */}
              <div className="admin-modal-info-strip">
                <p style={{ fontSize: 11, fontWeight: 700, color: "#8B8FA8", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>Status Preview</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className={`badge ${STATUS_STYLES[editingOrder.status] || "badge-pending"}`}>{editingOrder.status}</span>
                  <span style={{ fontSize: 13, color: "#AAADCC", fontWeight: 600 }}>→</span>
                  <span className={`badge ${STATUS_STYLES[newStatus] || "badge-pending"}`}>{newStatus}</span>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="btn-secondary" onClick={() => setEditingOrder(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateStatus}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM ══ */}
      {deletingOrder && (
        <div className="admin-modal-overlay" onClick={() => setDeletingOrder(null)}>
          <div className="admin-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-confirm-header">
              <div className="admin-confirm-icon-wrap">
                <AlertTriangle style={{ width: 26, height: 26, color: "#fff" }} />
              </div>
              <p className="admin-confirm-title">Delete Order?</p>
              <p className="admin-confirm-subtitle">This will remove it from active views.</p>
            </div>
            <div className="admin-confirm-body">
              <div className="admin-confirm-message">
                Order <strong style={{ color: "#1A1A2E" }}>#{shortId(deletingOrder.id)}</strong> will be moved to trash. You can restore it from the Trash Bin if needed.
              </div>
              <div className="admin-confirm-actions">
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setDeletingOrder(null)}>Cancel</button>
                <button className="btn-danger" style={{ flex: 1 }} onClick={handleDelete}><Trash2 style={{ width: 14, height: 14 }} /> Move to Trash</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
