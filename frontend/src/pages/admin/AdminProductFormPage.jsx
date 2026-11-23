import { useEffect, useState } from "react";
import { ImagePlus, Link as LinkIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminProductsApi } from "../../api";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { Skeleton } from "../../components/ui/Skeleton";
import ProductImage from "../../components/ui/ProductImage";

const empty = {
  name: "",
  category: "",
  farmer_name: "",
  description: "",
  price: "",
  available_quantity: "0",
  image_url: "",
  status: "active",
};

function validateForm(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Product name is required";
  if (!form.category.trim()) errors.category = "Category is required";
  if (!form.farmer_name.trim()) errors.farmer_name = "Farmer name is required";
  if (!form.description.trim() || form.description.trim().length < 8)
    errors.description = "Enter a description (at least 8 characters)";
  const price = Number(form.price);
  if (!form.price || Number.isNaN(price) || price <= 0) errors.price = "Enter a price greater than 0";
  const qty = Number(form.available_quantity);
  if (form.available_quantity === "" || !Number.isInteger(qty) || qty < 0)
    errors.available_quantity = "Stock must be a non-negative integer";
  if (form.image_url.trim() && !form.image_url.startsWith("/uploads/")) {
    try {
      new URL(form.image_url);
    } catch {
      errors.image_url = "Enter a valid image URL or upload a file";
    }
  }
  return errors;
}

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    adminProductsApi
      .get(id)
      .then(({ data }) =>
        setForm({
          name: data.name,
          category: data.category,
          farmer_name: data.farmer_name,
          description: data.description,
          price: String(data.price),
          available_quantity: String(data.available_quantity),
          image_url: data.image_url,
          status: data.status,
        }),
      )
      .catch(() => setLoadError("Product not found."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const onUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image_url: "Choose an image file (JPEG, PNG, WebP, GIF)." }));
      return;
    }
    setUploading(true);
    setSubmitError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const { data } = await adminProductsApi.uploadImage(body);
      setForm((prev) => ({ ...prev, image_url: data.image_url }));
      setErrors((prev) => ({ ...prev, image_url: undefined }));
    } catch {
      setErrors((prev) => ({ ...prev, image_url: "Upload failed. Try a smaller image or use a URL." }));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setSubmitError("");
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      farmer_name: form.farmer_name.trim(),
      description: form.description.trim(),
      price: Number(form.price).toFixed(2),
      available_quantity: Number(form.available_quantity),
      image_url: form.image_url.trim(),
      status: form.status,
    };

    try {
      if (isEdit) await adminProductsApi.update(id, payload);
      else await adminProductsApi.create(payload);
      navigate("/admin/products");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setSubmitError(typeof detail === "string" ? detail : "Could not save product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-lg">
        <Alert tone="error">{loadError}</Alert>
        <Link to="/admin/products" className="mt-4 inline-block">
          <Button variant="ghost">Back to products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-forest-900">{isEdit ? "Edit product" : "Add product"}</h1>
      <p className="mt-1 text-sm text-forest-500">All fields are validated on the client and again by the API.</p>

      <form onSubmit={onSubmit} className="mt-6 rounded-3xl border border-forest-100 bg-white p-4 shadow-card sm:p-8" noValidate>
        {submitError && (
          <div className="mb-4">
            <Alert tone="error">{submitError}</Alert>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Product name *" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Category *" value={form.category} error={errors.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input label="Farmer name *" value={form.farmer_name} error={errors.farmer_name} onChange={(e) => setForm({ ...form, farmer_name: e.target.value })} />
          <Input label="Price (USD) *" type="number" min="0.01" step="0.01" value={form.price} error={errors.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input label="Available quantity *" type="number" min="0" value={form.available_quantity} error={errors.available_quantity} onChange={(e) => setForm({ ...form, available_quantity: e.target.value })} />
          <Select label="Status (Active / Inactive)" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_180px]">
          <div>
            <Input
              label="Product image URL"
              placeholder="https://… or upload a file"
              value={form.image_url}
              error={errors.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
            <label className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-forest-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-forest-700 hover:bg-cream-100 sm:w-auto">
              <ImagePlus className="h-4 w-4" />
              {uploading ? "Uploading…" : "Upload image"}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onUpload} disabled={uploading} />
            </label>
            <p className="mt-2 flex items-start gap-1.5 text-xs text-forest-400">
              <LinkIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Use a public URL or upload JPEG/PNG/WebP/GIF (max 5 MB).
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-forest-100 bg-cream-50">
            <ProductImage
              src={form.image_url}
              name={form.name}
              category={form.category}
              className="aspect-[4/3] h-40 w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-4">
          <Textarea
            label="Description *"
            rows={4}
            value={form.description}
            error={errors.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="submit" disabled={submitting || uploading}>
            {submitting ? "Saving…" : isEdit ? "Update product" : "Create product"}
          </Button>
          <Link to="/admin/products">
            <Button variant="ghost">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}