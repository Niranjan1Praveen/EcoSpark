"use client";
import { Button } from "@/components/ui/button";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Person4Icon from "@mui/icons-material/Person4";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import { Checkbox } from "@/components/ui/checkbox";
import { CloseOutlined, Description, InputOutlined } from "@mui/icons-material";
import { Textarea } from "@/components/ui/textarea";
function Page() {
  const [error, setError] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    authToken: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.bio
    ) {
      setError(true);
      return;
    }
    setError(false);
    const uniqueToken = crypto.randomUUID();
    const newUser = {
      ...formData,
      authToken: uniqueToken,
    };

    try {
      const response = await fetch("http://localhost:3001/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", uniqueToken);
        router.push("/responses");
      } else {
        alert("Cannot Sign Up!");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <section className="flex flex-col gap-6 section-p min-h-screen overflow-hidden items-center justify-center bg-[var(--secondary-background)]">
      <Link href={"/"} className="absolute top-0 left-0 p-5">
        <CloseOutlined />
      </Link>
      <div className="flex flex-col gap-4 px-8 py-10 bg-white rounded-xl shadow-md">
        {error && (
          <p className="flex items-center gap-3 bg-red-100 text-red-700 py-3 px-4 rounded-[5px] text-sm border border-red-300">
            <ErrorOutlineOutlinedIcon /> Incorrect username, email, or password.
          </p>
        )}

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <Person4Icon className="icon" />
          Username
        </label>
        <Input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          className="border border-gray-300 bg-white"
        />

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <EmailIcon className="icon" />
          Email
        </label>
        <Input
          type="text"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 bg-white"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <PasswordIcon className="icon" />
          Password
        </label>
        <Input
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-300 bg-white"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <Description className="icon" />
          Bio
        </label>
        <Textarea
          type="bio"
          name="bio"
          placeholder="Tell us about yourself"
          value={formData.bio}
          onChange={handleChange}
          className="border border-gray-300 bg-white rounded-[6px] h-28"
        />
        <div className="flex items-center justify-between mt-4 gap-4">
          <small className="flex items-center gap-1">
            {" "}
            <Checkbox /> I agree to the Terms of Service and Privacy Policy.
          </small>
          <Button
            className="w-auto bg-[#34A853] my-5 text-white p-3 rounded-full hover:bg-[#2c8c42] transition-transform transform hover:scale-105 border-none"
            onClick={handleSignup}
          >
            Sign Up
          </Button>
        </div>
      </div>
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?
        <Link
          href="/login"
          className="underline text-[#1ed760] hover:text-green-600"
        >
          {" "}
          Login to EcoSpark
        </Link>
      </p>
    </section>
  );
}

export default Page;
