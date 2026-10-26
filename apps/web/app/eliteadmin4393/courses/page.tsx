"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetAdminCoursesQuery,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
  useSeedCoursesMutation,
} from "@/lib/features/api/apiSlice";

export default function CoursesAdminPage() {
  const { data: response, isLoading } = useGetAdminCoursesQuery({});
  const [deleteCourse] = useDeleteCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [seedCourses, { isLoading: isSeeding }] = useSeedCoursesMutation();

  const courses = response?.data || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?\n\nThis will remove the course and its syllabus modules permanently.`)) {
      try {
        await deleteCourse(id).unwrap();
        showToast("✓ Course deleted successfully.");
      } catch {
        alert("Failed to delete course.");
      }
    }
  };

  const handleTogglePublish = async (course: any) => {
    const newStatus = course.status === "active" ? "draft" : "active";
    try {
      await updateCourse({ id: course.id, status: newStatus }).unwrap();
      showToast(`✓ Marked as ${newStatus === "active" ? "Published" : "Draft"}.`);
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleSeed = async () => {
    if (confirm("Populate database with the 5 standard Elite Vertex institutional courses and learning modules?")) {
      try {
        await seedCourses(undefined).unwrap();
        showToast("✓ 5 accredited courses seeded successfully!");
      } catch {
        alert("Failed to seed default courses.");
      }
    }
  };

  const filteredCourses = courses.filter((c: any) => {
    const matchesSearch = !searchQuery || c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || c.badge?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">Course Management CMS</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Create, edit, publish, and structure syllabus modules for all institute courses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSeed}
            disabled={isSeeding}
            className="inline-flex items-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            title="Import the 5 official accredited syllabus tracks into database"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-500">auto_fix_high</span>
            <span>{isSeeding ? "Seeding..." : "Seed Default Courses"}</span>
          </button>

          <Link
            href="/eliteadmin4393/courses/new"
            className="inline-flex items-center gap-2 bg-primary hover:opacity-90 text-on-primary px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-opacity shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Course</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none select-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search programs by title or badge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-surface-container-low text-sm rounded-lg border border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-surface-container-low border border-outline-variant px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-on-surface focus:outline-none cursor-pointer"
          >
            <option value="all">All Tracks</option>
            <option value="spoken">Foundational Spoken</option>
            <option value="career">Career &amp; Interview</option>
            <option value="advanced">Executive &amp; Leadership</option>
            <option value="professional">Professional</option>
          </select>

          <span className="text-xs font-bold text-on-surface-variant uppercase px-2 shrink-0">
            {filteredCourses.length} {filteredCourses.length === 1 ? "Program" : "Programs"}
          </span>
        </div>
      </div>

      {/* Course List Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl animate-spin">refresh</span>
            <span className="text-sm font-semibold">Loading courses catalogue...</span>
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 text-center rounded-2xl border border-outline-variant flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px]">school</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-on-surface">No Courses Found</h3>
            <p className="text-sm text-on-surface-variant mt-1 max-w-sm">
              {searchQuery ? "Try clearing search filters or add a new program." : "Populate the catalogue using the button below or create a custom course."}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleSeed}
              className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-on-secondary-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
              <span>Seed 5 Default Courses</span>
            </button>
            <Link
              href="/eliteadmin4393/courses/new"
              className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-surface-container-high transition-colors"
            >
              + Add Custom Course
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs font-bold uppercase tracking-wider border-b border-outline-variant">
                  <th className="py-3.5 px-4">Program &amp; Track</th>
                  <th className="py-3.5 px-4">Duration &amp; Cohort</th>
                  <th className="py-3.5 px-4">Modules</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm">
                {filteredCourses.map((course: any) => {
                  const moduleCount = course.modules?.length || 6;

                  return (
                    <tr key={course.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-surface-container shrink-0 overflow-hidden border border-outline-variant">
                            {course.image ? (
                              <img src={course.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-on-surface-variant/60">
                                <span className="material-symbols-outlined text-[24px]">school</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col max-w-sm">
                            <span className="font-bold text-on-surface text-sm sm:text-base leading-snug">
                              {course.title}
                            </span>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                                {course.badge || course.category}
                              </span>
                              {course.isFeatured && (
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-400/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-400/30">
                                  Featured
                                </span>
                              )}
                              {course.level && (
                                <span className="text-[11px] text-on-surface-variant font-medium">
                                  • {course.level}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface text-xs sm:text-sm">{course.duration || "6 Weeks"}</span>
                          <span className="text-xs text-on-surface-variant mt-0.5">{course.cohortCap || "12 Scholars"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container text-on-surface border border-outline-variant">
                          <span className="material-symbols-outlined text-[15px] text-secondary">menu_book</span>
                          <span>{moduleCount} Modules</span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(course)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                            course.status === "active"
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20 hover:bg-emerald-100"
                              : "bg-surface-container text-on-surface-variant border border-outline-variant hover:bg-surface-container-high"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${course.status === "active" ? "bg-emerald-600 dark:bg-emerald-400" : "bg-slate-400"}`} />
                          <span>{course.status === "active" ? "Published" : "Draft"}</span>
                        </button>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/eliteadmin4393/courses/${course.id}`}
                            className="p-2 text-on-surface-variant hover:text-secondary hover:bg-surface-container rounded-lg transition-colors"
                            title="Edit Course & Curriculum Modules"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(course.id, course.title)}
                            className="p-2 text-on-surface-variant hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                            title="Delete Course"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-primary text-on-primary px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 border border-outline-variant">
          <span className="material-symbols-outlined text-[20px] text-amber-400">check_circle</span>
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
