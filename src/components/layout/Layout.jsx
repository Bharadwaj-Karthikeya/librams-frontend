import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice.js";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import useAuth from "../../hooks/useAuth.jsx";

export default function Layout({ children }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const density = user?.role === "student" ? "spacious" : "compact";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen flex" data-density={density}>
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}