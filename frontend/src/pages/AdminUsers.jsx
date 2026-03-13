import { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // ✅ Ensure users is always an array
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load users", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>All Registered Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            style={{
              display: "flex",
              gap: "15px",
              padding: "15px",
              borderBottom: "1px solid #ddd",
              alignItems: "center",
            }}
          >
            <img
              src={
                user.avatar
                  ? `http://localhost:5000${user.avatar}`
                  : `https://ui-avatars.com/api/?name=${user.name}`
              }
              alt={user.name}
              width="50"
              height="50"
              style={{ borderRadius: "50%" }}
            />

            <div>
              <p><b>{user.name}</b></p>
              <p>{user.email}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminUsers;
