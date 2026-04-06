import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-background text-foreground border-t border-border overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Next<span className="text-primary">Hire</span>
            </h2>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your trusted platform for connecting talented professionals with top employers. 
              Discover opportunities, grow your career, and build your future.
            </p>
            <div className="flex space-x-4">
              <a
                href={import.meta.env.VITE_SOCIAL_FACEBOOK_URL || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:shadow-neon flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" />
                </svg>
              </a>
              <a
                href={import.meta.env.VITE_SOCIAL_TWITTER_URL || "https://twitter.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:shadow-neon flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" />
                </svg>
              </a>
              <a
                href={import.meta.env.VITE_SOCIAL_LINKEDIN_URL || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:shadow-neon flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/browse-jobs" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Search Results
                </Link>
              </li>
              <li>
                <Link to="/other-jobs" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Other Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">For Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/profile/admin/companies/create" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Create Company
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-200">Find Talent</span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-200">Pricing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2024 NextHire. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-200">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
