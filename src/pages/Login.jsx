import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { BookOpen, LogIn, ShieldCheck, Sparkles } from "lucide-react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  useEffect(() => {
    if (user) {
      toast.success("Login successful");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-stretch px-6 py-10">
        <div className="grid w-full overflow-hidden border border-[var(--line)] bg-[var(--surface)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative bg-[var(--accent)] text-white p-8">
            <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[var(--accent-2)]/20 blur-2xl" aria-hidden="true" />
            <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
            <div className="relative z-10 flex h-full flex-col gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                  Librams
                </p>
                <h1 className="text-3xl font-semibold">Library Desk</h1>
                <p className="text-sm text-white/70 mt-2">
                  Sign in to manage circulation and keep shelves moving.
                </p>
              </div>
              <div className="space-y-4 text-sm text-white/85">
                <div className="flex items-center gap-3">
                  <BookOpen size={18} />
                  Fast access to books, issues, and holds.
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} />
                  Secure account controls for staff and students.
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles size={18} />
                  Clean workflow built for the front desk.
                </div>
              </div>
              <p className="mt-auto text-xs text-white/70">
                Use your campus credentials to continue.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text-strong)]">
                  Welcome back
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Access your library desk workspace.
                </p>
              </div>

              <Input
                type="email"
                name="email"
                label="Email"
                placeholder="you@school.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Button type="submit" disabled={loading} className="w-full">
                <span className="inline-flex items-center justify-center gap-2">
                  <LogIn size={16} />
                  {loading ? "Logging in..." : "Login"}
                </span>
              </Button>

              <div className="flex flex-wrap items-center justify-between text-sm text-[var(--text-muted)]">
                <span>Need access?</span>
                <Link to="/register" className="text-[var(--accent)]">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}