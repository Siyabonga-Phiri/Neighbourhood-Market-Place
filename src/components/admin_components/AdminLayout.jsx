import { Outlet } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";

export default function AdminLayout() {
  return (
    <div className="admin-layout">

      <AdminSideBar />

      <div className="admin-main">

        <div className="admin-content">
          <Outlet />
        </div>

        <footer className="admin-footer">
          © 2026 Neighbourhood Market Admin
        </footer>

      </div>

    </div>
  );
}