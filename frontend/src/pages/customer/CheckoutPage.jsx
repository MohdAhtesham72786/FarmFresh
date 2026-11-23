import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ordersApi } from "../../api";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import EmptyState from "../../components/ui/EmptyState";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/format";
import ProductImage from "../../components/ui/ProductImage";
import { CreditCard } from "lucide-react";

const initial = {
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  shipping_address: "",
};

export default function CheckoutPage() {
  const { cart, grandTotal, refresh } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const items = cart?.items ?? [];

  const onFieldChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const validate = () => {
    const next = {};
    if (!form.customer_name.trim()) next.customer_name = "Full name is required";
    if (!form.customer_email.trim()) next.customer_email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) next.customer_email = "Enter a valid email";
    if (!form.customer_phone.trim() || form.customer_phone.trim().length < 7)
      next.customer_phone = "Enter a valid phone number";
    if (!form.shipping_address.trim() || form.shipping_address.trim().length < 5)
      next.shipping_address = "Enter a complete shipping address";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || items.length === 0) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const { data } = await ordersApi.checkout({
        customer_name: form.customer_name.trim(),
        customer_email: form.customer_email.trim(),
        customer_phone: form.customer_phone.trim(),
        shipping_address: form.shipping_address.trim(),
      });
      await refresh();
      navigate(`/order-success/${data.id}`, { state: { order: data } });
    } catch (err) {
      const detail = err.response?.data?.detail;
      setSubmitError(typeof detail === "string" ? detail : "Checkout failed. Review your cart and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart) return null;

  if (items.length === 0) {
    return (
      <div className="container-app py-8 sm:py-10">
        <EmptyState
          icon={CreditCard}
          title="Nothing to checkout"
          description="Add products to your cart before placing an order."
          action={
            <Link to="/">
              <Button>Browse shop</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-app py-8 sm:py-10">
      <h1 className="font-display text-3xl font-bold text-forest-900">Checkout</h1>
      <p className="mt-2 text-forest-500">Complete your details to place the order securely.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_340px]">
        <form onSubmit={onSubmit} className="rounded-3xl border border-forest-100 bg-white p-6 shadow-card sm:p-8" noValidate>
          {submitError && (
            <div className="mb-4">
              <Alert tone="error">{submitError}</Alert>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full name *"
              name="customer_name"
              value={form.customer_name}
              error={errors.customer_name}
              onChange={onFieldChange("customer_name")}
            />
            <Input
              label="Email *"
              name="customer_email"
              type="email"
              value={form.customer_email}
              error={errors.customer_email}
              onChange={onFieldChange("customer_email")}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Phone *"
              name="customer_phone"
              type="tel"
              value={form.customer_phone}
              error={errors.customer_phone}
              onChange={onFieldChange("customer_phone")}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Shipping address *"
              name="shipping_address"
              rows={3}
              value={form.shipping_address}
              error={errors.shipping_address}
              onChange={onFieldChange("shipping_address")}
            />
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full rounded-full sm:w-auto" disabled={submitting}>
            {submitting ? "Placing order…" : "Place order"}
          </Button>
        </form>

        <aside className="h-fit rounded-3xl border border-forest-100 bg-white p-6 shadow-card lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold text-forest-900">Order summary</h2>
          <ul className="mt-4 space-y-3 border-b border-forest-100 pb-4 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3 text-forest-600">
                <span className="flex min-w-0 items-center gap-2.5">
                  <ProductImage
                    src={i.image_url}
                    name={i.product_name}
                    category={i.category}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <span className="truncate">
                    {i.product_name} × {i.quantity}
                  </span>
                </span>
                <span className="shrink-0 font-medium text-forest-800">{formatCurrency(i.line_total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between text-lg font-bold text-forest-900">
            <span>Grand total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
          <Link to="/cart" className="mt-4 block">
            <Button variant="ghost" className="w-full">
              Edit cart
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}