"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CloseOutlined } from "@mui/icons-material";
import EmptyList from "@/components/emptylist";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [responses, setResponses] = useState({
    "How many members usually live in your household (including yourself)?": "",
    "Do you own or regularly use an electric vehicle (EV)?": "",
    "How do you typically wash your clothes?": "",
    "Which best describes how you wash your dishes?": "",
    "How do you manage indoor temperature during warm seasons?": "",
    "Which category best fits the count of major electrical appliances (e.g., refrigerator, washing machine, microwave, TV, water pump, geyser, etc.) in your home?":
      "",
    "How do you and your family members typically bathe?": "",
    "How do you use your water heater (geyser) at home?": "",
    "Which best describes your toilet flush system?": "",
    "How do you operate a motor or water pump to access water (if applicable)?":
      "",
  });
  useEffect(() => {
    fetch(`http://localhost:3001/api/questions`)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);
  const authToken = localStorage.getItem("authToken");
  useEffect(() => {
    if (authToken) {
      fetch(`http://localhost:3001/api/user-score?authToken=${authToken}`)
        .then((res) => res.json())
        .then((data) => setUserScore(data?.UserScore || 0))
        .catch((err) => console.error("Error fetching user score:", err));
    }
  }, []);

  if (questions.length === 0) {
    return <EmptyList />;
  }

  const data = questions[index];

  const handleSelect = async (optionIndex) => {
    setSelected(optionIndex);
    const currentQuestion = questions[index].Question;
    const selectedOption = [
      questions[index].Option1,
      questions[index].Option2,
      questions[index].Option3,
      questions[index].Option4,
    ][optionIndex - 1];

    setResponses((prev) => ({
      ...prev,
      [currentQuestion]: selectedOption,
    }));
  };
  console.log(responses);

  const handleNext = async () => {
    if (selected !== null && index < questions.length) {
      try {
        const selectedScore =
          selected === 1
            ? data.op1score
            : selected === 2
            ? data.op2score
            : selected === 3
            ? data.op3score
            : selected === 4
            ? data.op4score
            : 0;

        const newTotalScore = userScore + selectedScore;

        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          console.error("AuthToken is missing");
          return;
        }

        console.log("Sending request with:", { authToken, newTotalScore });

        await axios.post(
          `http://localhost:3001/api/update-score/${authToken}`,
          { total_score: newTotalScore },
          { headers: { "Content-Type": "application/json" } }
        );

        setUserScore(newTotalScore);
        setIndex((prev) => prev + 1);
        setSelected(null);
      } catch (error) {
        console.error("Error submitting score:", error);
      }
    }
  };
  const handleSubmit = async () => {
    if (!authToken) {
      console.error("AuthToken is missing");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3001/api/submit-responses/${authToken}`,
        {
          ...responses,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Responses submitted successfully:", response.data);
      router.push("/home");
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  const handlePrevious = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  return (
    <section className="flex justify-center flex-col min-h-screen section-p bg-[var(--secondary-background)]">
      <h1 className="text-1xl font-bold flex items-center gap-4 text-[#1CB0F6] p-2 absolute right-0 top-0">
        {new Date().toLocaleDateString()}
      </h1>
      <Link href={"/home"} className="absolute top-0 left-0 p-5">
        <CloseOutlined />
      </Link>
      <main className="bg-white rounded-xl py-[40px]">
        {/* Progress Bar */}
        <div className="flex gap-2 w-full items-center px-[50px]">
          <ArrowBackIcon
            onClick={handlePrevious}
            className="icon cursor-pointer"
          />
          <div className="relative w-full bg-[rgb(55,70,79)] rounded-full h-[10px]">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 left-0 h-full bg-[#1ed760] rounded-full"
            />
          </div>
        </div>

        {/* Question Section */}
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-lg p-8 flex flex-col gap-4"
        >
          <div className="flex gap-4 items-center font-medium">
            <motion.p
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="py-[12px] px-[16px] rounded-[5px] text-2xl"
            >
              {data.Question}
            </motion.p>
          </div>

          {/* Options */}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 quiz-options py-10">
            {[data.Option1, data.Option2, data.Option3, data.Option4].map(
              (option, i) => (
                <motion.li
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.03 }}
                  className={`border-2 border-[rgba(55,70,79,1)] overflow-hidden p-[16px] rounded-[6px] text-lg cursor-pointer w-full transition-all ${
                    selected === i + 1 ? "bg-[#1CB0F6] text-white" : ""
                  }`}
                  onClick={() => handleSelect(i + 1)}
                >
                  {option}
                </motion.li>
              )
            )}
          </ul>
          <small className="text-center">
            {index + 1} of {questions.length} questions
          </small>
          <hr className="w-full" />
          <div className="flex justify-end">
            {index === questions.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSubmit}
                className="uppercase text-sm font-bold flex items-center justify-center px-8 py-4 rounded-full bg-[#1ed760] text-black"
              >
                Submit 🎉
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleNext}
                className="uppercase text-sm font-bold flex items-center justify-center px-8 py-4 rounded-full bg-[#1ed760] text-black"
              >
                Continue
              </motion.button>
            )}
          </div>
        </motion.div>
      </main>
    </section>
  );
}
