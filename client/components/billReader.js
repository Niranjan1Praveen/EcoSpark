"use client";
import React, { useState } from "react";
import axios from "axios";
import { DropletIcon, FileUp, ZapIcon } from "lucide-react";
import { toast } from "sonner";

const BillUploader = ({ setExtractedText }) => {
  const [electricityFile, setElectricityFile] = useState(null);
  const [waterFile, setWaterFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (billType, file) => {
    if (!file) {
      toast.error("No file selected!");
      return;
    }
  
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file!");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bill_type", billType);
  
    let toastId; 
  
    try {
      setIsLoading(true);
      toastId = toast.loading(`Uploading ${billType} bill...`);
  
      const response = await axios.post(
        "https://ecospark-billupload.onrender.com/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      setExtractedText(JSON.stringify(response.data));
      toast.success(`${billType} bill processed successfully!`, {
        id: toastId,
      });
      console.log(`${billType} bill data:`, response.data);
    } catch (error) {
      console.error(`Error uploading ${billType} bill:`, error);
      toast.error(`Failed to upload ${billType} bill. Try again.`, {
        id: toastId, 
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative h-40 rounded-xl overflow-hidden flex bg-[#1CB0F6]">
      {/* Electricity Bill Upload */}
      <div
        className="w-1/2 h-full flex items-center justify-center bg-[#1ED760] relative p-4"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%)" }}
      >
        <label className="text-white font-semibold cursor-pointer">
          Upload Electricity Bill
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              setElectricityFile(e.target.files[0]);
              handleFileUpload("electricity", e.target.files[0]);
            }}
            disabled={isLoading}
          />
        </label>
        <ZapIcon className="absolute z-[-10] text-black w-20 h-20" />
      </div>

      <div className="flex items-center justify-center">
        <FileUp size={50} className="text-white p-2" />
      </div>

      {/* Water Bill Upload */}
      <div
        className="w-1/2 h-full flex items-center justify-center bg-[#1CB0F6] relative p-4"
        style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      >
        <label className="text-white font-semibold cursor-pointer">
          Upload Water Bill
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              setWaterFile(e.target.files[0]);
              handleFileUpload("water", e.target.files[0]);
            }}
            disabled={isLoading}
          />
        </label>
        <DropletIcon className="absolute z-[-10] text-black w-20 h-20" />
      </div>
    </div>
  );
};

export default BillUploader;
