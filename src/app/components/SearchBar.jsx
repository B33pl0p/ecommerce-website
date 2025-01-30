"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ For navigation
import axios from "axios";
import ImagePickerModal from "./ImagePickerModal";
import IP_ADDRESSES from "./IPAddresses";
import { useSearch } from "@/context/SearchContext";

export default function SearchBar() {
  const [query, setQuery] = useState(""); // ✅ Store search query
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Modal state
  const { setSearchResults } = useSearch(); // ✅ Get Context API function
  const router = useRouter(); // ✅ Use Next.js router

  // Open the modal
  const openImagePicker = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeImagePicker = () => {
    setIsModalOpen(false);
  };

  // Handle image selection from modal
  const handleImageSelected = (image) => {
    console.log("Selected Image:", image);
    setIsModalOpen(false);
  };

  // ✅ Handle text search submission when user presses Enter
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();

      try {
        const response = await axios.post(`${IP_ADDRESSES.IP}/upload_text`, { query_text: query },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data.result;
        console.log("Text Search Response:", data);

        if (data) {
          setSearchResults(data); // ✅ Store search results in context
          router.push("/ResultsScreen"); // ✅ Navigate to results screen
        } else {
          console.error("No products found.");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  return (
    <div className="w-full  flex items-center shadow-md">
      {/* ✅ Handle text input with Enter key */}
      <input
        type="text"
        placeholder="Enter text or upload an image"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown} // ✅ Detect Enter key press
        className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500"
      />

      {/* Camera Icon */}
      <button
        onClick={openImagePicker}
        className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10l4.553 2.276a1 1 0 010 1.448L15 16M15 10l-4.553 2.276a1 1 0 000 1.448L15 16M12 4v2m0 12v2m-7-7h2m12 0h2m-3 3l1.5 1.5M5 8l-1.5-1.5"
          />
        </svg>
      </button>

      {/* Image Picker Modal */}
      {isModalOpen && (
        <ImagePickerModal
          isOpen={isModalOpen}
          onClose={closeImagePicker}
          onImageSelected={handleImageSelected}
        />
      )}
    </div>
  );
}
