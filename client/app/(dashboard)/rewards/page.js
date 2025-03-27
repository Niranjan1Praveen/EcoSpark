"use client";
import ScratchCoupon from "@/components/scratchCoupon";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
function page() {
  const [points, setPoints] = useState(0);
  useEffect(
    () => (
      setPoints(localStorage.getItem("points"))
    )
  );
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (points / 100) * circumference;
  return (
    <div className="section-p">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex flex-col gap-1 sm:gap-2 text-center sm:text-left w-full sm:w-auto">
          <h1 className="font-bold text-4xl sm:text-3xl md:text-3xl">
            Choose your Rewards
          </h1>
          <h2 className="text-sm sm:text-base md:text-lg text-gray-600">
            Redeem codes for your points
          </h2>
        </div>

        <div className="flex items-center justify-center sm:justify-end">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#e0e0e0"
                strokeWidth="8"
                className="sm:stroke-width-10"
              />
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#1CB0F6"
                strokeWidth="8"
                className="sm:stroke-width-10"
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
                className="text-xs sm:text-sm font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {points || 0} pts
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <ScratchCoupon />
      </div>
    </div>
  );
}
export default page;
