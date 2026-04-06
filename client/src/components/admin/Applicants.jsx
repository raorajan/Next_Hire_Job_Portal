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
    <div className='min-h-screen bg-background relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse'></div>
        <div className='absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse'></div>
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
            <h1 className='text-4xl font-black tracking-tight text-foreground mb-2'>
              Candidate <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic'>Registry</span>
            </h1>
            <p className='text-muted-foreground font-medium'>Reviewing {applicants?.length || 0} active dossiers for this posting.</p>
          </div>
          <Button
            onClick={() => navigate(-1)}
            className='rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 text-muted-foreground hover:text-primary shadow-sm hover:shadow-neon-sm transition-all duration-300 px-6 py-2'
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
