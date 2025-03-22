"use client";

import Food from "../public/rewards/food.jpeg";
import Games from "../public/rewards/games.jpeg";
import Grocery from "../public/rewards/grocery.jpeg";
import Movie from "../public/rewards/movie.jpeg";
import Restaurant from "../public/rewards/restaurant.jpeg";
import Fashion from "../public/rewards/fashion.webp";
import Electronics from "../public/rewards/electronics.webp";
import Books from "../public/rewards/books.webp";
import Travel from "../public/rewards/flights.webp";
import Fitness from "../public/rewards/fitness.webp";

import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import { ScratchCard } from "next-scratchcard";
import Image from "next/image";

const ScratchCoupon = () => {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [screenWidth, setScreenWidth] = useState(800);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;

      try {
        const response = await fetch(
          `http://localhost:3001/api/user/${authToken}`
        );
        const data = await response.json();

        if (response.ok) {
          setUserDetails(data);
        } else {
          console.error("Error fetching user details:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);
  useEffect(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  const handleScratchComplete = () => {
    setIsComplete(true);
  };

  const copyCode = () => {
    toast("Code has been copied.");
  };

  const vouchersList = [
    { name: "Restaurants", code: "RESTO123", points: 300, image: Restaurant },
    { name: "Movie Tickets", code: "MOVIE456", points: 200, image: Movie },
    { name: "Grocery", code: "GROCERY789", points: 100, image: Grocery },
    { name: "Games", code: "GAME101", points: 20, image: Games },
    { name: "Food", code: "FOOD202", points: 50, image: Food },
    { name: "Electronics", code: "ELEC303", points: 500, image: Electronics },
    { name: "Fashion", code: "FASH404", points: 250, image: Fashion },
    { name: "Books", code: "BOOK505", points: 150, image: Books },
    { name: "Travel", code: "TRAVEL707", points: 600, image: Travel },
    { name: "Fitness", code: "FIT606", points: 400, image: Fitness },
  ];
  

  return (
    <main className="flex flex-col gap-6 p-5 bg-center rounded-md max-w-6xl mx-auto">
      <h1 className="font-bold text-2xl sm:text-3xl">Choose your Rewards</h1>
      <h2 className="text-md sm:text-lg">Redeem codes for your points</h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {vouchersList.map((voucher, index) => (
          <div
            key={index}
            className="relative bg-white min-w-[200px] min-h-[220px] shadow-lg rounded-xl flex items-center justify-center text-center overflow-hidden group transition-all hover:scale-105"
          >
            <Image
              src={voucher.image}
              alt={voucher.name}
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 transition-all duration-300 hover:blur-md"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                {voucher.name}
              </h3>
              <p className={`${userDetails?.userScore < voucher.points ? "text-red-400" : "text-[#1ed760]"} text-sm sm:text-base`}>
                [{voucher.points} pts]
              </p>
            </div>

            <AlertDialog>
              {userDetails?.userScore >= voucher.points && (
                <AlertDialogTrigger
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-[#1CB0F6] text-white rounded-[5px] z-10"
                  onClick={() => setSelectedVoucher(voucher)}
                >
                  Redeem
                </AlertDialogTrigger>
              )}

              <AlertDialogContent className="bg-white rounded-md max-w-md mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">
                    Redeem {voucher.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="flex flex-col items-center">
                      <h2 className="text-xl font-bold mb-4 text-center">
                        Scratch to Reveal Your Code
                      </h2>
                      <ScratchCard
                        width={250}
                        height={150}
                        brushSize={40}
                        percentToFinish={75}
                        onComplete={handleScratchComplete}
                        scratchImage="https://tse2.mm.bing.net/th?id=OIP.JW4_m9cH_KS3mvIXY7kmqwHaF9&pid=Api&P=0&h=180"
                      >
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-green-600">
                          {selectedVoucher
                            ? selectedVoucher.code
                            : "Scratch Me!"}
                        </div>
                      </ScratchCard>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  {isComplete && (
                    <AlertDialogAction onClick={copyCode}>
                      Copy
                    </AlertDialogAction>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ScratchCoupon;
