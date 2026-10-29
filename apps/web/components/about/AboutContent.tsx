"use client";

import Link from "next/link";
import { useGetAboutPageQuery, useGetMentorsQuery } from "@/lib/features/api/apiSlice";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function AboutContent() {
  const { data: aboutResponse, isLoading: isAboutLoading } = useGetAboutPageQuery({});
  const { data: mentorsResponse, isLoading: isMentorsLoading } = useGetMentorsQuery({});

  const aboutData = aboutResponse?.data || {};
  const mentorsList = mentorsResponse?.data || [];

  // Parse extra structured data from paradigmParagraph3 if present
  let extra: any = {};
  if (aboutData?.paradigmParagraph3) {
    try {
      if (typeof aboutData.paradigmParagraph3 === "string" && aboutData.paradigmParagraph3.trim().startsWith("{")) {
        extra = JSON.parse(aboutData.paradigmParagraph3);
      }
    } catch {
      // not JSON; ignored
    }
  }

  const defaultWhyUsItems = [
    { icon: "school", title: "Practical Learning", description: "Learn by doing with hands-on speech drills & live practice." },
    { icon: "record_voice_over", title: "Roleplay Training", description: "Real-world workplace simulations & public stage practice." },
    { icon: "group", title: "Expert Mentors", description: "Learn from experienced speech coaches & linguists." },
    { icon: "groups", title: "Small Batches", description: "Personalized attention and individual vocal diagnostic feedback." },
    { icon: "verified", title: "Verifiable Certificate", description: "Get an ISO 9001:2015 accredited certificate for career growth." },
    { icon: "work", title: "Career Support", description: "Interview preparation, presentation skills, & placement guidance." },
  ];

  const whyUsItems = extra?.whyUsItems && Array.isArray(extra.whyUsItems) && extra.whyUsItems.length > 0
    ? extra.whyUsItems
    : defaultWhyUsItems;

  const defaultFacilities = [
    { icon: "graphic_eq", title: "Acoustic Pods", description: "Soundproof chambers for speech recording and feedback." },
    { icon: "videocam", title: "HD Playback Labs", description: "Dual-camera video review for posture and body language." },
    { icon: "meeting_room", title: "Executive Studios", description: "Roundtable chambers configured for authentic boardroom practice." },
  ];

  const facilities = extra?.facilities && Array.isArray(extra.facilities) && extra.facilities.length > 0
    ? extra.facilities
    : defaultFacilities;

  const defaultLeadMentor = {
    name: "Dr. Meenakshi Sundaram",
    designation: "Chief Linguist & Academic Dean",
    accreditation: "British Council Accredited Fellow",
    quote: "We do not teach you to impersonate a native speaker. We coach you to speak with total clarity, natural gravitas, and unflinching presence.",
    bio: "With over 22 years of forensic linguistic research and corporate communication advisory across Oxford, Singapore, and India, Dr. Sundaram directs the curriculum standards at Elite Vertex.",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
  };

  const leadMentor = mentorsList[0] || (!isMentorsLoading ? defaultLeadMentor : null);

  return (
    <div className="flex flex-col w-full font-sans bg-background text-foreground">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="w-full bg-background py-12 lg:py-16 border-b border-outline-variant/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal direction="up" delay={0}>
            <div className="max-w-3xl flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 text-secondary font-bold tracking-widest text-xs uppercase mb-1 w-fit badge-shimmer">
                <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse"></span>
                <span>{extra.headerBadge || "ABOUT ELITE VERTEX"}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                {aboutData.headerTitle || "Empowering Communicators & Future Leaders"}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mt-2 font-normal">
                {aboutData.headerSubtitle || "Learn more about Elite Vertex Institute, our mission, vision, and the expert mentors guiding our students towards executive confidence and oral fluency."}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. VISION & MISSION SECTION */}
      <section className="py-16 lg:py-24 bg-surface-container-low/60 border-b border-outline-variant/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            {/* Left Header */}
            <div className="lg:col-span-1">
              <ScrollReveal direction="up">
                <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">
                  {extra.purposeLabel || "INSTITUTIONAL PURPOSE"}
                </span>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground leading-tight">
                  {extra.purposeTitle || "Our Vision & Mission"}
                </h2>
              </ScrollReveal>
            </div>

            {/* Right 2-Card Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Our Vision Card */}
              <ScrollReveal direction="up" delay={80}>
                <div className="bg-secondary/5 border border-secondary/20 rounded-3xl p-8 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all hover-lift">
                  <div className="w-14 h-14 bg-surface-container-lowest rounded-full flex items-center justify-center border border-outline-variant/40 shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-secondary text-[26px]">
                      visibility
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {aboutData.visionTitle || "Our Vision"}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                      {aboutData.visionBody || "To be a premier communication institute that empowers individuals with practical fluency, vocal confidence, and executive presence for global career success."}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Our Mission Card */}
              <ScrollReveal direction="up" delay={160}>
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all hover-lift">
                  <div className="w-14 h-14 bg-surface-container-lowest rounded-full flex items-center justify-center border border-outline-variant/40 shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-secondary text-[26px]">
                      ads_click
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {aboutData.missionTitle || "Our Mission"}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                      {aboutData.missionBody || "To deliver high-impact, practical training through expert mentors, real-world simulations, and personalized feedback to transform speakers into confident leaders."}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE ELITE VERTEX 6-CARD GRID */}
      <section className="py-16 lg:py-24 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">
                {extra.whyUsLabel || "WHY US"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                {extra.whyUsTitle || "Why Choose Elite Vertex?"}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-6 gap-6">
            {whyUsItems.map((item: any, idx: number) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 60}>
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl text-center flex flex-col items-center p-6 shadow-xs hover:shadow-xl transition-all hover-lift h-full">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-5 border border-secondary/20">
                    <span className="material-symbols-outlined text-secondary text-[24px]">
                      {item.icon || "school"}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INSTITUTIONAL STORY & AIRTIME STATS SECTION */}
      <section className="py-16 lg:py-24 bg-surface-container-low/60 border-t border-outline-variant/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 flex flex-col gap-6">
              <ScrollReveal direction="up">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                  {extra.storyLabel || "01 / ORIGIN & PARADIGM"}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                  {aboutData.paradigmTitle || "Fluency is a physical and psychological habit."}
                </h2>
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={80}>
                <div className="flex flex-col gap-4 text-muted-foreground text-sm sm:text-base leading-relaxed font-normal">
                  <p>
                    {aboutData.paradigmParagraph1 || "Traditional language learning treats spoken communication as a silent written test. Classrooms drilled parsing syntax and memorizing grammar rules—leaving professionals articulate on paper, yet hesitant when speaking."}
                  </p>
                  <p>
                    {aboutData.paradigmParagraph2 || "Elite Vertex was created to change this paradigm. Fluency is not theoretical knowledge; it is vocal muscle conditioning and confidence. Under acoustic guidance, speech hesitation dissolves when students are liberated from fear of judgment."}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={160}>
                <div className="pt-2 flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-3xl font-extrabold text-primary">{aboutData.airtimeStat || "70%"}</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
                      {extra.airtimeLabel || "Acoustic Airtime Per Learner"}
                    </span>
                  </div>
                  <div className="w-px h-10 bg-outline-variant/40"></div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-extrabold text-secondary">{aboutData.ratioStat || "1:12"}</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
                      {extra.ratioLabel || "Strict Cohort Ratio"}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6">
              <ScrollReveal direction="scale" delay={120}>
                <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 shadow-md hover-lift img-zoom-parent">
                  {isAboutLoading && !aboutResponse ? (
                    <div className="w-full aspect-[4/3] bg-surface-container rounded-xl animate-pulse" />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      alt="Elite Vertex interactive speech workshop"
                      className="w-full aspect-[4/3] object-cover rounded-xl"
                      src={aboutData.paradigmImage || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80"}
                    />
                  )}
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FACULTY & LEADERSHIP SECTION */}
      <section className="py-16 lg:py-24 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-2">
                {extra.facultyLabel || "02 / LEADERSHIP & FACULTY"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                {extra.facultyTitle || "Guided by Experienced Speech Coaches"}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {isMentorsLoading && !mentorsResponse ? (
              <>
                <div className="lg:col-span-5">
                  <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 shadow-md">
                    <div className="w-full aspect-[4/5] bg-surface-container rounded-xl animate-pulse" />
                    <div className="p-4 flex flex-col gap-2">
                      <div className="h-5 w-44 bg-surface-container rounded animate-pulse" />
                      <div className="h-3 w-32 bg-surface-container rounded animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="h-7 w-52 bg-surface-container rounded-full animate-pulse" />
                  <div className="space-y-3 mt-4">
                    <div className="h-7 w-full bg-surface-container rounded-lg animate-pulse" />
                    <div className="h-7 w-5/6 bg-surface-container rounded-lg animate-pulse" />
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="h-4 w-full bg-surface-container rounded animate-pulse" />
                    <div className="h-4 w-4/5 bg-surface-container rounded animate-pulse" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {[0, 1, 2].map((f) => (
                      <div key={f} className="h-24 bg-surface-container-low rounded-xl animate-pulse" />
                    ))}
                  </div>
                </div>
              </>
            ) : leadMentor ? (
              <>
                <div className="lg:col-span-5">
                  <ScrollReveal direction="scale" delay={80}>
                    <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 shadow-md hover-lift img-zoom-parent">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={leadMentor.name}
                        className="w-full aspect-[4/5] object-cover rounded-xl"
                        src={leadMentor.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
                      />
                      <div className="p-4 flex flex-col gap-1">
                        <span className="font-bold text-foreground text-lg">{leadMentor.name}</span>
                        <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{leadMentor.designation}</span>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-6">
                  <ScrollReveal direction="up" delay={120}>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-wider w-fit">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>{leadMentor.accreditation || "British Council Accredited Fellow"}</span>
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-relaxed mt-4">
                      &quot;{leadMentor.quote || "We do not teach you to impersonate a native speaker. We coach you to speak with total clarity, natural gravitas, and unflinching presence."}&quot;
                    </h3>
                    
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-normal mt-3">
                      {leadMentor.bio}
                    </p>
                  </ScrollReveal>

                  {/* Dynamic Facilities / Studios */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {facilities.map((fac: any, fIdx: number) => (
                      <ScrollReveal key={fIdx} direction="up" delay={180 + fIdx * 80}>
                        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-1 hover-lift h-full">
                          <span className="material-symbols-outlined text-secondary text-[24px]">
                            {fac.icon || "meeting_room"}
                          </span>
                          <h4 className="font-bold text-foreground text-sm mt-1">{fac.title}</h4>
                          <p className="text-xs text-muted-foreground leading-normal">{fac.description}</p>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION BANNER */}
      <section className="py-16 lg:py-24 bg-surface-container-low/60 border-t border-outline-variant/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="bg-primary p-8 sm:p-12 lg:p-16 rounded-[2rem] text-on-primary flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-xl">
              
              <div className="flex flex-col gap-3 max-w-xl">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                  {extra.ctaBadge || "DIRECT ADMISSIONS PORTAL"}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {extra.ctaTitle || "Start Your Journey With Elite Vertex."}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                  {extra.ctaSubtitle || "Experience an active classroom session and receive a complimentary 20-minute speech assessment with our senior academic linguists."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
                <Link
                  href={extra.ctaPrimaryUrl || "/book-counselling"}
                  className="inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-md btn-press hover-lift"
                >
                  {extra.ctaPrimaryLabel || "Book Free Counselling"}
                </Link>
                <Link
                  href={extra.ctaSecondaryUrl || "/courses"}
                  className="inline-flex items-center justify-center gap-2 text-white font-bold text-sm uppercase tracking-wider hover:text-amber-400 transition-colors py-4 px-4 btn-press"
                >
                  <span>{extra.ctaSecondaryLabel || "Explore Curriculum"}</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
