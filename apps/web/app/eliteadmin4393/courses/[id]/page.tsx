"use client";

import { use } from "react";
import CourseForm from "@/components/admin/CourseForm";
import { useGetAdminCourseByIdQuery } from "@/lib/features/api/apiSlice";

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: response, isLoading, isError } = useGetAdminCourseByIdQuery(resolvedParams.id);
  const course = response?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined text-4xl animate-spin text-on-surface-variant">refresh</span>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant text-center max-w-xl mx-auto">
        <h3 className="font-bold text-lg text-on-surface mb-2">Course Not Found</h3>
        <p className="text-on-surface-variant text-sm mb-4">The requested course could not be retrieved.</p>
        <a href="/eliteadmin4393/courses" className="text-secondary font-bold text-sm underline">Back to Courses</a>
      </div>
    );
  }

  return (
    <div className="w-full">
      <CourseForm initialData={course} isEdit={true} />
    </div>
  );
}
