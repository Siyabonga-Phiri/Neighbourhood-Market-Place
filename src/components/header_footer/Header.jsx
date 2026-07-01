import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import "./header_styles.css";

function Header() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Header must be used inside AuthProvider");
  }

  const { user, logout } = context;
  const navigate = useNavigate();

  const isAdmin = user?.role === "ROLE_ADMIN";

  return (
    <header className="header">

      <h2 className="logo">NeighbourHood Gig</h2>

      <nav>
        <ul>

          <li><Link to="/">Home</Link></li>
          <li><Link to="/browse">Browse</Link></li>

          {!user ? (
            <>
              <li><Link to="/login">Login</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>

              {/* 👤 Profile */}
              <li>
                <button
                  onClick={() => navigate(`/profile/${user.id}`)}
                  className="profile-btn"
                >
                  My Profile
                </button>
              </li>

              {/* 🔥 ADMIN BUTTON (ONLY ADMIN) */}
              {isAdmin && (
                <li>
                  <button
                    onClick={() => navigate("/admin")}
                    className="admin-btn"
                  >
                    Admin Panel
                  </button>
                </li>
              )}

              {/* Logout */}
              <li>
                <button onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          )}

        </ul>
      </nav>

    </header>
  );
}

export default Header;