import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { HelpCircle, Mail, Send } from "lucide-react";

function ContactForm(props) {
  return (
    <main>
      <div className="bg-[var(--secondary-background)] flex flex-col items-center justify-center gap-5 shadow-sm p-5 rounded-[5px]">
        <h2 className="text-2xl text-center font-semibold gap-2">
          Get in Touch with Us
        </h2>
        <form className="flex flex-col gap-4 w-full">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-500" />
            <Input
              type="text"
              name="email"
              placeholder="Your Email"
              className="w-full pl-10 border-2 border-gray-300 bg-white"
            />
          </div>
          <Textarea
            placeholder="Your Message"
            className="w-full rounded-[6px] border-2 border-gray-300 bg-white resize-none"
          />
          <button
            type="submit"
            className="bg-[#1CB0F6] text-white py-2 rounded-[6px] w-auto flex items-center justify-center gap-2 hover:bg-[#1380C3] transition"
          >
            <Send /> Send Message
          </button>
        </form>
      </div>
    </main>
  );
}

export default ContactForm;
