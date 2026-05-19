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
    icon: <FaUserTie className="text-[#00C8FF] text-2xl group-hover:scale-110 transition-transform duration-300" />,
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
    icon: <FaBook className="text-[#8040FF] text-2xl group-hover:scale-110 transition-transform duration-300" />,
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
    <div className="flex flex-col min-h-screen bg-[#050810] relative overflow-hidden">
      {/* Premium Cyber Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,255,0.03),transparent_40%)] pointer-events-none" />
      <div className="grid-overlay"></div>
      <div className="absolute top-20 left-10 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none anim-spin-slow">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#00C8FF] rounded-full shadow-[0_0_10px_#00C8FF]" />
      </div>
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none anim-spin-rev">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#8040FF] rounded-full shadow-[0_0_10px_#8040FF]" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#00C8FF] bg-[#00C8FF]/10 rounded-full border border-[#00C8FF]/20 shadow-[0_0_15px_rgba(0,200,255,0.15)] animate-bounce">
              <FaMagic />
              Job-Seeker Playbook
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
              Tools that make the job search <span className="bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent italic">painless.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From resume polish to interview practice, this workspace brings together curated
              workflows, templates, and quick actions to keep you moving forward.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#00C8FF] text-[#050810] font-bold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-105 transition-all duration-300"
              >
                Jump to Open Roles
              </Link>
              <Link
                to="/browse-jobs"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/10 text-white hover:bg-white/5 hover:border-[#00C8FF]/30 font-bold transition-all duration-300"
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
                className="rounded-2xl border border-white/5 p-8 shadow-[0_0_50px_rgba(0,100,220,0.03)] hover:shadow-[0_0_30px_rgba(0,200,255,0.2)] hover:border-[#00C8FF]/20 transition-all duration-500 group bg-[#080C1E]/80 backdrop-blur-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#00C8FF]/10 transition-all duration-500">
                  {item.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00C8FF] transition-colors">{item.title}</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{item.description}</p>
                <Link
                  to={item.to}
                  className="text-[#00C8FF] font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all drop-shadow-[0_0_10px_rgba(0,200,255,0.2)]"
                >
                  {item.action}
                  <span className="text-xl">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="py-24 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
          {/* Subtle noise pattern or grid could go here */}
          <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-3">
            {workflowCards.map((card) => (
              <article
                key={card.title}
                className="p-8 bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-2xl text-white space-y-4 hover:border-[#8040FF]/20 hover:shadow-[0_0_30px_rgba(128,64,255,0.1)] transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-[#8040FF] drop-shadow-[0_0_10px_rgba(128,64,255,0.2)]">{card.title}</h3>
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

