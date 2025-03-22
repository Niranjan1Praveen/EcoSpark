"use client";
import React, { useState } from "react";
import xmark from "../public/icons/xmark.svg";
import bars from "../public/icons/bars.svg";
import signIn from "../public/icons/sign-in.svg";
import logo from "../public/logo/EcoSpark.svg";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex items-center justify-between py-4 w-full shadow-sm z-50 section-p">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Logo" width={50} height={50} />
        <h1 className="text-xl font-bold tracking-widest cursor-pointer">
          <span className="text-[#1ed760]">Eco</span>
          <span className="text-[#1CB0F6]">Spark</span>
        </h1>
      </div>

      <ul
        id="navbar"
        className={`fixed top-0 right-0 h-screen w-64 bg-white shadow-lg p-6 flex flex-col gap-6 transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "translate-x-full"} 
        md:static md:h-auto md:w-auto md:bg-transparent md:flex-row md:shadow-none md:translate-x-0`}
      >
        <li className="md:hidden cursor-pointer" onClick={() => setIsOpen(false)}>
          <Image src={xmark} alt="Close navbar" className="w-6 h-6" />
        </li>
        <li>
          <Link href={"/home"} className="text-gray-900 font-medium hover:underline">
            Start
          </Link>
        </li>
        <li>
          <Link href={"/"} className="text-gray-900 font-medium hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link href={"/"} className="text-gray-900 font-medium hover:underline">
            Contact
          </Link>
        </li>
        <li className="flex items-center gap-2 cursor-pointer">
          <Link href={"/login"}>
            <Image src={signIn} className="w-5 h-5" alt="Logout" />
          </Link>
        </li>
      </ul>

      {/* Mobile Menu Icon */}
      <div className="md:hidden cursor-pointer" onClick={() => setIsOpen(true)}>
        <Image src={bars} alt="Open navbar" className="w-6 h-6" />
      </div>
    </header>
  );
}
