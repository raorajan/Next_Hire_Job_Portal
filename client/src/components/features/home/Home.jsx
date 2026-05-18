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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
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
    <section className="py-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Featured on NextHire
            </h2>
            <p className="text-muted-foreground mt-2">
              Discover top employers and success stories curated by our team.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <article
              key={item._id}
              className="bg-card backdrop-blur-sm rounded-2xl border border-border shadow-custom hover:shadow-neon hover:border-primary/50 transition-all duration-300 p-6 flex flex-col gap-4 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant="outline" className="text-xs font-semibold text-primary border-primary bg-primary/10">
                  {item.type === "company" ? "Featured Employer" : "Success Story"}
                </Badge>
                {item.company?.badges && item.company.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.company.badges.slice(0, 2).map((badge) => (
                      <Badge
                        key={badge}
                        className="bg-secondary/10 text-secondary border-secondary/30 text-[11px] font-semibold"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm font-semibold text-muted-foreground">{item.subtitle}</p>
              )}
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
              )}
              {item.company && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">{item.company.companyName}</span>
                  {item.company.location && ` • ${item.company.location}`}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
