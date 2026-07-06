import { useEffect, useState } from "react";

export default function ClientRequests({ userId }) {
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
fetch(`${import.meta.env.VITE_API_URL}/api/bookings/user/${userId}`)
.then(res => res.json())
.then(data => {
setBookings(data);
setLoading(false);
})
.catch(err => {
console.error("Failed to load bookings", err);
setLoading(false);
});
}, [userId]);

const handleWhatsApp = (phone, providerName) => {
const url = `https://wa.me/${phone}?text=Hi ${providerName}, I accepted your offer.`;
window.open(url, "_blank");
};

if (loading) return <p>Loading requests...</p>;

return ( <div className="requests-container"> <h2>My Requests</h2>

```
  {bookings.length === 0 && <p>No requests yet.</p>}

  {bookings.map((booking) => (
    <div key={booking.id} className="request-card">

      <h3>{booking.request?.title || "Request"}</h3>
      <p>{booking.request?.description}</p>

      <hr />

      <h4>Provider Offer</h4>
      <p><strong>Name:</strong> {booking.provider?.firstName} {booking.provider?.lastName}</p>
      <p><strong>Price:</strong> R{booking.request?.budget || "N/A"}</p>
      <p><strong>Status:</strong> {booking.status}</p>

      {/* UNLOCK CONTACT ONLY AFTER ACCEPTANCE */}
      {booking.status === "ACCEPTED" && (
        <div className="contact-box">
          <p><strong>Phone:</strong> {booking.provider?.phoneNumber}</p>

          <button
            onClick={() =>
              handleWhatsApp(
                booking.provider?.phoneNumber,
                booking.provider?.firstName
              )
            }
          >
            WhatsApp Provider
          </button>
        </div>
      )}

      {/* ACTIONS ONLY FOR PENDING */}
      {booking.status === "PENDING" && (
        <div className="actions">
          <p>Waiting for response...</p>
        </div>
      )}

      {booking.status === "REJECTED" && (
        <p style={{ color: "red" }}>Offer rejected</p>
      )}

    </div>
  ))}
</div>


);
}
