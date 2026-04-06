import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useNavigate } from "react-router-dom";
import ReactHelmet from "../common/ReactHelmet";
import { useDispatch, useSelector } from "react-redux";
import {
  getHighlights,
  createHighlight,
  updateHighlight,
  deleteHighlight,
} from "@/redux/slices/job.slice";
import { getCompanies } from "@/redux/slices/company.slice";
import { getAllJobs } from "@/redux/slices/job.slice";
import { toast } from "react-toastify";
import Loader from "../common/Loader";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const AdminHighlights = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { highlights } = useSelector((state) => state.job);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    type: "company",
    title: "",
    subtitle: "",
    description: "",
    company: "",
    job: "",
    imageUrl: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchHighlights();
    fetchCompanies();
    fetchJobs();
  }, [dispatch]);

  const fetchHighlights = async () => {
    setLoading(true);
    try {
      await dispatch(getHighlights()).unwrap();
    } catch (error) {
      toast.error("Failed to fetch highlights");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await dispatch(getCompanies()).unwrap();
      if (res?.status === 200) {
        setCompanies(res?.companies || []);
      }
    } catch (error) {
      console.error("Failed to fetch companies");
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await dispatch(getAllJobs({ limit: 100 })).unwrap();
      if (res?.jobs) {
        setJobs(res.jobs);
      }
    } catch (error) {
      console.error("Failed to fetch jobs");
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
        company: formData.company || undefined,
        job: formData.job || undefined,
        order: Number(formData.order) || 0,
      };

      if (editingId) {
        await dispatch(
          updateHighlight({ highlightId: editingId, data })
        ).unwrap();
        toast.success("Highlight updated successfully!");
      } else {
        await dispatch(createHighlight(data)).unwrap();
        toast.success("Highlight created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        type: "company",
        title: "",
        subtitle: "",
        description: "",
        company: "",
        job: "",
        imageUrl: "",
        isActive: true,
        order: 0,
      });
      fetchHighlights();
    } catch (error) {
      toast.error(error?.message || "Failed to save highlight");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (highlight) => {
    setFormData({
      type: highlight.type || "company",
      title: highlight.title || "",
      subtitle: highlight.subtitle || "",
      description: highlight.description || "",
      company: highlight.company?._id || highlight.company || "",
      job: highlight.job?._id || highlight.job || "",
      imageUrl: highlight.imageUrl || "",
      isActive: highlight.isActive !== undefined ? highlight.isActive : true,
      order: highlight.order || 0,
    });
    setEditingId(highlight._id);
    setShowForm(true);
  };

  const handleDelete = async (highlightId) => {
    if (!window.confirm("Are you sure you want to delete this highlight?"))
      return;

    setLoading(true);
    try {
      await dispatch(deleteHighlight(highlightId)).unwrap();
      toast.success("Highlight deleted successfully!");
      fetchHighlights();
    } catch (error) {
      toast.error(error?.message || "Failed to delete highlight");
    } finally {
      setLoading(false);
    }
  };

  const filteredHighlights = highlights?.filter(
    (highlight) =>
      highlight.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      highlight.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
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
        title="Landing Page Highlights - Admin"
        description="Curate featured enterprises and success narratives for the landing page ecosystem."
        canonicalUrl="/admin/highlights"
      />

      <div className="max-w-6xl mx-auto pt-24 pb-12 px-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground mb-2">
              Landing Page <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Highlights</span>
            </h1>
            <p className="text-muted-foreground font-medium">Manage featured records to enhance initial platform interaction.</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="rounded-xl border-border hover:border-primary/50 hover:text-primary transition-all duration-300"
            >
              Return Base
            </Button>
            <Button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) {
                  setEditingId(null);
                  setFormData({
                    type: "company",
                    title: "",
                    subtitle: "",
                    description: "",
                    company: "",
                    job: "",
                    imageUrl: "",
                    isActive: true,
                    order: 0,
                  });
                }
              }}
              className={`rounded-xl font-bold transition-all duration-300 shadow-neon-sm hover:shadow-neon border-none ${
                showForm 
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/80" 
                  : "bg-primary text-primary-foreground hover:bg-primary/80"
              }`}
            >
              {showForm ? "Abort Operation" : <><FaPlus className="mr-2" /> New Highlight</>}
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="bg-card backdrop-blur-xl border border-border rounded-3xl p-8 shadow-custom mb-10 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-2xl"></div>
            <h2 className="text-2xl font-black mb-6 text-foreground tracking-tight italic">
              {editingId ? "Modify Existing Descriptor" : "Initialize New Context"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-extrabold text-foreground mb-2 block uppercase tracking-wider text-[10px]">Context Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="rounded-xl bg-muted/20 border-border border-2 h-12 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="company">Enterprise Spotlight</SelectItem>
                      <SelectItem value="story">Success Narrative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="font-extrabold text-foreground mb-2 block uppercase tracking-wider text-[10px]">Primary Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Prime Partner: TechVault"
                    className="rounded-xl bg-muted/20 border-border border-2 h-12 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-extrabold text-foreground mb-2 block uppercase tracking-wider text-[10px]">Secondary Tagline</Label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    placeholder="Brief contextual detail"
                    className="rounded-xl bg-muted/20 border-border border-2 h-12 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <Label className="font-extrabold text-foreground mb-2 block uppercase tracking-wider text-[10px]">Asset URL</Label>
                  <Input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://cloud.storage/asset.webp"
                    className="rounded-xl bg-muted/20 border-border border-2 h-12 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <Label className="font-extrabold text-foreground mb-2 block uppercase tracking-wider text-[10px]">Descriptive Narrative</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Elaborate on the significance of this highlight..."
                  rows={4}
                  className="w-full rounded-2xl bg-muted/20 border-border border-2 p-4 text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none resize-none transition-all duration-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.type === "company" && (
                  <div>
                    <Label className="font-extrabold text-foreground mb-2 block uppercase tracking-wider text-[10px]">Linked Enterprise</Label>
                    <Select
                      value={formData.company}
                      onValueChange={(value) =>
                        setFormData({ ...formData, company: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl bg-muted/20 border-border border-2 h-12 focus:ring-primary/20">
                        <SelectValue placeholder="Select Target Enterprise" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {companies.map((company) => (
                          <SelectItem key={company._id} value={company._id}>
                            {company.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.type === "story" && (
                  <div>
                    <Label className="font-extrabold text-foreground mb-2 block uppercase tracking-wider text-[10px]">Linked Role</Label>
                    <Select
                      value={formData.job}
                      onValueChange={(value) =>
                        setFormData({ ...formData, job: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl bg-muted/20 border-border border-2 h-12 focus:ring-primary/20">
                        <SelectValue placeholder="Select Associated Opportunity" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {jobs.map((job) => (
                          <SelectItem key={job._id} value={job._id}>
                            {job.title} - {job.company?.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center gap-8 h-12 mt-auto">
                  <div className="flex-1">
                    <Label className="font-extrabold text-foreground mb-2 block uppercase tracking-wider text-[10px]">Display Priority</Label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                      className="rounded-xl bg-muted/20 border-border border-2 h-12 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-neon-sm"></div>
                      <span className="ml-3 text-sm font-bold text-foreground">Active Status</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-black text-lg shadow-neon hover:scale-[1.02] transition-all duration-300 border-none"
                >
                  {editingId ? "Update System Catalog" : "Initialize New Highlight"}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-10 relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Input
            className="w-full bg-card/50 backdrop-blur-md border-border border-2 h-16 rounded-2xl pl-12 focus:ring-primary/20 focus:border-primary/50 text-xl font-bold tracking-tight placeholder:text-muted-foreground"
            placeholder="Search by title or descriptor keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredHighlights && filteredHighlights.length > 0 ? (
            filteredHighlights.map((highlight) => (
              <div
                key={highlight._id}
                className="group relative bg-card backdrop-blur-md p-8 rounded-3xl border border-border shadow-custom hover:shadow-neon-sm transition-all duration-500 hover:border-primary/30 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 shadow-neon-sm">
                          {highlight.type}
                        </span>
                        {highlight.isActive ? (
                          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest border border-border">
                            Inactive
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight leading-tight mb-2">
                        {highlight.title}
                      </h3>
                      {highlight.subtitle && (
                        <p className="text-foreground/80 font-extrabold italic mb-4">
                          {highlight.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center border border-border group-hover:border-primary/40 transition-all duration-300 shadow-inner">
                      <p className="text-xl font-black text-primary">#{highlight.order}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {highlight.description && (
                      <p className="text-muted-foreground font-medium leading-relaxed bg-muted/20 border border-border/50 rounded-2xl p-4 italic text-sm">
                        {highlight.description}
                      </p>
                    )}
                    
                    {highlight.imageUrl && (
                      <div className="relative group/img overflow-hidden rounded-2xl border border-border/50 aspect-video">
                        <img
                          src={highlight.imageUrl}
                          alt={highlight.title}
                          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-2 border-t border-border/50">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(highlight)}
                        className="flex-1 h-12 rounded-xl bg-card border-border hover:border-primary/50 text-foreground hover:text-primary font-bold shadow-sm transition-all duration-300"
                      >
                        <FaEdit className="mr-2" /> Modify
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(highlight._id)}
                        className="w-14 h-12 rounded-xl bg-card border-border hover:border-destructive/50 text-muted-foreground hover:text-destructive shadow-sm transition-all duration-300"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full border border-border border-dashed rounded-3xl p-20 bg-muted/10 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-muted-foreground opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-muted-foreground text-xl font-bold tracking-tight">
                {searchTerm
                  ? "Record indexing yielded no matches. Try alternative descriptors."
                  : "Registry is currently vacant. Initialize a highlight to populate the catalog."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHighlights;
