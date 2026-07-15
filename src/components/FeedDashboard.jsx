import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProviderCard from "./provider_components/ProviderCard";
import RequestCard from "./request_components/RequestCard";
import "./styles/FeedDashboard.css";

export default function FeedDashboard() {

const navigate = useNavigate();

  const [feedItems, setFeedItems] = useState([]);
  const [filteredFeed, setFilteredFeed] = useState([]);

  const [feedType, setFeedType] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // =========================
  // GET CURRENT USER
  // =========================
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setCurrentUserId(data?.id);

      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchMe();
  }, []);

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    filterFeed();
  }, [feedItems, feedType, categoryFilter, keyword, location]);

  // =========================
  // LOAD FEED
  // =========================
  const loadFeed = async () => {

    try {
      setLoading(true);

      const [servicesResponse, requestsResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/services`),
        fetch(`${import.meta.env.VITE_API_URL}/api/requests`)
      ]);

      const servicesData = await servicesResponse.json();
      const requestsData = await requestsResponse.json();

      const providerCache = {};

      const servicesWithProviders = await Promise.all(
        servicesData.map(async (service) => {

          const providerId =
            service.providerId ||
            service.providerUserId;

          try {

            if (!providerCache[providerId]) {
              const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/users/profile/${providerId}`
              );

              providerCache[providerId] = await res.json();
            }

            return {
              ...service,
              providerDetails: providerCache[providerId],
              feedType: "service"
            };

          } catch (err) {

            console.error("Provider load failed", err);

            return {
              ...service,
              providerDetails: null,
              feedType: "service"
            };
          }
        })
      );

      const formattedRequests = requestsData.map(request => ({
        ...request,
        feedType: "request"
      }));

      const combinedFeed = [
        ...servicesWithProviders,
        ...formattedRequests
      ];

      // 🔥 NEWEST FIRST (safe fallback)
      combinedFeed.sort((a, b) => (b.id || 0) - (a.id || 0));

      setFeedItems(combinedFeed);

    } catch (error) {
      console.error("Failed to load feed", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE SERVICE (OPTIMISTIC + SYNC)
  // =========================
  const handleDeleteService = async (id) => {

    const confirmDelete = window.confirm("Delete this service?");
    if (!confirmDelete) return;

    try {

      // 🔥 Optimistic UI update first (instant removal)
      setFeedItems(prev =>
        prev.filter(item => !(item.feedType === "service" && item.id === id))
      );

      setFilteredFeed(prev =>
        prev.filter(item => !(item.feedType === "service" && item.id === id))
      );

      // backend delete
      await fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}`, {
        method: "DELETE"
      });

    } catch (err) {
      console.error("Delete failed", err);

      // fallback reload if something breaks
      loadFeed();
    }
  };

  // =========================
  // FILTER FEED
  // =========================
  const filterFeed = () => {

    let filtered = [...feedItems];

    if (feedType !== "all") {
      filtered = filtered.filter(item => item.feedType === feedType);
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        item => item.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (keyword.trim()) {
      const k = keyword.toLowerCase();

      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(k) ||
        item.description?.toLowerCase().includes(k) ||
        item.service?.toLowerCase().includes(k)
      );
    }

    if (location.trim()) {
      const l = location.toLowerCase();

      filtered = filtered.filter(item =>
        item.location?.toLowerCase().includes(l)
      );
    }

    setFilteredFeed(filtered);
  };

  const categories = [
    ...new Set(
      feedItems
        .filter(i => i.feedType === "service")
        .map(s => s.category)
        .filter(Boolean)
    )
  ];

  return (
    <div className="feed-page">

      {/* SEARCH HEADER */}
      <section className="search-section">

        <h1>Neighbourhood Marketplace</h1>

        <div className="quick-actions">

  <div
    className="action-card"
    onClick={() => navigate("/become-provider")}
  >
    <div className="action-icon">🛠️</div>
    <h3>Offer a Service</h3>
    <p>Become a provider and start earning.</p>
  </div>

  <div
    className="action-card"
    onClick={() => navigate("/requests/create")}
  >
    <div className="action-icon">📢</div>
    <h3>Post a Request</h3>
    <p>Looking for help? Let providers find you.</p>
  </div>

  <div
    className="action-card"
    onClick={() => setFeedType("service")}
  >
    <div className="action-icon">🔍</div>
    <h3>Browse Services</h3>
    <p>Explore services offered near you.</p>
  </div>

</div>

        <div className="search-bar">

          <input
            type="text"
            placeholder="Search..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>

            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}

          </select>
            <button
    className="search-btn"
    onClick={filterFeed}
>
    Search
</button>
        </div>
      </section>

      {/* TYPE FILTERS */}
      <div className="feed-type-filters">

        <button
          className={feedType === "all" ? "active-filter" : ""}
          onClick={() => setFeedType("all")}
        >
          All
        </button>

        <button
          className={feedType === "service" ? "active-filter" : ""}
          onClick={() => setFeedType("service")}
        >
          Services
        </button>

        <button
          className={feedType === "request" ? "active-filter" : ""}
          onClick={() => setFeedType("request")}
        >
          Requests
        </button>

      </div>

      <div className="feed-content">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <h4>Categories</h4>

          <button
            className={categoryFilter === "" ? "active-filter" : ""}
            onClick={() => setCategoryFilter("")}
          >
            All
          </button>

          {categories.map(category => (
            <button
              key={category}
              className={categoryFilter === category ? "active-filter" : ""}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </button>
          ))}

        </aside>

        {/* FEED RESULTS */}
        <section className="providers-list">

          <div className="results-header">
            <h4>
              {filteredFeed.length} Result{filteredFeed.length !== 1 ? "s" : ""}
            </h4>
          </div>

          {loading ? (
            <p>Loading feed...</p>

          ) : filteredFeed.length === 0 ? (
            <div className="empty-state">
              <h3>No results found</h3>
              <p>Try adjusting your filters.</p>
            </div>

          ) : (

            filteredFeed.map(item => {

              const isClosedRequest =
                item.feedType === "request" && item.status === "CLOSED";

              const isActiveDeal =
                item.feedType === "request" && item.status === "IN_PROGRESS";

              return (
                <div
                  key={`${item.feedType}-${item.id}`}
                  className={`feed-item-wrapper
                    ${isClosedRequest ? "closed-request" : ""}
                    ${isActiveDeal ? "active-deal" : ""}
                  `}
                >

                  {isActiveDeal && (
                    <div className="business-badge">
                      🤝 In Business
                    </div>
                  )}

                  {isClosedRequest && (
                    <div className="closed-badge">
                      🔒 Completed
                    </div>
                  )}

                  {item.feedType === "service" ? (
                    <ProviderCard
                      provider={item}
                      currentUserId={currentUserId}
                      onDelete={handleDeleteService}
                    />
                  ) : (
                    <RequestCard request={item} />
                  )}

                </div>
              );
            })

          )}

        </section>

      </div>
    </div>
  );
}