"use client";
import { useState, useRef, useEffect } from "react";
import categories from "./categories";
import { useRouter } from "next/navigation";
import { FaCamera, FaImages, FaTimes } from "react-icons/fa";
import axios from "axios";
import IP_ADDRESSES from "./IPAddresses";
import { useSearch } from "@/context/SearchContext";

const ImagePickerModal = ({ onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const cameraStreamRef = useRef(null);
  const { setSearchResults } = useSearch();
  const router = useRouter();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Camera API not supported.");
        setCameraPermission(false);
        return;
      }
      
      console.log("Requesting camera permission...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      
      console.log("Camera stream received:", stream);
      setCameraEnabled(true);
      setCameraPermission(true);
      
      if (cameraStreamRef.current) {
        cameraStreamRef.current.srcObject = stream;
        cameraStreamRef.current.onloadedmetadata = async () => {
          try {
            await cameraStreamRef.current.play();
            console.log("Camera is now playing");
          } catch (error) {
            console.error("Error playing video stream:", error);
          }
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current?.srcObject) {
      cameraStreamRef.current.srcObject.getTracks().forEach((track) => track.stop());
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
      if (!blob) {
        console.error("Failed to capture image from camera.");
        return;
      }
      
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

  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(
        `${IP_ADDRESSES.IP}/upload_image?similarity_threshold=0.7`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSearchResults(response.data.result);
      router.push("/ResultsScreen");
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
        ) : cameraEnabled && cameraPermission ? (
          <>
            <video ref={cameraStreamRef} autoPlay playsInline className="w-full h-full object-contain bg-gray-900" />
            <div className="absolute bottom-5 flex justify-center space-x-6">
              <button onClick={captureImage} className="bg-white p-4 rounded-full hover:bg-gray-200">
                <FaCamera className="text-black text-3xl" />
              </button>
              <label className="bg-white p-4 rounded-full hover:bg-gray-200 cursor-pointer">
                <FaImages className="text-black text-3xl" />
                <input type="file" accept="image/*" className="hidden" onChange={selectFromGallery} />
              </label>
            </div>
          </>
        ) : (
          <button onClick={startCamera} className="text-white text-base p-3 bg-gray-800 rounded-lg">
            Tap to Enable Camera permissions
          </button>
        )}
        <button onClick={onClose} className="absolute top-5 right-5 bg-white p-2 rounded-full hover:bg-gray-300">
          <FaTimes className="text-black text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default ImagePickerModal;
