import { useEffect, useState } from "react";
import "./admin.css";

export default function AdminDashboard() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading dashboard:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>No data available</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">

        <div className="card">
          <h3>Users</h3>
          <p>{stats.users}</p>
        </div>

        <div className="card">
          <h3>Providers</h3>
          <p>{stats.providers}</p>
        </div>

        <div className="card">
          <h3>Services</h3>
          <p>{stats.services}</p>
        </div>

        <div className="card">
          <h3>Requests</h3>
          <p>{stats.requests}</p>
        </div>

        <div className="card">
          <h3>Bookings</h3>
          <p>{stats.bookings}</p>
        </div>

      </div>
    </div>
  );
}