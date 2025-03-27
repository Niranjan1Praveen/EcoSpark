"use client";
import React, { useState } from "react";
import axios from "axios";
import { DropletIcon, FileUp, ZapIcon } from "lucide-react";

const BillUploader = ({ setExtractedText }) => {
  const [electricityFile, setElectricityFile] = useState(null);
  const [waterFile, setWaterFile] = useState(null);

  const handleFileUpload = async (billType, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bill_type", billType);

    try {
      const response = await axios.post("https://ecospark-billupload.onrender.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setExtractedText(JSON.stringify(response.data));
      console.log(`${billType} bill data:`, response.data);
    } catch (error) {
      console.error(`Error uploading ${billType} bill:`, error);
    }
  };

  return (
    <div className="relative h-40 rounded-xl overflow-hidden flex bg-[#1CB0F6]">
      <div
        className="w-1/2 h-full flex items-center justify-center bg-[#1ED760] relative p-4"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%)",
        }}
      >
        <label className="text-white font-semibold cursor-pointer">
          Upload your Electricity Bill
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              setElectricityFile(e.target.files[0]);
              handleFileUpload("electricity", e.target.files[0]);
            }}
          />
        </label>
        <ZapIcon className="absolute z-[-10] text-black w-20 h-20" />
      </div>

      <div className="flex items-center justify-center">
        <FileUp size={50} className="text-white p-2" />
      </div>

      <div
        className="w-1/2 h-full flex items-center justify-center bg-[#1CB0F6] relative p-4"
        style={{
          clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      >
        <label className="text-white font-semibold cursor-pointer">
          Upload your Water Bill
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              setWaterFile(e.target.files[0]);
              handleFileUpload("water", e.target.files[0]);
            }}
          />
        </label>
        <DropletIcon className="absolute z-[-10] text-black w-20 h-20" />
      </div>
    </div>
  );
};

export default BillUploader;