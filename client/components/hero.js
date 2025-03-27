"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
function Hero() {
  const heroStrong = ["Savings", "Sustainability", "Rewards"];
  const [currentText, setCurrentText] = useState(heroStrong[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        const currentIndex = heroStrong.indexOf(currentText);
        const nextIndex = (currentIndex + 1) % heroStrong.length;
        setCurrentText(heroStrong[nextIndex]);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [currentText, heroStrong]);

  // const imageGrid = [
  //   { text: "Eco-friendly Solutions", style: "z-50 bg-red-500 bg-[url(https://files.oaiusercontent.com/file-SmUKgtzW2SXvtLFfWsMsjN?se=2025-03-12T17%3A11%3A33Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D20e29a47-b6b0-42bf-9053-481a6b286462.webp&sig=lLXEiHIUY4wW/HGe33rkh9sqssEZ9ukUe6iKfrUyAXc%3D)]" },
  //   { text: "Save Water & Electricity", style: "top-[200px] left-[50px] bg-pink-500 bg-[url(https://files.oaiusercontent.com/file-38VDCMSSWDm1d68YT3MYSg?se=2025-03-12T17%3A12%3A06Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dc1a18e4a-a4a4-48f6-b3c2-95d5227650d3.webp&sig=avTAybaK6gO4iyRbfgkTfUBeIa2hexliha8CdsQU2As%3D)]" },
  //   { text: "Earn Rewards for Saving", style: "top-[180px] right-[30px] bg-yellow-500 bg-[url(https://files.oaiusercontent.com/file-BEoyBboj1GwykHgwfFazyu?se=2025-03-12T17%3A12%3A24Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D1a2afffb-2af1-473f-bd4f-5abbb860fa96.webp&sig=i%2BdcogRhagRlx2LPcYcTMq70f69b0FkTAvGiVZDiQJM%3D)]" },
  //   { text: "Earn Rewards for Helping", style: "top-[40px] right-[250px] bg-green-500 bg-[url(https://gloxy.in/cdn/shop/files/1_92cb3e27-dce5-4198-96a1-65f658053b7f.jpg?v=1734827751)]" },
  // ];
  const imageGrid = [
    {
      text: "Older washers use 40-50 gallons, newer ones 15-25.",
      style:
        "bg-red-500 bg-[url(/hero/washingMachine.jpeg)]",
    },
    {
      text: "A dripping tap wastes 3,000+ gallons yearly.",
      style:
        "bg-pink-500 bg-[url(/hero/sink.jpeg)]",
    },
    {
      text: "AC overuse wastes 500-3,500 kWh yearly.",
      style:
        "bg-yellow-500 bg-[url(/hero/ac.jpeg)]",
    },
    {
      text: "Fridges use 100-800 kWh yearly.",
      style:
        "bg-green-500 bg-[url(/hero/fridge.jpeg)]",
    },
  ];

  return (
    <div className="section-p">
      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10">
        {/* Hero Content (60%) */}
        <div className="flex flex-col gap-10 py-[50px] md:py-[70px]">
          <h1 className="font-bold text-4xl md:text-4xl leading-tight">
            Track, Save & Earn{" "}
            <strong
              className={`italic font-bold text-[#1CB0F6] fade-up ${
                fade ? "fade-in" : "fade-out"
              }`}
            >
              {currentText}{" "}
            </strong>
            !
          </h1>
          <p className="text-lg text-gray-700">
            Helps you <b>track</b> electricity & water usage, <b>reduce</b>{" "}
            consumption with AI-powered insights, and <b>earn rewards</b> for
            sustainable habits. Upload your bills, set eco-goals, and get
            rewarded for saving resources.
          </p>
          <div className="flex gap-2 items-center">
            <Button className="bg-[#1ed760] text-black rounded-[5px] uppercase border-none outline-none hover:!bg-[#1ed760] hover:!border-none hover:!shadow-none hover:!text-black p-[20px]">
              <Link href={"/signup"}>Get Started</Link>
            </Button>
            <Link href={"/login"} className="underline text-sm italic">
              or Login
            </Link>
          </div>
        </div>

        {/* Scene (40%) - Hidden on small screens */}
        <div className="hidden md:flex gap-5">
          <div className="md:grid grid-cols-2 grid-rows-2 gap-5 w-full max-w-[600px] mx-auto">
            {imageGrid.map((item, index) => (
              <div
                key={index}
                className={`bg-cover bg-center ${item.style} w-full h-[175px] rounded-[5px] flex items-center justify-center transition-all duration-500 relative`}
              >
                <div className="absolute inset-0 bg-black/50 rounded-[5px] backdrop-blur-sm opacity-0 hover:opacity-100 hover:z-50 transition-opacity duration-500 flex items-center justify-center text-white text-lg font-bold p-2">
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
