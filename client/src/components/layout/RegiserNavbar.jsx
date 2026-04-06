import React from "react";
import { Link } from "react-router-dom";
import NextHireLogo from "@/assets/nexthire.png";

const RegisterNavbar = () => {
  return (
    <div className="bg-background/80 backdrop-blur-md border-b border-border w-full fixed top-0 left-0 z-50">
      <div className="w-11/12 m-auto">
        <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 lg:px-0">
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Link to="/" className="flex items-center group">
              <img
                src={NextHireLogo}
                alt="NextHire Logo"
                className="h-8 mr-2 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Next<span className="text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">Hire</span>
              </span>
            </Link>
          </h1>
          <div className="hidden md:flex items-center gap-6">
            <p className="text-muted-foreground">
              Already registered?{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:text-secondary transition-colors duration-300 relative group"
              >
                Login here
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterNavbar;
