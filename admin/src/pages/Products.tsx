import { useEffect, useState } from "react";
import { apiFetch, BACKEND_URL } from "@/lib/api";
import {
  Trash2,
  Edit,
  Plus,
  X,
  AlertTriangle,
  Package,
  Image as ImageIcon,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

const emptyForm = {
  name: "",
  description: "",
  price: 0,
  originalPrice: 0,
  artisan: "",
  stockQuantity: 0,
  category: "",
  sellerId: "",
};

const getImageUrl = (src: string) => {
  if (!src)
    return "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80";
  return src.startsWith("http") || src.startsWith("blob:")
    ? src
    : `${BACKEND_URL}${src}`;
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div style={{ marginBottom: 12 }}>
    <label className="admin-label">{label}</label>
    {children}
  </div>
);

const ProductFormFields = ({
  form,
  setForm,
  setFiles,
  previews,
  setPreviews,
  userRole,
  sellers,
  handleFileChange,
}: any) => (
  <>
    {userRole === "SUPER_ADMIN" && (
      <Field label="Assign Seller">
        <select
          className="admin-select"
          value={form.sellerId}
          onChange={(e) => setForm({ ...form, sellerId: e.target.value })}
        >
          <option value="">Select a Seller (Optional)</option>
          {sellers.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.email})
            </option>
          ))}
        </select>
      </Field>
    )}
    <Field label="Product Name *">
      <input
        className="admin-input"
        value={form.name}
        placeholder="e.g. Handwoven Basket"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
    </Field>

    <Field label="Description">
      <textarea
        className="admin-textarea"
        value={form.description}
        placeholder="Describe this product…"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
    </Field>

    <div className="admin-modal-grid-2">
      <Field label="Selling Price (RWF) *">
        <input
          className="admin-input"
          type="number"
          min="0"
          step="1"
          value={Number.isNaN(form.price) ? "" : form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value ? parseFloat(e.target.value) : 0,
            })
          }
        />
      </Field>
      <Field label="Original Price (RWF)">
        <input
          className="admin-input"
          type="number"
          min="0"
          step="1"
          value={Number.isNaN(form.originalPrice) ? "" : form.originalPrice}
          onChange={(e) =>
            setForm({
              ...form,
              originalPrice: e.target.value ? parseFloat(e.target.value) : 0,
            })
          }
        />
      </Field>
    </div>

    <div className="admin-modal-grid-2">
      <Field label="Stock Qty *">
        <input
          className="admin-input"
          type="number"
          min="0"
          value={Number.isNaN(form.stockQuantity) ? "" : form.stockQuantity}
          onChange={(e) =>
            setForm({
              ...form,
              stockQuantity: e.target.value ? parseInt(e.target.value) : 0,
            })
          }
        />
      </Field>
      <Field label="Category">
        <select
          className="admin-select"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select…</option>
          <option value="imyenda">Imyenda</option>
          <option value="imitako">Imitako</option>
          <option value="ibyo mubukwe">Ibyo mubukwe</option>
          <option value="ibyo murugo">Ibyo murugo</option>
          <option value="nibindi">Nibindi</option>
        </select>
      </Field>
    </div>

    <Field label="Artisan / Maker">
      <input
        className="admin-input"
        value={form.artisan}
        placeholder="e.g. Jean Bosco"
        onChange={(e) => setForm({ ...form, artisan: e.target.value })}
      />
    </Field>

    <Field label="Product Images (Max 3)">
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            border: "2px dashed #E2E4F6",
            borderRadius: 10,
            cursor: "pointer",
            background: "#F3F4FF",
            color: "#6C5CE7",
          }}
        >
          <ImageIcon style={{ width: 24, height: 24, marginBottom: 4 }} />
          <span style={{ fontSize: 10, fontWeight: 600 }}>Upload</span>
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, setFiles, setPreviews)}
          />
        </label>
        {previews.map((src: string, idx: number) => {
          const url = getImageUrl(src);
          return (
            <img
              key={idx}
              src={url}
              alt="preview"
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 10,
                border: "1.5px solid #E2E4F6",
              }}
            />
          );
        })}
      </div>
    </Field>
  </>
);

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [viewingProduct, setViewingProduct] = useState<any | null>(null);

  const [editForm, setEditForm] = useState({ ...emptyForm });
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editPreviews, setEditPreviews] = useState<string[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ ...emptyForm });
  const [addFiles, setAddFiles] = useState<File[]>([]);
  const [addPreviews, setAddPreviews] = useState<string[]>([]);

  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);
  const [userRole, setUserRole] = useState("");
  const [sellers, setSellers] = useState<any[]>([]);

  const [filterStatus, setFilterStatus] = useState("active");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const userData = localStorage.getItem("admin_user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserRole(parsedUser.role);
      if (parsedUser.role === "SUPER_ADMIN") {
        fetchSellers();
      }
    }
    fetchProducts();
  }, [filterStatus]);

  const fetchSellers = async () => {
    try {
      const data = await apiFetch("/users");
      setSellers(data.filter((u: any) => u.role === "SELLER"));
    } catch {
      console.error("Error fetching sellers");
    }
  };

  const fetchProducts = async () => {
    try {
      const userData = localStorage.getItem("admin_user");
      let url = `/products?status=${filterStatus}`;
      if (userData) {
        const user = JSON.parse(userData);
        if (user.role === "SELLER")
          url = `/products/seller/${user.id}?status=${filterStatus}`;
      }
      const data = await apiFetch(url);
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await apiFetch(`/products/${deletingProduct.id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== deletingProduct.id));
      setDeletingProduct(null);
      toast.success("Product moved to trash");
    } catch {
      toast.error("Error deleting product");
    }
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || 0,
      originalPrice: product.originalPrice || 0,
      artisan: product.artisan || "",
      stockQuantity: product.stockQuantity || 0,
      category: product.category || "",
      sellerId: product.seller?.id || "",
    });
    setEditFiles([]);
    setEditPreviews(product.images || (product.image ? [product.image] : []));
  };

  const handleAdd = async () => {
    try {
      const formData = new FormData();
      Object.entries(addForm).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      addFiles.forEach((file) => {
        formData.append("images", file);
      });

      const added = await apiFetch(`/products`, {
        method: "POST",
        body: formData,
      });
      setProducts([added, ...products]);
      setIsAdding(false);
      setAddForm({ ...emptyForm });
      setAddFiles([]);
      setAddPreviews([]);
      toast.success("Product created");
    } catch (err: any) {
      toast.error(err.message || "Failed to create product");
    }
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      editFiles.forEach((file) => {
        formData.append("images", file);
      });

      const updated = await apiFetch(`/products/${editingProduct.id}`, {
        method: "PUT",
        body: formData,
      });
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
      setEditingProduct(null);
      toast.success("Product updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update product");
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFiles: any,
    setPreviews: any,
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 3); // max 3
      setFiles(newFiles);
      setPreviews(newFiles.map((file) => URL.createObjectURL(file)));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1 className="page-header-title">Products</h1>
          <p className="page-header-crumb" style={{ marginTop: 4 }}>
            Workspace / Products
          </p>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            <div>
              <label className="admin-label">Status</label>
              <select
                className="admin-select"
                style={{ width: 140, padding: "8px 12px", minHeight: 36 }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="trash">In Trash</option>
                <option value="all">All Products</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Sort By</label>
              <select
                className="admin-select"
                style={{ width: 180, padding: "8px 12px", minHeight: 36 }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="stock_asc">Stock (Low to High)</option>
                <option value="stock_desc">Stock (High to Low)</option>
              </select>
            </div>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setIsAdding(true)}>
          <Plus style={{ width: 15, height: 15 }} /> Add Product
        </button>
      </div>

      {/* ── Table ── */}
      <div className="admin-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr className="admin-table-head">
              <th style={{ textAlign: "left", width: 60 }}>Image</th>
              <th style={{ textAlign: "left" }}>Product</th>
              <th style={{ textAlign: "left" }}>Price</th>
              <th style={{ textAlign: "left" }}>Category</th>
              <th style={{ textAlign: "left" }}>Stock</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="admin-table-row">
                    <td>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: "#F0F2FF",
                        }}
                      />
                    </td>
                    <td>
                      <div
                        style={{
                          height: 14,
                          background: "#F0F2FF",
                          borderRadius: 6,
                          width: "60%",
                        }}
                      />
                    </td>
                    <td>
                      <div
                        style={{
                          height: 14,
                          background: "#F0F2FF",
                          borderRadius: 6,
                          width: 60,
                        }}
                      />
                    </td>
                    <td>
                      <div
                        style={{
                          height: 20,
                          background: "#F0F2FF",
                          borderRadius: 999,
                          width: 70,
                        }}
                      />
                    </td>
                    <td>
                      <div
                        style={{
                          height: 14,
                          background: "#F0F2FF",
                          borderRadius: 6,
                          width: 30,
                        }}
                      />
                    </td>
                    <td />
                  </tr>
                ))
              : (() => {
                  let sorted = [...products];
                  switch (sortBy) {
                    case "price_asc":
                      sorted.sort((a, b) => a.price - b.price);
                      break;
                    case "price_desc":
                      sorted.sort((a, b) => b.price - a.price);
                      break;
                    case "stock_asc":
                      sorted.sort((a, b) => a.stockQuantity - b.stockQuantity);
                      break;
                    case "stock_desc":
                      sorted.sort((a, b) => b.stockQuantity - a.stockQuantity);
                      break;
                  }
                  if (sorted.length === 0)
                    return (
                      <tr>
                        <td colSpan={6}>
                          <div
                            style={{
                              textAlign: "center",
                              padding: "60px 0",
                              color: "#8B8FA8",
                            }}
                          >
                            <Package
                              style={{
                                width: 40,
                                height: 40,
                                margin: "0 auto 12px",
                                opacity: 0.3,
                              }}
                            />
                            <p style={{ fontWeight: 600 }}>No products found</p>
                          </div>
                        </td>
                      </tr>
                    );

                  return sorted.map((product) => (
                    <tr
                      key={product.id}
                      className="admin-table-row"
                      style={{ opacity: product.deletedAt ? 0.6 : 1 }}
                    >
                      <td>
                        {product.image ? (
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              objectFit: "cover",
                              border: "1.5px solid #E2E4F6",
                              filter: product.deletedAt
                                ? "grayscale(100%)"
                                : "none",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              background: "#F0F2FF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Package
                              style={{
                                width: 18,
                                height: 18,
                                color: "#8B8FA8",
                              }}
                            />
                          </div>
                        )}
                      </td>
                      <td>
                        <p
                          style={{
                            fontWeight: 700,
                            color: product.deletedAt ? "#AAADCC" : "#1A1A2E",
                            textDecoration: product.deletedAt
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {product.name}
                        </p>
                        {product.deletedAt && (
                          <span
                            className="badge badge-low"
                            style={{
                              marginTop: 4,
                              display: "inline-block",
                              padding: "2px 6px",
                              fontSize: 10,
                            }}
                          >
                            Trashed
                          </span>
                        )}
                        {product.artisan && (
                          <p
                            style={{
                              fontSize: 12,
                              color: "#8B8FA8",
                              marginTop: 2,
                            }}
                          >
                            by {product.artisan}
                          </p>
                        )}
                      </td>
                      <td>
                        <p
                          style={{
                            fontWeight: 800,
                            color: "#6C5CE7",
                            fontSize: 15,
                          }}
                        >
                          RWF {Number(product.price).toLocaleString()}
                        </p>
                        {product.originalPrice > 0 && (
                          <p
                            style={{
                              fontSize: 11,
                              color: "#AAADCC",
                              textDecoration: "line-through",
                            }}
                          >
                            RWF {Number(product.originalPrice).toLocaleString()}
                          </p>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-seller">
                          {product.category || "—"}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color:
                              product.stockQuantity < 5 ? "#FF7675" : "#1A1A2E",
                          }}
                        >
                          {product.stockQuantity}
                          {product.stockQuantity < 5 && (
                            <span
                              className="badge badge-low"
                              style={{ marginLeft: 8 }}
                            >
                              Low
                            </span>
                          )}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 8,
                          }}
                        >
                          <button
                            className="btn-icon-view"
                            onClick={() => setViewingProduct(product)}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              color: "#6C5CE7",
                            }}
                          >
                            <Eye style={{ width: 16, height: 16 }} />
                          </button>
                          {product.deletedAt ? (
                            <button
                              onClick={async () => {
                                try {
                                  await apiFetch(
                                    `/products/${product.id}/restore`,
                                    { method: "POST" },
                                  );
                                  toast.success("Product restored");
                                  fetchProducts();
                                } catch {
                                  toast.error("Failed to restore product");
                                }
                              }}
                              style={{
                                background: "#E2E4F6",
                                color: "#6C5CE7",
                                border: "none",
                                borderRadius: 8,
                                padding: "4px 12px",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              Restore
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn-icon-edit"
                                onClick={() => openEdit(product)}
                              >
                                <Edit style={{ width: 14, height: 14 }} />
                              </button>
                              <button
                                className="btn-icon-delete"
                                onClick={() => setDeletingProduct(product)}
                              >
                                <Trash2 style={{ width: 14, height: 14 }} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ));
                })()}
          </tbody>
        </table>
      </div>

      {/* ══ ADD MODAL ══ */}
      {isAdding && (
        <div className="admin-modal-overlay" onClick={() => setIsAdding(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div
              className="admin-modal-header"
              style={{
                background: "#1A1A2E",
                color: "#fff",
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <Plus style={{ width: 18, height: 18, color: "#a29bfe" }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 700 }}>Add New Product</p>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div
              className="admin-modal-body"
              style={{
                padding: 24,
                maxHeight: "70vh",
                overflowY: "auto",
                background: "#fff",
              }}
            >
              <ProductFormFields
                form={addForm}
                setForm={setAddForm}
                files={addFiles}
                setFiles={setAddFiles}
                previews={addPreviews}
                setPreviews={setAddPreviews}
                userRole={userRole}
                sellers={sellers}
                handleFileChange={handleFileChange}
              />
            </div>
            <div
              className="admin-modal-footer"
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #E2E4F6",
                background: "#F8F9FF",
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <button
                className="btn-secondary"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAdd}>
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT MODAL ══ */}
      {editingProduct && (
        <div
          className="admin-modal-overlay"
          onClick={() => setEditingProduct(null)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div
              className="admin-modal-header"
              style={{
                background: "#1A1A2E",
                color: "#fff",
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <Edit style={{ width: 18, height: 18, color: "#a29bfe" }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 700 }}>Edit Product</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div
              className="admin-modal-body"
              style={{
                padding: 24,
                maxHeight: "70vh",
                overflowY: "auto",
                background: "#fff",
              }}
            >
              <ProductFormFields
                form={editForm}
                setForm={setEditForm}
                files={editFiles}
                setFiles={setEditFiles}
                previews={editPreviews}
                setPreviews={setEditPreviews}
                userRole={userRole}
                sellers={sellers}
                handleFileChange={handleFileChange}
              />
            </div>
            <div
              className="admin-modal-footer"
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #E2E4F6",
                background: "#F8F9FF",
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <button
                className="btn-secondary"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM ══ */}
      {deletingProduct && (
        <div
          className="admin-modal-overlay"
          onClick={() => setDeletingProduct(null)}
        >
          <div
            className="admin-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="admin-confirm-header"
              style={{
                background: "#1A1A2E",
                padding: "20px 24px",
                textAlign: "center",
                color: "#fff",
              }}
            >
              <AlertTriangle
                style={{
                  width: 26,
                  height: 26,
                  color: "#fff",
                  margin: "0 auto 10px",
                }}
              />
              <p style={{ fontSize: 18, fontWeight: 800 }}>Move to Trash?</p>
            </div>
            <div
              className="admin-confirm-body"
              style={{ padding: 24, background: "#fff" }}
            >
              <p
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: "#5A5B7A",
                  marginBottom: 20,
                }}
              >
                "{deletingProduct.name}" will be soft-deleted.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setDeletingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn-danger"
                  style={{ flex: 1 }}
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingProduct && (
        <div
          className="admin-modal-overlay"
          onClick={() => setViewingProduct(null)}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: 600 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="admin-modal-header"
              style={{
                background: "#F0F2FF",
                borderBottom: "1px solid #E2E4F6",
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E" }}>
                Product Details
              </p>
              <button
                className="admin-modal-close"
                onClick={() => setViewingProduct(null)}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <div
              className="admin-modal-body"
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div style={{ display: "flex", gap: 16 }}>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid #E2E4F6",
                    background: "#F3F4FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {viewingProduct.image ? (
                    <img
                      src={getImageUrl(viewingProduct.image)}
                      alt="Main"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Package
                      style={{ width: 40, height: 40, color: "#8B8FA8" }}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#1A1A2E",
                      marginBottom: 6,
                    }}
                  >
                    {viewingProduct.name}
                  </h2>
                  <p
                    style={{ fontSize: 13, color: "#8B8FA8", marginBottom: 12 }}
                  >
                    {viewingProduct.description || "No description provided."}
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span className="badge badge-seller">
                      Category: {viewingProduct.category || "None"}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color:
                          viewingProduct.stockQuantity < 5
                            ? "#FF7675"
                            : "#00B894",
                      }}
                    >
                      Stock: {viewingProduct.stockQuantity}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#6C5CE7",
                      }}
                    >
                      Price: RWF {Number(viewingProduct.price).toLocaleString()}
                    </span>
                  </div>
                  {viewingProduct.artisan && (
                    <p
                      style={{ fontSize: 13, color: "#4A4D68", marginTop: 12 }}
                    >
                      <strong>Artisan:</strong> {viewingProduct.artisan}
                    </p>
                  )}
                </div>
              </div>

              {viewingProduct.images && viewingProduct.images.length > 0 && (
                <div>
                  <h4
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#1A1A2E",
                      marginBottom: 10,
                    }}
                  >
                    Gallery
                  </h4>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {viewingProduct.images.map((src: string, idx: number) => (
                      <img
                        key={idx}
                        src={getImageUrl(src)}
                        alt="gallery"
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 10,
                          border: "1.5px solid #E2E4F6",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setViewingProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
