"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateCourseMutation, useUpdateCourseMutation } from "@/lib/features/api/apiSlice";

type CourseFormProps = {
  initialData?: any;
  isEdit?: boolean;
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
    cohortCap: initialData?.cohortCap || "",
    format: initialData?.format || "",
    isFeatured: initialData?.isFeatured || false,
    status: initialData?.status || "draft",
    sortOrder: initialData?.sortOrder || 0,
    image: initialData?.image || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : (type === "number" ? Number(value) : value)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0] as File;
    
    setUploadingImage(true);
    const fd = new FormData();
    fd.append("image", file);

    try {
      // Direct fetch to upload endpoint, ensure cookies are sent if needed
      const res = await fetch("http://localhost:5000/api/v1/admin/upload", {
        method: "POST",
        body: fd,
        // credentials: "include" // Adjust based on cors config
      });
      const json = await res.json();
      if (json.success) {
        setFormData(prev => ({ ...prev, image: json.data.url }));
        showToast("Image uploaded successfully");
      } else {
        alert(json.message || "Upload failed");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEdit && initialData?.id) {
        await updateCourse({ id: initialData.id, ...formData }).unwrap();
        showToast("Course updated successfully");
      } else {
        await createCourse(formData).unwrap();
        showToast("Course created successfully");
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-space-xl max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-headline-md text-on-surface">{isEdit ? "Edit Course" : "New Course"}</h2>
        <div className="flex gap-space-sm">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-space-md py-space-xs rounded-lg font-label-md bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-space-md py-space-xs rounded-lg font-label-md bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting ? "Saving..." : "Save Course"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {/* Main Content Form */}
        <div className="md:col-span-2 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
            <h3 className="font-headline-sm text-on-surface border-b border-outline-variant pb-2">Basic Information</h3>
            
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Course Title</label>
              <input name="title" required value={formData.title} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface" placeholder="e.g. Basic Spoken English" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Slug</label>
              <input name="slug" required value={formData.slug} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface font-mono text-sm" placeholder="e.g. basic-spoken-english" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Short Description</label>
              <textarea name="shortDescription" required value={formData.shortDescription} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface min-h-[100px]" placeholder="Brief overview for the card..." />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Full Description</label>
              <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface min-h-[150px]" placeholder="Detailed description for the course page..." />
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
            <h3 className="font-headline-sm text-on-surface border-b border-outline-variant pb-2">Course Details</h3>
            
            <div className="grid grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Duration</label>
                <input name="duration" value={formData.duration} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface" placeholder="e.g. 6 Weeks" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Cohort Cap</label>
                <input name="cohortCap" value={formData.cohortCap} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface" placeholder="e.g. 12 Fellows Max" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Format</label>
                <input name="format" value={formData.format} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface" placeholder="e.g. Campus & Hybrid" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Form */}
        <div className="flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
            <h3 className="font-headline-sm text-on-surface border-b border-outline-variant pb-2">Publishing</h3>
            
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface appearance-none">
                <option value="active">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 accent-secondary" />
              <label htmlFor="isFeatured" className="font-label-md text-on-surface cursor-pointer">Featured (Flagship)</label>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
            <h3 className="font-headline-sm text-on-surface border-b border-outline-variant pb-2">Categorization</h3>
            
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface appearance-none">
                <option value="spoken">Spoken English</option>
                <option value="career">Career & Communication</option>
                <option value="professional">Professional English</option>
                <option value="flagship">Flagship / Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Badge Text</label>
              <input name="badge" value={formData.badge} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface" placeholder="e.g. Foundation" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Subtitle / CEFR Level</label>
              <input name="level" value={formData.level} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface" placeholder="e.g. CEFR A1-A2" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Sort Order</label>
              <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface" />
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
            <h3 className="font-headline-sm text-on-surface border-b border-outline-variant pb-2">Image</h3>
            
            <div className="flex flex-col gap-4">
              {formData.image && (
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-surface-container">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploadingImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className={`w-full p-4 border-2 border-dashed border-outline-variant rounded-lg text-center ${uploadingImage ? 'bg-surface-container' : 'bg-surface-container-lowest hover:bg-surface-container'} transition-colors`}>
                  <span className="font-label-sm text-on-surface-variant">
                    {uploadingImage ? "Uploading..." : "Click to upload image"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-surface-container-highest text-on-surface px-space-md py-space-xs rounded-lg shadow-xl z-50 flex items-center gap-space-xs animate-in fade-in slide-in-from-bottom-5 border border-outline-variant">
          <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
          <span className="font-body-sm">{toastMessage}</span>
        </div>
      )}
    </form>
  );
}
