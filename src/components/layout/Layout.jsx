import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Layout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Library</h2>

        <nav className="flex flex-col gap-4">
          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>

          <Link to="/books" className="hover:text-blue-600">
            Books
          </Link>

          {user?.role !== "student" && (
            <Link to="/issues" className="hover:text-blue-600">
              Issues
            </Link>
          )}

          {user?.role === "student" && (
            <Link to="/my-issues" className="hover:text-blue-600">
              My Issues
            </Link>
          )}

          <Link to="/profile" className="hover:text-blue-600">
            Profile
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Topbar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">
            Welcome, {user?.name || user?.email}
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}