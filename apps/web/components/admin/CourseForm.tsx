"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateCourseMutation, useUpdateCourseMutation } from "@/lib/features/api/apiSlice";
import DualImageInput from "@/components/admin/DualImageInput";

type CourseFormProps = {
  initialData?: any;
  isEdit?: boolean;
};

const DEFAULT_MODULE_TEMPLATES: Record<string, string[]> = {
  spoken: [
    "Basic Alphabetic Phonetics & Sound Production",
    "Essential Daily Sight Words & Lexicon (500+ Words)",
    "Simple Sentence Construction & Subject-Verb Agreement",
    "Daily Life Greeting & Conversational Drills",
    "Basic Present, Past & Future Tense Usage",
    "Confidence Building & Stage Fear Removal",
  ],
  career: [
    "Professional Elevator Pitch & STAR Interview Technique",
    "Executive Business Vocabulary & Diplomatic Corporate Lexicon",
    "High-Impact Slides Pitching & Presentation Dynamics",
    "Boardroom Negotiation, Objection Handling & Assertive Rhetoric",
    "Cross-Cultural Global Communication & Accent Neutralization",
    "Simulated Panel Mock Interviews with Video Feedback Review",
  ],
  advanced: [
    "Persuasive Rhetoric & High-Stakes Podium Oratory",
    "Executive Storytelling, Vocal Modulation & Physical Gravitas",
    "Impromptu Keynote Speaking & Extempore Mastery",
    "Crisis Communication, Media Q&A & Unscripted Dialogue",
    "Boardroom Influence & Stakeholder Consensus Building",
    "Frame-by-Frame Diagnostic Video Review & Metric Scorecard",
  ],
};

export default function CourseForm({ initialData, isEdit }: CourseFormProps) {
  const router = useRouter();
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "spoken",
    badge: initialData?.badge || "",
    level: initialData?.level || "",
    shortDescription: initialData?.shortDescription || "",
    fullDescription: initialData?.fullDescription || "",
    duration: initialData?.duration || "",
    price: initialData?.price || 0,
    cohortCap: initialData?.cohortCap || "12 Scholars Max",
    format: initialData?.format || "Classroom & Hybrid",
    isFeatured: initialData?.isFeatured || false,
    status: initialData?.status || "active",
    sortOrder: initialData?.sortOrder || 0,
    image: initialData?.image || "",
  });

  // Extract modules from initialData (modules relation or strings)
  const [modules, setModules] = useState<string[]>(() => {
    if (initialData?.modules && Array.isArray(initialData.modules) && initialData.modules.length > 0) {
      return initialData.modules.map((m: any) => (typeof m === "string" ? m : m.title || String(m)));
    }
    return DEFAULT_MODULE_TEMPLATES[initialData?.category || "spoken"] || DEFAULT_MODULE_TEMPLATES.spoken;
  });

  const [newModuleText, setNewModuleText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : type === "number" ? Number(value) : value,
      };
      // Auto-generate slug on new course creation when title changes
      if (!isEdit && name === "title" && !prev.slug) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleAddModule = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newModuleText.trim()) return;
    setModules((prev) => [...prev, newModuleText.trim()]);
    setNewModuleText("");
  };

  const handleRemoveModule = (index: number) => {
    setModules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveModule = (index: number, direction: "up" | "down") => {
    setModules((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      const currentItem = next[index];
      const targetItem = next[target];
      if (currentItem !== undefined && targetItem !== undefined) {
        next[index] = targetItem;
        next[target] = currentItem;
      }
      return next;
    });
  };

  const handleUpdateModule = (index: number, text: string) => {
    setModules((prev) => {
      const next = [...prev];
      next[index] = text;
      return next;
    });
  };

  const handleLoadTemplate = () => {
    const template = DEFAULT_MODULE_TEMPLATES[formData.category] || DEFAULT_MODULE_TEMPLATES.spoken || [];
    setModules([...template]);
    showToast(`Loaded ${template.length} template modules.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        modules,
      };

      if (isEdit && initialData?.id) {
        await updateCourse({ id: initialData.id, ...payload }).unwrap();
        showToast("✓ Course and syllabus updated successfully");
      } else {
        await createCourse(payload).unwrap();
        showToast("✓ Course created successfully");
        setTimeout(() => {
          router.push("/eliteadmin4393/courses");
        }, 1000);
      }
    } catch (err: any) {
      alert(err?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Top Bar Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface">
            {isEdit ? `Edit: ${initialData?.title}` : "Create New Program"}
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Configure curriculum details, CEFR level, pricing, and syllabus modules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/eliteadmin4393/courses")}
            className="px-4 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider bg-primary hover:opacity-90 text-on-primary transition-all disabled:opacity-50 flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>{isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Publish Course"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Core Details & Syllabus */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Basic Course Information */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs flex flex-col gap-4">
            <h3 className="font-bold text-base text-on-surface border-b border-outline-variant pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">school</span>
              <span>Course Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Course Title *</label>
                <input
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-surface-container-low border border-outline-variant px-4 py-3 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder="e.g. Pre-Foundation English (PFE)"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">URL Slug *</label>
                <input
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="bg-surface-container-low border border-outline-variant px-4 py-3 rounded-xl text-sm font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder="e.g. pre-foundation-english"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Badge / Level Tag</label>
                <input
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="bg-surface-container-low border border-outline-variant px-4 py-3 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder="e.g. Level 1 — Absolute Beginners"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Short Summary *</label>
              <textarea
                name="shortDescription"
                required
                rows={3}
                value={formData.shortDescription}
                onChange={handleChange}
                className="bg-surface-container-low border border-outline-variant p-4 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 leading-relaxed resize-none"
                placeholder="High-level description shown on the public course card..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Full Overview (Optional)</label>
              <textarea
                name="fullDescription"
                rows={4}
                value={formData.fullDescription}
                onChange={handleChange}
                className="bg-surface-container-low border border-outline-variant p-4 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 leading-relaxed resize-none"
                placeholder="In-depth academic syllabus background, target audience, and outcomes..."
              />
            </div>
          </div>

          {/* Curriculum Syllabus Modules CRUD */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">format_list_numbered</span>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Curriculum Learning Modules</h3>
                  <p className="text-xs text-on-surface-variant">Syllabus breakdown shown when learners expand the course.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLoadTemplate}
                className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-surface-container hover:bg-surface-container-high text-secondary border border-outline-variant transition-colors"
              >
                Reset to Template
              </button>
            </div>

            {/* Modules List */}
            <div className="flex flex-col gap-2.5">
              {modules.map((modText, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 bg-surface-container-low p-2.5 rounded-xl border border-outline-variant"
                >
                  <span className="w-7 h-7 rounded-lg bg-secondary/15 text-secondary font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <input
                    type="text"
                    value={modText}
                    onChange={(e) => handleUpdateModule(idx, e.target.value)}
                    className="flex-1 bg-transparent text-sm text-on-surface font-medium focus:outline-none px-2"
                  />

                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveModule(idx, "up")}
                    className="p-1 rounded text-on-surface-variant hover:text-on-surface disabled:opacity-20 transition-opacity"
                    title="Move Up"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={idx === modules.length - 1}
                    onClick={() => handleMoveModule(idx, "down")}
                    className="p-1 rounded text-on-surface-variant hover:text-on-surface disabled:opacity-20 transition-opacity"
                    title="Move Down"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleRemoveModule(idx)}
                    className="p-1 rounded text-red-500 hover:text-red-700 transition-colors"
                    title="Remove Module"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Module Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newModuleText}
                onChange={(e) => setNewModuleText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddModule();
                  }
                }}
                placeholder="Enter topic / module title..."
                className="flex-1 bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
              <button
                type="button"
                onClick={handleAddModule}
                className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-secondary text-on-secondary hover:bg-on-secondary-container transition-colors shrink-0"
              >
                + Add Module
              </button>
            </div>
          </div>

        </div>

        {/* Right Sidebar (4 cols): Meta, Settings & Image */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Publishing & Status */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs flex flex-col gap-4">
            <h3 className="font-bold text-base text-on-surface border-b border-outline-variant pb-2">Status &amp; Visibility</h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Publishing Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="bg-surface-container-low border border-outline-variant px-3.5 py-2.5 rounded-xl text-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="active">Published (Live On Site)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-sm font-semibold text-on-surface cursor-pointer select-none">
                Featured Flagship Program
              </label>
            </div>
          </div>

          {/* Categorization & Metrics */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs flex flex-col gap-4">
            <h3 className="font-bold text-base text-on-surface border-b border-outline-variant pb-2">Specifications</h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Track Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-surface-container-low border border-outline-variant px-3.5 py-2.5 rounded-xl text-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="spoken">Foundational Spoken English</option>
                <option value="career">Career &amp; Interview Skills</option>
                <option value="advanced">Leadership &amp; Executive Oratory</option>
                <option value="professional">Professional Communication</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">CEFR Benchmark Level</label>
              <input
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="bg-surface-container-low border border-outline-variant px-3.5 py-2 rounded-xl text-sm text-on-surface focus:outline-none"
                placeholder="e.g. Intermediate (CEFR B2)"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Cohort Duration</label>
              <input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="bg-surface-container-low border border-outline-variant px-3.5 py-2 rounded-xl text-sm text-on-surface focus:outline-none"
                placeholder="e.g. 8 Weeks (60 Hours)"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Classroom Format</label>
              <input
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="bg-surface-container-low border border-outline-variant px-3.5 py-2 rounded-xl text-sm text-on-surface focus:outline-none"
                placeholder="e.g. Classroom & Hybrid"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Cohort Cap</label>
              <input
                name="cohortCap"
                value={formData.cohortCap}
                onChange={handleChange}
                className="bg-surface-container-low border border-outline-variant px-3.5 py-2 rounded-xl text-sm text-on-surface focus:outline-none"
                placeholder="e.g. 12 Scholars Max"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Tuition (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="bg-surface-container-low border border-outline-variant px-3.5 py-2 rounded-xl text-sm text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Sort Order</label>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  className="bg-surface-container-low border border-outline-variant px-3.5 py-2 rounded-xl text-sm text-on-surface focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dual Image Input */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs flex flex-col gap-4">
            <h3 className="font-bold text-base text-on-surface border-b border-outline-variant pb-2">Cover Media</h3>
            <DualImageInput
              label="Course Cover Image"
              value={formData.image}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              helpText="Upload a course banner from device or paste an image link."
              placeholder="https://images.unsplash.com/... or https://..."
            />
          </div>

        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-primary text-on-primary px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 border border-outline-variant">
          <span className="material-symbols-outlined text-[20px] text-amber-400">check_circle</span>
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </form>
  );
}
