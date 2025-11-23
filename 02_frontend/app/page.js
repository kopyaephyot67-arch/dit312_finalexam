"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const API = process.env.NEXT_PUBLIC_API_HOST;

  const allCategories = [
    "Electronics",
    "Furniture",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Other"
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      let url = `${API}/products?`;
      if (search) url += `search=${search}&`;
      if (category) url += `category=${category}&`;
      if (minPrice) url += `minPrice=${minPrice}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;
      
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchProducts();
  }

  function resetFilters() {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setTimeout(fetchProducts, 100);
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">🛍️ ShopHub Store</h1>
        <p className="subtitle">Browse, search, and manage products</p>
      </header>

      <div className="actions">
        <Link href="/add" className="btn btn-primary">
          + Add New Product
        </Link>
      </div>

      <form onSubmit={handleSearch} className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
        
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="select"
        >
          <option value="">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="input-small"
        />
        
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="input-small"
        />
        
        <button type="submit" className="btn btn-primary">Search</button>
        <button type="button" onClick={resetFilters} className="btn btn-secondary">Reset</button>
      </form>

      {loading ? (
        <div className="empty">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty">No products found</div>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <div key={p.id} className="card">
              {p.imageUrl && (
                <div className="card-image">
                  <img src={p.imageUrl} alt={p.name} />
                </div>
              )}
              <div className="card-body">
                <h3 className="card-title">{p.name}</h3>
                <p className="card-desc">{p.description?.substring(0, 100)}...</p>
                <div className="card-meta">
                  <span className="price">${p.price}</span>
                  <span className="stock">Stock: {p.stock}</span>
                </div>
                <div className="card-actions">
                  <Link href={`/${p.id}`} className="btn-link">View</Link>
                  <Link href={`/edit/${p.id}`} className="btn-link">Edit</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}