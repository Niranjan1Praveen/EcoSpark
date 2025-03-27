"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Challenges from "@/components/challenges";
import { Flame, ArrowBigRight } from "lucide-react";
import Leaderboards from "@/components/leaderboards";
import ScratchCoupon from "@/components/scratchCoupon";
import Topbar from "@/components/topbar";

const Dashboard = () => {
  useEffect(() => {
    const fetchUserName = async () => {
      if (typeof window === "undefined") return;
  
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;
    };
  
    fetchUserName();
  }, []);
  

  return (
    <div className="grid gap-12 section-p">
      <Topbar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
        <div className="flex flex-col gap-10">
          <Challenges />
        </div>
        <div className="flex flex-col gap-10">
          <Leaderboards />
          <ScratchCoupon />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
