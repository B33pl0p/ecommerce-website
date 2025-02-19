// Improved SearchBar Component
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ImagePickerModal from "./ImagePickerModal";
import IP_ADDRESSES from "./IPAddresses";
import { useSearch } from "@/context/SearchContext";
import { FaCamera, FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setSearchResults } = useSearch();
  const router = useRouter();

  const openImagePicker = () => setIsModalOpen(true);
  const closeImagePicker = () => setIsModalOpen(false);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && query.trim()) {
      try {
        const response = await axios.post(
          `${IP_ADDRESSES.IP}/upload_text?similarity_threshold=0.8&top_k=20`,
          { query_text: query },
          { headers: { "Content-Type": "application/json" } }
        );
        const data = response.data.result;
        if (data) {
          setSearchResults(data);
          router.push("/ResultsScreen");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  return (
    <div className="w-full flex items-center border border-gray-300 rounded-lg shadow-md bg-gray-100">
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow p-3 text-black outline-none bg-transparent rounded-l-lg focus:ring-2 focus:ring-blue-500"
      />
      <button onClick={() => handleKeyDown({ key: "Enter" })} className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
        <FaSearch className="w-6 h-6" />
      </button>
      <button onClick={openImagePicker} className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
        <FaCamera className="w-6 h-6" />
      </button>
      {isModalOpen && <ImagePickerModal isOpen={isModalOpen} onClose={closeImagePicker} />}
    </div>
  );
}
