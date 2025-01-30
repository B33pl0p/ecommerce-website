"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import IP_ADDRESSES from "./IPAddresses";
import { useSearch } from "@/context/SearchContext";

const ImagePickerModal = ({ onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const galleryInputRef = useRef(null); // ✅ Reference for gallery input
  const [isMobile, setIsMobile] = useState(false); // ✅ Detect mobile (iOS & Android)
  const router = useRouter();
  const { setSearchResults } = useSearch();

  // ✅ Detect if device is iOS or Android
  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  // ✅ Auto-open gallery when modal opens on mobile
  useEffect(() => {
    if (isMobile && galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  }, [isMobile]);

  // ✅ Handle image selection
  const selectFromGallery = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoUri(URL.createObjectURL(file));
      await uploadImage(file);
    }
  };

  // ✅ Upload image to backend
  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${IP_ADDRESSES.IP}/upload_image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data.result;
      console.log("API Response:", data);

      if (data) {
        setSearchResults(data);
        router.push("/ResultsScreen");
      } else {
        console.error("No products found.");
      }

      onClose();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative bg-black w-full h-full flex flex-col items-center justify-center">
        {isUploading ? (
          <p className="text-white text-lg">Uploading...</p>
        ) : (
          <div className="absolute bottom-5 flex justify-center space-x-6">
            {/* ✅ Hidden File Input (Auto-Triggers on Mobile) */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={galleryInputRef}
              onChange={selectFromGallery}
            />
          </div>
        )}

        {/* ✅ Close Modal */}
        <button onClick={onClose} className="absolute top-5 right-5 bg-white p-2 rounded-full hover:bg-gray-300">
          <FaTimes className="text-black text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default ImagePickerModal;
