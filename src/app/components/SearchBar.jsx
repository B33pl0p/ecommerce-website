"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Next.js router for navigation
import axios from "axios";
import ImagePickerModal from "./ImagePickerModal";
import IP_ADDRESSES from "./IPAddresses";
import { useSearch } from "@/context/SearchContext";
import { FaCamera, FaSearch } from "react-icons/fa"; // ✅ Proper camera icon

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
     

      try {
        const response = await axios.post(
          `${IP_ADDRESSES.IP}/upload_text`,
          { query_text: query },
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
    <div className="w-full flex items-center border border-gray-300 rounded-md shadow-md">
      {/* ✅ Search Input */}
      <input
        type="text"
        placeholder="Enter text or upload an image"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown} // ✅ Detect Enter key press
        className="flex-grow p-3 text-black outline-none rounded-l-md focus:ring-2 focus:ring-blue-500"
      />
      {/* ✅ Submit Button */}
      <button   onClick={() => handleKeyDown({ key: "Enter" })} className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center mx-0.5">
        <FaSearch className="w-6 h-6" />
      </button>

      {/* ✅ Camera Icon Button */}
      <button onClick={openImagePicker} className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center">
        <FaCamera className="w-6 h-6" />
      </button>

      {/* ✅ Image Picker Modal */}
      {isModalOpen && <ImagePickerModal isOpen={isModalOpen} onClose={closeImagePicker} onImageSelected={handleImageSelected} />}
    </div>
  );
}
