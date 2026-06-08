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
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, Plus } from "lucide-react"
import { toast } from "sonner"

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Edit State
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [editForm, setEditForm] = useState({ name: "", price: 0, stockQuantity: 0, category: "" })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const userData = localStorage.getItem("admin_user")
      let url = "/products"
      if (userData) {
        const user = JSON.parse(userData)
        if (user.role === "SELLER") {
          url = `/products/seller/${user.id}`
        }
      }
      const data = await apiFetch(url)
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" })
      setProducts(products.filter(p => p.id !== id))
      toast.success("Product moved to trash")
    } catch (error) {
      toast.error("Error deleting product")
      console.error("Error deleting product:", error)
    }
  }

  const openEdit = (product: any) => {
    setEditingProduct(product)
    setEditForm({
      name: product.name,
      price: product.price,
      stockQuantity: product.stockQuantity,
      category: product.category
    })
  }

  const handleUpdate = async () => {
    if (!editingProduct) return
    try {
      const updated = await apiFetch(`/products/${editingProduct.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm)
      })
      
      setProducts(products.map(p => p.id === updated.id ? updated : p))
      setEditingProduct(null)
      toast.success("Product updated successfully")
    } catch (error) {
      toast.error("Failed to update product")
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Products</h2>
        <Button className="bg-[#0A0F1C] text-white hover:bg-slate-800 transition-all rounded-xl shadow-md flex items-center gap-2 px-6">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b-slate-100">
              <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs py-4">Image</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs py-4">Name</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs py-4">Price</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs py-4">Category</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs py-4">Stock</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">No products found.</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-slate-50 transition-colors border-b-slate-50">
                  <TableCell className="py-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover shadow-sm border border-slate-100" />
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">{product.name}</TableCell>
                  <TableCell className="text-slate-600 font-medium">${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{product.stockQuantity}</TableCell>
                  <TableCell className="text-right space-x-2 py-3">
                    <Button onClick={() => openEdit(product)} variant="outline" size="icon" className="h-9 w-9 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl border-slate-100">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-500">
                            This will move the product <span className="font-semibold text-slate-800">"{product.name}"</span> to the trash. It will no longer be visible on the store.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                          <AlertDialogCancel className="rounded-xl font-semibold">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-white transition-colors">
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

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="rounded-3xl border-slate-100 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                value={editForm.name}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price ($)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                  value={editForm.price}
                  onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</label>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                  value={editForm.stockQuantity}
                  onChange={e => setEditForm({...editForm, stockQuantity: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                value={editForm.category}
                onChange={e => setEditForm({...editForm, category: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)} className="rounded-xl font-semibold">Cancel</Button>
            <Button onClick={handleUpdate} className="bg-[#0A0F1C] text-white hover:bg-slate-800 rounded-xl font-semibold px-6 transition-colors">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
