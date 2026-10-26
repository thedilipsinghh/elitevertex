import { db } from "../../config/db";
import { admins, websiteSettings, faqs, courses, mentors, campuses, aboutPage, testimonials, galleryItems, pages, pageSections, navigationMenus, navigationItems } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
      role: "admin",
    });
    console.log(`✅ Seeded admin user (${adminEmail} / ${adminPass})`);
  }

  // Ensure existing admin has role set
  if (existingAdmin && existingAdmin.role !== "admin") {
    await db.update(admins).set({ role: "admin" }).where(eq(admins.id, existingAdmin.id));
    console.log("✅ Promoted existing admin to role=admin");
  }

  // Seed Website Settings
  const existingSettings = await db.query.websiteSettings.findFirst();
  if (!existingSettings) {
    await db.insert(websiteSettings).values({
      instituteName: "Elite Vertex",
      phone: "+91 98765 43210",
      email: "admissions@elitevertax.com",
      address: "2nd Floor, Elite Vertex Tower, Indiranagar, Bengaluru, Karnataka 560038",
    });
    console.log("✅ Seeded website settings");
  }

  // Seed FAQs
  const existingFaqs = await db.query.faqs.findFirst();
  if (!existingFaqs) {
    await db.insert(faqs).values([
      {
        question: "How long are the courses?",
        answer: "Most courses run for 4 to 12 weeks depending on whether it is an intensive workshop or a full flagship masterclass.",
        displayOrder: 1,
        isActive: true,
      },
      {
        question: "Do you offer placement assistance & interview training?",
        answer: "Yes! Our specialized Interview Skills & GD module includes 1-on-1 mock panels and resume review with corporate hiring partners.",
        displayOrder: 2,
        isActive: true,
      },
      {
        question: "Are classes available online or on-campus?",
        answer: "We offer both physical classroom batches across our campus centers and hybrid/online live interactive cohorts.",
        displayOrder: 3,
        isActive: true,
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

  // Seed Mentors
  const existingMentor = await db.query.mentors.findFirst();
  if (!existingMentor) {
    await db.insert(mentors).values([
      {
        name: "Dr. Evelyn Reed",
        designation: "Senior Vocal & Rhetoric Coach",
        experience: "14+ Years Experience",
        bio: "Specialist in executive communication, voice modulation, and public speaking rhetoric for C-suite leaders.",
        specialization: "Rhetoric & Tonal Inflection",
        displayOrder: 1,
        isPublished: true,
      },
      {
        name: "Marcus Vance",
        designation: "Corporate Interview Strategist",
        experience: "10+ Years Experience",
        bio: "Former Fortune 500 recruiter coaching candidates on STAR framework responses and high-friction group discussions.",
        specialization: "Placement & Behavioral Mock Panels",
        displayOrder: 2,
        isPublished: true,
      },
    ]);
    console.log("✅ Seeded Mentors");
  }

  // Seed Campuses
  const existingCampus = await db.query.campuses.findFirst();
  if (!existingCampus) {
    await db.insert(campuses).values([
      {
        city: "Bengaluru",
        name: "Indiranagar Flagship Campus",
        address: "2nd Floor, Elite Vertex Building, 100ft Road, Indiranagar, Bengaluru 560038",
        landmark: "Next to Metro Station Exit 2",
        mapUrl: "https://maps.google.com/?q=Indiranagar+Bengaluru",
        isPublished: true,
      },
      {
        city: "Bengaluru",
        name: "Koramangala Learning Hub",
        address: "80ft Road, 4th Block, Koramangala, Bengaluru 560034",
        landmark: "Opposite Sony World Junction",
        mapUrl: "https://maps.google.com/?q=Koramangala+Bengaluru",
        isPublished: true,
      },
    ]);
    console.log("✅ Seeded Campuses");
  }

  // Seed About Page
  const existingAbout = await db.query.aboutPage.findFirst();
  if (!existingAbout) {
    await db.insert(aboutPage).values({
      headerTitle: "Empowering Professional Communication Excellence",
      headerSubtitle: "Transforming spoken fluency, executive poise, and interview mastery across India.",
      visionTitle: "Our Vision",
      visionBody: "To become the premier acoustic speech lab and professional training academy in the nation.",
      missionTitle: "Our Mission",
      missionBody: "To eliminate language hesitation and equip ambitious individuals with persuasive spoken English skills for global career success.",
    });
    console.log("✅ Seeded About Page");
  }

  // Seed Testimonials
  const existingTestimonial = await db.query.testimonials.findFirst();
  if (!existingTestimonial) {
    await db.insert(testimonials).values([
      {
        name: "Aarav Sharma",
        role: "Software Engineer at Global Tech",
        message: "The vocal diagnostics and accent neutralization lab completely redefined my confidence during client presentations!",
        rating: 5,
        displayOrder: 1,
        isActive: true,
      },
      {
        name: "Priya Nair",
        role: "Product Manager at Fintech Innovators",
        message: "From stage fright to keynote presentation: Elite Vertex gave me actionable rhetoric tools that leveled up my career.",
        rating: 5,
        displayOrder: 2,
        isActive: true,
      },
    ]);
    console.log("✅ Seeded Testimonials");
  }

  // Seed Gallery Items
  const existingGallery = await db.query.galleryItems.findFirst();
  if (!existingGallery) {
    await db.insert(galleryItems).values([
      {
        title: "Acoustic Rhetoric Lab Session",
        description: "Students practicing real-time speech cadence and vocal modulation.",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
        category: "Campus Life",
        displayOrder: 1,
        isActive: true,
      },
      {
        title: "Executive Group Discussion Round",
        description: "Placement preparation panel in progress.",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
        category: "Workshops",
        displayOrder: 2,
        isActive: true,
      },
    ]);
    console.log("✅ Seeded Gallery");
  }

  // Seed CMS: Home page with sections matching the existing design
  const existingHomePage = await db.query.pages.findFirst({
    where: eq(pages.slug, "home"),
  });

  if (!existingHomePage) {
    const [homePage] = await db
      .insert(pages)
      .values({
        slug: "home",
        title: "Home",
        metaTitle: "Elite Vertex — Spoken English, Communication & Career Skills",
        metaDescription:
          "Build the English, communication skills, and executive confidence you need for classrooms, global careers, and everyday influence.",
        status: "published",
        publishedAt: new Date(),
      })
      .returning();

    const homeSections = [
      {
        type: "hero",
        title: "Hero",
        sortOrder: 1,
        content: {
          tagline: "Spoken English • Communication • Career Skills",
          heading: "Speak With Confidence. Go Further.",
          subheading:
            "Build the English, communication skills, and executive confidence you need for classrooms, global careers, and everyday influence.",
          image:
            "https://lh3.googleusercontent.com/aida/AEtjO1XUmQebC7cWdgP8rjmnfdqiY3TWTBNoYsfMaSYI7n3xfYNILdru7siueSJaT3rMs4i4yPJNbvZvfikMQY3F9R2qu9KcA-IJpgJKfBgkmFG_E5MXmadYRgWJ_6PhUHhZrCm8UV-zLzfi7YQS7zuXK6r0MjulQm5z6SjXV14VWLoizz-xs76JsWDExBfm2OMZySxsZVg3HIpEMQlOhdIgz88ZuQ4xbfsXjeGRuCDxyYgFYtotlQBLMiC4mi6i",
          imageAlt: "Learners collaborating actively in executive seminar hall at Elite Vertex",
          primaryCtaLabel: "Book Free Counselling",
          primaryCtaUrl: "/contact",
          secondaryCtaLabel: "Explore Courses",
          secondaryCtaUrl: "/courses",
        },
      },
      {
        type: "pillars",
        title: "Trust Strip",
        sortOrder: 2,
        content: {
          items: [
            { label: "Pillar 01", title: "Practical Learning", description: "70% active speaking, zero passive lecturing." },
            { label: "Pillar 02", title: "Expert Trainers", description: "Cambridge-certified linguists & speech mentors." },
            { label: "Pillar 03", title: "Personal Attention", description: "Strictly capped micro-cohorts of 12 peers." },
            { label: "Pillar 04", title: "Career-Focused", description: "Interview panels, GD mastery, and boardroom articulation." },
          ],
        },
      },
      {
        type: "about_preview",
        title: "About Preview",
        sortOrder: 3,
        content: {
          label: "Pedagogical Framework",
          heading: "More Than English. We Build Confidence.",
          paragraph1:
            "Traditional language teaching isolates students inside grammar rules and rote drills. True oratory fluency requires psychological comfort, systematic desensitization to scrutiny, and immediate real-time feedback loops.",
          paragraph2:
            "At Elite Vertex, every participant receives continuous spoken runtime. We deconstruct anxiety, rebuild phonetics, and condition the posture of authority so your internal intellect translates effortlessly outward.",
          linkLabel: "Discover Elite Vertex",
          linkUrl: "/about",
          image:
            "https://lh3.googleusercontent.com/aida/AEtjO1UbCF47-wiszdwusF3kMtv218IqjqvwCWDJvXsccjhFWJowp5BXlhN1kafTOugiyzVfXIo1qi-UcFsCrXM57_lf-qI570CX2oKhiyKwApnDYDnGhjl05XnUcddmLAQBAC6iFtCkxGqpYRZMU9Qz-9h2x7T4YArXXt7nfL08xtPsa92omp0t5PyG8ovtazAtrAb_SaxJcN0q6Zs2xHS7t9SSVcj163VqpH4g0UmK98w5ZaPNxHYi4F5GhoI",
          imageAlt: "Academic mentor guiding student presentation in modern learning acoustic pod",
        },
      },
      {
        type: "courses_preview",
        title: "Courses Preview",
        sortOrder: 4,
        content: {
          label: "Curriculum Tracks",
          heading: "Learn Skills That Move You Forward.",
          linkLabel: "View All Courses",
          linkUrl: "/courses",
          items: [
            { title: "Spoken English Mastery", description: "Foundation to executive fluency, structural grammar, accent conditioning, and daily verbal sparring.", meta: "8 Weeks • In-Campus", url: "/courses" },
            { title: "Interview Skills & Group Discussion", description: "Behavioral frameworks (STAR method), high-pressure panel simulations, case extempore, and rapid rebuttals.", meta: "4 Weeks • Cohort-Based", url: "/courses" },
            { title: "Personality Development & Public Speaking", description: "Stage presence, vocal diaphragmatic modulation, kinesics, physical anchoring, and emotional resonance.", meta: "6 Weeks • Studio Lab", url: "/courses" },
            { title: "Professional & Executive Communication", description: "Boardroom presentations, executive brevity, persuasive corporate correspondence, and diplomatic dissent.", meta: "6 Weeks • Executive Weekend", url: "/courses" },
          ],
        },
      },
      {
        type: "testimonials",
        title: "Testimonials",
        sortOrder: 5,
        content: {
          badge: "STUDENT LOVE",
          heading: "Loved By Many Students",
          subheading:
            "We're proud to have a community of learners who trust us to help them grow their skills and achieve their goals.",
        },
      },
      {
        type: "gallery",
        title: "Gallery",
        sortOrder: 6,
        content: {
          heading: "Be A Part Of Our Thriving Community",
          subheading:
            "Connect, share, and grow together with thousands of passionate learners across the globe.",
        },
      },
      {
        type: "certificate_faq",
        title: "Certificate & FAQ",
        sortOrder: 7,
        content: {
          certificateCardTitle: "Official Attestation",
          certificateCardText: "Verify any alumni completion credential or serial number online.",
          certificateCardCta: "Verify",
          certificateCardCtaUrl: "/verify-certificate",
          diagnosticLabel: "Speech Diagnostic",
          diagnosticTitle: "Complimentary Speech Baseline Assessment",
          diagnosticText:
            "Evaluate your spoken clarity, pause cadence, and acoustic confidence with our senior academic linguists.",
          diagnosticNote: "No obligation required",
          faqLabel: "Clarifications",
          faqTitle: "Common Inquiries",
          faqLinkLabel: "View All FAQ",
          faqLinkUrl: "/faq",
        },
      },
      {
        type: "cta",
        title: "Final CTA",
        sortOrder: 8,
        content: {
          label: "Admissions Open For Next Cohort",
          heading: "Your Next Opportunity Starts With Better Communication.",
          subheading:
            "Schedule an in-person or virtual speech evaluation with our academic directors. Discover your baseline fluency score and receive a personalized curriculum path.",
          primaryCtaLabel: "Book Free Counselling",
          primaryCtaUrl: "/contact",
          secondaryCtaLabel: "Visit Campus",
          secondaryCtaUrl: "/contact",
        },
      },
    ];

    await db.insert(pageSections).values(
      homeSections.map((s) => ({
        pageId: homePage.id,
        type: s.type,
        title: s.title,
        sortOrder: s.sortOrder,
        draftContent: s.content,
        publishedContent: s.content,
        isVisible: true,
      }))
    );
    console.log("✅ Seeded Home page with 8 sections");
  }

  // Seed CMS: Navigation menus
  const seedMenu = async (location: string, name: string, items: Array<{ label: string; url: string }>) => {
    let menu = await db.query.navigationMenus.findFirst({
      where: eq(navigationMenus.location, location),
    });
    if (!menu) {
      const [created] = await db
        .insert(navigationMenus)
        .values({ name, location })
        .returning();
      menu = created;
    }
    const existingItems = await db.query.navigationItems.findMany({
      where: eq(navigationItems.menuId, menu.id),
    });
    if (existingItems.length === 0) {
      await db.insert(navigationItems).values(
        items.map((item, index) => ({
          menuId: menu.id,
          label: item.label,
          url: item.url,
          position: index + 1,
          isVisible: true,
        }))
      );
    }
    return menu;
  };

  await seedMenu("header", "Header Menu", [
    { label: "Home", url: "/" },
    { label: "Courses", url: "/courses" },
    { label: "About", url: "/about" },
    { label: "Verify Certificate", url: "/verify-certificate" },
    { label: "Contact", url: "/contact" },
  ]);

  await seedMenu("footer", "Footer Menu", [
    { label: "Home", url: "/" },
    { label: "Courses & Curriculum", url: "/courses" },
    { label: "About the Institute", url: "/about" },
    { label: "Campus Gallery", url: "/gallery" },
    { label: "Verify Credential", url: "/verify-certificate" },
    { label: "FAQ & Help", url: "/faq" },
    { label: "Contact & Visit", url: "/contact" },
  ]);

  console.log("✅ Seeded navigation menus");

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

