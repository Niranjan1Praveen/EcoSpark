import Image from "next/image";
import billUpload from "../public/seo/bill-upload.png";
import trackUsage from "../public/seo/track-usage.png";
import saveRewards from "../public/seo/save-rewards.png";
import Link from "next/link";

function Seo() {
  return (
    <div className="bg-[var(--secondary-background)] section-p flex flex-col py-10">
      {/* <h1 className="text-white text-3xl md:text-4xl font-bold text-center my-4">
        How It Works?
      </h1> */}
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
        <div
          key={index}
          className={`flex flex-col md:flex-row ${
            item.reverse ? "md:flex-row-reverse" : ""
          } items-center justify-center gap-8 md:gap-16 mb-16`}
        >
          <div className="flex flex-col max-w-lg gap-3 text-center md:text-left">
            <small className="bg-[var(--sky-blue)] uppercase rounded-[5px] p-1 w-fit text-black">
              {item.tagline}
            </small>
            <h2 className="text-2xl md:text-3xl font-semibold">
              {item.title}
            </h2>
            <p className="text-base md:text-lg">{item.text}</p>
          </div>
          <Image
            src={item.image}
            width={300}
            height={300}
            alt={item.title}
            className="w-64 h-64 md:w-96 md:h-96"
          />
        </div>
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
