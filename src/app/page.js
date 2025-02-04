"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import CategoryGrid from "./components/CategoryGrid";
import Header from "./components/Header";
import ProductGrid from "./components/ProductGrid";
import IP_ADDRESSES from "./components/IPAddresses";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // ✅ Track page number for pagination
  const [hasMore, setHasMore] = useState(true); // ✅ Stop fetching when no more data
  const [selectedCategory, setSelectedCategory] = useState(null);
  const observerRef = useRef(null); // ✅ Observer for infinite scrolling

  // ✅ Fetch products (either all or filtered by category)
  const fetchProducts = async (reset = false, category = selectedCategory) => {
    if (!hasMore && !reset) return;

    setLoading(true);
    try {
      const endpoint = category
        ? `${IP_ADDRESSES.IP}/products?random=true&master_category=${encodeURIComponent(category)}&limit=10&skip=${reset ? 0 : page * 10}`
        : `${IP_ADDRESSES.IP}/products?random=true&limit=10&skip=${reset ? 0 : page * 10}`;

      const response = await axios.get(endpoint);

      if (response.data.length === 0) {
        setHasMore(false);
      }

      setProducts((prev) => (reset ? response.data : [...prev, ...response.data])); // ✅ Append new products
      setPage((prevPage) => (reset ? 1 : prevPage + 1)); // ✅ Update page number
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch products when the page loads
  useEffect(() => {
    fetchProducts(true);
  }, []);

  // ✅ Fetch new products when category changes
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setHasMore(true);
    setProducts([]); // ✅ Reset products list
    setPage(0);
    fetchProducts(true, category);
  };

  // ✅ Infinite scrolling logic (IntersectionObserver)
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchProducts(); // ✅ Load more products when user scrolls down
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="home-container bg-white">
      <Header />
      <SearchBar />

      {/* ✅ Pass category selection function */}
      <CategoryGrid onSelectCategory={handleCategorySelect} />

      <h2 className="text-2xl font-semibold text-gray-700 text-center mt-8">Featured Products</h2>

      {/* ✅ Product List */}
      <ProductGrid products={products} />

      {/* ✅ Infinite Scrolling Loader */}
      {loading && <p className="text-center text-gray-500 mt-4">Loading more products...</p>}

      {/* ✅ Bottom Observer for Infinite Scroll */}
      <div ref={observerRef} className="h-10"></div>
    </div>
  );
}
