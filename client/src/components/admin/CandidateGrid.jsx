import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidateInsights, fetchCandidateRadar } from '@/redux/slices/application.slice';
import RadarChart from '../common/RadarChart';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Loader2, Copy, CheckCircle2, ChevronRight, MessageSquare, AlertCircle, Target } from 'lucide-react';
import { toast } from 'react-toastify';

const CandidateCard = ({ application, insights, radar, loading }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Interview starter copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 flex flex-col gap-6 relative overflow-hidden group">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00C8FF]/5 to-[#8040FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-gray-800">
          <AvatarImage src={application?.applicant?.profile?.profilePhoto} />
          <AvatarFallback className="bg-gray-800 text-gray-200">
            {application?.applicant?.fullname?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg text-white">
            {application?.applicant?.fullname}
          </h3>
          <p className="text-gray-400 text-sm">
            Applied on {new Date(application?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-400 py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#00C8FF]" />
          <p>Generating AI Insights...</p>
        </div>
      ) : (
        <>
          {/* Radar Chart */}
          <div className="flex justify-center -my-4">
            {radar ? (
              <RadarChart data={radar} size={250} />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                Radar data unavailable
              </div>
            )}
          </div>

          {/* Insights */}
          {insights && (
            <div className="space-y-4">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Key Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {insights.strengths?.map((strength, i) => (
                    <Badge key={i} variant="outline" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Potential Concerns
                </h4>
                <div className="flex flex-wrap gap-2">
                  {insights.concerns?.map((concern, i) => (
                    <Badge key={i} variant="outline" className="bg-amber-400/10 text-amber-400 border-amber-400/20">
                      {concern}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <MessageSquare className="w-4 h-4 text-[#00C8FF]" />
                  Interview Starters
                </h4>
                <div className="space-y-2">
                  {insights.interviewStarters?.slice(0, 2).map((starter, i) => (
                    <div key={i} className="flex gap-2 group/item">
                      <p className="text-sm text-gray-400 flex-1 leading-relaxed bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                        {starter}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover/item:opacity-100 shrink-0"
                        onClick={() => handleCopy(starter)}
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const CandidateGrid = ({ selectedApplications = [] }) => {
  const dispatch = useDispatch();
  const { candidateInsights, candidateRadar, loading } = useSelector((state) => state.application);

  useEffect(() => {
    selectedApplications.forEach(app => {
      if (!candidateInsights[app._id]) {
        dispatch(fetchCandidateInsights(app._id));
      }
      if (!candidateRadar[app._id]) {
        dispatch(fetchCandidateRadar(app._id));
      }
    });
  }, [selectedApplications, dispatch, candidateInsights, candidateRadar]);

  if (!selectedApplications.length) {
    return (
      <div className="text-center p-12 bg-gray-900 border border-gray-800 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-2">No Candidates Selected</h3>
        <p className="text-gray-400">Select candidates from the table to compare their AI insights.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {selectedApplications.map(app => (
        <CandidateCard
          key={app._id}
          application={app}
          insights={candidateInsights[app._id]}
          radar={candidateRadar[app._id]}
          loading={loading && (!candidateInsights[app._id] || !candidateRadar[app._id])}
        />
      ))}
    </div>
  );
};

export default CandidateGrid;
