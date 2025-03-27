"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

function Challenges() {
  const [currentUser, setCurrentUser] = useState("");
  const [leaderboard, setLeaderboard] = useState([
    { position: 1, name: "Alice", trophies: 320 },
    {
      position: 2,
      name: "Bob",
      trophies: 290,
    },
    {
      position: 3,
      name: "Charlie",
      trophies: 275,
    },
  ]);

  const determineLeague = (score) => {
    if (score >= 300) return "Eco Warrior";
    if (score >= 250) return "Sustainability Advocate";
    return "Green Enthusiast";
  };

  useEffect(() => {
    const fetchUserScore = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;

      try {
        const response = await fetch(
          `http://localhost:3001/api/user/${authToken}`
        );
        const data = await response.json();

        if (response.ok) {
          const userScore = data.userScore ?? 0;
          setCurrentUser(data.username);
          setLeaderboard((prevLeaderboard) => {
            if (prevLeaderboard.some((user) => user.name === data.username)) {
              return prevLeaderboard.map((user) =>
                user.name === data.username
                  ? { ...user, trophies: userScore }
                  : user
              );
            }

            const updatedLeaderboard = [
              ...prevLeaderboard,
              {
                name: data.username,
                trophies: userScore,
                league: determineLeague(userScore),
              },
            ];

            updatedLeaderboard.sort((a, b) => b.trophies - a.trophies);
            updatedLeaderboard.forEach(
              (user, index) => (user.position = index + 1)
            );

            return updatedLeaderboard;
          });
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
    <div className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {/* Leaderboard Section */}
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Leaderboard</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((user, index) => (
                <TableRow
                  key={index}
                  className={
                    user.name === currentUser ? "bg-blue-200 font-semibold" : ""
                  }
                >
                  <TableCell>{user.position}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.trophies}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Challenges;
