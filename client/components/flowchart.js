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
      <div className="flex flex-wrap justify-center items-center py-7 z-10 gap-y-8 gap-x-6 md:flex-nowrap md:gap-6">
        {flowChartData.map((item, id) => (
          <React.Fragment key={id}>
            {/* Item Container */}
            <div
              className={`flex flex-col items-center w-[calc(50%-12px)] md:w-40 transition-transform duration-300 hover:scale-110 ${
                id % 2 === 0 ? "md:translate-y-6" : "md:-translate-y-6"
              }`}
            >
              {/* Icon Circle */}
              <div
                className={`w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-full flex justify-center items-center shadow-md ${item.className}`}
              >
                <item.icon size={40} color="white" className="md:size-[50px]" />
              </div>

              {/* Text Content */}
              <h3 className="mt-3 md:mt-4 text-base md:text-lg font-semibold">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 px-1">
                {item.description}
              </p>
            </div>

            {/* Mobile Arrow (only between pairs) */}
            {id % 2 === 0 && id < flowChartData.length - 1 && (
              <div className="w-full flex justify-center md:hidden">
                <ArrowRight
                  size={24}
                  className="text-gray-500 rotate-90 md:rotate-0"
                />
              </div>
            )}

            {/* Desktop Arrow */}
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
