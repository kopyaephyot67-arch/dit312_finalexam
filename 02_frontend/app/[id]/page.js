"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const API = process.env.NEXT_PUBLIC_API_HOST;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  async function fetchProduct() {
    try {
      const res = await fetch(`${API}/products/${params.id}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load product");
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`${API}/products/${params.id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      alert("Product deleted successfully!");
      router.push("/");
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="empty">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="empty">Product not found</div>
        <Link href="/" className="btn btn-primary">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <Link href="/" className="back-link">← Back to Products</Link>
      </header>

      <div className="product-detail">
        <div className="product-detail-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>

        <div className="product-detail-content">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <span className="category-badge">{product.category}</span>
            <span className="stock-badge">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="product-price">${product.price}</div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || "No description available"}</p>
          </div>

          <div className="product-info">
            <div className="info-item">
              <strong>SKU:</strong> {product.slug}
            </div>
            <div className="info-item">
              <strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString()}
            </div>
            <div className="info-item">
              <strong>Updated:</strong> {new Date(product.updatedAt).toLocaleDateString()}
            </div>
          </div>

          <div className="product-actions">
            <Link href={`/edit/${product.id}`} className="btn btn-primary">
              ✏️ Edit Product
            </Link>
            <button 
              onClick={handleDelete} 
              disabled={deleting}
              className="btn btn-danger"
            >
              {deleting ? "Deleting..." : "🗑️ Delete Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}