import React from "react";
import EmptyGif from "../public/gifs/EmptyList.gif";
import Image from "next/image";
import Link from "next/link";
const EmptyList = () => {
  return (
    <section className="flex justify-center items-center flex-col min-h-screen">
      <Image src={EmptyGif} alt="Empty List Gif" width={300} height={300} />
      <p className="text-sm uppercase">No Data Available</p>
      <Link href={"/home"} className="pointer underline text-sm">
        Go Back
      </Link>
    </section>
  );
};

export default EmptyList;
