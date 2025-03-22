"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const appliances = [
  {
    category: "Laundry Appliances",
    items: ["Washing Machine", "Washer-Dryer Combo"],
  },
  {
    category: "Kitchen Appliances",
    subcategories: [
      {
        name: "Cooking & Heating",
        items: ["Oven", "Microwave", "Induction Cooktop", "Toaster"],
      },
      {
        name: "Cleaning & Storage",
        items: ["Dishwasher", "Refrigerator with Ice/Water Dispenser"],
      },
      {
        name: "Water Systems",
        items: ["Water Purifier Systems"],
      },
    ],
  },
  {
    category: "Heating and Cooling Systems",
    subcategories: [
      {
        name: "Water Heating",
        items: ["Water Heater (Geyser)"],
      },
      {
        name: "Air Conditioning & Cooling",
        items: ["Air Conditioner", "Fan", "Water-Cooled Air Cooler"],
      },
    ],
  },
  {
    category: "Cleaning Appliances",
    items: ["Vacuum Cleaner", "Steam Cleaner", "Air Purifier"],
  },
  {
    category: "Miscellaneous Appliances",
    items: [
      "Motorized Water Pumps",
      "Tandoor / Electric Roti Makers",
      "Steam Cleaners",
    ],
  },
  {
    category: "Lighting Types",
    items: ["CFL Bulb", "LED Bulb", "Tube Light", "LED Tube Light"],
  },
];

const ApplianceSelection = () => {
  const [values, setValues] = useState({});
  const authToken = localStorage.getItem("authToken");

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/save-appliances/${authToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="section-p flex flex-col gap-5 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Select Your Appliances</h1>
      <form className="grid lg:grid-cols-3 md:grid-cols-2 gap-[15px]" onSubmit={handleSubmit}>
        {appliances.map((section, index) => (
          <fieldset key={index} className="p-4 rounded-xl bg-white border shadow-sm">
            <legend className="font-semibold text-lg text-center mx-auto px-2 py-1 rounded-xl w-max">
              {section.category}
            </legend>
            {section.subcategories ? (
              section.subcategories.map((sub, subIndex) => (
                <fieldset key={subIndex} className="p-3 rounded-lg mt-2 border border-gray-200">
                  <legend className="text-sm font-medium">{sub.name}</legend>
                  {sub.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center mt-2">
                      <label className="w-64">{item}:</label>
                      <input
                        type="number"
                        name={item}
                        min="0"
                        value={values[item] || "0"}
                        onChange={handleChange}
                        className="border rounded p-1 w-16"
                      />
                    </div>
                  ))}
                </fieldset>
              ))
            ) : (
              section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center mt-2">
                  <label className="w-64">{item}:</label>
                  <input
                    type="number"
                    name={item}
                    min="0"
                    value={values[item] || "0"}
                    onChange={handleChange}
                    className="border rounded p-1 w-16"
                  />
                </div>
              ))
            )}
          </fieldset>
        ))}
        <Button
          type="submit"
          className="bg-[#1CB0F6] text-white px-4 py-2 rounded w-fit hover:bg-[#1CB0F6] mt-4"
        >
          Save Details
        </Button>
      </form>
    </div>
  );
};

export default ApplianceSelection;