import { useEffect, useState } from "react";

export default function ManageServices() {

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/api/admin/services")
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading services:", err);
        setLoading(false);
      });
  }, []);

  const deleteService = (id) => {
    fetch(`http://localhost:8081/api/admin/services/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setServices(services.filter(s => s.id !== id));
      })
      .catch(err => console.error("Delete failed:", err));
  };

  if (loading) return <p>Loading services...</p>;

  return (
    <div>
      <h1>Manage Services</h1>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Location</th>
            <th>Provider</th>
            <th>Available</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {services.map(service => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.title}</td>
              <td>{service.category}</td>
              <td>R {service.price}</td>
              <td>{service.location}</td>

              {/* IMPORTANT: matches your backend structure */}
              <td>
                {service.providerName || service.providerUserId}
              </td>

              <td>
                {service.available ? "Yes" : "No"}
              </td>

              <td>
                <button
                  onClick={() => deleteService(service.id)}
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