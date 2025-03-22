"use client";
import React from "react";
import Link from "next/link";
import { DropletIcon, FileUp, ZapIcon } from "lucide-react";

const BillUploader = () => {
  return (
    <div className="relative h-40 rounded-xl overflow-hidden flex bg-[#1CB0F6]">
      <div
        className="w-1/2 h-full flex items-center justify-center bg-[#1ED760] relative p-4"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%)",
        }}
      >
        <Link
          href="http://127.0.0.1:5000?bill_type=electricity" // Add query parameter
          className="hover:underline text-white font-semibold"
        >
          Upload your Electricity Bill
        </Link>
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
        <Link
          href="http://127.0.0.1:5000?bill_type=water" // Add query parameter
          className="hover:underline text-white font-semibold"
        >
          Upload your Water Bill
        </Link>
        <DropletIcon className="absolute z-[-10] text-black w-20 h-20" />
      </div>
    </div>
  );
};

export default BillUploader;