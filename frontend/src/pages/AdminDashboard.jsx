import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h2>Admin Dashboard 📊</h2>

      <p>Total Orders: {stats.totalOrders}</p>
      <p>Orders Today: {stats.ordersToday}</p>
      <p>Total Revenue: ₹{stats.revenue}</p>

      <h3>Top Products</h3>
      <ul>
        {stats.topProducts.map(p => (
          <li key={p._id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
