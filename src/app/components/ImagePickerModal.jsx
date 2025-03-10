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

      const permission = await navigator.permissions.query({ name: "camera" });

      if (permission.state === "denied") {
        console.error("Camera permission denied by user settings.");
        setCameraPermission(false);
        alert("Camera access is blocked. Please allow access in browser settings.");
        return;
      }

      alert("Tap anywhere on the screen to start the camera");
      console.log("Waiting for user interaction...");

      document.body.addEventListener(
        "click",
        async () => {
          console.log("User clicked, starting camera...");

          const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

          let constraints = {
            video: {
              facingMode: "environment",
              width: { ideal: isMobile ? 1920 : 1280 },
              height: { ideal: isMobile ? 1080 : 720 },
              frameRate: { ideal: 30 },
            },
          };

          try {
            let stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log("Camera stream received:", stream);
            setCameraEnabled(true);
            setCameraPermission(true);

            if (cameraStreamRef.current) {
              cameraStreamRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error("Error starting camera with high resolution, retrying with lower settings:", error);

            constraints.video.width = { ideal: 640 };
            constraints.video.height = { ideal: 480 };

            try {
              let fallbackStream = await navigator.mediaDevices.getUserMedia(constraints);
              console.log("Fallback Camera stream received:", fallbackStream);
              setCameraEnabled(true);
              setCameraPermission(true);

              if (cameraStreamRef.current) {
                cameraStreamRef.current.srcObject = fallbackStream;
              }
            } catch (fallbackError) {
              console.error("Failed to start camera even with low resolution:", fallbackError);
              alert("Could not access the camera. Please check your browser settings.");
            }
          }
        },
        { once: true }
      );
    } catch (error) {
      console.error("Unexpected error starting camera:", error);
      alert("An error occurred while accessing the camera. Try refreshing the page.");
      setCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current?.srcObject) {
      cameraStreamRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const compressImage = (file, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: "image/jpeg" }));
              } else {
                reject(new Error("Image compression failed."));
              }
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = () => reject(new Error("Failed to load image for compression."));
      };

      reader.onerror = () => reject(new Error("Failed to read image file."));
    });
  };

  const captureImage = async () => {
    if (cameraStreamRef.current) {
      const video = cameraStreamRef.current;

      if (video.readyState !== 4) {
        console.error("Video is not ready yet.");
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Canvas context not available.");
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));
      if (!blob) {
        console.error("Failed to capture image from camera.");
        return;
      }

      const compressedFile = await compressImage(new File([blob], "photo.jpg", { type: "image/jpeg" }));
      setPhotoUri(URL.createObjectURL(compressedFile));
      await uploadImage(compressedFile);
    }
  };

  const selectFromGallery = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const compressedFile = await compressImage(file);
      setPhotoUri(URL.createObjectURL(compressedFile));
      await uploadImage(compressedFile);
    }
  };

  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(`${IP_ADDRESSES.IP}/upload_image?similarity_threshold=0.75&top_k=15`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.result && response.data.result.length > 0) {
        setSearchResults(response.data.result);
        router.push("/ResultsScreen");
      } else {
        alert("No product found with sufficient similarity.");
      }

      onClose();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {isUploading ? (
          <p className="text-white text-lg">Uploading...</p>
        ) : (
          <>
            <video ref={cameraStreamRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />

            <div className="absolute bottom-14 flex justify-center items-center w-full">
              <label className="absolute left-10 p-4 rounded-full cursor-pointer">
                <FaImages className="text-white text-3xl" />
                <input type="file" accept="image/*" className="hidden" onChange={selectFromGallery} />
              </label>

              <button onClick={captureImage} className="p-6 rounded-full border-4 border-white">
                <FaCamera className="text-white text-5xl" />
              </button>
            </div>

            <button onClick={onClose} className="absolute top-6 right-6">
              <FaTimes className="text-white text-3xl" />
            </button>

            <p className="absolute bottom-4 text-white text-lg">Capture or Select an Image</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImagePickerModal;
