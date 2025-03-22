"use client";
import BillUploader from "@/components/billReader";
import Challenges from "@/components/challenges";
import Topbar from "@/components/topbar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Scatter,
} from "recharts";

const Page = () => {
  const [extractedText, setExtractedText] = useState("");
  const [ElectricityBillDetails, setElectricityBillDetails] = useState(null);
  const [WaterBillDetails, setWaterBillDetails] = useState(null);
  const [electricityData, setElectricityData] = useState([]);
  const [waterData, setWaterData] = useState([]);

  // Electricity Bill
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/electricity-bills")
      .then((response) => {
        const data = response.data[response.data.length - 1]; // Get the latest entry
        setElectricityBillDetails(data);
  
        if (data?.consumption_history) {
          // Split by comma (,) instead of semicolon (;)
          const consumptionEntries = data.consumption_history.split(", ");
  
          const formattedData = consumptionEntries.map((entry) => {
            const [period, units] = entry.split(": ");
            const usage = parseInt(units.replace("units", "").trim(), 10);
  
            if (isNaN(usage)) {
              console.warn(`Invalid units value: ${units}`);
              return null;
            }
  
            return {
              period: period.trim(),
              usage: usage,
            };
          }).filter(entry => entry !== null); // Filter out invalid entries
  
          setElectricityData(formattedData);
        }
      })
      .catch((error) => {
        console.error("Error fetching electricity data:", error);
      });
  }, []);

  // Water Bill
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/water-bills")
      .then((response) => {
        const data = response.data[response.data.length - 1];
        setWaterBillDetails(data);

        if (data && data.bill_history) {
          const historyPattern = /(\w+\s\d{4}):\s*(\d+\.?\d*)\s*units/g;
          const matches = [...data.bill_history.matchAll(historyPattern)];
          const formattedData = matches.map((match) => ({
            month: match[1],
            usage: parseFloat(match[2]),
          }));
          setWaterData(formattedData);
        }
      })
      .catch((error) => {
        console.error("Error fetching water data:", error);
      });
  }, []);
  const maxUsage = Math.max(...waterData.map((item) => item.usage));
  const maxDataPoint = waterData.find((item) => item.usage === maxUsage); 
  console.log("Electricity Bill Details:", ElectricityBillDetails);
  console.log("Water Bill Details:", WaterBillDetails);
  console.log("Water Data:", waterData);
  console.log("Electricity Data:", electricityData);
  return (
    <main className="flex flex-col section-p gap-7 w-full min-h-screen">
      <Topbar />
      <div className="w-full grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-[25%_25%_25%_25%]">
        <div className="col-span-2 flex">
          <div className="w-full bg-white shadow-md rounded-xl p-6 flex flex-col">
            <Challenges />
          </div>
        </div>

        <div className="col-span-2 flex">
          <div className="w-full bg-white shadow-md rounded-xl flex flex-col">
            <BillUploader
              extractedText={extractedText}
              setExtractedText={setExtractedText}
            />
          </div>
        </div>

        {/* Electricity Data */}
        {[
          {
            title: "Electricity Bill Amount",
            value:
              "₹" + (ElectricityBillDetails?.bill_amount || "Not Available"),
          },
          {
            title: "Electricity Units Consumed",
            value:
              ElectricityBillDetails?.current_units_consumed || "Not Available",
          },
          {
            title: "Electricity Goal Units",
            value: ElectricityBillDetails?.goal_units || "Not Available",
          },
          {
            title: "Subsidies for Electricity",
            value: ElectricityBillDetails?.subsidies_unit || "Not Available",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md h-44 rounded-xl p-4 flex flex-col hover:shadow-lg transition-all duration-300 overflow-auto"
          >
            <p className="text-lg font-semibold mb-1">{item.title}</p>
            {item.title === "Subsidies" && item.value !== "Not Available" ? (
              <div className="text-[1.1rem] font-bold">
                {item.value.split(". ").map((line, i) => (
                  <p key={i} className="mb-1 text-[#1CB0F6]">
                    • {line.trim()}
                  </p>
                ))}
              </div>
            ) : (
              <small className="text-[1.1rem] font-bold text-[#1CB0F6]">
                {item.value}
              </small>
            )}
          </div>
        ))}

        {/* Water Data */}
        {[
          {
            title: "Water Bill Amount",
            value: WaterBillDetails?.bill_amount || "Not Available",
          },
          {
            title: "Water Units Consumed",
            value:
              WaterBillDetails?.water_usage || "Not Available",
          },
          {
            title: "Water Goal Units",
            value: WaterBillDetails?.goal_units || "Not Available",
          },
          {
            title: "Subsidies for Water",
            value: WaterBillDetails?.subsidies_unit || "Not Available",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md h-44 rounded-xl p-4 flex flex-col hover:shadow-lg transition-all duration-300 overflow-auto"
          >
            <p className="text-lg font-semibold mb-1">{item.title}</p>
            {item.title === "Subsidies" && item.value !== "Not Available" ? (
              <div className="text-[1.1rem] font-bold">
                {item.value.split(". ").map((line, i) => (
                  <p key={i} className="mb-1 text-[#1CB0F6]">
                    • {line.trim()}
                  </p>
                ))}
              </div>
            ) : (
              <small className="text-[1.1rem] font-bold text-[#1CB0F6]">
                {item.value}
              </small>
            )}
          </div>
        ))}

        {/* Electricity Bill Trends Chart */}
        <div className="col-span-2 bg-white shadow-md rounded-xl p-6 w-full flex flex-col">
          <p className="text-lg font-semibold mb-4">
            Electricity Bill Trends{" "}
            <small>[Consumption History for last {electricityData.length} months]</small>
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={electricityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                angle={-45}
                fontSize={12}
                textAnchor="end"
                height={120}
              />
              <Legend align="right" verticalAlign="top"/>
              <YAxis
                label={{
                  value: "Units (kWh/kVAh)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Bar
                dataKey="usage"
                shape={(props) => {
                  const { x, y, width, height, value } = props;
                  const maxUsage = Math.max(
                    ...electricityData.map((item) => item.usage)
                  );
                  const fillColor = value === maxUsage ? "#ff0000" : "#1ed760";
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={fillColor}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Water Trends Chart */}
        <div className="col-span-2 bg-white shadow-md rounded-xl p-6 w-full flex flex-col">
          <p className="text-lg font-semibold mb-4">
            Water Trends <small>[Consumption History for last {waterData.length} months]</small>
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <Legend align="right" verticalAlign="top" />
              <YAxis
                label={{
                  value: "kiloLitres (kL)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="usage"
                stroke="#1CB0F6"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  if (payload.usage === maxUsage) {
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={6}
                        fill="#ff0000"
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    );
                  }
                  return null; 
                }}
              />
              <Scatter
                data={[maxDataPoint]}
                shape={(props) => {
                  const { cx, cy } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill="#ff0000"
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

export default Page;
