import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

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
        `http://localhost:8081/api/users/profile/${userId}`,
      );

      const profileData = await profileRes.json();

      setProfile(profileData);

      setBio(profileData.bio || "");

      const requestRes = await fetch(
        `http://localhost:8081/api/requests/user/${userId}`,
      );

      const requestData = await requestRes.json();

      setRequests(Array.isArray(requestData) ? requestData : []);

      const serviceRes = await fetch(
        `http://localhost:8081/api/services/provider/${userId}`,
      );

      const serviceData = await serviceRes.json();

      setServices(Array.isArray(serviceData) ? serviceData : []);

      const clientBookingRes = await fetch(
        `http://localhost:8081/api/bookings/user/${userId}`,
      );

      const clientData = await clientBookingRes.json();

      setBookingsAsClient(Array.isArray(clientData) ? clientData : []);

      const providerBookingRes = await fetch(
        `http://localhost:8081/api/bookings/provider/${userId}`,
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

      const uploadRes = await fetch("http://localhost:8081/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      await fetch(
        `http://localhost:8081/api/users/profile-image/${userId}`,

        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            profileImage: uploadData.imageUrl,
          }),
        },
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
      `http://localhost:8081/api/users/profile/${userId}`,

      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          bio: bio,
        }),
      },
    );

    setEditing(false);

    fetchProfile();
  };

  const isAccepted = (status) => status?.toUpperCase?.() === "ACCEPTED";

  const activeProviderJobs = bookingsAsProvider.filter((b) =>
    isAccepted(b.status),
  );

  const activeClientJobs = bookingsAsClient.filter((b) => isAccepted(b.status));

  if (loading) return <p>Loading profile...</p>;

  if (!profile) return <p>User not found</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt="profile"
              style={{
                width: "60px",

                height: "60px",

                borderRadius: "50%",
              }}
            />
          ) : (
            <>
              {profile.firstName?.charAt(0)}

              {profile.lastName?.charAt(0)}
            </>
          )}
        </div>

        <div>
          <h1>
            {profile.firstName}

            {profile.lastName}
          </h1>

          <p>{profile.location}</p>

          <p className="email">{profile.email}</p>

          <p>{profile.bio || "No bio added"}</p>

          {isOwner && !editing && (
            <button onClick={() => setEditing(true)}>Edit Profile</button>
          )}

          {isOwner && editing && (
            <div className="edit-profile-box">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write your bio"
              />

              <button onClick={saveBio}>Save Bio</button>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />

              <button onClick={handleImageUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Picture"}
              </button>
            </div>
          )}

          {isOwner && (
            <div className="profile-stats">
              <p>
                Requests:
                {requests.length}
              </p>

              <p>
                Services:
                {services.length}
              </p>

              <p>
                Client Jobs:
                {bookingsAsClient.length}
              </p>

              <p>
                Provider Jobs:
                {bookingsAsProvider.length}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        {isOwner && (
          <button onClick={() => setActiveTab("overview")}>Overview</button>
        )}

        <button onClick={() => setActiveTab("requests")}>
          {isOwner ? "My Requests" : "Requests"}
        </button>

        {profile.role === "ROLE_PROVIDER" && (
          <button onClick={() => setActiveTab("services")}>
            {isOwner ? "My Services" : "Services Offered"}
          </button>
        )}

        {isOwner && (
          <button onClick={() => setActiveTab("activity")}>Activity</button>
        )}
      </div>

      <div className="profile-content">
        {activeTab === "overview" && isOwner && (
          <div>
            <p>
              Requests Posted:
              {requests.length}
            </p>

            <p>
              Services Offered:
              {services.length}
            </p>

            <p>
              Active Client Jobs:
              {activeClientJobs.length}
            </p>

            <p>
              Active Provider Jobs:
              {activeProviderJobs.length}
            </p>
          </div>
        )}

        {activeTab === "requests" && (
          <div>
            {requests.length === 0 ? (
              <p>No requests yet</p>
            ) : (
              requests.map((r) => (
                <div key={r.id} className="card">
                  <h3
                    onClick={() => navigate(`/requests/${r.id}`)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {r.title}
                  </h3>

                  <p>{r.description}</p>

                  <p>Budget: R{r.budget}</p>

                  <p>
                    Status:
                    {r.status}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "services" && profile.role === "ROLE_PROVIDER" && (
          <div>
            {services.length === 0 ? (
              <p>No services yet</p>
            ) : (
              services.map((s) => (
                <div key={s.id} className="card">
                  <h3
                    onClick={() => navigate(`/services/${s.id}`)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {s.title}
                  </h3>

                  <p>{s.description}</p>

                  <p>Price: R{s.price}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "activity" && isOwner && (
          <div>
            <h3>As Client</h3>

            {bookingsAsClient.map((b) => (
              <div key={b.id} className="card">
                <h3>{b.requestTitle}</h3>

                <p>
                  Status:
                  {b.status}
                </p>

                {isAccepted(b.status) && (
                  <div className="success-text">
                    <p>✔ Active Job</p>

                    <p>
                      Provider:
                      {b.provider?.name || "No provider"}
                    </p>

                    <p>
                      Phone:
                      {b.provider?.phone || "No phone"}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {profile.role === "ROLE_PROVIDER" && (
              <>
                <h3>As Provider</h3>

                {bookingsAsProvider.map((b) => (
                  <div key={b.id} className="card">
                    <h3>{b.requestTitle}</h3>

                    <p>
                      Status:
                      {b.status}
                    </p>

                    {isAccepted(b.status) && (
                      <div className="success-text">
                        <p>✔ Active Job</p>

                        <p>
                          Client:
                          {b.customer?.name || "No client"}
                        </p>

                        <p>
                          Phone:
                          {b.customer?.phone || "No phone"}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
