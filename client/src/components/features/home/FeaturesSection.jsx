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
    <div className="py-12 px-4 bg-transparent relative overflow-hidden">
      {/* Background decoration with slow rotating orbits */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00C8FF]/5 rounded-full blur-[130px] anim-spin-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#8040FF]/5 rounded-full blur-[140px] anim-spin-rev"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-[-0.02em]">
            <span className="text-[#E6EDF3]">
              Why Choose{" "}
            </span>
            <span className="bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.3)] font-black">
              NextHire?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Experience the future of talent sourcing with our high-performance, secure intelligence workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-[#080C1E]/80 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:shadow-[0_0_40px_rgba(0,200,255,0.1)] hover:border-[#00C8FF]/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Spot light overlay on hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00C8FF]/5 rounded-full blur-xl group-hover:bg-[#00C8FF]/10 transition-all duration-300 -z-10"></div>
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-300`}></div>
              
              <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6 group-hover:shadow-[0_0_20px_rgba(0,200,255,0.3)]`}>
                <div className="anim-pulse-glow">{feature.icon}</div>
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-[#00C8FF] transition-colors duration-300 relative z-10">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed relative z-10 font-medium">
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

