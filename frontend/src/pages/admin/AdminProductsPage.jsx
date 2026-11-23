import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Search, Trash2, ToggleLeft, ToggleRight, Warehouse } from "lucide-react";
import { adminProductsApi } from "../../api";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Select } from "../../components/ui/Input";
import Modal, { ModalActions } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";
import { Skeleton } from "../../components/ui/Skeleton";
import TableFetchOverlay from "../../components/ui/TableFetchOverlay";
import { useDebounce } from "../../hooks/useDebounce";
import { usePaginatedAdminProducts } from "../../hooks/usePaginatedAdminProducts";
import { formatCurrency } from "../../utils/format";
import ProductImage from "../../components/ui/ProductImage";

const compactBtn =
  "inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-lg border px-2 text-[11px] font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50";
const compactNeutral = `${compactBtn} border-forest-200/90 bg-white text-forest-700 hover:border-forest-300 hover:bg-cream-50`;
const compactDanger = `${compactBtn} border-red-100 bg-red-50 text-red-700 hover:bg-red-100`;

function ProductTableActions({ product, busyId, onStock, onToggle, onDelete }) {
  const disabled = busyId === product.id;
  const statusLabel = product.status === "active" ? "Deactivate" : "Activate";

  return (
    <div
      className="flex flex-nowrap items-center justify-end gap-1.5"
      role="group"
      aria-label={`Actions for ${product.name}`}
    >
      <Link to={`/admin/products/${product.id}`} className={compactNeutral} title="View product">
        <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>View</span>
      </Link>
      <Link to={`/admin/products/${product.id}/edit`} className={compactNeutral} title="Edit product">
        <Pencil className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>Edit</span>
      </Link>
      <button type="button" className={compactNeutral} disabled={disabled} title="Update stock" onClick={() => onStock(product)}>
        <Warehouse className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>Stock</span>
      </button>
      <button
        type="button"
        className={compactNeutral}
        disabled={disabled}
        title={statusLabel}
        onClick={() => onToggle(product)}
      >
        {product.status === "active" ? (
          <ToggleRight className="h-3.5 w-3.5 shrink-0 text-fresh-600" aria-hidden />
        ) : (
          <ToggleLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
        )}
        <span>{statusLabel}</span>
      </button>
      <button
        type="button"
        className={compactDanger}
        disabled={disabled}
        title="Delete product"
        onClick={() => onDelete(product)}
      >
        <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>Delete</span>
      </button>
    </div>
  );
}

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const debouncedSearch = useDebounce(search);

  const {
    items: products,
    meta,
    initialLoading,
    fetching,
    error,
    setError,
    reload,
    reloadAfterDelete,
  } = usePaginatedAdminProducts({
    page,
    setPage,
    search: debouncedSearch,
    status: statusFilter,
    category: categoryFilter,
  });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [stockTarget, setStockTarget] = useState(null);
  const [stockValue, setStockValue] = useState("0");
  const [stockError, setStockError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    adminProductsApi
      .categories()
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const toggleStatus = async (product) => {
    setBusyId(product.id);
    try {
      const next = product.status === "active" ? "inactive" : "active";
      await adminProductsApi.updateStatus(product.id, next);
      await reload();
    } catch {
      setError("Could not update product status.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setModalLoading(true);
    try {
      await adminProductsApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      await reloadAfterDelete();
    } catch {
      setError("Delete failed.");
    } finally {
      setModalLoading(false);
    }
  };

  const openStock = (product) => {
    setStockTarget(product);
    setStockValue(String(product.available_quantity));
    setStockError("");
  };

  const saveStock = async () => {
    const qty = Number(stockValue);
    if (!Number.isInteger(qty) || qty < 0) {
      setStockError("Enter a non-negative whole number.");
      return;
    }
    if (!stockTarget) return;
    setModalLoading(true);
    try {
      await adminProductsApi.updateStock(stockTarget.id, qty);
      setStockTarget(null);
      await reload();
    } catch {
      setStockError("Could not update stock.");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">Product listing</h1>
          <p className="mt-1 text-sm text-forest-500">View, search, and manage all products.</p>
        </div>
        <Link to="/admin/products/new">
          <Button>+ Add product</Button>
        </Link>
      </div>

      <div className="mb-6 grid gap-3 rounded-2xl border border-forest-100 bg-white p-4 shadow-card md:grid-cols-2 xl:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-[2.65rem] h-4 w-4 text-forest-400" />
          <Input
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            placeholder="Name or farmer…"
          />
        </div>
        <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
        <Select label="Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      {error && (
        <div className="mb-4">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card">
        {initialLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="p-10 text-center text-sm text-forest-500">No products match your filters.</p>
        ) : (
          <>
          <div className="relative -mx-px overflow-x-auto">
            <TableFetchOverlay busy={fetching} />
            <table className="min-w-[56rem] w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-forest-100 bg-cream-50/90 text-left text-[11px] font-semibold uppercase tracking-wide text-forest-500">
                  <th className="min-w-[14rem] px-4 py-3.5 font-semibold">Product</th>
                  <th className="whitespace-nowrap px-4 py-3.5">Category</th>
                  <th className="whitespace-nowrap px-4 py-3.5">Price</th>
                  <th className="whitespace-nowrap px-4 py-3.5 text-center">Stock</th>
                  <th className="whitespace-nowrap px-4 py-3.5">Status</th>
                  <th className="min-w-[22rem] whitespace-nowrap px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-100/80">
                {products.map((p) => (
                  <tr key={p.id} className="group bg-white transition-colors hover:bg-cream-50/70">
                    <td className="px-4 py-3.5 align-middle">
                      <div className="flex min-w-0 items-center gap-3">
                        <ProductImage
                          src={p.image_url}
                          name={p.name}
                          category={p.category}
                          className="h-10 w-10 shrink-0 rounded-lg border border-forest-100 object-cover"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/admin/products/${p.id}`}
                            className="block truncate font-semibold text-forest-900 hover:text-forest-700"
                            title={p.name}
                          >
                            {p.name}
                          </Link>
                          <p className="mt-0.5 truncate text-xs leading-relaxed text-forest-500" title={p.farmer_name}>
                            {p.farmer_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 align-middle text-forest-600">{p.category}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 align-middle font-medium tabular-nums text-forest-800">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-center align-middle tabular-nums text-forest-700">
                      {p.available_quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 align-middle">
                      <Badge tone={p.status === "active" ? "active" : "inactive"}>{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 align-middle">
                      <ProductTableActions
                        product={p}
                        busyId={busyId}
                        onStock={openStock}
                        onToggle={toggleStatus}
                        onDelete={setDeleteTarget}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={meta.page}
            totalPages={meta.total_pages}
            total={meta.total}
            limit={meta.limit}
            disabled={fetching}
            onPageChange={setPage}
          />
          </>
        )}
      </div>

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete product?"
        onClose={() => !modalLoading && setDeleteTarget(null)}
        footer={<ModalActions danger confirmLabel="Delete" loading={modalLoading} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
      >
        {deleteTarget && (
          <p>
            Remove <strong>{deleteTarget.name}</strong> permanently? This action cannot be undone.
          </p>
        )}
      </Modal>

      <Modal
        open={Boolean(stockTarget)}
        title="Update stock"
        onClose={() => !modalLoading && setStockTarget(null)}
        footer={<ModalActions confirmLabel="Save stock" loading={modalLoading} onCancel={() => setStockTarget(null)} onConfirm={saveStock} />}
      >
        <p className="mb-3">{stockTarget?.name}</p>
        <Input
          label="Available quantity"
          type="number"
          min="0"
          value={stockValue}
          error={stockError}
          onChange={(e) => setStockValue(e.target.value)}
        />
      </Modal>
    </div>
  );
}