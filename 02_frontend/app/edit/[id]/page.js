"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const API = process.env.NEXT_PUBLIC_API_HOST;
  
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  async function fetchProduct() {
    try {
      const res = await fetch(`${API}/products/${params.id}`);
      if (!res.ok) throw new Error("Product not found");
      
      const data = await res.json();
      setForm({
        name: data.name,
        slug: data.slug,
        description: data.description || "",
        price: data.price,
        category: data.category,
        stock: data.stock,
        imageUrl: data.imageUrl || "",
      });
      setCurrentImage(data.imageUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to load product");
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'imageUrl' && image) {
          // Skip imageUrl if uploading new file
          return;
        }
        formData.append(key, form[key]);
      });
      
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${API}/products/${params.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update product");
      }

      alert("Product updated successfully!");
      router.push(`/${params.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="empty">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">✏️ Edit Product</h1>
        <p className="subtitle">Update product information</p>
      </header>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Slug *</label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="input"
            />
            <small>Must be unique</small>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="input"
              />
            </div>

            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="select"
            >
              <option value="">Select category...</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Current Image</label>
            {currentImage && (
              <div className="current-image">
                <img src={currentImage} alt="Current" onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }} />
                <div style={{ display: 'none', padding: '2rem', background: '#f1f5f9', borderRadius: '0.5rem', textAlign: 'center', color: '#64748b' }}>
                  Image not available
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Update Image URL (Optional)</label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="input"
            />
            <small>Enter new image URL or upload file below</small>
          </div>

          <div className="form-group">
            <label>Or Upload New Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input-file"
            />
            <small>Max size: 5MB. Formats: JPG, PNG, GIF, WebP</small>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link href={`/${params.id}`} className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}