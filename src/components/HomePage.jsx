import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import api from "../api/axiosConfig";
import "./styles/HomePage.css";



const servicesList = [
  "Cleaning",
  "Plumbing",
  "Tutoring",
  "Food",
  "Events & Decor",
  "Gardening",
  "Laundry",
  "Hair & Beauty",
  "Repairs",
];

export default function HomePage() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await api.get("/providers");
      setProviders(res.data);
    } catch (err) {
      console.log("Failed to load providers", err);
    }
  };

  const handleFilter = (service) => {
    navigate(`/feed?service=${service}`);
  };

  return (
    <div className="homepage">

      {/* WELCOME BANNER */}
      {user && (
        <section className="welcome-banner">
          <h3>
            Welcome back, {user.firstName}
          </h3>

          <p>
            Logged in as {user.role}
          </p>
        </section>
      )}

      {/* HERO SECTION */}
      <section className="hero">
        <h1>
          It Takes a Village.
          <br />
          Find Services Close to Home.
        </h1>

        <p>
          Discover trusted local providers, hire skilled neighbours,
          or post a request and let your community step up.
        </p>

        <div className="hero-buttons">

          {/* Everyone can browse */}
          <button onClick={() => navigate("/feed")}>
            Find a Service
          </button>

          {/* Guests */}
          {!user && (
            <button onClick={() => navigate("/register")}>
              Offer a Service
            </button>
          )}

          {/* Normal Users */}
          {user?.role === "ROLE_USER" && (
    <>
      <button onClick={() => navigate("/request")}>
        Post a Request
      </button>

      <button onClick={() => navigate("/provider/register")}>
        Become a Provider
      </button>
    </>
  )}

          {/* Providers */}
          {user?.role === "ROLE_PROVIDER" && (
            <>
              <button onClick={() => navigate("/request")}>
                Create Request
              </button>

              <button onClick={() => navigate("/services/create")}>
                Create Service
              </button>
            </>
          )}

        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section">
        <span className="section-label">
          Services
        </span>

        <h2>
          A wide range of
          <br />
          local services
        </h2>

        <div className="services-grid">
          {servicesList.map((service) => (
            <button
              key={service}
              className="service-btn"
              onClick={() => handleFilter(service)}
            >
              {service}
            </button>
          ))}
        </div>
      </section>

      {/* PROVIDER TOOLS */}
      {user?.role === "ROLE_PROVIDER" && (
        <section className="provider-actions">

          <span className="section-label">
            Provider Tools
          </span>

          <h2>
            Manage Your Business
          </h2>

          <div className="services-grid">

            <button
              className="service-btn"
              onClick={() => navigate("/services/create")}
            >
              Create Service
            </button>

            <button
              className="service-btn"
              onClick={() => navigate("/provider/services")}
            >
              My Services
            </button>

            <button
              className="service-btn"
              onClick={() => navigate("/provider/bookings")}
            >
              My Bookings
            </button>

          </div>

        </section>
      )}

      {/* FEATURED PROVIDERS */}
      <section className="providers-section">

        <span className="section-label">
          Providers
        </span>

        <h2>
          Featured Providers
        </h2>

        <div className="providers-grid">

          {providers.length === 0 ? (
            <p>No providers available yet</p>
          ) : (
            providers.slice(0, 5).map((provider) => (
              <div
                className="provider-card"
                key={provider.id}
              >

                <div className="provider-avatar"></div>

                <h4>
                  {provider.user?.firstName || "Provider"}
                </h4>

                <p>
                  {provider.category}
                </p>

              </div>
            ))
          )}

        </div>

      </section>

    </div>
  );
}