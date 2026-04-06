import React from "react";
import LoaderLogo from "@/assets/nexthire.png"; // Ensure the image path is correct

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-[9999]">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
        <img
          src={LoaderLogo}
          alt="Loader"
          className="w-20 h-20 object-cover rounded-full z-10 border-2 border-primary/20 shadow-neon"
        />
        <div className="absolute w-28 h-28 border-2 border-border border-t-2 border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="mt-8 text-foreground font-bold tracking-widest animate-pulse">
        NEXT<span className="text-primary italic">HIRE</span>
      </p>
    </div>
  );
};

export default Loader;
