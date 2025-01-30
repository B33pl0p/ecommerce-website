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

  // Fetch products when the page loads
  useEffect(() => {
    axios
    .get(`${IP_ADDRESSES.IP}/products`)
    .then((res) => {
     // console.log("API Response:", res.data); // Debug the response here
      setProducts(res.data);
    })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);
  console.log(products)
  return (
    <div className="home-container bg-white">
      <Header />
      <SearchBar />
      <CategoryGrid />

      {/* Product Section */}
      <h2 className="text-2xl font-semibold text-gray-700 text-center mt-8">Featured Products</h2>
      <ProductGrid products={products} /> {/* Pass full product JSON */}
    </div>
  );
}
