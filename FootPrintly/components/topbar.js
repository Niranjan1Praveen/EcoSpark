"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function Topbar() {
  const [userDetails, setUserDetails] = useState({
    Username: "",
    Email: "",
    Password: "",
    Bio: "",
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;

      try {
        const response = await fetch(`http://localhost:3001/api/user/${authToken}`);
        const data = await response.json();

        if (response.ok) {
          setUserDetails({
            Username: data.userName ?? "",
            Email: data.email ?? "",
            Password: data.password ?? "",
            Bio: data.bio ?? "",
          });
        } else {
          console.error("Error fetching user details:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSaveChanges = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;

    try {
      const response = await fetch(`http://localhost:3001/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleDeleteAccount = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;

    try {
      const response = await fetch(`http://localhost:3001/api/user/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Account deleted successfully.");
        localStorage.removeItem("authToken");
        router.push("/"); // Redirect to home or login page
      } else {
        toast.error("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center border-2 border-gray-500 rounded-full px-2">
        <Search />
        <Input className="border-none shadow-none outline-none w-auto" placeholder="Search Anything" />
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="w-[40px] h-[40px]">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>ES</AvatarFallback>
        </Avatar>
        <Dialog>
          <DialogTrigger asChild>
            <small className="cursor-pointer">Hi, {userDetails.Username || "User"}</small>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle>Edit your profile</DialogTitle>
              <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  value={userDetails.Username}
                  onChange={(e) => setUserDetails({ ...userDetails, Username: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={userDetails.Email}
                  onChange={(e) => setUserDetails({ ...userDetails, Email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="psswd" className="text-right">
                  Password
                </Label>
                <Input
                  id="psswd"
                  type="password"
                  value={userDetails.Password}
                  onChange={(e) => setUserDetails({ ...userDetails, Password: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Input
                  id="bio"
                  value={userDetails.Bio}
                  onChange={(e) => setUserDetails({ ...userDetails, Bio: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="bg-red-500 text-white"
              >
                Delete
              </Button>
              <Button onClick={handleSaveChanges}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px] bg-white">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your EcoSpark account? If you delete it, it cannot be recovered again.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-4">
              <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Topbar;
