import React from "react";
import { Briefcase, Users, TrendingUp, Shield, Zap, Target } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "10,000+ Jobs",
      description: "Explore opportunities from top companies",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "5,000+ Companies",
      description: "Connect with leading employers",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "AI-Powered Matching",
      description: "Get personalized job recommendations",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Verified",
      description: "All profiles and companies verified",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Quick Apply",
      description: "One-click application process",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Career Growth",
      description: "Find roles that match your goals",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="py-12 px-4 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-foreground">
              Why Choose{" "}
            </span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              NextHire?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of job searching with our innovative platform designed for both job seekers and employers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-card backdrop-blur-sm rounded-2xl p-8 border border-border shadow-custom hover:shadow-neon hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6`}>
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

