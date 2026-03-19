import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsApi } from "../api";

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      productsApi.getById(id).then((res) => {
        setName(res.data.name);
        setDescription(res.data.description);
        setPrice(String(res.data.price));
      }).catch(() => setError("Failed to load product"));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isEdit) {
        await productsApi.update(id, { name, description, price: Number(price) });
      } else {
        await productsApi.create({ name, description, price: Number(price) });
      }
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save product");
    }
  };

  return (
    <div className="auth-container">
      <h1>{isEdit ? "Edit Product" : "New Product"}</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" />
        <button type="submit">{isEdit ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}
