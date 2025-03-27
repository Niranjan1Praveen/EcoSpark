"use client";
import Image from "next/image";
import billUpload from "../public/seo/bill-upload.png";
import trackUsage from "../public/seo/track-usage.png";
import saveRewards from "../public/seo/save-rewards.png";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

function Seo() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
    rootMargin: '800px 0px'
  });
  return (
    <div className="section-p flex flex-col py-10">
      {[
        {
          image: billUpload,
          title: "Upload Your Bills 📤",
          tagline: "UPLOAD",
          text: "Simply snap a photo or upload your electricity & water bills. Our AI extracts key insights automatically.",
          reverse: false,
        },
        {
          image: trackUsage,
          title: "Track & Reduce Consumption 📊",
          tagline: "MONITOR",
          text: "Monitor your monthly energy & water usage trends with our intuitive dashboard. Get personalized recommendations to lower costs.",
          reverse: true,
        },
        {
          image: saveRewards,
          title: "Earn Rewards for Saving 🎉",
          tagline: "REWARD",
          text: "Complete sustainability challenges, reduce consumption, and earn points. Redeem rewards & discounts for eco-friendly products.",
          reverse: false,
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`flex flex-col md:flex-row ${
            item.reverse ? "md:flex-row-reverse" : ""
          } items-center justify-center gap-8 md:gap-16 mb-16`}
        >
          <motion.div
            className="flex flex-col max-w-lg gap-3 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          >
            <small className="bg-[var(--sky-blue)] uppercase rounded-[5px] p-1 w-fit text-black">
              {item.tagline}
            </small>
            <h2 className="text-2xl md:text-3xl font-semibold">{item.title}</h2>
            <p className="text-base md:text-lg">{item.text}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          >
            <Image
              src={item.image}
              width={300}
              height={300}
              alt={item.title}
              className="w-64 h-64 md:w-96 md:h-96"
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Call-to-Action Section */}
      <div className="text-center mt-8">
        <h3 className="text-xl md:text-2xl font-semibold">
          Ready to Start Your <u>Sustainability Journey?</u>
        </h3>
        <button className="mt-4 bg-[#FFC107] text-black font-semibold px-6 py-3 shadow-md hover:bg-[#E6A800] transition rounded-[5px]">
          <Link href={"/signup"}>Sign Up Now</Link>
        </button>
      </div>
    </div>
  );
}

export default Seo;
