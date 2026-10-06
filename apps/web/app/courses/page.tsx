import { Metadata } from "next";
import { CoursesContent } from "@/components/courses/CoursesContent";

export const metadata: Metadata = {
  title: "Courses | Elite Vertex",
  description: "Practical, outcome-driven programs designed to build spoken English fluency, interview competence, and executive presence.",
};

export default function CoursesPage() {
  return <CoursesContent />;
}
