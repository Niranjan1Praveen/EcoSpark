"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      title: "Tree Plantation Drive",
      ngo: "Green Earth NGO",
      location: "Delhi",
      date: "2025-04-10",
      slots: 20,
      score: 150,
    },
    {
      id: 2,
      title: "Water Conservation Workshop",
      ngo: "Save Water Foundation",
      location: "Mumbai",
      date: "2025-04-15",
      slots: 15,
      score: 250,
    },
    {
      id: 3,
      title: "Solar Panel Installation Camp",
      ngo: "Renewable Energy Society",
      location: "Bangalore",
      date: "2025-04-20",
      slots: 10,
      score: 70,
    },
  ]);

  return (
    <div className="section-p">
      <h1 className="text-3xl font-bold mb-6">Community Building with NGOs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white shadow-md p-8 flex flex-col rounded-xl relative"
          >
            <h2 className="text-xl font-semibold my-2">{activity.title}</h2>
            <p className="text-gray-600 mb-2">NGO: {activity.ngo}</p>
            <p className="text-gray-600 mb-2">Location: {activity.location}</p>
            <p className="text-gray-600 mb-2">Date: {activity.date}</p>
            <p className="text-gray-600 mb-4">
              Slots Available: {activity.slots}
            </p>
            <p className="text-black absolute top-0 right-0 bg-[#1ed760] rounded-bl-xl p-2 text-sm">For {activity.score} points</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
              
                <Button variant="outline" className="bg-[#1CB0F6] text-white px-4 py-2 transition-all">Book Now</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white rounded-md max-w-md mx-auto">
                <AlertDialogHeader>
                  <AlertDialogDescription>
                  Activity booked successfully! You will receive the details in your email.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
