import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { FaBook, FaMagic, FaUserTie, FaCheckCircle } from "react-icons/fa";
import ReactHelmet from "@/components/common/ReactHelmet";

const guideBlocks = [
  {
    title: "Interview Readiness",
    description:
      "Structured prep checklists, behavioral prompts, and whiteboard drills to help you walk into interviews with confidence.",
    to: "/other-jobs",
    action: "Explore Practice Sets",
    icon: <FaUserTie className="text-primary text-2xl group-hover:scale-110 transition-transform duration-300" />,
  },
  {
    title: "ATS-Friendly Resume Tips",
    description:
      "Learn how to tailor your profile for every submission, with examples that score well across the top ATS scanners.",
    to: "/profile",
    action: "Review My Profile",
    icon: <FaCheckCircle className="text-green-400 text-2xl group-hover:scale-110 transition-transform duration-300" />,
  },
  {
    title: "Career Playbooks",
    description:
      "Step-by-step pathways for popular roles so you can upskill, benchmark compensation, and target the right companies.",
    to: "/jobs",
    action: "See Matching Roles",
    icon: <FaBook className="text-secondary text-2xl group-hover:scale-110 transition-transform duration-300" />,
  },
];

const workflowCards = [
  {
    title: "AI Resume Refiner",
    body: "Upload a draft and get tailored bullet suggestions aligned to the role you’re exploring on NextHire.",
  },
  {
    title: "1:1 Mock Interviews",
    body: "Book 30-minute sessions with vetted mentors from FAANG, top startups, and hyper-growth SaaS companies.",
  },
  {
    title: "Offer Navigator",
    body: "Track stages, compare offers, and generate polite negotiation emails in one place.",
  },
];

function CareerResources() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <Navbar />
      <ReactHelmet
        title="Career Resources - NextHire"
        description="Access curated job-seeker playbooks, interview readiness tools, and resume tips to land your next role."
        canonicalUrl="/career-resources"
      />

      <main className="flex-1">
        <section className="pt-32 pb-16 relative">
          <div className="max-w-6xl mx-auto px-4 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary bg-primary/10 rounded-full border border-primary/20 shadow-neon-sm animate-bounce">
              <FaMagic />
              Job-Seeker Playbook
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-tight">
              Tools that make the job search <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">painless.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From resume polish to interview practice, this workspace brings together curated
              workflows, templates, and quick actions to keep you moving forward.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-neon hover:scale-105 transition-all duration-300"
              >
                Jump to Open Roles
              </Link>
              <Link
                to="/browse-jobs"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-border text-foreground hover:bg-muted/50 hover:border-primary/30 font-bold transition-all duration-300"
              >
                Use Filters & Alerts
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
            {guideBlocks.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border p-8 shadow-custom hover:shadow-neon hover:border-primary/20 transition-all duration-500 group bg-card backdrop-blur-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-500">
                  {item.icon}
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{item.title}</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{item.description}</p>
                <Link
                  to={item.to}
                  className="text-primary font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  {item.action}
                  <span className="text-xl">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="py-24 bg-muted/10 border-y border-border relative overflow-hidden">
          {/* Subtle noise pattern or grid could go here */}
          <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-3">
            {workflowCards.map((card) => (
              <article
                key={card.title}
                className="p-8 bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl text-foreground space-y-4 hover:border-secondary/20 transition-all duration-300 shadow-inner"
              >
                <h3 className="text-xl font-bold text-secondary">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{card.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CareerResources;

