"use client";

import { useState } from "react";
import Link from "next/link";
import React from "react";

const faqData = [
  {
    id: "01",
    categories: ["courses"],
    question: "What courses does Elite Vertex offer?",
    answer: (
      <>
        We specialize exclusively in oral mastery and leadership rhetoric through three core tracks:
        <ul className="mt-space-2xs space-y-1 text-on-surface-variant list-disc pl-5">
          <li><strong className="text-on-surface">Spoken English &amp; Pronunciation:</strong> Foundational grammar, phonetics, accent neutralization, and spontaneous daily speech.</li>
          <li><strong className="text-on-surface">Career Communication:</strong> Interview mastery, cross-border corporate meetings, executive synthesis, and negotiation rhetoric.</li>
          <li><strong className="text-on-surface">Professional Public Speaking:</strong> Keynote delivery, extempore debate, vocal variety, and teleprompter precision.</li>
        </ul>
      </>
    ),
    rawText: "We specialize exclusively in oral mastery and leadership rhetoric through three core tracks: Spoken English & Pronunciation: Foundational grammar, phonetics, accent neutralization, and spontaneous daily speech. Career Communication: Interview mastery, cross-border corporate meetings, executive synthesis, and negotiation rhetoric. Professional Public Speaking: Keynote delivery, extempore debate, vocal variety, and teleprompter precision."
  },
  {
    id: "02",
    categories: ["general", "courses"],
    question: "Who can join Elite Vertex courses?",
    answer: "Our institute admits ambitious adult learners aged 17 and above. Typical cohorts consist of university scholars, technical managers, corporate leaders, legal advocates, and entrepreneurs. Since we stream students strictly into peer-aligned cohorts by CEFR level, beginners study comfortably alongside beginners, while senior executives train within advanced professional streams.",
    rawText: "Our institute admits ambitious adult learners aged 17 and above. Typical cohorts consist of university scholars, technical managers, corporate leaders, legal advocates, and entrepreneurs. Since we stream students strictly into peer-aligned cohorts by CEFR level, beginners study comfortably alongside beginners, while senior executives train within advanced professional streams."
  },
  {
    id: "03",
    categories: ["courses", "batches"],
    question: "What is the typical duration of courses?",
    answer: (
      <>
        Course modules range between <strong className="text-on-surface">4 weeks and 12 weeks</strong>, depending on your diagnostic starting point and fluency targets:
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs mt-space-sm">
          <div className="bg-surface-container-low p-space-sm rounded">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Accelerated Intensive</span>
            <p className="font-body-sm text-body-sm text-on-surface mt-1">4 Weeks • Monday to Thursday • 90 min/session</p>
          </div>
          <div className="bg-surface-container-low p-space-sm rounded">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">Executive Immersion</span>
            <p className="font-body-sm text-body-sm text-on-surface mt-1">10–12 Weeks • Saturdays &amp; Sundays • 2.5 hrs/session</p>
          </div>
        </div>
      </>
    ),
    rawText: "Course modules range between 4 weeks and 12 weeks, depending on your diagnostic starting point and fluency targets: Accelerated Intensive 4 Weeks • Monday to Thursday • 90 min/session Executive Immersion 10–12 Weeks • Saturdays & Sundays • 2.5 hrs/session"
  },
  {
    id: "04",
    categories: ["courses"],
    question: "Are classes practical or theory-based?",
    answer: <>We mandate a strict <strong className="text-on-surface">70% Active Speaking Rule</strong>. Instructors spend at most 15-20 minutes demonstrating rhetorical techniques before handing the floor to the cohort. Every class entails recorded podium speeches, parliamentary debates, simulated boardroom negotiations, and live phonological feedback.</>,
    rawText: "We mandate a strict 70% Active Speaking Rule. Instructors spend at most 15-20 minutes demonstrating rhetorical techniques before handing the floor to the cohort. Every class entails recorded podium speeches, parliamentary debates, simulated boardroom negotiations, and live phonological feedback."
  },
  {
    id: "05",
    categories: ["general", "admissions"],
    question: "Do beginners need prior English knowledge to join?",
    answer: "No prior fluency or English medium schooling is required. Every applicant completes an unobtrusive 20-minute verbal diagnostic. If you possess basic reading comprehension, our Step 1 Foundational Cohort gently dissolves mother-tongue hesitation and establishes core conversational momentum in an encouraging, non-judgmental environment.",
    rawText: "No prior fluency or English medium schooling is required. Every applicant completes an unobtrusive 20-minute verbal diagnostic. If you possess basic reading comprehension, our Step 1 Foundational Cohort gently dissolves mother-tongue hesitation and establishes core conversational momentum in an encouraging, non-judgmental environment."
  },
  {
    id: "06",
    categories: ["admissions"],
    question: "How can I book a counselling session?",
    answer: (
      <>
        You can arrange a complimentary consultation through three simple channels:
        <ol className="mt-space-2xs space-y-1.5 list-decimal pl-5 text-on-surface-variant">
          <li>Select a dedicated 25-minute slot via our online booking engine on this portal.</li>
          <li>Directly visit our flagship campuses in Bengaluru (M.G. Road) or New Delhi (Connaught Place) between 09:00 AM and 07:00 PM.</li>
          <li>Call our Admissions Registry directly at <span className="text-on-surface font-semibold">+91 (80) 4920-8800</span>.</li>
        </ol>
      </>
    ),
    rawText: "You can arrange a complimentary consultation through three simple channels: Select a dedicated 25-minute slot via our online booking engine on this portal. Directly visit our flagship campuses in Bengaluru (M.G. Road) or New Delhi (Connaught Place) between 09:00 AM and 07:00 PM. Call our Admissions Registry directly at +91 (80) 4920-8800."
  },
  {
    id: "07",
    categories: ["admissions", "courses"],
    question: "How do I know which course is right for me?",
    answer: "We never ask prospective scholars to guess their tier. During your free diagnostic session, a Senior Faculty Assessor evaluates your phonological control, lexical range, structural coherence, and communicative stamina. Based on empirical scoring against the European CEFR grid, we issue a personalized syllabus prescription.",
    rawText: "We never ask prospective scholars to guess their tier. During your free diagnostic session, a Senior Faculty Assessor evaluates your phonological control, lexical range, structural coherence, and communicative stamina. Based on empirical scoring against the European CEFR grid, we issue a personalized syllabus prescription."
  },
  {
    id: "08",
    categories: ["batches"],
    question: "What is the student capacity per cohort?",
    answer: <>Class size is strictly capped at <strong className="text-on-surface">12 learners per cohort</strong> for physical campus batches, and 10 learners for digital virtual studios. This strict ceiling ensures that every participant logs a documented minimum of 22 minutes of active vocal stage-time in every single session.</>,
    rawText: "Class size is strictly capped at 12 learners per cohort for physical campus batches, and 10 learners for digital virtual studios. This strict ceiling ensures that every participant logs a documented minimum of 22 minutes of active vocal stage-time in every single session."
  },
  {
    id: "09",
    categories: ["batches"],
    question: "Can I switch batches if my work schedule changes?",
    answer: "Yes. We recognize the dynamic calendars of working executives. You are entitled to two schedule transitions per term across our morning (07:30 AM), evening (07:00 PM), or weekend executive formats without penalty, subject to seat availability in the target cohort.",
    rawText: "Yes. We recognize the dynamic calendars of working executives. You are entitled to two schedule transitions per term across our morning (07:30 AM), evening (07:00 PM), or weekend executive formats without penalty, subject to seat availability in the target cohort."
  },
  {
    id: "10",
    categories: ["certificates"],
    question: "Do you provide recognized certificates?",
    answer: <>Yes. Successful graduates receive the <strong className="text-on-surface">Elite Vertex Diploma in Spoken Rhetoric &amp; Executive Oratory</strong>, with an encrypted certificate hash bench-marked against ISO 9001:2015 educational protocols and international CEFR matrices. Employers can verify credentials instantly via our online verification registry.</>,
    rawText: "Yes. Successful graduates receive the Elite Vertex Diploma in Spoken Rhetoric & Executive Oratory, with an encrypted certificate hash bench-marked against ISO 9001:2015 educational protocols and international CEFR matrices. Employers can verify credentials instantly via our online verification registry."
  }
];

export function FaqContent() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.categories.includes(activeCategory);
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      faq.question.toLowerCase().includes(query) || 
      faq.rawText.toLowerCase().includes(query);
      
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Minimal Hero Header */}
      <section className="max-w-[1280px] mx-auto w-full px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pt-space-xl pb-space-lg">
        <div className="max-w-3xl flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-2xs">
            <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Frequently Asked Questions</span>
          </div>
          <h1 className="font-display text-display text-on-surface tracking-tight leading-none mt-space-3xs">
            Questions, Answered.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs leading-relaxed max-w-2xl">
            Clear answers regarding course curriculum, admissions diagnostics, batch timings, and institutional certification standards.
          </p>
        </div>
        
        {/* Search & Filters Container */}
        <div className="mt-space-xl pt-space-lg flex flex-col gap-space-md">
          {/* Search Input Bar */}
          <div className="relative w-full max-w-2xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none select-none text-[20px]">
              search
            </span>
            <input 
              aria-label="Search frequently asked questions" 
              className="w-full bg-surface-container-lowest pl-12 pr-10 py-3.5 rounded text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/60 shadow-sm transition-colors duration-150 focus:outline-none focus:bg-surface-container-lowest" 
              placeholder="Search your question..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                aria-label="Clear search query" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors" 
                type="button"
                onClick={() => setSearchQuery("")}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          
          {/* Category Filter Pills */}
          <div aria-label="FAQ Categories" className="flex flex-wrap items-center gap-space-2xs pt-space-3xs" role="tablist">
            {[
              { id: "all", label: "All" },
              { id: "general", label: "General" },
              { id: "courses", label: "Courses" },
              { id: "admissions", label: "Admissions" },
              { id: "batches", label: "Batches" },
              { id: "certificates", label: "Certificates" }
            ].map(cat => (
              <button 
                key={cat.id}
                className={`px-space-sm py-1.5 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-150 shadow-sm ${activeCategory === cat.id ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'}`} 
                onClick={() => setActiveCategory(cat.id)}
                type="button"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Accordion Section */}
      <section className="max-w-[1280px] mx-auto w-full px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* Left Column: Academic Metadata & Stat */}
          <aside className="lg:col-span-4 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-2xs text-secondary">
                <span className="material-symbols-outlined text-[20px]">school</span>
                <span className="font-label-md text-label-md uppercase tracking-wider">Linguistic Framework</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Our curriculum adheres strictly to the Common European Framework of Reference for Languages (CEFR), assuring verified global compatibility from A1 foundational to C2 executive mastery.
              </p>
              <div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span>Average Diagnostic Accuracy</span>
                <span className="font-semibold text-on-surface">98.4%</span>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-space-2xs px-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Live Batch Index</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Spring cohorts run concurrently across Bengaluru, New Delhi, and live virtual studios. Max cohort size remains locked at 12 students.
              </p>
            </div>
          </aside>
          
          {/* Right Column: Accordion Items */}
          <div className="lg:col-span-8 flex flex-col">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              
              return (
                <article key={faq.id} className="group bg-surface-container-lowest rounded shadow-sm mb-space-xs transition-colors">
                  <button 
                    aria-expanded={isOpen} 
                    className="w-full px-space-md py-space-md text-left flex items-start justify-between gap-space-sm" 
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="flex items-start gap-space-sm">
                      <span className="font-label-md text-label-md text-on-surface-variant/50 pt-0.5 select-none shrink-0">{faq.id}</span>
                      <h2 className={`font-headline-sm text-headline-sm transition-colors ${isOpen ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                        {faq.question}
                      </h2>
                    </div>
                    <span className={`material-symbols-outlined text-on-surface-variant text-[22px] transition-transform duration-200 shrink-0 mt-0.5 ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  <div className={`px-space-md pb-space-md pl-[calc(1.5rem+1.5rem)] ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="pt-space-2xs text-on-surface-variant font-body-md text-body-md leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </article>
              );
            })}

            {/* No Results Fallback State */}
            {filteredFaqs.length === 0 && (
              <div className="py-space-xl text-center bg-surface-container-lowest rounded shadow-sm">
                <span className="material-symbols-outlined text-[36px] text-on-surface-variant/40 mb-space-2xs">search_off</span>
                <p className="font-headline-sm text-headline-sm text-on-surface">No inquiries matching your criteria</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Try adjusting your keywords or selecting "All" to browse the full index.</p>
                <button 
                  className="mt-space-sm font-label-md text-label-md uppercase tracking-wider text-secondary hover:underline" 
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                >
                  Reset search &amp; filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Compact Editorial Helpdesk Section */}
      <section className="max-w-[1280px] mx-auto w-full px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-xl">
        <div className="bg-surface-container-lowest rounded p-space-lg md:p-space-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
          <div className="max-w-xl flex flex-col gap-space-3xs">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Institutional Registry</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Still Have a Question?</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
              Our academic counsellors are available on campus and over live call to answer specific inquiries regarding diagnostics, cohort schedules, and placement audits.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-space-xs shrink-0">
            <Link className="px-space-md py-3 rounded text-on-surface font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-low transition-colors duration-150" href="/contact">
              Contact Us
            </Link>
            <Link className="bg-secondary hover:bg-on-secondary-container text-on-secondary px-space-md py-3 rounded font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors duration-150" href="/book-counselling">
              Book Free Counselling
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
