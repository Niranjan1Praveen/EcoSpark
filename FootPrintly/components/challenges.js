"use client";
import {
  BoltIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";

function Challenges(props) {
  const maxPoints = 100;
  const [points, setPoints] = useState(0);
  const progressPercentage = (points / maxPoints) * 100;

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
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[#1CB0F6]">
          <BoltIcon />
          <h1 className="text-lg font-bold text-[#1CB0F6]">Points Earned</h1>
        </div>
        <div className="h-4 w-full bg-gray-300 rounded-full relative overflow-hidden">
          <div
            className="h-full bg-[#1CB0F6] rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span className="text-sm">
          {points} / {maxPoints}
        </span>
      </div>
    </div>
  );
}

export default Challenges;
