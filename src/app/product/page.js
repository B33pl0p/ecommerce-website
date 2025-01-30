"use client"; // ✅ Ensure this runs on the client

import { useSearch } from "@/context/SearchContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const { selectedProduct } = useSearch(); // ✅ Retrieve stored product from Context API
  const router = useRouter();

  useEffect(() => {
    if (!selectedProduct) {
      router.push("/"); // ✅ Redirect to home if no product is found
    }
  }, [selectedProduct]);

  if (!selectedProduct) return <p className="text-center text-gray-500">Loading product...</p>;

  return (
    <div className="container mx-auto px-6">
      <h1 className="text-3xl font-bold">{selectedProduct.name}</h1>
      <img
        src={selectedProduct.image_url}
        alt={selectedProduct.name}
        className="w-full max-w-lg rounded-md mt-4"
      />
      <p className="text-gray-700 text-lg mt-2">
        {selectedProduct.price ? `Price: $${selectedProduct.price}` : "Price: N/A"}
      </p>
      <p className="text-gray-600 mt-2">Category: {selectedProduct.category_name || "Unknown"}</p>
      <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Buy Now
      </button>
    </div>
  );
}
