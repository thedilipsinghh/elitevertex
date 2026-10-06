"use client";

import Link from "next/link";
import { useState } from "react";

export function HomeContent() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: HERO */}
      <section className="w-full bg-surface py-space-2xl md:py-space-3xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Text Narrative */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-semibold mb-space-xs">
                Spoken English • Communication • Career Skills
              </span>
              <h1 className="font-display text-display text-primary tracking-tight leading-none mb-space-md">
                Speak With Confidence. Go Further.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-space-xl leading-relaxed">
                Build the English, communication skills, and executive confidence you need for classrooms, global careers, and everyday influence.
              </p>
              <div className="flex flex-wrap items-center gap-space-sm w-full sm:w-auto">
                <Link className="inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md uppercase tracking-wider px-space-lg py-space-xs rounded-lg transition-colors duration-150" href="/book-counselling">
                  Book Free Counselling
                </Link>
                <Link className="inline-flex items-center justify-center bg-transparent hover:bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-wider px-space-lg py-space-xs rounded-lg transition-colors duration-150" href="/courses">
                  Explore Courses
                </Link>
              </div>
            </div>
            {/* Hero Documentary Photo */}
            <div className="lg:col-span-6 w-full">
              <div className="relative overflow-hidden rounded-xl bg-surface-container shadow-sm aspect-[16/11]">
                <img alt="Learners collaborating actively in executive seminar hall at Elite Vertex" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1XUmQebC7cWdgP8rjmnfdqiY3TWTBNoYsfMaSYI7n3xfYNILdru7siueSJaT3rMs4i4yPJNbvZvfikMQY3F9R2qu9KcA-IJpgJKfBgkmFG_E5MXmadYRgWJ_6PhUHhZrCm8UV-zLzfi7YQS7zuXK6r0MjulQm5z6SjXV14VWLoizz-xs76JsWDExBfm2OMZySxsZVg3HIpEMQlOhdIgz88ZuQ4xbfsXjeGRuCDxyYgFYtotlQBLMiC4mi6i"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUST STRIP */}
      <section className="w-full bg-surface-container-lowest py-space-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-lg">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-space-3xs">Pillar 01</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">Practical Learning</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-3xs">70% active speaking, zero passive lecturing.</p>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-space-3xs">Pillar 02</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">Expert Trainers</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-3xs">Cambridge-certified linguists &amp; speech mentors.</p>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-space-3xs">Pillar 03</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">Personal Attention</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-3xs">Strictly capped micro-cohorts of 12 peers.</p>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-space-3xs">Pillar 04</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">Career-Focused</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-3xs">Interview panels, GD mastery, and boardroom articulation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ABOUT PREVIEW */}
      <section className="w-full bg-surface py-space-3xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
            {/* Visual */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="rounded-xl overflow-hidden bg-surface-container aspect-[4/5]">
                <img alt="Academic mentor guiding student presentation in modern learning acoustic pod" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1UbCF47-wiszdwusF3kMtv218IqjqvwCWDJvXsccjhFWJowp5BXlhN1kafTOugiyzVfXIo1qi-UcFsCrXM57_lf-qI570CX2oKhiyKwApnDYDnGhjl05XnUcddmLAQBAC6iFtCkxGqpYRZMU9Qz-9h2x7T4YArXXt7nfL08xtPsa92omp0t5PyG8ovtazAtrAb_SaxJcN0q6Zs2xHS7t9SSVcj163VqpH4g0UmK98w5ZaPNxHYi4F5GhoI"/>
              </div>
            </div>
            {/* Academic Narrative */}
            <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col">
              <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-space-2xs">Pedagogical Framework</span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-space-md">
                More Than English.<br/>We Build Confidence.
              </h2>
              <div className="flex flex-col gap-space-sm font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed mb-space-lg">
                <p>
                  Traditional language teaching isolates students inside grammar rules and rote drills. True oratory fluency requires psychological comfort, systematic desensitization to scrutiny, and immediate real-time feedback loops.
                </p>
                <p>
                  At Elite Vertex, every participant receives continuous spoken runtime. We deconstruct anxiety, rebuild phonetics, and condition the posture of authority so your internal intellect translates effortlessly outward.
                </p>
              </div>
              <div>
                <Link className="inline-flex items-center gap-space-2xs font-label-md text-label-md uppercase tracking-wider text-secondary hover:text-on-secondary-container transition-colors" href="/about">
                  Discover Elite Vertex
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COURSES PREVIEW (Clean Structured List) */}
      <section className="w-full bg-surface-container-low py-space-3xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
            <div>
              <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-space-3xs block">Curriculum Tracks</span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                Learn Skills That Move You Forward.
              </h2>
            </div>
            <Link className="inline-flex items-center gap-space-3xs font-label-md text-label-md uppercase tracking-wider text-secondary hover:text-on-secondary-container transition-colors" href="/courses">
              View All Courses
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          {/* Editorial Horizontal Course Registry */}
          <div className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            {/* Item 01 */}
            <Link className="group flex flex-col md:flex-row md:items-center justify-between p-space-lg hover:bg-surface-container transition-colors" href="/courses">
              <div className="flex items-start md:items-center gap-space-md mb-space-2xs md:mb-0">
                <span className="font-label-md text-label-md text-on-surface-variant/70 font-semibold group-hover:text-secondary transition-colors">01</span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">Spoken English Mastery</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-3xs">Foundation to executive fluency, structural grammar, accent conditioning, and daily verbal sparring.</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-space-md shrink-0">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">8 Weeks • In-Campus</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 group-hover:text-secondary transition-all">arrow_forward</span>
              </div>
            </Link>
            {/* Item 02 */}
            <Link className="group flex flex-col md:flex-row md:items-center justify-between p-space-lg hover:bg-surface-container transition-colors" href="/courses">
              <div className="flex items-start md:items-center gap-space-md mb-space-2xs md:mb-0">
                <span className="font-label-md text-label-md text-on-surface-variant/70 font-semibold group-hover:text-secondary transition-colors">02</span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">Interview Skills &amp; Group Discussion</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-3xs">Behavioral frameworks (STAR method), high-pressure panel simulations, case extempore, and rapid rebuttals.</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-space-md shrink-0">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">4 Weeks • Cohort-Based</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 group-hover:text-secondary transition-all">arrow_forward</span>
              </div>
            </Link>
            {/* Item 03 */}
            <Link className="group flex flex-col md:flex-row md:items-center justify-between p-space-lg hover:bg-surface-container transition-colors" href="/courses">
              <div className="flex items-start md:items-center gap-space-md mb-space-2xs md:mb-0">
                <span className="font-label-md text-label-md text-on-surface-variant/70 font-semibold group-hover:text-secondary transition-colors">03</span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">Personality Development &amp; Public Speaking</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-3xs">Stage presence, vocal diaphragmatic modulation, kinesics, physical anchoring, and emotional resonance.</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-space-md shrink-0">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">6 Weeks • Studio Lab</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 group-hover:text-secondary transition-all">arrow_forward</span>
              </div>
            </Link>
            {/* Item 04 */}
            <Link className="group flex flex-col md:flex-row md:items-center justify-between p-space-lg hover:bg-surface-container transition-colors" href="/courses">
              <div className="flex items-start md:items-center gap-space-md mb-space-2xs md:mb-0">
                <span className="font-label-md text-label-md text-on-surface-variant/70 font-semibold group-hover:text-secondary transition-colors">04</span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">Professional &amp; Executive Communication</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-3xs">Boardroom presentations, executive brevity, persuasive corporate correspondence, and diplomatic dissent.</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-space-md shrink-0">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">6 Weeks • Executive Weekend</span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 group-hover:text-secondary transition-all">arrow_forward</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY ELITE VERTEX */}
      <section className="w-full bg-surface py-space-3xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="max-w-2xl mb-space-2xl">
            <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-space-3xs block">The Vertex Methodology</span>
            <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Learning That Goes Beyond the Classroom.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-space-md">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-space-2xs">Practical Speaking</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Every class devotes 70% of time to active speech out loud. Students stand, address the room, and present continuously.
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-space-md block">01 / Rigor</span>
            </div>
            <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-space-md">
                  <span className="material-symbols-outlined text-[20px]">groups</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-space-2xs">Personal Attention</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Cohorts are strictly capped at 12 students to guarantee each learner dedicated time with senior faculty mentors every session.
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-space-md block">02 / Focus</span>
            </div>
            <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-space-md">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-space-2xs">Real-World Practice</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Tackle unscripted workplace confrontations, live keynote speech deliveries, and unpredictable media-style interrogations.
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-space-md block">03 / Reality</span>
            </div>
            <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-space-md">
                  <span className="material-symbols-outlined text-[20px]">trending_up</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-space-2xs">Confidence Building</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Overcome stage paralysis in an environment engineered for progressive exposure, peer camaraderie, and zero judgment.
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-space-md block">04 / Elevation</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CLASSROOM / IMMERSIVE EXPERIENCE */}
      <section className="w-full bg-surface-container-lowest py-space-3xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
            <div className="lg:col-span-5 flex flex-col">
              <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-semibold mb-space-2xs">Live Campus Dynamic</span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-space-md">
                You Don’t Learn Communication by Staying Silent.
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
                Inside our acoustic seminar halls and podium labs, theory yields immediately to execution. You are handed the floor, the microphone, and the audience from session one.
              </p>
              <div className="flex items-center gap-space-md text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                <div className="flex items-center gap-space-3xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                  <span>Acoustic Pods</span>
                </div>
                <div className="flex items-center gap-space-3xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                  <span>Video Playback Analysis</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="relative rounded-xl overflow-hidden bg-surface-container aspect-[16/10] shadow-sm">
                <img alt="Warm ambient photo of professional students engaged in an impassioned oral debate inside a sunlit university auditorium, natural wooden architectural accents, neutral lighting" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe3qQA3UdqI83J3eHBXhTr2vtGJX2sxuz79RPDAy-FdgIMBQPLXC9sM5yTrF2W4QWfejOc335qc2xtVHPDdjfiPTsjnScvye3kUJFeWgkwmL-rDzpQz1Pnx7mKMGE9nmW2nivy7JdRoUpNFY7krIYKyAi2A9YXpMl_gXbHkagAMMfV9WpAhLD5hmcZIKFvkBwc_w3JQKWJV90vZ0opBbDPzRgQGVi6UoJ3zQDj0W0_Kl83u9N5Iv_ymw"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: UNIFIED PREVIEW (Gallery, Certificate Verification, FAQ Highlight) */}
      <section className="w-full bg-surface py-space-3xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
            {/* Gallery & Certificate Column */}
            <div className="lg:col-span-6 flex flex-col gap-space-lg">
              {/* Gallery Thumbnail Preview */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-space-md">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Archival Record</span>
                    <h3 className="font-headline-sm text-headline-sm text-primary">Life Inside Campus</h3>
                  </div>
                  <Link className="font-label-sm text-label-sm uppercase tracking-wider text-secondary hover:text-on-secondary-container transition-colors flex items-center gap-1" href="/gallery">
                    View Gallery <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-space-xs">
                  <div className="rounded overflow-hidden aspect-square bg-surface-container">
                    <img alt="Close-up candid documentary photo of an adult learner giving a mock speech behind a sleek lectern in an executive communication center" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQa0GsC_Z4AgP4E_1nZyj-4yONayc1wren5BeGnQSL9pfSXmpR0v6biBPKubc9evuj0AUgFoVTLRvZxv-NFzsXaCnzBYQGaCOmIgx7sSlG24YfI5lz6gBaELaoEgj_Iv7U-GhY8ozQQ4vMROM_ppT862kcCh-MedyKG64BD6N4GswnXwuWPM70R3CHL8DhN5j6x_D_seA81raG2WzUISKsZZMdLeYWT4k7K6-xjB0a5iGcmPG1srLAxQ"/>
                  </div>
                  <div className="rounded overflow-hidden aspect-square bg-surface-container">
                    <img alt="Small group of diverse corporate trainees engaged in earnest discussion around an oak table in a modern learning library" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpLPHxd52Ac_nm48VO_HNke-GjvWNmhF-3vger-g_toKK2DxOWbacOhNQIPkkLhX6AGWbaGx158-I5fzwlU0Uc3q-HS8ztBFFVqIrSswq55iufTWB85v8IGTqwT1Jh9mLQ0p5MveOXmQPob8Ah9eNQw1vaZ-fhpNnNJx7MKwdFI8Sm9-oIKqzXZvLmpYh4PhSkr0TO5c6zNi_UUL2GkDJqftg-6wXgK-7nwNzTSPHVjcDa2J0p2yQ0PQ"/>
                  </div>
                  <div className="rounded overflow-hidden aspect-square bg-surface-container">
                    <img alt="Speech faculty mentor reviewing an analytical articulation progress chart with an enrolled professional on a laptop screen" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH_Yl3vspv6gyyZ4oijSuVywpUbBo2oAKlNRgBpm9nWe4Q9EHFasAmAVNT4uZpa9P2jYfxFwOIjLZMZVHyGuZMhjK7obOlkfQrzJqW1AhdaE01fi-A-2TiVqZh78vDHpNU6DduHBvgPg61pcHVuNER0rdERr0fhTa1Sw9SCHVBlNyMWm7zsMJcHxmNFhBTiTwKBvucN5W6labwB8GXTZbTorqAOwPaNZ6Pd9ygQSUAXMc4YECWNzKt1w"/>
                  </div>
                </div>
              </div>
              {/* Certificate Verification Card */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex items-center justify-between gap-space-md">
                <div className="flex items-start gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">verified</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-primary">Official Attestation</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Verify any alumni completion credential or serial number online.</p>
                  </div>
                </div>
                <Link className="shrink-0 font-label-md text-label-md uppercase tracking-wider bg-surface-container hover:bg-surface-container-high text-primary px-space-md py-space-xs rounded-lg transition-colors" href="/verify-certificate">
                  Verify
                </Link>
              </div>
            </div>
            {/* FAQ High-Value Highlight Column */}
            <div className="lg:col-span-6 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Clarifications</span>
                    <h3 className="font-headline-sm text-headline-sm text-primary">Common Inquiries</h3>
                  </div>
                  <Link className="font-label-sm text-label-sm uppercase tracking-wider text-secondary hover:text-on-secondary-container transition-colors flex items-center gap-1" href="/faq">
                    View All FAQ <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
                {/* Accordion items with inline interactive disclosure */}
                <div className="flex flex-col gap-space-xs">
                  {/* FAQ 1 */}
                  <div className="bg-surface-container-low rounded-lg p-space-md transition-all cursor-pointer" onClick={() => toggleFaq(1)}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-label-md text-label-md uppercase tracking-wider text-primary font-semibold">I have extreme hesitation speaking in public. Can I join?</h4>
                      <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${openFaqId === 1 ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>
                    <div className={`mt-space-2xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed ${openFaqId === 1 ? 'block' : 'hidden'}`}>
                      Over 85% of our learners arrive with stage hesitation. Our introductory week uses gradual speech exposure within 12-person cohorts, removing pressure completely before public speech modules begin.
                    </div>
                  </div>
                  {/* FAQ 2 */}
                  <div className="bg-surface-container-low rounded-lg p-space-md transition-all cursor-pointer" onClick={() => toggleFaq(2)}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-label-md text-label-md uppercase tracking-wider text-primary font-semibold">What is the batch size and duration?</h4>
                      <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${openFaqId === 2 ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>
                    <div className={`mt-space-2xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed ${openFaqId === 2 ? 'block' : 'hidden'}`}>
                      Batches are hard-capped at 12 participants. Cohorts run 4 to 8 weeks with both weekday evening and weekend intensive options available across campuses.
                    </div>
                  </div>
                  {/* FAQ 3 */}
                  <div className="bg-surface-container-low rounded-lg p-space-md transition-all cursor-pointer" onClick={() => toggleFaq(3)}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-label-md text-label-md uppercase tracking-wider text-primary font-semibold">Is the certificate recognized across corporations?</h4>
                      <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${openFaqId === 3 ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>
                    <div className={`mt-space-2xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed ${openFaqId === 3 ? 'block' : 'hidden'}`}>
                      Yes. Certificates bear the Council for Executive Speech and Oratory accreditation and unique digital cryptographic verification hashes recognized by top MNC recruiters.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="w-full bg-primary-container text-on-primary py-space-3xl mb-0">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <span className="font-label-md text-label-md uppercase tracking-widest text-on-primary-container mb-space-2xs">Admissions Open For Next Cohort</span>
            <h2 className="font-headline-lg text-headline-lg text-on-primary tracking-tight mb-space-md">
              Your Next Opportunity Starts With Better Communication.
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl mb-space-xl leading-relaxed">
              Schedule an in-person or virtual speech evaluation with our academic directors. Discover your baseline fluency score and receive a personalized curriculum path.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-space-sm">
              <Link className="w-full sm:w-auto inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md uppercase tracking-wider px-space-xl py-space-xs rounded-lg transition-colors duration-150" href="/book-counselling">
                Book Free Counselling
              </Link>
              <Link className="w-full sm:w-auto inline-flex items-center justify-center bg-surface-container-high/10 hover:bg-surface-container-high/20 text-on-primary font-label-md text-label-md uppercase tracking-wider px-space-lg py-space-xs rounded-lg transition-colors duration-150" href="/contact">
                Visit Campus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
