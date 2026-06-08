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
import { Button } from "@/components/ui/button"
import { RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function Trash() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrashedProducts()
  }, [])

  const fetchTrashedProducts = async () => {
    try {
      const data = await apiFetch("/products/trash")
      setProducts(data)
    } catch (error) {
      console.error("Error fetching trashed products:", error)
      toast.error("Failed to fetch trash bin")
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (id: number) => {
    try {
      await apiFetch(`/products/${id}/restore`, { method: "POST" })
      setProducts(products.filter(p => p.id !== id))
      toast.success("Product restored successfully")
    } catch (error) {
      toast.error("Error restoring product")
      console.error("Error restoring product:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Trash2 className="w-8 h-8 text-red-500" /> Trash Bin
          </h2>
          <p className="text-slate-500 text-sm mt-1">Restore products that were previously deleted.</p>
        </div>
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
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">Trash bin is empty.</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-slate-50 transition-colors border-b-slate-50">
                  <TableCell className="py-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover shadow-sm border border-slate-100 opacity-50 grayscale" />
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800 line-through text-opacity-60">{product.name}</TableCell>
                  <TableCell className="text-slate-600 font-medium">${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{product.stockQuantity}</TableCell>
                  <TableCell className="text-right space-x-2 py-3">
                    <Button onClick={() => handleRestore(product.id)} variant="outline" size="sm" className="rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
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
