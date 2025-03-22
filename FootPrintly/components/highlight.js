"use client";
import { useState, useEffect } from "react";
import { SmileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
function Highlight(props) {
  const [date, setDate] = useState(new Date());
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    // localStorage.clear();
    const storedImages =
      JSON.parse(localStorage.getItem("uploadedImages")) || [];
    setImages(storedImages);
  }, []);
  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const newImages = [];
      const currentDate = new Date().toLocaleDateString();

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageObject = { src: reader.result, date: currentDate };
          newImages.push(imageObject);

          const storedImages =
            JSON.parse(localStorage.getItem("uploadedImages")) || [];
          const updatedImages = [...storedImages, ...newImages];

          localStorage.setItem("uploadedImages", JSON.stringify(updatedImages));
          setImages(updatedImages);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  return (
    <div className="flex flex-col gap-5">
      <h1 className="flex items-center gap-1 font-bold text-lg">
        Post your Highlight of the Day <SmileIcon />
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input
          type="file"
          accept="image/*"
          multiple
          className="p-2 border border-gray-300 rounded-[5px]"
          onChange={handleImageUpload}
          required
        />
        <Link href={"/gallery"}>
          <Button
            type="submit"
            className="bg-[#1ed760] w-auto uppercase border-none outline-none hover:!bg-[#1ed760] hover:!border-none hover:!shadow-none hover:!text-black p-[20px]"
          >
            Post
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Highlight;
