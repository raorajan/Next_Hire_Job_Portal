import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse'></div>
        <div className='absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse'></div>
      </div>

      <Navbar />
      <main className="flex flex-col flex-1 items-center justify-center text-center px-4 py-20 md:py-32 gap-8 relative z-10">
        {/* Neon 404 badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary font-bold text-sm tracking-widest uppercase shadow-neon-sm backdrop-blur-sm animate-bounce">
          <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
          Error Code: 404
        </div>

        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-tight">
            <span className="block text-foreground mb-4">Route Not Found.</span>
            <span className="bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent italic">
              System Disorientation
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
            The destination you are seeking has been relocated, redacted, or never materialized in this sector.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mt-4">
          <Link
            to="/"
            className="group relative inline-flex items-center justify-center rounded-2xl bg-primary px-10 py-4 font-bold text-primary-foreground shadow-neon hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return Base
            </span>
          </Link>
          <Link
            to="/other-jobs"
            className="inline-flex items-center justify-center rounded-2xl border border-border bg-card/30 backdrop-blur-sm px-10 py-4 font-bold text-foreground hover:bg-muted hover:border-primary/40 transition-all duration-300 shadow-custom"
          >
            Explore Highlights
          </Link>
        </div>

        {/* Supplemental Guidance Card */}
        <section className="w-full max-w-2xl mt-16 rounded-3xl border border-border bg-card/60 backdrop-blur-xl shadow-custom p-8 text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-foreground italic tracking-tight">Need a professional reset?</h2>
              <p className="text-muted-foreground font-medium leading-normal">
                Navigate to our active job directory to filter roles by <span className="text-secondary font-bold">domain</span>, <span className="text-primary font-bold">expertise</span>, and <span className="text-foreground font-bold">scale</span>.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 font-extrabold text-primary-foreground shadow-neon-sm hover:shadow-neon hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Access Jobs Console
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/50 text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">
            System log: Curated opportunities updated in real-time from verified global enterprises.
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default NotFound;

