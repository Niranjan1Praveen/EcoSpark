"use client";
import React, { useState, useEffect } from "react";
import {
  Droplet,
  Footprints,
  Leaf,
  Mic,
  PlusIcon,
  SendIcon,
  ShoppingCart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

function Page() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isResLoaded, setIsResLoaded] = useState(false);
  const [challenges, setChallenges] = useState([]);

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     const authToken = localStorage.getItem("authToken");
  //     if (!authToken) return;

  //     try {
  //       const challengesResponse = await fetch(
  //         "http://localhost:3001/user-challenges"
  //       );
  //       const challengesData = await challengesResponse.json();
  //       console.log(challengesData);

  //       if (challengesResponse.ok) {
  //         setChallenges(challengesData.challenges.slice(0, 4));
  //       } else {
  //         console.error("Error fetching challenges:", challengesData.error);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchUserDetails();
  // }, []);
  const CHALLENGE_CATEGORIES = [
    "water conservation",
    "energy efficiency",
    "waste reduction",
    "sustainable transportation",
    "eco-friendly shopping"
  ];
  
  // Icons mapping for challenges
  const CHALLENGE_ICONS = {
    "water conservation": <Droplet className="text-blue-500" />,
    "energy efficiency": <Leaf className="text-green-500" />,
    "waste reduction": <ShoppingCart className="text-yellow-500" />,
    "sustainable transportation": <Footprints className="text-red-500" />,
    "eco-friendly shopping": <ShoppingCart className="text-purple-500" />
  };
  useEffect(() => {
    const generateRandomChallenges = async () => {
      setLoading(true);
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Generate 4 random challenges
        const generatedChallenges = await Promise.all(
          Array(4).fill().map(async (_, index) => {
            const randomCategory = CHALLENGE_CATEGORIES[
              Math.floor(Math.random() * CHALLENGE_CATEGORIES.length)
            ];
            
            const prompt = `Generate one specific, actionable sustainability challenge about ${randomCategory} that a person can do daily. Make it very concise (10-15 words max) and prefix with an emoji related to the topic. Example: "💧 Take a 5-minute shower instead of 10-minute"`;
            
            const result = await model.generateContent(prompt);
            const text = await result.response.text();
            
            return {
              id: index + 1,
              challenge: text.trim(),
              category: randomCategory
            };
          })
        );
        
        setChallenges(generatedChallenges);
      } catch (error) {
        console.error("Error generating challenges:", error);
        setChallenges([
          { id: 1, challenge: "💧 Take a 5-minute shower instead of 10-minute", category: "water conservation" },
          { id: 2, challenge: "♻️ Bring reusable bags to the grocery store", category: "waste reduction" },
          { id: 3, challenge: "🚶 Walk or bike for trips under 1 mile", category: "sustainable transportation" },
          { id: 4, challenge: "🌱 Try one meatless meal this week", category: "eco-friendly shopping" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    generateRandomChallenges();
  }, []);
  const sendPrompt = async (selectedPrompt) => {
    const finalPrompt = selectedPrompt || prompt.trim();
    if (!finalPrompt) return;
  
    setLoading(true);
    setResponse("");
    setTyping(false);
    setPrompt(finalPrompt);
  
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chatSession = model.startChat({ history: [] });
  
      const detailedPrompt = `Explain the following challenge in detail, including why it's important, how to implement it, and its impact on sustainability: ${finalPrompt}`;
  
      const result = await chatSession.sendMessage(detailedPrompt);
      const aiResponse = await result.response.text();
  
      setIsResLoaded(true);
      setLoading(false);
      setTyping(true);
      displayTypingEffect(aiResponse);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("❌ Failed to fetch response. Try again.");
      setLoading(false);
    }
  };
  const displayTypingEffect = (text) => {
    let index = 0;
    setResponse(text.charAt(0));

    const interval = setInterval(() => {
      index++;
      setResponse((prev) => prev + text.charAt(index));
      if (index === text.length - 1) {
        clearInterval(interval);
        setTyping(false);
      }
    }, 5);
  };

  const formatResponse = (text) => {
    return text
      .replace(/`/g, "")
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\n/g, "<br>");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendPrompt();
    }
  };

  return (
    <main className="flex flex-col min-h-screen section-p gap-2">
      <div className="flex items-center p-[20px] gap-3">
        <p className="text-lg">Gemini</p>
        <small>({new Date().toLocaleDateString()})</small>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        {!isResLoaded && (
          <p className="text-4xl text-center">
          What small change will you make today to help the planet?
        </p>
        )}

        {/* Challenges Section */}
        {challenges.length > 0 ? (
          <div className="grid lg:grid-cols-4 gap-[15px] md:grid-cols-2 py-[75px]">
            {challenges.map((challenge, index) => (
              <div
                key={challenge.id}
                className={`${
                  index === 0 && "bg-yellow-100 animate-shine"
                } bg-white transition-all shadow-md p-4 rounded-xl relative min-h-[200px] cursor-pointer hover:bg-gray-200`}
                onClick={() => sendPrompt(challenge.challenge)}
              >
                <p
                  dangerouslySetInnerHTML={{
                    __html: formatResponse(challenge.challenge),
                  }}
                ></p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-[15px] md:grid-cols-2 py-[75px]">
            {[1, 2, 3, 4].map((index) => (
              <Skeleton
                className="w-full p-2 rounded-xl min-h-[200px] min-w-[200px]"
                key={index}
              />
            ))}
          </div>
        )}

        {isResLoaded && (
          <div className="bg-white rounded-l-full rounded-br-full rounded-tr-[5px] px-4 py-2 self-end w-auto max-w-[75%]">
            {prompt}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-2 py-5">
            <Skeleton className="w-full p-2 rounded-[5px]" />
            <Skeleton className="w-full p-2 rounded-[5px]" />
            <Skeleton className="w-full p-2 rounded-[5px]" />
          </div>
        ) : (
          response && (
            <div className="p-5 max-h-[700px] overflow-y-scroll">
              <p
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
              ></p>
              {typing && <span className="animate-pulse">▍</span>}
            </div>
          )
        )}
      </div>

      {/* Input Section */}
      <div className="sticky bottom-0 left-0 bg-white px-4 py-2 flex items-center justify-between rounded-full">
        <PlusIcon className="cursor-pointer ml-2 transition hover:scale-125" />
        <Input
          type="text"
          placeholder="Enter prompt here"
          className="border-none outline-none hover:outline-none shadow-none w-full"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Mic className="cursor-pointer ml-2 transition hover:scale-125" />
        <SendIcon
          onClick={() => sendPrompt(prompt)}
          className="cursor-pointer ml-2 transition hover:scale-125"
        />
      </div>

      <small className="text-center">
        Gemini can make mistakes, so double-check it.
      </small>
    </main>
  );
}

export default Page;