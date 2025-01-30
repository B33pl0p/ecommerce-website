"use client";

import { useSearchParams } from "next/navigation";

export default function ProductDetails() {
  const searchParams = useSearchParams();
  
  // Retrieve product JSON from query
  const product = {
    id: searchParams.get("id"),
    name: searchParams.get("name"),
    image_url: searchParams.get("image_url"),
    price: searchParams.get("price"),
    category_name: searchParams.get("category_name"),
    rating: searchParams.get("rating"),
  };

  return (
    <div className="container mx-auto px-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full max-w-lg rounded-md mt-4"
      />
      <p className="text-gray-700 text-lg mt-2">
        {product.price ? `Price: $${product.price}` : "Price: N/A"}
      </p>
      <p className="text-gray-600 mt-2">Category: {product.category_name}</p>
      <p className="text-gray-600 mt-2">Rating: {product.rating || "N/A"}</p>

      <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Buy Now
      </button>
    </div>
  );
}
