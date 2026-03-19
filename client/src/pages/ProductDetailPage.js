import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productsApi } from "../api";
import { useAuth } from "../AuthContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    productsApi.getById(id).then((res) => setProduct(res.data)).catch(() => setError("Product not found"));
  }, [id]);

  const handleDelete = async () => {
    try {
      await productsApi.remove(id);
      navigate("/products");
    } catch {
      setError("Failed to delete");
    }
  };

  if (error) return <div className="container"><p className="error">{error}</p><Link to="/products">Back</Link></div>;
  if (!product) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <div className="card-actions">
        {hasRole("seller", "admin") && <Link to={`/products/${id}/edit`}><button>Edit</button></Link>}
        {hasRole("admin") && <button className="btn-danger" onClick={handleDelete}>Delete</button>}
        <Link to="/products"><button>Back</button></Link>
      </div>
    </div>
  );
}
