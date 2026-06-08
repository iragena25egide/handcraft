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
import { FileText, TrendingUp, AlertTriangle, Download } from "lucide-react"

export default function Reports() {
  const [sales, setSales] = useState({ totalOrders: 0, totalRevenue: 0 })
  const [lowStock, setLowStock] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const [salesData, stockData] = await Promise.all([
        apiFetch("/reports/sales"),
        apiFetch("/reports/low-stock")
      ])
      setSales(salesData)
      setLowStock(stockData)
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = () => {
    const token = localStorage.getItem("admin_token")
    if (token) {
      window.open(`http://localhost:5000/api/reports/pdf?token=${token}`, "_blank")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-500" /> Reports Center
          </h2>
          <p className="text-slate-500 text-sm mt-1">Analytics, low stock alerts, and downloadable reports.</p>
        </div>
        <Button onClick={handleDownloadPDF} className="bg-blue-600 text-white hover:bg-blue-700 transition-all rounded-xl shadow-md flex items-center gap-2 px-6">
          <Download className="w-4 h-4" /> Download PDF Report
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Processing Revenue</h3>
            <div className="text-4xl font-extrabold text-slate-900 mt-1">${sales.totalRevenue.toFixed(2)}</div>
            <p className="text-sm text-slate-500 mt-1">From {sales.totalOrders} processing orders</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Low Stock Items</h3>
            <div className="text-4xl font-extrabold text-slate-900 mt-1">{lowStock.length}</div>
            <p className="text-sm text-slate-500 mt-1">Products needing restock (below 5)</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Low Stock Products (<span className="text-orange-500">{"<"} 5</span>)</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-slate-100">
              <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs py-4">Image</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs py-4">Name</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs py-4">Category</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-wider text-xs py-4 text-right">Current Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : lowStock.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-slate-500">All products are sufficiently stocked.</TableCell>
              </TableRow>
            ) : (
              lowStock.map((product) => (
                <TableRow key={product.id} className="hover:bg-slate-50 transition-colors border-b-slate-50">
                  <TableCell className="py-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover shadow-sm border border-slate-100" />
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">{product.name}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-red-600 font-bold bg-red-50 px-3 py-1 rounded-lg">
                      {product.stockQuantity}
                    </span>
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
