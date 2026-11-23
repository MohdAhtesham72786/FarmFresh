import { useState } from "react";
import { adminProductsApi } from "../../api";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import Modal, { ModalActions } from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import { Skeleton } from "../../components/ui/Skeleton";
import TableFetchOverlay from "../../components/ui/TableFetchOverlay";
import { usePaginatedAdminProducts } from "../../hooks/usePaginatedAdminProducts";
import ProductImage from "../../components/ui/ProductImage";

export default function AdminStockPage() {
  const [page, setPage] = useState(1);
  const { items: products, meta, initialLoading, fetching, error, reload } = usePaginatedAdminProducts({
    page,
    setPage,
  });

  const [target, setTarget] = useState(null);
  const [stockValue, setStockValue] = useState("0");
  const [stockError, setStockError] = useState("");
  const [saving, setSaving] = useState(false);

  const openEdit = (product) => {
    setTarget(product);
    setStockValue(String(product.available_quantity));
    setStockError("");
  };

  const save = async () => {
    const qty = Number(stockValue);
    if (!Number.isInteger(qty) || qty < 0) {
      setStockError("Enter a non-negative whole number.");
      return;
    }
    if (!target) return;
    setSaving(true);
    try {
      await adminProductsApi.updateStock(target.id, qty);
      setTarget(null);
      await reload();
    } catch {
      setStockError("Could not update stock.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-forest-900">Stock management</h1>
      <p className="mt-1 text-sm text-forest-500">Update available quantity for each product.</p>

      {error && (
        <div className="mt-6">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card">
        {initialLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="p-10 text-center text-sm text-forest-500">No products found.</p>
        ) : (
          <>
            <div className="relative overflow-x-auto">
              <TableFetchOverlay busy={fetching} />
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-forest-100 bg-cream-50/90 text-left text-[11px] font-semibold uppercase tracking-wide text-forest-500">
                    <th className="px-4 py-3.5">Product</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-center">Stock</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-100/80">
                  {products.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-cream-50/70">
                      <td className="px-4 py-3.5 align-middle">
                        <div className="flex items-center gap-3">
                          <ProductImage
                            src={p.image_url}
                            name={p.name}
                            category={p.category}
                            className="h-10 w-10 rounded-lg border border-forest-100 object-cover"
                          />
                          <span className="font-semibold text-forest-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <Badge tone={p.status === "active" ? "active" : "inactive"}>{p.status}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-center align-middle tabular-nums text-forest-700">
                        {p.available_quantity}
                      </td>
                      <td className="px-4 py-3.5 text-right align-middle">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>
                          Update stock
                        </Button>
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
        open={Boolean(target)}
        title="Update stock"
        onClose={() => !saving && setTarget(null)}
        footer={<ModalActions confirmLabel="Save" loading={saving} onCancel={() => setTarget(null)} onConfirm={save} />}
      >
        <p className="mb-3 font-medium text-forest-800">{target?.name}</p>
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