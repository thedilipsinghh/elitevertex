"use client";
import Link from "next/link";
import { useGetAdminCoursesQuery } from "@/lib/features/api/apiSlice";

export default function DashboardPage() {
  const { data: response, isLoading } = useGetAdminCoursesQuery({});
  const courses = response?.data || [];
  
  const publishedCount = courses.filter((c: any) => c.status === "active").length;
  const draftCount = courses.filter((c: any) => c.status === "draft").length;

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-headline-lg text-on-surface">Overview</h1>
        <Link 
          href="/eliteadmin4393/courses/new" 
          className="bg-primary text-on-primary px-space-md py-space-xs rounded-lg font-label-md"
        >
          + Add Course
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md animate-pulse">
          <div className="h-32 bg-surface-container rounded-xl"></div>
          <div className="h-32 bg-surface-container rounded-xl"></div>
          <div className="h-32 bg-surface-container rounded-xl"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
            <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-2">Total Courses</h3>
            <p className="font-display text-display text-on-surface">{courses.length}</p>
          </div>
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
            <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-2">Published</h3>
            <p className="font-display text-display text-secondary">{publishedCount}</p>
          </div>
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
            <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-2">Drafts</h3>
            <p className="font-display text-display text-on-surface-variant">{draftCount}</p>
          </div>
        </div>
      )}
    </div>
  );
}
