import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Profile() {

    const { userId } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [requests, setRequests] = useState([]);
    const [services, setServices] = useState([]);
    const [bookingsAsProvider, setBookingsAsProvider] = useState([]);
    const [bookingsAsClient, setBookingsAsClient] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);

    // =========================
    // NEW: IMAGE STATES
    // =========================
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {

        try {
            setLoading(true);

            if (!userId) return;

            // PROFILE
            const profileRes = await fetch(
                `http://localhost:8081/api/users/profile/${userId}`
            );

            const profileData = await profileRes.json();
            setProfile(profileData || null);

            // REQUESTS
            const requestRes = await fetch(
                `http://localhost:8081/api/requests/user/${userId}`
            );

            const requestData = await requestRes.json();
            setRequests(Array.isArray(requestData) ? requestData : []);

            // CLIENT BOOKINGS
            const clientBookingRes = await fetch(
                `http://localhost:8081/api/bookings/user/${userId}`
            );

            const clientData = await clientBookingRes.json();
            setBookingsAsClient(Array.isArray(clientData) ? clientData : []);

            // PROVIDER LOGIC
            const providerId = profileData?.id;

            if (providerId) {

                const serviceRes = await fetch(
                    `http://localhost:8081/api/services/provider/${providerId}`
                );

                const serviceData = await serviceRes.json();
                setServices(Array.isArray(serviceData) ? serviceData : []);

                const providerBookingRes = await fetch(
                    `http://localhost:8081/api/bookings/provider/${providerId}`
                );

                const providerData = await providerBookingRes.json();
                setBookingsAsProvider(Array.isArray(providerData) ? providerData : []);
            }

        } catch (err) {
            console.error("Profile load error:", err);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // NEW: IMAGE UPLOAD
    // =========================
    const handleImageUpload = async () => {

        if (!image) return;

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("image", image);

            const uploadRes = await fetch(
                "http://localhost:8081/api/upload/image",
                {
                    method: "POST",
                    body: formData
                }
            );

            const uploadData = await uploadRes.json();

            await fetch(
                `http://localhost:8081/api/users/profile-image/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        profileImage: uploadData.imageUrl
                    })
                }
            );

            // refresh profile so image appears everywhere
            await fetchProfile();

        } catch (err) {
            console.error("Image upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    const isAccepted = (status) =>
        status?.toUpperCase?.() === "ACCEPTED";

    const isProvider = Boolean(
        profile?.id && (services.length > 0 || bookingsAsProvider.length > 0)
    );

    const activeProviderJobs =
        bookingsAsProvider.filter(b => isAccepted(b.status));

    const activeClientJobs =
        bookingsAsClient.filter(b => isAccepted(b.status));

    if (loading) return <p>Loading profile...</p>;
    if (!profile) return <p>User not found</p>;

    return (
        <div className="profile-container">

            {/* HEADER */}
            <div className="profile-header">

                {/* =========================
                    AVATAR (UPDATED WITH IMAGE)
                ========================= */}
                <div className="profile-avatar">

                    {profile.profileImage ? (
                        <img
                            src={profile.profileImage}
                            alt="profile"
                            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
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
                        {profile.firstName} {profile.lastName}
                    </h1>

                    <p>{profile.location}</p>

                    <p className="role-badge">
                        {isProvider ? "PROVIDER" : "CLIENT"}
                    </p>

                    <p className="email">{profile.email}</p>

                    {/* =========================
                        NEW: IMAGE UPLOAD UI
                    ========================= */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />

                    <button
                        onClick={handleImageUpload}
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Upload Picture"}
                    </button>

                    {/* STATS (UNCHANGED) */}
                    <div className="profile-stats">

                        {isProvider ? (
                            <>
                                <p>Services: {services.length}</p>
                                <p>Active Jobs: {activeProviderJobs.length}</p>
                                <p>Total Bookings: {bookingsAsProvider.length}</p>
                            </>
                        ) : (
                            <>
                                <p>My Requests: {requests.length}</p>
                                <p>Accepted Jobs: {activeClientJobs.length}</p>
                            </>
                        )}

                    </div>
                </div>
            </div>

            {/* TABS (UNCHANGED) */}
            <div className="profile-tabs">

                <button onClick={() => setActiveTab("overview")}>
                    Overview
                </button>

                <button onClick={() => setActiveTab("posts")}>
                    {isProvider ? "Services" : "My Requests"}
                </button>

                <button onClick={() => setActiveTab("activity")}>
                    Activity
                </button>

            </div>

            {/* CONTENT (UNCHANGED) */}
            <div className="profile-content">

                {/* OVERVIEW */}
                {activeTab === "overview" && (
                    <div>
                        {isProvider ? (
                            <>
                                <p>Services: {services.length}</p>
                                <p>Incoming Bookings: {bookingsAsProvider.length}</p>
                                <p>Active Jobs: {activeProviderJobs.length}</p>
                            </>
                        ) : (
                            <>
                                <p>Requests: {requests.length}</p>
                                <p>Accepted Jobs: {activeClientJobs.length}</p>
                            </>
                        )}
                    </div>
                )}

                {/* POSTS */}
                {activeTab === "posts" && (
                    <div>

                        {isProvider ? (

                            services.length === 0 ? (
                                <p>No services yet</p>
                            ) : (
                                services.map((s) => (
                                    <div key={s.id} className="card">
                                        <h3>{s.title}</h3>
                                        <p>{s.description}</p>
                                        <p>R{s.price}</p>
                                    </div>
                                ))
                            )

                        ) : (

                            requests.length === 0 ? (
                                <p>No requests yet</p>
                            ) : (
                                requests.map((r) => (
                                    <div
                                        key={r.id}
                                        className="card"
                                        onClick={() => navigate(`/requests/${r.id}`)}
                                    >
                                        <h3>{r.title}</h3>
                                        <p>{r.service}</p>
                                        <p>R{r.budget}</p>
                                        <p>Status: {r.status}</p>
                                    </div>
                                ))
                            )

                        )}

                    </div>
                )}

                {/* ACTIVITY (UNCHANGED) */}
                {activeTab === "activity" && (
                    <div>

                        {isProvider ? (

                            bookingsAsProvider.length === 0 ? (
                                <p>No activity yet</p>
                            ) : (
                                bookingsAsProvider.map((b) => (
                                    <div key={b.id} className="card">

                                        <h3>{b.requestTitle}</h3>
                                        <p>{b.notes}</p>
                                        <p>Status: {b.status}</p>

                                        {isAccepted(b.status) && (
                                            <div className="success-text">
                                                <p>✔ Active Job</p>
                                                <p>Client: {b.customer?.name}</p>
                                                <p>Phone: {b.customer?.phone}</p>
                                            </div>
                                        )}

                                    </div>
                                ))
                            )

                        ) : (

                            bookingsAsClient.length === 0 ? (
                                <p>No activity yet</p>
                            ) : (
                                bookingsAsClient.map((b) => (
                                    <div key={b.id} className="card">

                                        <h3>{b.requestTitle}</h3>
                                        <p>{b.notes}</p>
                                        <p>Status: {b.status}</p>

                                        {isAccepted(b.status) && (
                                            <div className="success-text">
                                                <p>✔ Active Job</p>
                                                <p>Provider: {b.provider?.name}</p>
                                                <p>Phone: {b.provider?.phone}</p>
                                            </div>
                                        )}

                                    </div>
                                ))
                            )

                        )}

                    </div>
                )}

            </div>
        </div>
    );
}