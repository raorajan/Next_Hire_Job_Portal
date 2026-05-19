import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import { useParams, useNavigate } from "react-router-dom";
import ReactHelmet from "../common/ReactHelmet";
import { getApplicants } from "@/redux/slices/application.slice";
import { useDispatch } from "react-redux";
import Loader from "../common/Loader";
import { Button } from "@/components/ui/button";

const Applicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await dispatch(getApplicants(id));
        if (res?.payload?.status === 200) {
          setApplicants(res?.payload?.applicants ?? []);
        }
      } catch (error) {
        console.error("Failed to fetch applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [dispatch, id]);

  return (
    <div className='min-h-screen bg-[#050810] relative overflow-hidden'>
      {/* Premium Cyber Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,255,0.03),transparent_40%)] pointer-events-none" />
      <div className="grid-overlay"></div>
      
      {/* Decorative Orbits */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none anim-spin-slow">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#00C8FF] rounded-full shadow-[0_0_10px_#00C8FF]" />
      </div>
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none anim-spin-rev">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#8040FF] rounded-full shadow-[0_0_10px_#8040FF]" />
      </div>

      <Navbar />
      <ReactHelmet
        title='Candidate Registry - Admin'
        description='Review application dossiers, evaluate candidate profiles, and coordinate selection statuses for active recruitment cycles.'
        canonicalUrl='/admin/applicants'
      />

      <div className='max-w-7xl mx-auto pt-24 pb-12 px-6 relative z-10'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6'>
          <div>
            <h1 className='text-4xl font-black tracking-tight text-white mb-2'>
              Candidate <span className='bg-gradient-to-r from-[#00C8FF] to-[#8040FF] bg-clip-text text-transparent italic'>Registry</span>
            </h1>
            <p className='text-muted-foreground font-medium'>Reviewing {applicants?.length || 0} active dossiers for this posting.</p>
          </div>
          <Button
            onClick={() => navigate(-1)}
            className='rounded-xl bg-white/5 border border-white/10 hover:border-[#00C8FF]/50 text-muted-foreground hover:text-white transition-all duration-300 px-6 py-2'
          >
            <span className="mr-2 italic">←</span> Return Terminal
          </Button>
        </div>

        {loading ? <Loader /> : <ApplicantsTable applicants={applicants} />}
      </div>
    </div>
  );
};

export default Applicants;
