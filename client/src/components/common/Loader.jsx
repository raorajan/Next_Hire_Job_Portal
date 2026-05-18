import React from "react";


const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-[9999]">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
        <img
          src="/favicon.svg"
          alt="Loader"
          className="w-20 h-20 object-cover rounded-full z-10 border-2 border-primary/20 shadow-neon"
        />
        <div className="absolute w-28 h-28 border-2 border-border border-t-2 border-t-primary rounded-full animate-spin"></div>
      </div>
     
    </div>
  );
};

export default Loader;
