import { Metadata } from "next";
import { ContactContent } from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact | Elite Vertex",
  description: "Visit our flagship campuses in Bengaluru and Delhi, or connect directly with our academic admissions desk for structured guidance.",
};

export default function ContactPage() {
  return <ContactContent />;
}
