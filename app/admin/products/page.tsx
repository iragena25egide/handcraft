"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Plus, Edit, Trash2, Search, Image as ImageIcon, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  image: string;
  artisan: string;
  description?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "handicraft",
    price: "",
    stockQuantity: "",
    artisan: "",
    description: "Handcrafted item",
    image: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading(editingProduct ? "Updating product..." : "Creating product...");
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("stockQuantity", formData.stockQuantity);
      data.append("artisan", formData.artisan);
      data.append("description", formData.description);
      
      if (imageFile) {
        data.append("images", imageFile);
      } else if (formData.image) {
        data.append("image", formData.image);
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Product updated successfully", { id: toastId });
      } else {
        await api.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Product created successfully", { id: toastId });
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
      // Reset form
      setFormData({ name: "", category: "handicraft", price: "", stockQuantity: "", artisan: "", description: "Handcrafted item", image: "" });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      toast.error(editingProduct ? "Failed to update product" : "Failed to create product", { id: toastId });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    const toastId = toast.loading("Deleting product...");
    try {
      await api.delete(`/products/${productToDelete}`);
      toast.success("Product deleted", { id: toastId });
      fetchProducts();
      setProductToDelete(null);
    } catch (error) {
      toast.error("Failed to delete product", { id: toastId });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your store's inventory</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: "", category: "handicraft", price: "", stockQuantity: "", artisan: "", description: "Handcrafted item", image: "" });
            setImageFile(null);
            setImagePreview(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold text-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredProducts.length} products
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No products found.</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">by {product.artisan}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300 capitalize">{product.category}</td>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">${Number(product.price).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.stockQuantity > 10 ? "bg-green-100 text-green-700" : 
                        product.stockQuantity > 0 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                      }`}>
                        {product.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingProduct(product);
                            setFormData({
                              name: product.name,
                              category: product.category,
                              price: product.price.toString(),
                              stockQuantity: product.stockQuantity.toString(),
                              artisan: product.artisan,
                              description: product.description || "Handcrafted item",
                              image: product.image
                            });
                            setImageFile(null);
                            setImagePreview(product.image);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-500 transition" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    {/* Create/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">&times;</button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ($)</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                  <input required type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="handicraft">Handicraft</option>
                  <option value="fashion">Fashion</option>
                  <option value="art">Art</option>
                  <option value="home">Home Decor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Artisan Name</label>
                <input required type="text" value={formData.artisan} onChange={e => setFormData({...formData, artisan: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center flex flex-col items-center">
                    {imagePreview ? (
                      <div className="relative mb-4">
                        <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto rounded-lg object-cover" />
                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center w-full">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none">
                        <span>{imagePreview ? 'Change image' : 'Upload a file'}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold">{editingProduct ? "Update Product" : "Save Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Product?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setProductToDelete(null)} className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium w-full transition">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold w-full transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
