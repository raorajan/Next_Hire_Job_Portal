import React from "react";
import Navbar from "../../layout/Navbar";
import Footer from "../../layout/Footer";
import ReactHelmet from "../../common/ReactHelmet";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />
      <ReactHelmet
        title="Privacy Policy - Next_Hire"
        description="Read our privacy policy to understand how we protect your data at Next_Hire."
        canonicalUrl="/privacy"
      />

      <div className="max-w-4xl mx-auto mt-32 px-4 py-8 relative z-10 mb-10">
        <div className="bg-card backdrop-blur-sm border border-border rounded-2xl p-8 sm:p-12 shadow-custom">
          <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">1. Data Collection</h2>
              <p>
                We collect information about you when you provide it to us, such as when you create an account, upload a resume, or apply for jobs. This may include your name, email address, profile photo, and career history.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">2. Use of Information</h2>
              <p>
                The information we collect is used to provide and enhance our services, facilitate job applications between candidates and recruiters, and send relevant job alerts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">3. Data Protection</h2>
              <p>
                We implement industry-standard security measures to protect your personal data. Your resumes and profile details are only shared with authorized recruiters when you explicitly apply for a position.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">4. Your Controls</h2>
              <p>
                You can manage your privacy settings, such as profile visibility and notification preferences, directly from the settings page. You also have the right to deactivate or delete your account at any time.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Privacy;