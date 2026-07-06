import { useEffect, useState } from "react";

export default function ManageRequests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/requests`)
      .then(res => res.json())
      .then(data => {
        console.log("REQUESTS API:", data);

        setRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading requests:", err);
        setRequests([]);
        setLoading(false);
      });
  }, []);

  const deleteRequest = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/requests/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setRequests(prev => prev.filter(r => r.id !== id));
      })
      .catch(err => console.error("Delete failed:", err));
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div>
      <h1>Manage Requests</h1>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Budget</th>
            <th>Location</th>
            <th>Date Needed</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.title}</td>
              <td>{req.description}</td>
              <td>R {req.budget}</td>
              <td>{req.location}</td>
              <td>{req.dateNeeded}</td>

              <td>
                <button
                  onClick={() => deleteRequest(req.id)}
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