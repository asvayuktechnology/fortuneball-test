// components/ImageCropper.tsx
"use client";

import React, { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import Button from "./ui/common/input/Button";

interface Props {
  image: string;
  onCancel: () => void;
  onCropComplete: (croppedImage: string) => void;
}

const ImageCropper: React.FC<Props> = ({ image, onCancel, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropDone = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="relative w-[50vw] h-[50vh] bg-white p-4 rounded-lg flex flex-col">
        <div className="flex-1 relative">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
          />
        </div>
        <div className="mt-4 flex justify-between gap-2 z-[60]">
          <Button 
            text="Cancel" 
            onClick={onCancel} 
            className="z-[60] px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          />
          <Button 
            text="Crop & Save" 
            onClick={onCropDone} 
            className="z-[60] px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;