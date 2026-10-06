"use client";

import { use, useEffect, useState } from "react";
import CourseForm from "@/components/admin/CourseForm";
import { useGetAdminCoursesQuery } from "@/lib/features/api/apiSlice";

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: response, isLoading } = useGetAdminCoursesQuery({});
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (response?.data) {
      const found = response.data.find((c: any) => c.id === resolvedParams.id);
      if (found) setCourse(found);
    }
  }, [response, resolvedParams.id]);

  if (isLoading || !course) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined text-4xl animate-spin text-on-surface-variant">refresh</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <CourseForm initialData={course} isEdit={true} />
    </div>
  );
}
