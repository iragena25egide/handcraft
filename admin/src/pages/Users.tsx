import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, User as UserIcon, Store } from "lucide-react"
import { toast } from "sonner"

export default function Users() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [newRole, setNewRole] = useState("")
  const [activeTab, setActiveTab] = useState<"BUYER" | "SELLER">("BUYER")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await apiFetch("/users")
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`/users/${id}`, { method: "DELETE" })
      setUsers(users.filter(u => u.id !== id))
      toast.success("User deleted successfully")
    } catch (error) {
      toast.error("Error deleting user")
      console.error("Error deleting user:", error)
    }
  }

  const handleUpdateRole = async () => {
    if (!editingUser) return;
    try {
      await apiFetch(`/users/${editingUser.id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole })
      })
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: newRole } : u))
      setEditingUser(null)
      toast.success("User role updated successfully")
    } catch (error) {
      toast.error("Error updating user role")
    }
  }

  const displayedUsers = users.filter(u => u.role === activeTab)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">User Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage sellers and buyers on your platform.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          variant={activeTab === "BUYER" ? "default" : "outline"} 
          onClick={() => setActiveTab("BUYER")}
          className={`rounded-xl px-6 py-6 h-auto ${activeTab === 'BUYER' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 border-slate-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${activeTab === 'BUYER' ? 'bg-blue-500/20' : 'bg-slate-100'}`}>
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold text-base">Buyers</div>
              <div className={`text-xs ${activeTab === 'BUYER' ? 'text-blue-100' : 'text-slate-500'}`}>Standard users</div>
            </div>
          </div>
        </Button>
        <Button 
          variant={activeTab === "SELLER" ? "default" : "outline"} 
          onClick={() => setActiveTab("SELLER")}
          className={`rounded-xl px-6 py-6 h-auto ${activeTab === 'SELLER' ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 border-slate-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${activeTab === 'SELLER' ? 'bg-purple-500/20' : 'bg-slate-100'}`}>
              <Store className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold text-base">Sellers</div>
              <div className={`text-xs ${activeTab === 'SELLER' ? 'text-purple-100' : 'text-slate-500'}`}>Store owners</div>
            </div>
          </div>
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b-slate-100">
              <TableHead className="font-bold text-slate-600 py-4 uppercase tracking-wider text-xs">Name</TableHead>
              <TableHead className="font-bold text-slate-600 py-4 uppercase tracking-wider text-xs">Email</TableHead>
              <TableHead className="font-bold text-slate-600 py-4 uppercase tracking-wider text-xs">Role</TableHead>
              <TableHead className="font-bold text-slate-600 py-4 uppercase tracking-wider text-xs">Joined</TableHead>
              <TableHead className="text-right font-bold text-slate-600 py-4 uppercase tracking-wider text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">Loading...</TableCell>
              </TableRow>
            ) : displayedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">No {activeTab.toLowerCase()}s found.</TableCell>
              </TableRow>
            ) : (
              displayedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-bold text-slate-900">{user.name}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      user.role === 'SELLER' ? 'bg-purple-50 text-purple-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2 py-3">
                    
                    <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                      <DialogTrigger asChild>
                        <Button onClick={() => { setEditingUser(user); setNewRole(user.role) }} variant="outline" size="icon" className="h-9 w-9 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-slate-200">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] rounded-3xl">
                        <DialogHeader>
                          <DialogTitle>Update User Role</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Role</label>
                            <select 
                              value={newRole} 
                              onChange={(e) => setNewRole(e.target.value)}
                              className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="BUYER">BUYER</option>
                              <option value="SELLER">SELLER</option>
                              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingUser(null)} className="rounded-xl">Cancel</Button>
                          <Button onClick={handleUpdateRole} className="rounded-xl bg-blue-600 text-white hover:bg-blue-700">Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-slate-200">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Suspend user account?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will soft-delete the user account, preventing them from logging in.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700 rounded-xl">
                            Suspend
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
