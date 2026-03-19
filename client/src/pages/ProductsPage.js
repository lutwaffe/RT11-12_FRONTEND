import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productsApi } from "../api";
import { useAuth } from "../AuthContext";

export default function ProductsPage() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    productsApi.getAll().then((res) => setProducts(res.data)).catch(() => setError("Failed to load products"));
  }, []);

  const handleDelete = async (id) => {
    try {
      await productsApi.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Failed to delete product");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <header>
        <h1>Products</h1>
        <div className="header-actions">
          <span className="role-badge">{user?.role}</span>
          <span>{user?.username}</span>
          {hasRole("admin") && <Link to="/users"><button>Users</button></Link>}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      {hasRole("seller", "admin") && (
        <Link to="/products/new"><button className="btn-primary">Add Product</button></Link>
      )}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <div className="card-actions">
              <Link to={`/products/${product.id}`}><button>View</button></Link>
              {hasRole("seller", "admin") && (
                <Link to={`/products/${product.id}/edit`}><button>Edit</button></Link>
              )}
              {hasRole("admin") && (
                <button className="btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && <p>No products yet.</p>}
    </div>
  );
}
