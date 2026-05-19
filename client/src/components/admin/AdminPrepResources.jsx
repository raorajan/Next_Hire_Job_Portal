import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";
import ReactHelmet from "../common/ReactHelmet";
import { useDispatch, useSelector } from "react-redux";
import {
  getPrepResources,
  createPrepResource,
  updatePrepResource,
  deletePrepResource,
} from "@/redux/slices/job.slice";
import { toast } from "react-toastify";
import Loader from "../common/Loader";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ConfirmationModal from "../common/ConfirmationModal";

const AdminPrepResources = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const { prepResources } = useSelector((state) => state.job);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    url: "",
    tags: "",
  });

  useEffect(() => {
    fetchResources();
  }, [dispatch]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      await dispatch(getPrepResources()).unwrap();
    } catch (error) {
      toast.error("Failed to fetch prep resources");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      if (editingId) {
        await dispatch(
          updatePrepResource({ resourceId: editingId, data })
        ).unwrap();
        toast.success("Prep resource updated successfully!");
      } else {
        await dispatch(createPrepResource(data)).unwrap();
        toast.success("Prep resource created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        category: "",
        content: "",
        url: "",
        tags: "",
      });
      fetchResources();
    } catch (error) {
      toast.error(error?.message || "Failed to save prep resource");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resource) => {
    setFormData({
      title: resource.title || "",
      category: resource.category || "",
      content: resource.content || "",
      url: resource.url || "",
      tags: resource.tags?.join(", ") || "",
    });
    setEditingId(resource._id);
    setShowForm(true);
  };

  const handleDeleteClick = (resourceId) => {
    setSelectedResourceId(resourceId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedResourceId) return;
    setDeleting(true);
    try {
      await dispatch(deletePrepResource(selectedResourceId)).unwrap();
      toast.success("Prep resource deleted successfully!");
      setDeleteModalOpen(false);
      setSelectedResourceId(null);
      fetchResources();
    } catch (error) {
      toast.error(error?.message || "Failed to delete prep resource");
    } finally {
      setDeleting(false);
    }
  };

  const filteredResources = prepResources?.filter(
    (resource) =>
      resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-[#050810] text-[#E6EDF3] relative overflow-hidden">
      {/* Fine-lined cyber laser grid overlay */}
      <div className="grid-overlay"></div>
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00C8FF]/5 rounded-full blur-[130px] anim-spin-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#8040FF]/5 rounded-full blur-[140px] anim-spin-rev"></div>
      </div>

      <Navbar />
      {loading && <Loader />}

      <ReactHelmet
        title="Knowledge Base - Admin"
        description="Curate and manage high-fidelity interview preparation resources to empower candidate success."
        canonicalUrl="/admin/prep-resources"
      />

      <div className="max-w-6xl mx-auto pt-24 pb-12 px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white italic mb-2">
              Resource <span className="text-[#00C8FF] drop-shadow-[0_0_15px_rgba(0,200,255,0.4)]">Nexus</span>
            </h1>
            <p className="text-muted-foreground font-medium">Platform-wide interview preparation intelligence.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="h-12 border-white/10 hover:border-[#00C8FF]/50 text-muted-foreground hover:text-white bg-white/5 transition-all duration-300 font-bold px-6 rounded-xl"
            >
              Abort
            </Button>
            <Button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) {
                  setEditingId(null);
                  setFormData({
                    title: "",
                    category: "",
                    content: "",
                    url: "",
                    tags: "",
                  });
                }
              }}
              className={`h-12 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 border-none px-6 ${
                showForm 
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]" 
                  : "bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-[1.02]"
              }`}
            >
              {showForm ? "Cancel Operation" : (
                <><FaPlus className="mr-2" /> Initialize Resource</>
              )}
            </Button>
          </div>
        </div>

        {/* Dynamic Form Section */}
        {showForm && (
          <div className="bg-[#080C1E]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,100,220,0.03)] mb-10 relative overflow-hidden group animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C8FF]/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-[#00C8FF]/10 transition-colors duration-500"></div>
            
            <h2 className="text-2xl font-black mb-8 text-white tracking-tight italic">
              {editingId ? "Modify" : "Initialize"} Record
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-extrabold text-white uppercase tracking-wider text-[10px] ml-1">Context Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Advanced React Engineering"
                    className="h-14 rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-extrabold text-white uppercase tracking-wider text-[10px] ml-1">Taxonomy Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Technical, Architectural"
                    className="h-14 rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-extrabold text-white uppercase tracking-wider text-[10px] ml-1">Technical Brief</Label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="In-depth resource description or technical insights..."
                  rows={4}
                  className="w-full rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 p-4 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight outline-none resize-none transition-all duration-300 placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-extrabold text-white uppercase tracking-wider text-[10px] ml-1">Asset URL</Label>
                  <Input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://intel.next-hire.io/resource"
                    className="h-14 rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-extrabold text-white uppercase tracking-wider text-[10px] ml-1">Search Descriptors (Tags)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="react, performance, edge-cases"
                    className="h-14 rounded-2xl bg-[#080C1E]/80 border-white/5 border-2 focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold tracking-tight placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 h-14 rounded-xl bg-[#00C8FF] hover:bg-[#00E5FF] text-[#050810] font-black text-lg shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] hover:scale-[1.01] transition-all duration-300 border-none"
                >
                  {editingId ? "Commit Update" : "Establish Resource"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      title: "",
                      category: "",
                      content: "",
                      url: "",
                      tags: "",
                    });
                  }}
                  className="h-14 px-8 rounded-xl bg-white/5 border-white/10 hover:border-red-500/50 text-muted-foreground hover:text-red-400 transition-all duration-300 font-bold"
                >
                  Discard
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Filters Section */}
        <div className="relative mb-10 group">
          <Input
            className="h-16 pl-12 pr-6 rounded-2xl bg-[#080C1E]/80 backdrop-blur-xl border-white/5 border shadow-[0_0_50px_rgba(0,100,220,0.03)] focus:ring-[#00C8FF]/20 focus:border-[#00C8FF]/50 text-white font-bold transition-all duration-500 overflow-hidden placeholder:text-muted-foreground"
            placeholder="Query resource intelligence by title, category, or technical tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#00C8FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Resources Registry */}
        <div className="bg-[#080C1E]/80 backdrop-blur-xl rounded-3xl border border-white/5 shadow-[0_0_50px_rgba(0,100,220,0.03)] p-8 overflow-hidden relative">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 -mr-16 -mb-16 rounded-full blur-2xl"></div>
          
          {filteredResources && filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
              {filteredResources.map((resource) => (
                <div
                  key={resource._id}
                  className="group relative p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-[#00C8FF]/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,200,255,0.15)] flex flex-col h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00C8FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        {resource.category && (
                          <span className="bg-[#00C8FF]/10 text-[#00C8FF] border border-[#00C8FF]/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(0,200,255,0.15)]">
                            {resource.category}
                          </span>
                        )}
                        <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest">
                          ID: {resource._id.slice(-6)}
                        </span>
                      </div>
                      <h3 className="font-black text-xl text-white mb-3 tracking-tight group-hover:text-[#00C8FF] transition-colors">
                        {resource.title}
                      </h3>
                      {resource.content && (
                        <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-4 italic">
                          "{resource.content}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(resource)}
                        className="h-10 w-10 rounded-xl border-white/10 bg-[#080C1E] text-muted-foreground hover:text-white hover:border-[#00C8FF]/50 transition-all duration-300 p-0"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(resource._id)}
                        className="h-10 w-10 rounded-xl border-white/10 bg-[#080C1E] text-muted-foreground hover:text-red-400 hover:border-red-500/50 transition-all duration-300 p-0"
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-auto space-y-4 relative z-10">
                    {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-[#00C8FF] hover:text-[#00E5FF] font-black text-[10px] uppercase tracking-widest italic group-hover:translate-x-1 transition-all duration-300 drop-shadow-[0_0_10px_rgba(0,200,255,0.2)]"
                        >
                          Access Intelligence Intelligence →
                        </a>
                      )}

                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {resource.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-white/5 text-muted-foreground border border-white/5 px-2 py-1 rounded-lg text-[9px] font-bold"
                          >
                            #{tag.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 relative z-10">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center animate-pulse">
                    <FaPlus className="text-muted-foreground/40 w-8 h-8" />
                </div>
              </div>
              <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-xs">
                {searchTerm
                  ? "Registry Intelligence Mismatch"
                  : "Registry Database Empty"}
              </p>
              <p className="text-muted-foreground/60 text-sm mt-2">
                {searchTerm
                  ? "No resources align with current technical query."
                  : "Initialize your first intelligence record to begin."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Prep Resource"
        description="Are you sure you want to delete this preparation resource? This action cannot be undone and will permanently remove this material from the database."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleting}
      />
    </div>
  );
};

export default AdminPrepResources;

