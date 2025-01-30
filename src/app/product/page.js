"use client"; // ✅ Ensure this is a client component

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";

const ProductDetails = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id"); // Get product ID from query params
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (productId) {
      axios
        .get(`https://YOUR_BACKEND_URL/products/${productId}`)
        .then((res) => setProduct(res.data))
        .catch((err) => console.error("Error fetching product:", err));
    }
  }, [productId]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <img src={product.image_url} alt={product.name} className="w-full max-w-lg rounded-md mt-4" />
      <p className="text-gray-700 text-lg mt-2">{product.price ? `Price: $${product.price}` : "Price: N/A"}</p>
      <p className="text-gray-600 mt-2">Category: {product.category_name || "Unknown"}</p>
      <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Buy Now
      </button>
    </div>
  );
};

// ✅ Wrap in Suspense Boundary
export default function ProductPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-500">Loading product...</p>}>
      <ProductDetails />
    </Suspense>
  );
}
