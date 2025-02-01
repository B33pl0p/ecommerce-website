"use client"; // ✅ Ensure this runs on the client

import { useSearch } from "@/context/SearchContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const { selectedProduct } = useSearch(); // ✅ Retrieve stored product from Context API
  const router = useRouter();

  useEffect(() => {
    if (!selectedProduct) {
      router.replace("/"); // ✅ Redirect to home if no product is found
    }
  }, [selectedProduct, router]);

  if (!selectedProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-gray-500 text-lg">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col lg:flex-row items-center lg:items-start lg:justify-center">
      {/* Product Image */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <img
          src={selectedProduct.image_url}
          alt={selectedProduct.name}
          className="w-full max-w-md rounded-md mt-4 shadow-md"
        />
      </div>

      {/* Product Details */}
      <div className="w-full lg:w-1/2 text-center lg:text-left lg:pl-8 mt-6 lg:mt-0">
        <h1 className="text-3xl font-bold">{selectedProduct.name}</h1>
        <p className="text-gray-700 text-lg mt-2">
          {selectedProduct.price ? `Price: Rs ${selectedProduct.price.toFixed(2)}` : "Price: N/A"}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Category:</strong> {selectedProduct.category || "Unknown"}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Master Category:</strong> {selectedProduct.master_category || "N/A"}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Article Type:</strong> {selectedProduct.article_type || "N/A"}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Gender:</strong> {selectedProduct.gender || "N/A"}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Season:</strong> {selectedProduct.season || "N/A"}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Year:</strong> {selectedProduct.year || "N/A"}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Rating:</strong> {selectedProduct.rating ? `${selectedProduct.rating} ⭐` : "No Rating"}
        </p>

        {/* Buy Now Button */}
        <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Buy Now
        </button>
      </div>
    </div>
  );
}
