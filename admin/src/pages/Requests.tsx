import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Edit, X, FileText } from "lucide-react"
import { toast } from "sonner"

const STATUS_STYLES: Record<string, string> = {
  Pending: "badge-pending",
  Contacted: "badge-processing",
  Resolved: "badge-delivered",
}

export default function Requests() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRequest, setEditingRequest] = useState<any | null>(null)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => { fetchRequests() }, [])

  const fetchRequests = async () => {
    try {
      const data = await apiFetch("/requests")
      setRequests(data)
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!editingRequest) return
    try {
      await apiFetch(`/requests/${editingRequest.id}/status`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) })
      setRequests(requests.map(r => r.id === editingRequest.id ? { ...r, status: newStatus } : r))
      setEditingRequest(null)
      toast.success("Request status updated")
    } catch { toast.error("Error updating status") }
  }

  const shortId = (id: string) => id?.split("-")[0]?.toUpperCase() || id

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Page Header ── */}
      <div>
        <h1 className="page-header-title">Product Requests</h1>
        <p className="page-header-crumb" style={{ marginTop: 4 }}>Workspace / Requests</p>
      </div>

      {/* ── Table ── */}
      <div className="admin-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr className="admin-table-head">
              <th style={{ textAlign: "left" }}>ID</th>
              <th style={{ textAlign: "left" }}>Customer</th>
              <th style={{ textAlign: "left" }}>Product</th>
              <th style={{ textAlign: "left" }}>Status</th>
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
              : requests.length === 0
                ? <tr><td colSpan={6}><div style={{ textAlign: "center", padding: "60px 0", color: "#8B8FA8" }}><FileText style={{ width: 40, height: 40, margin: "0 auto 12px", opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>No requests found</p></div></td></tr>
                : requests.map(req => (
                  <tr key={req.id} className="admin-table-row">
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#6C5CE7", background: "#EDE7FF", padding: "3px 10px", borderRadius: 8, display: "inline-block" }}>
                        #{shortId(req.id)}
                      </span>
                    </td>
                    <td>
                      <p style={{ fontWeight: 600, color: "#1A1A2E" }}>{req.customerName}</p>
                      <p style={{ fontSize: 12, color: "#8B8FA8", marginTop: 1 }}>{req.customerPhone}</p>
                    </td>
                    <td>
                      <p style={{ fontWeight: 600, color: "#1A1A2E" }}>{req.productName || `ID: ${req.productId}`}</p>
                    </td>
                    <td><span className={`badge ${STATUS_STYLES[req.status] || "badge-pending"}`}>{req.status}</span></td>
                    <td><p style={{ fontSize: 13, color: "#8B8FA8" }}>{new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <button className="btn-icon-edit" onClick={() => { setEditingRequest(req); setNewStatus(req.status) }}><Edit style={{ width: 14, height: 14 }} /></button>
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* ══ UPDATE STATUS MODAL ══ */}
      {editingRequest && (
        <div className="admin-modal-overlay" onClick={() => setEditingRequest(null)}>
          <div className="admin-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-header-icon">
                <Edit style={{ width: 16, height: 16, color: "#a29bfe" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p className="admin-modal-title">Update Status</p>
                <p className="admin-modal-subtitle">Request #{shortId(editingRequest.id)}</p>
              </div>
              <button className="admin-modal-close-btn" onClick={() => setEditingRequest(null)}>
                <X style={{ width: 14, height: 14, color: "rgba(255,255,255,0.6)" }} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div>
                <label className="admin-label">Request Status *</label>
                <select className="admin-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option>Pending</option>
                  <option>Contacted</option>
                  <option>Resolved</option>
                </select>
              </div>

              <div className="admin-modal-info-strip">
                <p style={{ fontSize: 11, fontWeight: 700, color: "#8B8FA8", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>Status Preview</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className={`badge ${STATUS_STYLES[editingRequest.status] || "badge-pending"}`}>{editingRequest.status}</span>
                  <span style={{ fontSize: 13, color: "#AAADCC", fontWeight: 600 }}>→</span>
                  <span className={`badge ${STATUS_STYLES[newStatus] || "badge-pending"}`}>{newStatus}</span>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="btn-secondary" onClick={() => setEditingRequest(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateStatus}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
