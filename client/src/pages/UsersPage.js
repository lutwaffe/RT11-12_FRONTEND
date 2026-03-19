import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usersApi } from "../api";
import { useAuth } from "../AuthContext";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    usersApi.getAll().then((res) => setUsers(res.data)).catch(() => setError("Failed to load users"));
  }, []);

  const handleBlock = async (id) => {
    try {
      await usersApi.block(id);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, blocked: true } : u));
    } catch {
      setError("Failed to block user");
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Users</h1>
        <div className="header-actions">
          <Link to="/products"><button>Products</button></Link>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className={u.blocked ? "blocked-row" : ""}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.blocked ? "Blocked" : "Active"}</td>
              <td>
                <div className="card-actions">
                  <Link to={`/users/${u.id}/edit`}><button>Edit</button></Link>
                  {!u.blocked && u.id !== currentUser?.id && (
                    <button className="btn-danger" onClick={() => handleBlock(u.id)}>Block</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
