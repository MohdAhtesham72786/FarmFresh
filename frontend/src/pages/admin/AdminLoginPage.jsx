import { useState } from "react";
import { Eye, EyeOff, Leaf, LockKeyhole, Shield } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../../api";
import { setAdminToken } from "../../api/client";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const FARM_IMAGE =
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1800&q=80";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Enter username and password.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.login(username.trim(), password);
      setAdminToken(data.access_token);
      navigate(location.state?.from?.pathname || "/admin/dashboard", { replace: true });
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMouse({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    });
  };

  const shiftX = (mouse.x - 0.5) * 28;
  const shiftY = (mouse.y - 0.5) * 20;

  return (
    <div className="grid min-h-screen md:grid-cols-[1.15fr_0.85fr]">
      <section
        className="relative min-h-[52vh] overflow-hidden bg-forest-950 md:min-h-screen"
        onMouseMove={onMove}
        onMouseLeave={() => setMouse({ x: 0.5, y: 0.5 })}
      >
        <div
          className="absolute inset-[-5%] h-[110%] w-[110%]"
          style={{ transform: `translate(${shiftX}px, ${shiftY}px)` }}
        >
          <img src={FARM_IMAGE} alt="" className="h-full w-full animate-ken-burns object-cover" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/35 to-forest-950/15" />
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(520px circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(82,183,136,0.28), transparent 42%)`,
          }}
        />

        <span className="animate-float-slow pointer-events-none absolute left-[12%] top-[18%] h-24 w-24 rounded-full bg-fresh-400/20 blur-2xl" />
        <span className="animate-float-slower pointer-events-none absolute right-[16%] top-[28%] h-32 w-32 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex h-full min-h-[52vh] flex-col justify-between p-6 text-white md:min-h-screen md:p-12">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20 backdrop-blur-md">
              <Leaf className="h-5 w-5 text-fresh-400" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fresh-400">FarmFresh Admin</p>
              <p className="text-sm text-white/70">Marketplace operations</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fresh-300">Harvest crates</p>
            <h1 className="mt-3 max-w-xl font-display text-4xl font-bold leading-tight lg:text-5xl">
              Manage the harvest with confidence.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
              Sign in to manage catalog, stock, and orders — reserved for marketplace operators.
            </p>
          </div>
        </div>
      </section>

      <div className="relative flex items-center justify-center overflow-hidden bg-cream-50 px-4 py-12">
        <span className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full bg-fresh-400/15 blur-3xl" />
        <span className="pointer-events-none absolute -left-10 bottom-8 h-40 w-40 rounded-full bg-forest-800/10 blur-3xl" />

        <div className="animate-login-in relative w-full max-w-md rounded-2xl border border-forest-100 bg-white/90 p-8 shadow-elevated backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-950 text-white">
              <Shield className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-forest-900">Admin sign in</h2>
              <p className="text-sm text-forest-500">Protected product management</p>
            </div>
          </div>

          {error && (
            <div className="mb-4">
              <Alert tone="error">{error}</Alert>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[34px] text-forest-400 transition-colors hover:text-forest-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              <LockKeyhole className="h-4 w-4" />
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <Link to="/" className="mt-6 block text-center text-sm font-semibold text-forest-600 hover:underline">
            ← Back to customer storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
