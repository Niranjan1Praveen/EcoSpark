"use client";
import React from "react";
import {
  ArrowRight,
  Eye,
  Gift,
  LineChart,
  Leaf,
  ArrowDown,
} from "lucide-react";

const flowChartData = [
  {
    icon: LineChart,
    title: "Track Usage",
    description: "Monitor your water & electricity consumption.",
    className: "bg-[#1CB0F6]",
  },
  {
    icon: Leaf,
    title: "Reduce Consumption",
    description: "Get AI-driven insights to cut down waste.",
    className: "bg-[#1CB0F6]",
  },
  {
    icon: Gift,
    title: "Earn Rewards",
    description: "Complete challenges & earn points.",
    className: "bg-[#1CB0F6]",
  },
  {
    icon: Eye,
    title: "See Your Impact",
    description: "Measure your contribution to sustainability.",
    className: "bg-[#1CB0F6]",
  },
];

const Flowchart = () => {
  return (
    <div className="relative text-center overflow-hidden section-p">
      <div className="flex gap-6 justify-center items-center py-7 z-10 flex-wrap md:flex-nowrap">
        {flowChartData.map((item, id) => (
          <React.Fragment key={id}>
            <div
              className={`flex flex-col items-center w-40 transition-transform duration-300 hover:scale-110 ${
                id % 2 === 0 ? "md:translate-y-6" : "md:-translate-y-6"
              }`}
            >
              <div
                className={`w-[120px] h-[120px] rounded-full flex justify-center items-center shadow-md ${item.className}`}
              >
                <item.icon size={50} color="white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            {id < flowChartData.length - 1 && (
              <ArrowRight size={30} className="text-gray-500 hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Flowchart;
