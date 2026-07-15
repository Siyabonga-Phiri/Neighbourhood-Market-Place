import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";

import "./styles/Profile.css";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [bookingsAsProvider, setBookingsAsProvider] = useState([]);
  const [bookingsAsClient, setBookingsAsClient] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");

  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");

  const isOwner = user?.id == userId;

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const profileRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile/${userId}`
      );

      const profileData = await profileRes.json();

      setProfile(profileData);
      setBio(profileData.bio || "");

      const requestRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/requests/user/${userId}`
      );

      const requestData = await requestRes.json();

      setRequests(Array.isArray(requestData) ? requestData : []);

      const serviceRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services/provider/${userId}`
      );

      const serviceData = await serviceRes.json();

      setServices(Array.isArray(serviceData) ? serviceData : []);

      const clientBookingRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/user/${userId}`
      );

      const clientData = await clientBookingRes.json();

      setBookingsAsClient(Array.isArray(clientData) ? clientData : []);

      const providerBookingRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/provider/${userId}`
      );

      const providerData = await providerBookingRes.json();

      setBookingsAsProvider(Array.isArray(providerData) ? providerData : []);
    } catch (err) {
      console.error("Profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", image);

      const uploadRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/upload/image`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile-image/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profileImage: uploadData.imageUrl,
          }),
        }
      );

      fetchProfile();
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const saveBio = async () => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/profile/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio,
        }),
      }
    );

    setEditing(false);
    fetchProfile();
  };

  const isAccepted = (status) => status?.toUpperCase?.() === "ACCEPTED";

  const activeProviderJobs = bookingsAsProvider.filter((b) =>
    isAccepted(b.status)
  );

  const activeClientJobs = bookingsAsClient.filter((b) =>
    isAccepted(b.status)
  );

  if (loading) return <p>Loading profile...</p>;

  if (!profile) return <p>User not found</p>;
  return (
  <div className="profile-container">

    <section className="profile-hero">

      <div className="profile-cover" />

      <div className="profile-hero-content">

        <div className="profile-avatar-large">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt="Profile"
            />
          ) : (
            <>
              {profile.firstName?.charAt(0)}
              {profile.lastName?.charAt(0)}
            </>
          )}
        </div>

        <div className="profile-details">

          <div className="profile-name-row">

            <div>

              <h1>
                {profile.firstName} {profile.lastName}
              </h1>

              <span className="profile-role">
                {profile.role === "ROLE_PROVIDER"
                  ? "Service Provider"
                  : "Community Member"}
              </span>

            </div>

            {isOwner && !editing && (
              <button
                className="edit-profile-btn"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}

          </div>

          <div className="profile-meta">

            <span>📍 {profile.location || "Location not provided"}</span>

            <span>{profile.email}</span>

          </div>

          <p className="profile-bio">
            {profile.bio ||
              "Tell your community a little about yourself."}
          </p>

          {isOwner && editing && (

            <div className="edit-profile-card">

              <h3>Edit Profile</h3>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people about yourself..."
              />

              <div className="profile-edit-actions">

                <button
                  className="save-btn"
                  onClick={saveBio}
                >
                  Save Bio
                </button>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />

                <button
                  className="upload-btn"
                  disabled={uploading}
                  onClick={handleImageUpload}
                >
                  {uploading
                    ? "Uploading..."
                    : "Upload Picture"}
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

    </section>

    {isOwner && (

      <section className="profile-stat-grid">

        <div className="stat-card">
          <span className="stat-number">
            {requests.length}
          </span>

          <span className="stat-label">
            Requests
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-number">
            {services.length}
          </span>

          <span className="stat-label">
            Services
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-number">
            {activeClientJobs.length}
          </span>

          <span className="stat-label">
            Client Jobs
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-number">
            {activeProviderJobs.length}
          </span>

          <span className="stat-label">
            Provider Jobs
          </span>
        </div>

      </section>

    )}

    <div className="profile-tabs">

      {isOwner && (
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
      )}

      <button
        className={activeTab === "requests" ? "active" : ""}
        onClick={() => setActiveTab("requests")}
      >
        {isOwner ? "My Requests" : "Requests"}
      </button>

      {profile.role === "ROLE_PROVIDER" && (
        <button
          className={activeTab === "services" ? "active" : ""}
          onClick={() => setActiveTab("services")}
        >
          {isOwner ? "My Services" : "Services"}
        </button>
      )}

      {isOwner && (
        <button
          className={activeTab === "activity" ? "active" : ""}
          onClick={() => setActiveTab("activity")}
        >
          Activity
        </button>
      )}

    </div>

    <div className="profile-content"></div>

    <div className="profile-content">

  {activeTab === "overview" && isOwner && (

    <div className="overview-grid">

      <div className="overview-card">
        <h3>Requests Posted</h3>
        <span>{requests.length}</span>
        <p>Jobs you've asked the community to help with.</p>
      </div>

      <div className="overview-card">
        <h3>Services Listed</h3>
        <span>{services.length}</span>
        <p>Services you're currently advertising.</p>
      </div>

      <div className="overview-card">
        <h3>Active Client Jobs</h3>
        <span>{activeClientJobs.length}</span>
        <p>Providers currently working for you.</p>
      </div>

      <div className="overview-card">
        <h3>Active Provider Jobs</h3>
        <span>{activeProviderJobs.length}</span>
        <p>Jobs you're currently completing.</p>
      </div>

    </div>

  )}

  {activeTab === "requests" && (

    <div className="profile-card-grid">

      {requests.length === 0 ? (

        <div className="empty-state">

          <h3>No Requests Yet</h3>

          <p>
            {isOwner
              ? "You haven't posted any requests yet."
              : "This user hasn't posted any requests."}
          </p>

        </div>

      ) : (

        requests.map((r) => (

          <div
            key={r.id}
            className="market-card"
          >

            <div className="market-card-top">

              <span className="category-pill">
                Request
              </span>

              <span
                className={`status-pill ${
                  r.status?.toUpperCase() === "OPEN"
                    ? "open"
                    : "closed"
                }`}
              >
                {r.status}
              </span>

            </div>

            <h3
              onClick={() => navigate(`/requests/${r.id}`)}
              className="clickable-title"
            >
              {r.title}
            </h3>

            <p className="card-description">
              {r.description}
            </p>

            <div className="market-card-footer">

              <span className="price">
                Budget: R{r.budget}
              </span>

              <button
                className="view-btn"
                onClick={() => navigate(`/requests/${r.id}`)}
              >
                View Details →
              </button>

            </div>

          </div>

        ))

      )}

    </div>

  )}

  {activeTab === "services" &&
    profile.role === "ROLE_PROVIDER" && (

      <div className="profile-card-grid">

        {services.length === 0 ? (

          <div className="empty-state">

            <h3>No Services Listed</h3>

            <p>
              {isOwner
                ? "You haven't listed any services yet."
                : "This provider hasn't listed any services."}
            </p>

          </div>

        ) : (

          services.map((s) => (

            <div
              key={s.id}
              className="market-card"
            >

              <div className="market-card-top">

                <span className="category-pill">
                  Service
                </span>

                <span className="price-tag">
                  R{s.price}
                </span>

              </div>

              <h3
                className="clickable-title"
                onClick={() => navigate(`/services/${s.id}`)}
              >
                {s.title}
              </h3>

              <p className="card-description">
                {s.description}
              </p>

              <div className="market-card-footer">

                <button
                  className="view-btn"
                  onClick={() => navigate(`/services/${s.id}`)}
                >
                  View Service →
                </button>

              </div>

            </div>

          ))

        )}

      </div>

  )}
{activeTab === "activity" && isOwner && (

  <div className="activity-layout">

    <section className="activity-section">

      <div className="section-header">
        <h2>My Client Jobs</h2>
        <span>{bookingsAsClient.length} Total</span>
      </div>

      {bookingsAsClient.length === 0 ? (

        <div className="empty-state">
          <h3>No Client Activity</h3>
          <p>
            Once providers accept your requests, they'll appear here.
          </p>
        </div>

      ) : (

        bookingsAsClient.map((b) => (

          <div
            key={b.id}
            className="activity-card"
          >

            <div className="activity-top">

              <h3>{b.requestTitle}</h3>

              <span
                className={`status-pill ${
                  isAccepted(b.status)
                    ? "accepted"
                    : "pending"
                }`}
              >
                {b.status}
              </span>

            </div>

            {isAccepted(b.status) ? (

              <div className="activity-info">

                <div>
                  <strong>Provider</strong>
                  <p>{b.provider?.name || "Unavailable"}</p>
                </div>

                <div>
                  <strong>Phone</strong>
                  <p>{b.provider?.phone || "Unavailable"}</p>
                </div>

              </div>

            ) : (

              <p className="waiting-text">
                Waiting for provider confirmation.
              </p>

            )}

          </div>

        ))

      )}

    </section>

    {profile.role === "ROLE_PROVIDER" && (

      <section className="activity-section">

        <div className="section-header">

          <h2>My Provider Jobs</h2>

          <span>{bookingsAsProvider.length} Total</span>

        </div>

        {bookingsAsProvider.length === 0 ? (

          <div className="empty-state">

            <h3>No Provider Activity</h3>

            <p>
              Jobs you accept will appear here.
            </p>

          </div>

        ) : (

          bookingsAsProvider.map((b) => (

            <div
              key={b.id}
              className="activity-card"
            >

              <div className="activity-top">

                <h3>{b.requestTitle}</h3>

                <span
                  className={`status-pill ${
                    isAccepted(b.status)
                      ? "accepted"
                      : "pending"
                  }`}
                >
                  {b.status}
                </span>

              </div>

              {isAccepted(b.status) ? (

                <div className="activity-info">

                  <div>
                    <strong>Client</strong>
                    <p>{b.customer?.name || "Unavailable"}</p>
                  </div>

                  <div>
                    <strong>Phone</strong>
                    <p>{b.customer?.phone || "Unavailable"}</p>
                  </div>

                </div>

              ) : (

                <p className="waiting-text">
                  Awaiting confirmation.
                </p>

              )}

            </div>

          ))

        )}

      </section>

    )}

  </div>

)}

    </div>
  </div>
);
}