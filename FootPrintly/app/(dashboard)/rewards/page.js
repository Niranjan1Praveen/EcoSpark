"use client";
import ScratchCoupon from "@/components/scratchCoupon";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
function page() {
  const [points, setPoints] = useState(0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (points / 100) * circumference;
  useEffect(() => {
    const fetchUserScore = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;
      try {
        const response = await fetch(
          `http://localhost:3001/api/user/${authToken}`
        );
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setPoints(data.userScore ?? 0);
        } else {
          console.error("Error fetching score:", data.error);
        }
      } catch (error) {
        console.error("Error fetching score:", error);
      }
    };

    fetchUserScore();
  }, []);
  return (
    <div className="section-p">
      <div className="flex md:justify-between items-center flex-wrap gap-3 justify-center">
        {/* Text */}
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-2xl sm:text-3xl">
            Choose your Rewards
          </h1>
          <h2 className="text-md sm:text-lg">Redeem codes for your points</h2>
        </div>
        {/* Points */}
        <div className="flex items-center justify-center">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#e0e0e0"
                strokeWidth="10"
              />
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#1CB0F6"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1 }}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-sm font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {points} pts
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <ScratchCoupon />
    </div>
  );
}
export default page;
