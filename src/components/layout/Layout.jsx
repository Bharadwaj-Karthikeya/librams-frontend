import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import useAuth from "../../hooks/useAuth";

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