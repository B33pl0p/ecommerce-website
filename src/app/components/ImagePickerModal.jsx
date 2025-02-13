"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaCamera, FaImages, FaTimes } from "react-icons/fa"; // ✅ Removed front camera switch icon
import IP_ADDRESSES from "./IPAddresses";
import { useSearch } from "@/context/SearchContext";

const ImagePickerModal = ({ onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const cameraStreamRef = useRef(null);
  const router = useRouter();
  const { setSearchResults } = useSearch();

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Camera API not supported.");
        setCameraPermission(false);
        return;
      }
  
      const permission = await navigator.permissions.query({ name: "camera" });
  
      if (permission.state === "denied") {
        console.error("Camera permission denied by user settings.");
        setCameraPermission(false);
        return;
      }
  
      // ✅ Ensure user clicks a button first
      document.body.addEventListener(
        "click",
        async () => {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }, // ✅ Use only the back camera
          });
  2
          setCameraEnabled(true);
          setCameraPermission(true);
  
          if (cameraStreamRef.current) {
            cameraStreamRef.current.srcObject = stream;
  
            // ✅ Force a refresh to fix black screen issue on Android
            setTimeout(() => {
              cameraStreamRef.current.load();
            }, 500);
          }
        },
        { once: true } // Ensures it only runs once per click event
      );
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraPermission(false);
    }
  };
  
  

  // ✅ Stops camera properly when component unmounts
  const stopCamera = () => {
    if (cameraStreamRef.current?.srcObject) {
      cameraStreamRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // ✅ Capture image from camera and upload
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

  // ✅ Select image from gallery and upload
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
        `${IP_ADDRESSES.IP}/upload_image?similarity_threshold=0.7`,
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
        ) : cameraEnabled && cameraPermission ? (
          <>
            <video ref={cameraStreamRef} autoPlay className="w-full h-3/4 object-cover" />

            <div className="absolute bottom-5 flex justify-center space-x-6">
              {/* ✅ Capture Image */}
              <button onClick={captureImage} className="bg-white p-4 rounded-full hover:bg-gray-200">
                <FaCamera className="text-black text-3xl" />
              </button>

              {/* ✅ Select from Gallery */}
              <label className="bg-white p-4 rounded-full hover:bg-gray-200 cursor-pointer">
                <FaImages className="text-black text-3xl" />
                <input type="file" accept="image/*" className="hidden" onChange={selectFromGallery} />
              </label>
            </div>
          </>
        ) : (
          <button onClick={startCamera} className="text-white text-base p-3 bg-gray-800 rounded-lg">
            Tap to Enable Camera permissions, you might need to click on the camera button again after granting permissions.
          </button>
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
