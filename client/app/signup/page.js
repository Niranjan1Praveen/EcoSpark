"use client";
import { Button } from "@/components/ui/button";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
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
    bio: "",
  });
  const [authToken, setAuthToken] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = () => {
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
    setAuthToken(uniqueToken);
  
    const userData = {
      ...formData,
      authToken: uniqueToken,
    };
  
    if (typeof window !== "undefined") {
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("authToken", uniqueToken);
      localStorage.setItem("points", 47);
    }
  
    router.push("/responses");
  };
  

  return (
    <section className="flex flex-col gap-6 section-p min-h-screen overflow-hidden items-center justify-center bg-[var(--secondary-background)] p-4">
      <Link
        href={"/"}
        className="absolute top-4 left-4 p-2 md:top-6 md:left-6 md:p-3"
      >
        <CloseOutlined className="text-xl" />
      </Link>

      <div className="flex flex-col gap-4 w-full max-w-md p-6 md:p-10 bg-white rounded-xl shadow-md">
        {error && (
          <p className="flex items-center gap-3 bg-red-100 text-red-700 py-3 px-4 rounded-[5px] text-sm border border-red-300">
            <ErrorOutlineOutlinedIcon fontSize="small" />
            Incorrect username, email, or password.
          </p>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {[
            {
              icon: <Person4Icon className="icon" />,
              label: "Username",
              name: "username",
              placeholder: "Enter your username",
              type: "text",
            },
            {
              icon: <EmailIcon className="icon" />,
              label: "Email",
              name: "email",
              placeholder: "Enter your email",
              type: "email",
            },
            {
              icon: <PasswordIcon className="icon" />,
              label: "Password",
              name: "password",
              placeholder: "Create a password",
              type: "password",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                {field.icon}
                {field.label}
              </label>
              <Input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white rounded-[6px] p-2 md:p-3 text-sm md:text-base"
              />
            </div>
          ))}

          {/* Bio Field */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
              <Description className="icon" />
              Bio
            </label>
            <Textarea
              name="bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-white rounded-[6px] h-28 p-2 md:p-3 text-sm md:text-base"
            />
          </div>
        </div>

        {/* Terms and Submit */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-4 gap-4">
          <div className="flex items-center">
            <Checkbox className="mr-2" />
            <small className="text-xs md:text-sm">
              I agree to the Terms of Service and Privacy Policy.
            </small>
          </div>
          <Button
            className="w-full md:w-auto bg-[#34A853] text-white py-2 px-6 rounded-full hover:bg-[#2c8c42] transition-transform transform hover:scale-105 border-none text-sm md:text-base"
            onClick={handleSignup}
          >
            Sign Up
          </Button>
        </div>
      </div>

      {/* Login Link */}
      <p className="text-center text-xs md:text-sm text-gray-600 mt-2 md:mt-4">
        Already have an account?{" "}
        <Link
          href="/login"
          className="underline text-[#1ed760] hover:text-green-600"
        >
          Login to EcoSpark
        </Link>
      </p>
    </section>
  );
}

export default Page;
