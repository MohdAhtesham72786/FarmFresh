import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminProductsApi } from "../../api";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatCurrency } from "../../utils/format";
import ProductImage from "../../components/ui/ProductImage";

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminProductsApi
      .get(id)
      .then(({ data }) => setProduct(data))
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Alert tone="error">{error}</Alert>
        <Link to="/admin/products" className="mt-4 inline-block">
          <Button variant="ghost">Back to products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-forest-900">{product.name}</h1>
        <div className="flex gap-2">
          <Link to={`/admin/products/${product.id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Link to="/admin/products">
            <Button variant="ghost">Back</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 rounded-3xl border border-forest-100 bg-white p-6 shadow-card lg:grid-cols-2">
        <ProductImage
          src={product.image_url}
          name={product.name}
          category={product.category}
          className="aspect-[4/3] w-full rounded-xl object-cover lg:aspect-square"
        />
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-forest-400">Status</dt>
            <dd className="mt-1">
              <Badge tone={product.status === "active" ? "active" : "inactive"}>{product.status}</Badge>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-forest-400">Category</dt>
            <dd className="mt-1 font-semibold text-forest-800">{product.category}</dd>
          </div>
          <div>
            <dt className="font-medium text-forest-400">Farmer</dt>
            <dd className="mt-1 font-semibold text-forest-800">{product.farmer_name}</dd>
          </div>
          <div>
            <dt className="font-medium text-forest-400">Price</dt>
            <dd className="mt-1 text-xl font-bold text-forest-900">{formatCurrency(product.price)}</dd>
          </div>
          <div>
            <dt className="font-medium text-forest-400">Available quantity</dt>
            <dd className="mt-1 font-semibold text-forest-800">{product.available_quantity}</dd>
          </div>
          <div>
            <dt className="font-medium text-forest-400">Description</dt>
            <dd className="mt-1 leading-relaxed text-forest-600">{product.description}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}