import { useEffect, useState } from "react";

export default function ManageUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/api/admin/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading users:", err);
        setLoading(false);
      });
  }, []);

  const deleteUser = (id) => {
    fetch(`http://localhost:8081/api/admin/users/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setUsers(users.filter(u => u.id !== id));
      })
      .catch(err => console.error("Delete failed:", err));
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h1>Manage Users</h1>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => deleteUser(user.id)}
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