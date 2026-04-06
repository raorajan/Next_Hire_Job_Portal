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

const AdminPrepResources = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { prepResources } = useSelector((state) => state.job);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  const handleDelete = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?"))
      return;

    setLoading(true);
    try {
      await dispatch(deletePrepResource(resourceId)).unwrap();
      toast.success("Prep resource deleted successfully!");
      fetchResources();
    } catch (error) {
      toast.error(error?.message || "Failed to delete prep resource");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse"></div>
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
            <h1 className="text-4xl font-black tracking-tight italic mb-2">
              Resource <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Nexus</span>
            </h1>
            <p className="text-muted-foreground font-medium">Platform-wide interview preparation intelligence.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="h-12 border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-300 font-bold px-6 rounded-xl"
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
                  ? "bg-muted text-foreground hover:bg-destructive hover:text-white" 
                  : "bg-primary text-primary-foreground shadow-neon-sm hover:shadow-neon hover:scale-[1.02]"
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
          <div className="bg-card/60 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-custom mb-10 relative overflow-hidden group animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>
            
            <h2 className="text-2xl font-black mb-8 text-foreground tracking-tight italic">
              {editingId ? "Modify" : "Initialize"} Record
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1">Context Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Advanced React Engineering"
                    className="h-14 rounded-2xl bg-muted/20 border-border border-2 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1">Taxonomy Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Technical, Architectural"
                    className="h-14 rounded-2xl bg-muted/20 border-border border-2 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1">Technical Brief</Label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="In-depth resource description or technical insights..."
                  rows={4}
                  className="w-full rounded-2xl bg-muted/20 border-border border-2 p-4 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight outline-none resize-none transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1">Asset URL</Label>
                  <Input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://intel.next-hire.io/resource"
                    className="h-14 rounded-2xl bg-muted/20 border-border border-2 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-extrabold text-foreground uppercase tracking-wider text-[10px] ml-1">Search Descriptors (Tags)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="react, performance, edge-cases"
                    className="h-14 rounded-2xl bg-muted/20 border-border border-2 focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold tracking-tight"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 h-14 rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-neon-sm hover:shadow-neon hover:scale-[1.01] transition-all duration-300 border-none"
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
                  className="h-14 px-8 rounded-xl border-border hover:border-destructive/50 text-muted-foreground hover:text-destructive transition-all duration-300 font-bold"
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
            className="h-16 pl-12 pr-6 rounded-2xl bg-card/60 backdrop-blur-xl border-border border shadow-custom focus:ring-primary/20 focus:border-primary/50 text-foreground font-bold transition-all duration-500 overflow-hidden"
            placeholder="Query resource intelligence by title, category, or technical tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Resources Registry */}
        <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-custom p-8 overflow-hidden relative">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 -mr-16 -mb-16 rounded-full blur-2xl"></div>
          
          {filteredResources && filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
              {filteredResources.map((resource) => (
                <div
                  key={resource._id}
                  className="group relative p-6 bg-muted/20 border border-border/50 rounded-2xl hover:border-primary/30 transition-all duration-500 hover:shadow-neon-sm flex flex-col h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        {resource.category && (
                          <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                            {resource.category}
                          </span>
                        )}
                        <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest">
                          ID: {resource._id.slice(-6)}
                        </span>
                      </div>
                      <h3 className="font-black text-xl text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
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
                        className="h-10 w-10 rounded-xl border-border bg-card/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 p-0"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(resource._id)}
                        className="h-10 w-10 rounded-xl border-border bg-card/50 text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-all duration-300 p-0"
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
                          className="inline-flex items-center text-primary hover:text-secondary font-black text-[10px] uppercase tracking-widest italic group-hover:translate-x-1 transition-all duration-300"
                        >
                          Access Intelligence Intelligence →
                        </a>
                      )}

                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {resource.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-muted/40 text-muted-foreground border border-border/50 px-2 py-1 rounded-lg text-[9px] font-bold"
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
                <div className="w-20 h-20 rounded-full bg-muted/20 border-2 border-dashed border-border flex items-center justify-center animate-pulse">
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
    </div>
  );
};

export default AdminPrepResources;

