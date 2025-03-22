import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import data from "@/app/assets/faqs/data";
import { HelpCircle } from "lucide-react";

const Faqs = () => {
  return (
    <section className="flex flex-col gap-10 section-p items-center justify-center">
      <h1 className="text-3xl font-bold flex items-center gap-4">
        <HelpCircle /> Frequently Asked Questions
      </h1>
      <main>
        {/* FAQ Section */}
        <div className="grid grid-rows-2 gap-6 max-w-[800px] sm:grid-cols-2 md:grid-cols-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-[5px] border border-gray-300 shadow-sm"
            >
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </main>
    </section>
  );
};

export default Faqs;
