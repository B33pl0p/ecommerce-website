"use client";
import SearchBar from "./components/SearchBar";
import CategoryGrid from "./components/CategoryGrid";
import Header from "./components/Header";
import ProductGrid from "./components/ProductGrid";
import { useState, useEffect } from "react";
import axios from "axios";
import IP_ADDRESSES from "./components/IPAddresses";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all products when the page loads
  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Function to fetch all products OR filter by category
  const fetchProducts = async (category = null) => {
    setLoading(true);
    try {
      const endpoint = category
        ? `${IP_ADDRESSES.IP}/products?random=true&master_category=${encodeURIComponent(category)}`
        : `${IP_ADDRESSES.IP}/products`;

      const response = await axios.get(endpoint);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container bg-white">
      <Header />
      <SearchBar />

      {/* ✅ Pass fetchProducts to CategoryGrid for filtering */}
      <CategoryGrid onSelectCategory={fetchProducts} />

      <h2 className="text-2xl font-semibold text-gray-700 text-center mt-8">Featured Products</h2>

      {/* ✅ Show loading message when fetching */}
      {loading ? (
        <p className="text-center text-gray-500 mt-4">Loading products...</p>
      ) : (
        <ProductGrid products={products} /> // ✅ Pass the updated products
      )}
    </div>
  );
}
