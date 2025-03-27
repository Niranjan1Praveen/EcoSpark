import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="flex items-center bg-[var(--secondary-text)] section-p overflow-hidden ">
      <small className="text-[#B3B3B3]">
        Built by{" "}
        <Link href={"/"} className="uppercase underline">
          code4change
        </Link>
        . The source code is available on{" "}
        <Link href={"/"} className="underline">
          GitHub.
        </Link>
      </small>
    </footer>
  );
}

export default Footer;
