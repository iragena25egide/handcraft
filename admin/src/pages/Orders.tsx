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
import { Trash2, Edit } from "lucide-react"
import { toast } from "sonner"

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingOrder, setEditingOrder] = useState<any>(null)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

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

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/orders/${id}`, { method: "DELETE" })
      setOrders(orders.filter(o => o.id !== id))
      toast.success("Order moved to trash")
    } catch (error) {
      toast.error("Error deleting order")
      console.error("Error deleting order:", error)
    }
  }

  const handleUpdateStatus = async () => {
    if (!editingOrder) return;
    try {
      await apiFetch(`/orders/${editingOrder.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      })
      setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, status: newStatus } : o))
      setEditingOrder(null)
      toast.success("Order status updated")
    } catch (error) {
      toast.error("Error updating status")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Orders Management</h2>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b-slate-100">
              <TableHead className="font-bold text-slate-600 py-4 uppercase tracking-wider text-xs">Order ID</TableHead>
              <TableHead className="font-bold text-slate-600 py-4 uppercase tracking-wider text-xs">Customer</TableHead>
              <TableHead className="font-bold text-slate-600 py-4 uppercase tracking-wider text-xs">Status</TableHead>
              <TableHead className="font-bold text-slate-600 py-4 uppercase tracking-wider text-xs">Total</TableHead>
              <TableHead className="font-bold text-slate-600 py-4 uppercase tracking-wider text-xs">Date</TableHead>
              <TableHead className="text-right font-bold text-slate-600 py-4 uppercase tracking-wider text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">No orders found.</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium text-slate-900">{order.id.split('-')[0]}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{order.user?.name || order.guestName}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'Pending' ? 'bg-orange-50 text-orange-600' :
                      order.status === 'Processing' ? 'bg-blue-50 text-blue-600' :
                      order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-extrabold text-slate-900">${Number(order.total).toFixed(2)}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2 py-3">
                    
                    <Dialog open={editingOrder?.id === order.id} onOpenChange={(open) => !open && setEditingOrder(null)}>
                      <DialogTrigger asChild>
                        <Button onClick={() => { setEditingOrder(order); setNewStatus(order.status) }} variant="outline" size="icon" className="h-9 w-9 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-slate-200">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] rounded-3xl">
                        <DialogHeader>
                          <DialogTitle>Update Order Status</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Status</label>
                            <select 
                              value={newStatus} 
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingOrder(null)} className="rounded-xl">Cancel</Button>
                          <Button onClick={handleUpdateStatus} className="rounded-xl bg-blue-600 text-white hover:bg-blue-700">Save changes</Button>
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
                          <AlertDialogTitle>Move order to trash?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will soft-delete the order. It will no longer appear in reports or active views.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(order.id)} className="bg-red-600 hover:bg-red-700 rounded-xl">
                            Move to Trash
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
