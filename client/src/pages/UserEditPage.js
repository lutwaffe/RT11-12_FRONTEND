import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usersApi } from "../api";

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  useEffect(() => {
    usersApi.getById(id).then((res) => {
      setUsername(res.data.username);
      setRole(res.data.role);
    }).catch(() => setError("Failed to load user"));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await usersApi.update(id, { username, role });
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user");
    }
  };

  return (
    <div className="auth-container">
      <h1>Edit User</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
