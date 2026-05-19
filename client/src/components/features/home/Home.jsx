import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "./HeroSection";
import Footer from "@/components/layout/Footer";
import CategoryCarousel from "./CategoryCarousel";
import FeaturesSection from "./FeaturesSection";
import LatestJobs from "./LatestJobs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHighlights } from "@/redux/slices/job.slice";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const dispatch = useDispatch();
  const { highlights } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(getHighlights());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-[#050810] text-[#E6EDF3] relative overflow-hidden">
      {/* Cybernetic High-Tech Glow Overlay & Particle Grids */}
      <div className="absolute inset-0 grid-overlay -z-10"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00C8FF]/5 rounded-full blur-[140px] anim-spin-slow -z-10"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-[#8040FF]/5 rounded-full blur-[160px] anim-spin-rev -z-10"></div>
      
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        {highlights && highlights.length > 0 && <HighlightsSection highlights={highlights} />}
        <CategoryCarousel />
        <FeaturesSection />
        <LatestJobs />
      </main>
      <Footer />
    </div>
  );
};

const HighlightsSection = ({ highlights }) => {
  return (
    <section className="py-12 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#E6EDF3] to-[#8B949E] bg-clip-text text-transparent">
              Featured on <span className="text-[#00C8FF] drop-shadow-[0_0_15px_rgba(0,200,255,0.35)]">NextHire</span>
            </h2>
            <p className="text-muted-foreground mt-2 font-medium">
              Discover top employers and verified success stories curated by our intelligence platform.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <article
              key={item._id}
              className="relative group p-6 rounded-2xl glassmorphic-card border border-white/5 hover:border-[#00C8FF]/30 transition-all duration-300 flex flex-col gap-4 transform hover:-translate-y-1.5 hover:shadow-[0_0_50px_rgba(0,200,255,0.12)] overflow-hidden"
            >
              {/* Translucent corner hover ambient spot */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00C8FF]/5 rounded-full blur-xl group-hover:bg-[#00C8FF]/10 transition-all duration-300 -z-10"></div>
              
              <div className="flex items-center justify-between gap-3 relative z-10">
                <Badge variant="outline" className="text-xs font-semibold text-[#00C8FF] border-[#00C8FF]/30 bg-[#00C8FF]/10 px-3 py-1">
                  {item.type === "company" ? "Featured Employer" : "Success Story"}
                </Badge>
                {item.company?.badges && item.company.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.company.badges.slice(0, 2).map((badge) => (
                      <Badge
                        key={badge}
                        className="bg-[#8040FF]/15 text-[#8040FF] border border-[#8040FF]/30 text-[11px] font-semibold px-2 py-0.5"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-foreground relative z-10 group-hover:text-[#00C8FF] transition-colors duration-300">{item.title}</h3>
              
              {item.subtitle && (
                <p className="text-sm font-semibold text-muted-foreground relative z-10">{item.subtitle}</p>
              )}
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-3 relative z-10 leading-relaxed">{item.description}</p>
              )}
              {item.company && (
                <div className="mt-auto text-sm text-muted-foreground relative z-10 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="font-bold text-[#00C8FF]">{item.company.companyName}</span>
                  {item.company.location && (
                    <span className="text-xs font-semibold px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-muted-foreground">
                      {item.company.location}
                    </span>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const HighlightsSection_unused = ({ highlights }) => {
  return null;
};

export default Home;
