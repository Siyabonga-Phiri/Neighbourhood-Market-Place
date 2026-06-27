import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {

    const { user } = useContext(AuthContext);
    const userId = user?.id;

    const [profile, setProfile] = useState(null);
    const [requests, setRequests] = useState([]);
    const [services, setServices] = useState([]);
    const [bookingsAsProvider, setBookingsAsProvider] = useState([]);
    const [bookingsAsClient, setBookingsAsClient] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= SAFE ARRAY PARSER =================
    const safeArray = async (res) => {
        try {
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    };

    // ================= FETCH PROFILE (MOVED ABOVE useEffect) =================
    const fetchProfile = async () => {

        if (!userId) return;

        try {
            setLoading(true);

            // PROFILE
            const profileRes = await fetch(
                `http://localhost:8081/api/users/profile/${userId}`
            );
            const profileData = await profileRes.json();
            setProfile(profileData);

            // REQUESTS
            const requestRes = await fetch(
                `http://localhost:8081/api/requests/user/${userId}`
            );
            setRequests(await safeArray(requestRes));

            // CLIENT BOOKINGS
            const clientBookingRes = await fetch(
                `http://localhost:8081/api/bookings/user/${userId}`
            );
            setBookingsAsClient(await safeArray(clientBookingRes));

            // PROVIDER LOGIC (use Persona.id from profile)
            const providerId = profileData?.id;

            if (providerId) {

                const serviceRes = await fetch(
                    `http://localhost:8081/api/services/provider/${providerId}`
                );
                setServices(await safeArray(serviceRes));

                const providerBookingRes = await fetch(
                    `http://localhost:8081/api/bookings/provider/${providerId}`
                );
                setBookingsAsProvider(await safeArray(providerBookingRes));
            }

        } catch (err) {
            console.error("Profile load error:", err);
        } finally {
            setLoading(false);
        }
    };

    // ================= EFFECT =================
    useEffect(() => {
        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    // ================= GUARDS =================
    if (!userId) return <p>No user logged in</p>;
    if (loading) return <p>Loading profile...</p>;
    if (!profile) return <p>User not found</p>;

    const isAccepted = (status) =>
        typeof status === "string" && status.toUpperCase() === "ACCEPTED";

    const isProvider = Boolean(profile?.providerDetails?.id);

    return (
        <div>
            <h1>{profile.firstName} {profile.lastName}</h1>

            <p>{isProvider ? "Provider" : "Client"}</p>

            <p>Requests: {requests.length}</p>
            <p>Client Bookings: {bookingsAsClient.length}</p>
            <p>Provider Bookings: {bookingsAsProvider.length}</p>
            <p>Services: {services.length}</p>
        </div>
    );
}