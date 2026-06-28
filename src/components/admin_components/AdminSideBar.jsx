import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar() {

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>

      <nav>

        <Link
          to="/admin"
          className={isActive("/admin") ? "active" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/admin/users"
          className={isActive("/admin/users") ? "active" : ""}
        >
          Users
        </Link>

        <Link
          to="/admin/services"
          className={isActive("/admin/services") ? "active" : ""}
        >
          Services
        </Link>

        <Link
          to="/admin/requests"
          className={isActive("/admin/requests") ? "active" : ""}
        >
          Requests
        </Link>

        <Link
          to="/admin/bookings"
          className={isActive("/admin/bookings") ? "active" : ""}
        >
          Bookings
        </Link>

      </nav>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}