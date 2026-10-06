"use client";
import Link from "next/link";
import { useGetAdminCoursesQuery, useDeleteCourseMutation, useUpdateCourseMutation } from "@/lib/features/api/apiSlice";
import { useState } from "react";

export default function CoursesAdminPage() {
  const { data: response, isLoading } = useGetAdminCoursesQuery({});
  const [deleteCourse] = useDeleteCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const courses = response?.data || [];
  
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`)) {
      try {
        await deleteCourse(id).unwrap();
        showToast("Course deleted successfully.");
      } catch (e) {
        alert("Failed to delete course");
      }
    }
  };

  const handleTogglePublish = async (course: any) => {
    const newStatus = course.status === "active" ? "draft" : "active";
    try {
      await updateCourse({ id: course.id, status: newStatus }).unwrap();
      showToast(`Course marked as ${newStatus}.`);
    } catch (e) {
      alert("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined text-4xl animate-spin text-on-surface-variant">refresh</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-headline-lg text-on-surface">Courses</h1>
        <Link 
          href="/eliteadmin4393/courses/new" 
          className="bg-primary text-on-primary px-space-md py-space-xs rounded-lg font-label-md hover:bg-primary/90 transition-colors"
        >
          + Add Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-surface-container-lowest p-space-2xl text-center rounded-xl border border-outline-variant mt-4">
          <h3 className="font-headline-md text-on-surface mb-2">No courses yet.</h3>
          <p className="font-body-md text-on-surface-variant mb-6">Create your first course to get started.</p>
          <Link 
            href="/eliteadmin4393/courses/new" 
            className="inline-flex items-center justify-center bg-secondary text-on-secondary px-space-md py-space-xs rounded-lg font-label-md hover:bg-secondary/90 transition-colors"
          >
            + Add Course
          </Link>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-md uppercase tracking-wider border-b border-outline-variant">
                <th className="p-space-md font-medium">Course</th>
                <th className="p-space-md font-medium">Category</th>
                <th className="p-space-md font-medium">Price</th>
                <th className="p-space-md font-medium">Status</th>
                <th className="p-space-md font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm">
              {courses.map((course: any) => (
                <tr key={course.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                  <td className="p-space-md">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-12 h-12 rounded bg-surface-container shrink-0 overflow-hidden">
                        {course.image ? (
                          <img src={course.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-on-surface-variant">image</span>
                        )}
                      </div>
                      <div className="flex flex-col max-w-xs">
                        <span className="font-headline-sm text-on-surface truncate" title={course.title}>{course.title}</span>
                        {course.isFeatured && (
                          <span className="text-[10px] uppercase bg-secondary-container text-on-secondary-container w-max px-1 mt-1 rounded">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-space-md uppercase font-label-sm">{course.category}</td>
                  <td className="p-space-md font-semibold text-on-surface">₹{course.price}</td>
                  <td className="p-space-md">
                    <button 
                      onClick={() => handleTogglePublish(course)}
                      className={`px-space-2xs py-1 rounded-sm text-xs uppercase font-medium transition-colors ${course.status === 'active' ? 'bg-primary-container text-on-primary-container hover:bg-primary-container/70' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
                    >
                      {course.status === 'active' ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-space-md text-right">
                    <div className="flex items-center justify-end gap-space-2xs">
                      <Link 
                        href={`/eliteadmin4393/courses/${course.id}`}
                        className="p-2 text-on-surface-variant hover:text-secondary transition-colors rounded-full hover:bg-surface-container"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </Link>
                      <button 
                        onClick={() => handleDelete(course.id, course.title)}
                        className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-error-container"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-surface-container-highest text-on-surface px-space-md py-space-xs rounded-lg shadow-xl z-50 flex items-center gap-space-xs animate-in fade-in slide-in-from-bottom-5 border border-outline-variant">
          <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
          <span className="font-body-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
