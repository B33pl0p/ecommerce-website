"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaCamera, FaSyncAlt, FaImages, FaTimes } from "react-icons/fa";
import IP_ADDRESSES from "./IPAddresses";
import { useSearch } from "@/context/SearchContext";

const ImagePickerModal = ({ onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const cameraStreamRef = useRef(null);
  const router = useRouter();
  const { setSearchResults } = useSearch(); // Get the function to update search results

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Camera API not supported.");
        setCameraPermission(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      setCameraEnabled(true);
      setCameraPermission(true);
      if (cameraStreamRef.current) {
        cameraStreamRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      setCameraPermission(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const stopCamera = () => {
    if (cameraStreamRef.current?.srcObject) {
      cameraStreamRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${IP_ADDRESSES.IP}:${IP_ADDRESSES.PORT}/upload_image`,
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
        setSearchResults(data); // ✅ Store the response in Context API
        router.push("/ResultsScreen"); // ✅ Navigate to results screen
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

  const captureImage = async () => {
    if (cameraStreamRef.current) {
      const video = cameraStreamRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

      setPhotoUri(URL.createObjectURL(blob));
      await uploadImage(file);
    }
  };

  const selectFromGallery = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoUri(URL.createObjectURL(file));
      await uploadImage(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative bg-black w-full h-full flex flex-col items-center justify-center">
        {isUploading ? (
          <p className="text-white text-lg">Uploading...</p>
        ) : cameraEnabled && cameraPermission ? (
          <>
            <video ref={cameraStreamRef} autoPlay className="w-full h-3/4 object-cover" />

            <div className="absolute bottom-5 flex justify-center space-x-6">
              <button onClick={captureImage} className="bg-white p-4 rounded-full hover:bg-gray-200">
                <FaCamera className="text-black text-3xl" />
              </button>

              <label className="bg-white p-4 rounded-full hover:bg-gray-200 cursor-pointer">
                <FaImages className="text-black text-3xl" />
                <input type="file" accept="image/*" className="hidden" onChange={selectFromGallery} />
              </label>

              <button
                onClick={() => setFacingMode((prev) => (prev === "user" ? "environment" : "user"))}
                className="bg-white p-4 rounded-full hover:bg-gray-200"
              >
                <FaSyncAlt className="text-black text-3xl" />
              </button>
            </div>
          </>
        ) : (
          <p className="text-white text-lg">Camera access is required.</p>
        )}

        <button onClick={onClose} className="absolute top-5 right-5 bg-white p-2 rounded-full hover:bg-gray-300">
          <FaTimes className="text-black text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default ImagePickerModal;
