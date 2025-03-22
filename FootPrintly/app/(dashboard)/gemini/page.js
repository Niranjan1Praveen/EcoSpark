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
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Skeleton } from "@/components/ui/skeleton";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

function Page() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isResLoaded, setIsResLoaded] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [challenges, setChallenges] = useState([]);

  const questionTemplates = [
    {
      tempQS: `Based on my sustainability score of ${userScore}, suggest three eco-friendly challenges in a concise manner.`,
      icon: <Footprints className="absolute bottom-2 right-2" />,
      star: true,
    },
    {
      tempQS: "What are some sustainable shopping habits?",
      icon: <ShoppingCart className="absolute bottom-2 right-2" />,
    },
    {
      tempQS: "How can I conserve water efficiently?",
      icon: <Droplet className="absolute bottom-2 right-2" />,
    },
    {
      tempQS: "What are some eco-friendly alternatives to plastic?",
      icon: <Leaf className="absolute bottom-2 right-2" />,
    },
  ];

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
          setUserScore(data.userScore);
          const generatedChallenges = await generateChallenges(data.userScore);
          setChallenges(extractChallenges(generatedChallenges));
        } else {
          console.error("Error fetching user details:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const generateChallenges = async (userScore) => {
    let prompt = `Generate 4 simple yet effective challenges for a user to reduce their energy and water consumption at home based on their score of ${userScore}. The challenges should be practical, easy to implement, and tailored to their score.`;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const chatSession = model.startChat({ history: [] });
      const result = await chatSession.sendMessage(prompt);
      const aiResponse = await result.response.text();

      return aiResponse;
    } catch (error) {
      console.error("Error generating challenges:", error);
      return "❌ Failed to generate challenges. Please try again.";
    }
  };

  const extractChallenges = (challengesText) => {
    const challengesArray = challengesText.split("\n");
    const filteredChallenges = challengesArray.filter((line) =>
      line.startsWith("**Challenge")
    );
    return filteredChallenges.slice(0, 4);
  };

  const sendPrompt = async (selectedPrompt) => {
    const finalPrompt = selectedPrompt || prompt.trim();
    if (!finalPrompt) return;

    setLoading(true);
    setResponse("");
    setTyping(false);
    setPrompt(finalPrompt);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const chatSession = model.startChat({ history: [] });
      const result = await chatSession.sendMessage(finalPrompt);
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
  console.log(challenges);

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
          <p className="text-4xl text-center">How can I help you today?</p>
        )}
        {/* Challenges Section */}
        {challenges.length > 0 ? (
          <div className="grid lg:grid-cols-4 gap-[15px] md:grid-cols-2 py-[75px]">
            {challenges.map((challenge, index) => (
              <div
                key={index}
                className={`${
                  index === 0 && "bg-yellow-100 animate-shine"
                } bg-white transition-all shadow-md p-4 rounded-xl relative min-h-[200px] cursor-pointer hover:bg-gray-200`}
                onClick={() => sendPrompt(challenge)}
              >
                <p
                  dangerouslySetInnerHTML={{
                    __html: formatResponse(challenge),
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
