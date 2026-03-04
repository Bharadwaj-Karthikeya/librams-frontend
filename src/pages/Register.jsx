import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { BookOpen, ShieldCheck, Sparkles, UserPlus, Users } from "lucide-react";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(register(formData));
  };

  useEffect(() => {
    if (!submitted) return;

    if (!loading && error) {
      toast.error(error);
      setSubmitted(false);
    }

    if (!loading && !error) {
      toast.success("Registration successful. Please login.");
      setSubmitted(false);
      navigate("/");
    }
  }, [submitted, loading, error, navigate]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-stretch px-6 py-10">
        <div className="grid w-full overflow-hidden border border-[var(--line)] bg-[var(--surface)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative bg-[var(--accent)] text-white p-8">
            <div className="absolute -top-24 -left-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
            <div className="absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-[var(--accent-2)]/20 blur-2xl" aria-hidden="true" />
            <div className="relative z-10 flex h-full flex-col gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                  Librams
                </p>
                <h1 className="text-3xl font-semibold">Create your account</h1>
                <p className="text-sm text-white/70 mt-2">
                  Join the library desk and start managing your shelf.
                </p>
              </div>
              <div className="space-y-4 text-sm text-white/85">
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  Pick the role that matches your access level.
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen size={18} />
                  Track your active loans and due dates.
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} />
                  Secure onboarding for staff and admins.
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles size={18} />
                  Fast setup and a focused workspace.
                </div>
              </div>
              <p className="mt-auto text-xs text-white/70">
                Already registered? Use your credentials to sign in.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text-strong)]">
                  Register
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Create a new library account in seconds.
                </p>
              </div>

              <Input
                type="text"
                name="name"
                label="Full name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

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
                placeholder="Create a password"
                helperText="Minimum 6 characters."
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Select
                name="role"
                label="Role"
                value={formData.role}
                onChange={handleChange}
                helperText="Staff and admin roles may require approval."
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </Select>

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <UserPlus size={16} />
                  {loading ? "Registering..." : "Create account"}
                </span>
              </Button>

              <div className="flex flex-wrap items-center justify-between text-sm text-[var(--text-muted)]">
                <span>Already have an account?</span>
                <Link to="/" className="text-[var(--accent)]">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}