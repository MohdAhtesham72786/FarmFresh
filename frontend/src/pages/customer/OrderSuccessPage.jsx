import { CheckCircle2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import { formatCurrency } from "../../utils/format";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="container-app flex justify-center py-6">
      <div className="w-full max-w-lg rounded-3xl border border-forest-100 bg-white p-8 text-center shadow-card sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-fresh-500/15 text-fresh-600">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-forest-900">Order confirmed</h1>
        <p className="mt-2 text-forest-600">
          Thank you! Your order <strong>#{orderId}</strong> has been placed successfully.
        </p>
        {order && (
          <p className="mt-3 text-lg font-semibold text-forest-800">Total paid: {formatCurrency(order.grand_total)}</p>
        )}
        <p className="mt-2 text-sm text-forest-400">Inventory has been updated. A confirmation is saved for this session.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/">
            <Button>Continue shopping</Button>
          </Link>
          <Link to="/orders">
            <Button variant="ghost">View orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}