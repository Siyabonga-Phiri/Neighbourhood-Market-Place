import { useEffect, useState } from "react";

export default function ManageBookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/api/admin/bookings")
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading bookings:", err);
        setLoading(false);
      });
  }, []);

  const deleteBooking = (id) => {
    fetch(`http://localhost:8081/api/admin/bookings/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setBookings(bookings.filter(b => b.id !== id));
      })
      .catch(err => console.error("Delete failed:", err));
  };

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <h1>Manage Bookings</h1>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer ID</th>
            <th>Provider ID</th>
            <th>Service ID</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map(booking => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.customerId}</td>
              <td>{booking.providerId}</td>
              <td>{booking.serviceId}</td>
              <td>{booking.status}</td>
              <td>{booking.date}</td>

              <td>
                <button
                  onClick={() => deleteBooking(booking.id)}
                  style={{ background: "red", color: "white" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}