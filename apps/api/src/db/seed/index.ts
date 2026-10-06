import { db } from "../../config/db";
import { admins, websiteSettings, faqs, courses, courseModules } from "../schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function runSeed() {
  console.log("🌱 Seeding database...");

  // Seed Admin
  const adminEmail = process.env.ADMIN_USER || "admin@elitevertax.com";
  const adminPass = process.env.ADMIN_PASS || "password123";

  const existingAdmin = await db.query.admins.findFirst({
    where: eq(admins.email, adminEmail),
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPass, 10);
    await db.insert(admins).values({
      email: adminEmail,
      name: "Super Admin",
      passwordHash,
    });
    console.log(`✅ Seeded admin user (${adminEmail} / ${adminPass})`);
  }

  // Seed Website Settings
  const existingSettings = await db.query.websiteSettings.findFirst();
  if (!existingSettings) {
    await db.insert(websiteSettings).values({
      instituteName: "Elite Vertex",
      phone: "+91 90000 00000",
      email: "info@elitevertax.com",
      address: "MG Road, Bengaluru",
    });
    console.log("✅ Seeded website settings");
  }

  // Seed FAQs
  const existingFaqs = await db.query.faqs.findFirst();
  if (!existingFaqs) {
    await db.insert(faqs).values([
      {
        question: "How long are the courses?",
        answer: "Most courses run for 8-12 weeks depending on the curriculum.",
        displayOrder: 1,
      },
      {
        question: "Do you offer placement assistance?",
        answer: "Yes, we have a dedicated placement cell.",
        displayOrder: 2,
      },
    ]);
    console.log("✅ Seeded FAQs");
  }

  // Clear existing courses to ensure clean state
  await db.delete(courses);
  console.log("🧹 Cleared existing courses");

  // Seed the 9 UI courses
  const courseData = [
    {
      slug: "flagship-comprehensive-masterclass",
      category: "flagship",
      badge: "A1 → C1 Capstone",
      title: "Comprehensive Spoken English & Fluency Masterclass",
      shortDescription: "From hesitation to fluent articulation through daily acoustic speaking practice, paired rhetoric drills, and personalized vocal diagnostic coaching.",
      fullDescription: "A comprehensive masterclass designed to elevate your speaking skills to professional levels...",
      image: "https://lh3.googleusercontent.com/aida/AEtjO1XUmQebC7cWdgP8rjmnfdqiY3TWTBNoYsfMaSYI7n3xfYNILdru7siueSJaT3rMs4i4yPJNbvZvfikMQY3F9R2qu9KcA-IJpgJKfBgkmFG_E5MXmadYRgWJ_6PhUHhZrCm8UV-zLzfi7YQS7zuXK6r0MjulQm5z6SjXV14VWLoizz-xs76JsWDExBfm2OMZySxsZVg3HIpEMQlOhdIgz88ZuQ4xbfsXjeGRuCDxyYgFYtotlQBLMiC4mi6i",
      duration: "12 Weeks",
      level: "Cohort XXV Admissions Open",
      format: "Campus & Hybrid",
      cohortCap: "12 Fellows Max",
      isFeatured: true,
      status: "active" as const,
      sortOrder: 1,
      price: 15000
    },
    {
      slug: "basic-spoken-english",
      category: "spoken",
      badge: "Foundation",
      level: "CEFR A1–A2",
      title: "Basic Spoken English",
      shortDescription: "Structural scaffolding, grammar without rote jargon, everyday conversational lexicon, and overcoming baseline speaking apprehension.",
      fullDescription: "",
      duration: "6 Weeks (48 Contact Hours)",
      isFeatured: false,
      status: "active" as const,
      sortOrder: 2,
      price: 5000
    },
    {
      slug: "intermediate-spoken-english",
      category: "spoken",
      badge: "Intermediate",
      level: "CEFR B1–B2",
      title: "Intermediate Spoken English",
      shortDescription: "Fluid spontaneous articulation, extempore roundtables, discourse markers, conversational pace control, and paired debate sessions.",
      fullDescription: "",
      duration: "8 Weeks (64 Contact Hours)",
      isFeatured: false,
      status: "active" as const,
      sortOrder: 3,
      price: 7500
    },
    {
      slug: "advanced-spoken-english",
      category: "spoken",
      badge: "Advanced",
      level: "CEFR C1–C2",
      title: "Advanced Spoken English & Rhetoric",
      shortDescription: "Executive polish, sophisticated idiom usage, tonal inflection, narrative construction, and impromptu podium delivery.",
      fullDescription: "",
      duration: "8 Weeks (64 Contact Hours)",
      isFeatured: false,
      status: "active" as const,
      sortOrder: 4,
      price: 10000
    },
    {
      slug: "interview-skills",
      category: "career",
      badge: "Placement Prep",
      level: "Intensive",
      title: "Interview Skills & Group Discussion Mastery",
      shortDescription: "Mastering the STAR behavioural response architecture, unscripted mock panel simulations, critical entry-exit tactics in GDs, and case study pitches.",
      fullDescription: "",
      duration: "4 Weeks (32 Contact Hours)",
      isFeatured: false,
      status: "active" as const,
      sortOrder: 5,
      price: 4000
    },
    {
      slug: "personality-development",
      category: "career",
      badge: "Executive Demeanor",
      level: "All Levels",
      title: "Personality Development & Executive Poise",
      shortDescription: "Kinesthetic awareness, posture alignment, eye contact calibration, eliminating non-verbal crutches, and asserting psychological room control.",
      fullDescription: "",
      duration: "6 Weeks (48 Contact Hours)",
      isFeatured: false,
      status: "active" as const,
      sortOrder: 6,
      price: 6000
    },
    {
      slug: "public-speaking",
      category: "career",
      badge: "Oratory",
      level: "Auditorium Lab",
      title: "Public Speaking & Keynote Rhetoric",
      shortDescription: "Eradicating acute stage fright through systemic exposure, cadence modulation, strategic rhetorical pauses, and persuasive speech engineering.",
      fullDescription: "",
      duration: "6 Weeks (48 Contact Hours)",
      isFeatured: false,
      status: "active" as const,
      sortOrder: 7,
      price: 6000
    },
    {
      slug: "business-communication",
      category: "professional",
      badge: "Workplace Writing",
      level: "Global Enterprise",
      title: "Business Communication & Executive Writing",
      shortDescription: "High-stakes briefing memos, succinct board communication, client negotiation email etiquette, and facilitating high-friction virtual standups.",
      fullDescription: "",
      duration: "6 Weeks (48 Contact Hours)",
      isFeatured: false,
      status: "active" as const,
      sortOrder: 8,
      price: 8000
    },
    {
      slug: "voice-accent",
      category: "professional",
      badge: "Phonetics",
      level: "Acoustic Lab",
      title: "Voice & Accent Neutralization",
      shortDescription: "Mother Tongue Influence (MTI) softening, International Phonetic Alphabet (IPA) precision, vowel positioning, syllabic stress, and diaphragmatic projection.",
      fullDescription: "",
      duration: "6 Weeks (48 Contact Hours)",
      isFeatured: false,
      status: "active" as const,
      sortOrder: 9,
      price: 8000
    }
  ];

  await db.insert(courses).values(courseData);
  console.log("✅ Seeded 9 initial courses matching UI");

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
