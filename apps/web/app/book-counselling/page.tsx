import { Metadata } from "next";
import { ContactContent } from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Book Free Counselling | Elite Vertex",
  description: "Schedule a one-on-one speech diagnostic and academic counselling session with our senior communication coaches.",
};

export default function BookCounsellingPage() {
  return <ContactContent />;
}
