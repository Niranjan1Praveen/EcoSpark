"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, HandHeart, Home, Laptop2Icon, MenuIcon, WashingMachine } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Grade, PeopleSharp } from "@mui/icons-material";

export default function Navbar() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsNavbarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`min-h-screen transition-all duration-300 flex flex-col shadow-lg items-center bg-white 
      ${isNavbarOpen ? "min-w-[200px]" : "min-w-[55px]"}`}
    >
      {/* Menu Button */}
      <div className="flex justify-between items-center p-4 gap-4 w-full">
        <h2
          className={`text-[1.6rem] font-bold transition-all duration-300 text-[#1CB0F6] 
          ${isNavbarOpen ? "block" : "hidden"}`}
        >
          <Link href={"/"}>
            <Avatar>
              <AvatarImage src="/logo/EcoSpark.svg" />
              <AvatarFallback>ES</AvatarFallback>
            </Avatar>
          </Link>
        </h2>
        <MenuIcon
          className="cursor-pointer text-[var(--primary-text)]"
          onClick={() => setIsNavbarOpen(!isNavbarOpen)}
        />
      </div>
      <ul className="flex flex-col gap-2 flex-grow w-full">
        {/* Home */}
        <h1
          className={`uppercase text-[0.9rem] px-4 ${
            isNavbarOpen ? "block" : "hidden"
          }`}
        >
          Dashboard
        </h1>
        <Link href="/home">
          <li
            className={`text-sm flex items-center gap-4 p-4 cursor-pointer
            transition-all duration-300 ${
              pathname === "/home"
                ? "bg-[#1CB0F6] text-white"
                : "hover:bg-gray-200"
            }`}
          >
            <Home className="icon" />
            <p
              className={`${pathname === "/home" ? "text-white" : ""} ${
                isNavbarOpen ? "block" : "hidden"
              }`}
            >
              Home
            </p>
          </li>
        </Link>

        {/* Apps */}
        <h1
          className={`uppercase text-[0.9rem] px-4 ${
            isNavbarOpen ? "block" : "hidden"
          }`}
        >
          Apps
        </h1>
        <Link href="/gemini">
          <li
            className={`text-sm flex items-center gap-4 p-4 cursor-pointer
            transition-all duration-300 ${
              pathname === "/gemini"
                ? "bg-[#1CB0F6] text-white"
                : "hover:bg-gray-200"
            }`}
          >
            <Laptop2Icon className="icon" />
            <p
              className={`${pathname === "/gemini" ? "text-white" : ""} ${
                isNavbarOpen ? "block" : "hidden"
              }`}
            >
              Challenges
            </p>
          </li>
        </Link>

        <Link href="/rewards">
          <li
            className={`text-sm flex items-center gap-4 p-4 cursor-pointer
            transition-all duration-300 ${
              pathname === "/rewards"
                ? "bg-[#1CB0F6] text-white"
                : "hover:bg-gray-200"
            }`}
          >
            <Award className="icon" />
            <p
              className={`${pathname === "/rewards" ? "text-white" : ""} ${
                isNavbarOpen ? "block" : "hidden"
              }`}
            >
              Rewards
            </p>
          </li>
        </Link>
        <Link href="/appliances">
          <li
            className={`text-sm flex items-center gap-4 p-4 cursor-pointer
            transition-all duration-300 ${
              pathname === "/appliances"
                ? "bg-[#1CB0F6] text-white"
                : "hover:bg-gray-200"
            }`}
          >
            <WashingMachine className="icon" />
            <p
              className={`${pathname === "/appliances" ? "text-white" : ""} ${
                isNavbarOpen ? "block" : "hidden"
              }`}
            >
              Appliances
            </p>
          </li>
        </Link>
        {/* Community */}
        <h1
          className={`uppercase text-[0.9rem] px-4 ${
            isNavbarOpen ? "block" : "hidden"
          }`}
        >
          Community
        </h1>
        <Link href="/community">
          <li
            className={`text-sm flex items-center gap-4 p-4 cursor-pointer
            transition-all duration-300 ${
              pathname === "/community"
                ? "bg-[#1CB0F6] text-white"
                : "hover:bg-gray-200"
            }`}
          >
            <PeopleSharp className="icon" />
            <p
              className={`${pathname === "/community" ? "text-white" : ""} ${
                isNavbarOpen ? "block" : "hidden"
              }`}
            >
              Community
            </p>
          </li>
        </Link>
        {/* <Link href="/ngo-experts">
          <li
            className={`text-sm flex items-center gap-4 p-4 cursor-pointer
            transition-all duration-300 ${
              pathname === "/ngo-experts"
                ? "bg-[#1CB0F6] text-white"
                : "hover:bg-gray-200"
            }`}
          >
            <HandHeart className="icon" />
            <p
              className={`${pathname === "/ngo-experts" ? "text-white" : ""} ${
                isNavbarOpen ? "block" : "hidden"
              }`}
            >
              NGO Experts
            </p>
          </li>
        </Link> */}
      </ul>
    </div>
  );
}
