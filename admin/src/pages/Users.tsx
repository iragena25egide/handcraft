import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Trash2, Edit, X, AlertTriangle, Users as UsersIcon, Store, Plus } from "lucide-react"
import { toast } from "sonner"

export default function Users() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [newRole, setNewRole] = useState("")
  const [deletingUser, setDeletingUser] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<"BUYER" | "SELLER">("BUYER")
  const [isAdding, setIsAdding] = useState(false)
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "SELLER" })

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const data = await apiFetch("/users")
      setUsers(data)
    } catch {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingUser) return
    try {
      await apiFetch(`/users/${deletingUser.id}`, { method: "DELETE" })
      setUsers(users.filter(u => u.id !== deletingUser.id))
      setDeletingUser(null)
      toast.success("User suspended")
    } catch { toast.error("Error suspending user") }
  }

  const handleUpdateRole = async () => {
    if (!editingUser) return
    try {
      await apiFetch(`/users/${editingUser.id}/role`, { method: "PUT", body: JSON.stringify({ role: newRole }) })
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: newRole } : u))
      setEditingUser(null)
      toast.success("Role updated")
    } catch { toast.error("Error updating role") }
  }

  const handleAddUser = async () => {
    try {
      const added = await apiFetch("/users/register", { method: "POST", body: JSON.stringify(addForm) })
      setUsers([added, ...users])
      setIsAdding(false)
      setAddForm({ name: "", email: "", password: "", role: "SELLER" })
      toast.success("Account created successfully")
    } catch (err: any) { 
      toast.error(err.message || "Failed to create account") 
    }
  }

  const buyers = users.filter(u => u.role === "BUYER")
  const sellers = users.filter(u => u.role === "SELLER")
  const displayed = activeTab === "BUYER" ? buyers : sellers

  const badgeClass: Record<string, string> = {
    SELLER: "badge-seller",
    BUYER: "badge-buyer",
    SUPER_ADMIN: "badge-admin",
  }

  const TabBtn = ({ tab, label, Icon, count }: { tab: "BUYER" | "SELLER"; label: string; Icon: any; count: number }) => {
    const active = activeTab === tab
    return (
      <button onClick={() => setActiveTab(tab)} style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 20px", borderRadius: 12, cursor: "pointer",
        border: active ? "1.5px solid rgba(108,92,231,0.3)" : "1.5px solid #E2E4F6",
        background: active ? "#6C5CE7" : "#FFFFFF",
        color: active ? "#fff" : "#5A5B7A",
        fontWeight: 700, fontSize: 14,
        boxShadow: active ? "0 4px 14px rgba(108,92,231,0.3)" : "none",
        transition: "all 0.2s ease",
        fontFamily: "'Inter', sans-serif",
      }}>
        <Icon style={{ width: 15, height: 15 }} />
        {label}
        <span style={{
          background: active ? "rgba(255,255,255,0.22)" : "#EDE7FF",
          color: active ? "#fff" : "#6C5CE7",
          fontSize: 11, fontWeight: 800, padding: "2px 9px", borderRadius: 999,
        }}>{count}</span>
      </button>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="page-header-title">User & Role Management</h1>
          <p className="page-header-crumb" style={{ marginTop: 4 }}>Administration / User Management</p>
        </div>
        <button className="btn-primary" style={{ display: "flex", gap: 8, alignItems: "center" }} onClick={() => setIsAdding(true)}>
          <Plus style={{ width: 16, height: 16 }} /> Create Account
        </button>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 10 }}>
        <TabBtn tab="BUYER" label="Buyers" Icon={UsersIcon} count={buyers.length} />
        <TabBtn tab="SELLER" label="Sellers" Icon={Store} count={sellers.length} />
      </div>

      {/* ── Table ── */}
      <div className="admin-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr className="admin-table-head">
              <th style={{ textAlign: "left" }}>Name</th>
              <th style={{ textAlign: "left" }}>Email</th>
              <th style={{ textAlign: "left" }}>Role</th>
              <th style={{ textAlign: "left" }}>Joined</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="admin-table-row">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j}><div style={{ height: 14, background: "#F0F2FF", borderRadius: 6, width: "65%" }} /></td>
                  ))}
                </tr>
              ))
              : displayed.length === 0
                ? <tr><td colSpan={5}><div style={{ textAlign: "center", padding: "60px 0", color: "#8B8FA8" }}><UsersIcon style={{ width: 40, height: 40, margin: "0 auto 12px", opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>No {activeTab.toLowerCase()}s found</p></div></td></tr>
                : displayed.map(user => (
                  <tr key={user.id} className="admin-table-row">
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: user.role === "SELLER" ? "#6C5CE7" : "#00CEC9",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: 13, fontWeight: 800,
                        }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <p style={{ fontWeight: 700, color: "#1A1A2E" }}>{user.name}</p>
                      </div>
                    </td>
                    <td><p style={{ color: "#5A5B7A" }}>{user.email}</p></td>
                    <td><span className={`badge ${badgeClass[user.role] || "badge-buyer"}`}>{user.role}</span></td>
                    <td><p style={{ fontSize: 13, color: "#8B8FA8" }}>{new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <button className="btn-icon-edit" onClick={() => { setEditingUser(user); setNewRole(user.role) }}><Edit style={{ width: 14, height: 14 }} /></button>
                        <button className="btn-icon-delete" onClick={() => setDeletingUser(user)}><Trash2 style={{ width: 14, height: 14 }} /></button>
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* ══ EDIT ROLE MODAL ══ */}
      {isAdding && (
        <div className="admin-modal-overlay" onClick={() => setIsAdding(false)}>
          <div className="admin-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-header-icon">
                <UsersIcon style={{ width: 16, height: 16, color: "#a29bfe" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p className="admin-modal-title">Create Account</p>
                <p className="admin-modal-subtitle">Add a new seller or buyer manually.</p>
              </div>
              <button className="admin-modal-close-btn" onClick={() => setIsAdding(false)}>
                <X style={{ width: 14, height: 14, color: "rgba(255,255,255,0.6)" }} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Full Name *</label>
                <input className="admin-input" value={addForm.name} placeholder="John Doe" onChange={e => setAddForm({ ...addForm, name: e.target.value })} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Email Address *</label>
                <input className="admin-input" type="email" value={addForm.email} placeholder="john@example.com" onChange={e => setAddForm({ ...addForm, email: e.target.value })} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Password *</label>
                <input className="admin-input" type="password" value={addForm.password} placeholder="••••••" onChange={e => setAddForm({ ...addForm, password: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Assign Role *</label>
                <select className="admin-select" value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })}>
                  <option value="BUYER">BUYER</option>
                  <option value="SELLER">SELLER</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddUser}>Create Account</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT ROLE MODAL ══ */}
      {editingUser && (
        <div className="admin-modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="admin-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            {/* Dark header */}
            <div className="admin-modal-header">
              <div className="admin-modal-header-icon">
                <Edit style={{ width: 16, height: 16, color: "#a29bfe" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p className="admin-modal-title">Update User Role</p>
                <p className="admin-modal-subtitle">{editingUser.name} · {editingUser.email}</p>
              </div>
              <button className="admin-modal-close-btn" onClick={() => setEditingUser(null)}>
                <X style={{ width: 14, height: 14, color: "rgba(255,255,255,0.6)" }} />
              </button>
            </div>

            {/* White body */}
            <div className="admin-modal-body">
              <div>
                <label className="admin-label">Assign Role *</label>
                <select className="admin-select" value={newRole} onChange={e => setNewRole(e.target.value)}>
                  <option value="BUYER">BUYER</option>
                  <option value="SELLER">SELLER</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </div>

              {/* Role preview strip */}
              <div className="admin-modal-info-strip">
                <p style={{ fontSize: 11, fontWeight: 700, color: "#8B8FA8", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>Role Change Preview</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className={`badge ${badgeClass[editingUser.role] || "badge-buyer"}`}>{editingUser.role}</span>
                  <span style={{ fontSize: 14, color: "#AAADCC", fontWeight: 700 }}>→</span>
                  <span className={`badge ${badgeClass[newRole] || "badge-buyer"}`}>{newRole}</span>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateRole}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ SUSPEND CONFIRM ══ */}
      {deletingUser && (
        <div className="admin-modal-overlay" onClick={() => setDeletingUser(null)}>
          <div className="admin-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-confirm-header">
              <div className="admin-confirm-icon-wrap">
                <AlertTriangle style={{ width: 26, height: 26, color: "#fff" }} />
              </div>
              <p className="admin-confirm-title">Suspend Account?</p>
              <p className="admin-confirm-subtitle">This prevents the user from logging in.</p>
            </div>
            <div className="admin-confirm-body">
              <div className="admin-confirm-message">
                <strong style={{ color: "#1A1A2E" }}>{deletingUser.name}</strong>'s account will be soft-deleted. You can restore it from the database if needed.
              </div>
              <div className="admin-confirm-actions">
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setDeletingUser(null)}>Cancel</button>
                <button className="btn-danger" style={{ flex: 1 }} onClick={handleDelete}><Trash2 style={{ width: 14, height: 14 }} /> Suspend</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
