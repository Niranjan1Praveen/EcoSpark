"use client";
import { Button } from "@/components/ui/button";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CloseOutlined } from "@mui/icons-material";

function LoginPage() {
  const [error, setError] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      setError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("authToken", data.authToken);
        router.push("/home");
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(true);
    }
  };

  return (
    <section className="flex flex-col items-center gap-10 justify-center min-h-screen section-p overflow-hidden bg-[var(--secondary-background)]">
      <Link href={"/"} className="absolute top-0 left-0 p-5">
        <CloseOutlined />
      </Link>
      <div className="flex flex-col gap-4 px-8 py-10 bg-white rounded-xl shadow-md min-w-[400px]">
        <h2 className="font-bold text-2xl text-center">
          Log in to EcoSpark
        </h2>
        {error && (
          <p className="flex items-center gap-3 bg-red-100 text-red-700 py-3 px-4 rounded-[5px] text-sm border border-red-300">
            <ErrorOutlineOutlinedIcon /> Invalid credentials.
          </p>
        )}
        <div className="flex flex-col gap-4">
          <label className="text-gray-600 text-sm">Email or username</label>
          <Input
            type="text"
            name="username"
            placeholder="Enter your email or username"
            value={formData.username}
            onChange={handleChange}
            className="border border-gray-300 bg-white"
          />
          <label className="text-gray-600 text-sm">Password</label>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 bg-white"
          />
          <Button
            className="w-full bg-[#34A853] my-5 text-white py-3 rounded-full hover:bg-[#2c8c42] transition-transform transform hover:scale-105 border-none"
            onClick={handleLogin}
          >
            Log in
          </Button>
          <div className="flex items-center justify-between gap-2">
            <small className="flex gap-1 items-center">
              <Checkbox />
              Remember me
            </small>
            <small className="text-center cursor-pointer hover:text-green-500">
              Forgot your password?
            </small>
          </div>
        </div>
      </div>
      <p className="text-sm text-center text-gray-500">
        Don’t have an account?{" "}
        <Link
          href="/signup"
          className="text-green-500 underline hover:text-green-400"
        >
          Sign up for EcoSpark
        </Link>
      </p>
    </section>
  );
}

export default LoginPage;
