"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleryItems } from "@/data/gallery";

type FilterType = "all" | "classroom" | "events" | "workshops" | "milestones";

export function GalleryContent() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [lightboxItem, setLightboxItem] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = galleryItems.filter((item) => filter === "all" || item.category === filter);

  // Close lightbox when clicking escape
  if (typeof window !== "undefined") {
    window.onkeydown = (e) => {
      if (e.key === "Escape") setLightboxItem(null);
    };
  }

  return (
    <div className="flex flex-col w-full">
      {/* Top Editorial Header Block */}
      <section className="w-full bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-xl md:py-space-2xl">
          {/* Breadcrumbs & Document Reference */}
          <div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-md">
            <nav className="flex items-center gap-space-2xs font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-semibold">Gallery</span>
            </nav>
            <div className="inline-flex items-center gap-space-2xs px-space-xs py-space-3xs bg-surface-container text-on-surface-variant font-label-sm text-label-sm rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span>ARCHIVAL REPERTORY • ACADEMIC YEAR 2024–2025</span>
            </div>
          </div>
          {/* Main Heading Typography */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-end">
            <div className="lg:col-span-8 flex flex-col gap-space-2xs">
              <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">Documentary Visual Index</span>
              <h1 className="font-display text-headline-lg-mobile md:text-display text-primary tracking-tight">Inside Elite Vertex.</h1>
            </div>
            <div className="lg:col-span-4">
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Unfiltered glimpses into our acoustic speech laboratories, intellectual round-tables, high-stakes debate symposiums, and student milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Index Navigation Bar */}
      <section className="sticky top-20 z-40 w-full bg-surface-container-lowest shadow-sm">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="flex items-center justify-between py-space-xs overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-space-2xs shrink-0">
              <button 
                onClick={() => setFilter("all")}
                className={`px-space-sm py-space-2xs rounded font-label-md text-label-md uppercase tracking-wider transition-all duration-150 ${filter === 'all' ? 'bg-primary text-on-primary' : 'bg-transparent text-on-surface-variant hover:text-primary'}`}
              >
                All Works <span className="ml-1 opacity-70">(04)</span>
              </button>
              <button 
                onClick={() => setFilter("classroom")}
                className={`px-space-sm py-space-2xs rounded font-label-md text-label-md uppercase tracking-wider transition-all duration-150 ${filter === 'classroom' ? 'bg-primary text-on-primary' : 'bg-transparent text-on-surface-variant hover:text-primary'}`}
              >
                Classroom
              </button>
              <button 
                onClick={() => setFilter("events")}
                className={`px-space-sm py-space-2xs rounded font-label-md text-label-md uppercase tracking-wider transition-all duration-150 ${filter === 'events' ? 'bg-primary text-on-primary' : 'bg-transparent text-on-surface-variant hover:text-primary'}`}
              >
                Symposiums
              </button>
              <button 
                onClick={() => setFilter("workshops")}
                className={`px-space-sm py-space-2xs rounded font-label-md text-label-md uppercase tracking-wider transition-all duration-150 ${filter === 'workshops' ? 'bg-primary text-on-primary' : 'bg-transparent text-on-surface-variant hover:text-primary'}`}
              >
                Acoustic Labs
              </button>
              <button 
                onClick={() => setFilter("milestones")}
                className={`px-space-sm py-space-2xs rounded font-label-md text-label-md uppercase tracking-wider transition-all duration-150 ${filter === 'milestones' ? 'bg-primary text-on-primary' : 'bg-transparent text-on-surface-variant hover:text-primary'}`}
              >
                Milestones
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm tracking-wider">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              <span>4 AUTHENTIC RECORDS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Asymmetric Layout */}
      <section className="w-full py-space-2xl md:py-space-3xl bg-surface">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start mb-space-xl">
            {filteredItems.slice(0, 2).map((item) => (
              <article 
                key={item.id} 
                onClick={() => setLightboxItem(item)}
                className={`${item.gridSpan} group cursor-pointer bg-surface-container-lowest p-space-sm rounded shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className={`relative w-full ${item.aspectRatio} overflow-hidden rounded bg-surface-container`}>
                  <img alt={item.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" loading="lazy" src={item.image} />
                  <div className="absolute top-space-xs left-space-xs">
                    <span className={`${item.tagClass} font-label-sm text-label-sm uppercase px-space-2xs py-space-3xs tracking-widest rounded`}>
                      {item.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-space-xs right-space-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-surface-container-lowest text-primary p-space-2xs rounded shadow-sm flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">fullscreen</span>
                    </div>
                  </div>
                </div>
                <div className="pt-space-md pb-space-2xs flex flex-col md:flex-row md:items-baseline justify-between gap-space-xs">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">{item.title}</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-3xs max-w-xl">{item.description}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider shrink-0 mt-space-sm md:mt-0">
                    <span>{item.location}</span>
                    {item.subLocation && <span>{item.subLocation}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {filteredItems.slice(2, 4).map((item) => (
              <article 
                key={item.id} 
                onClick={() => setLightboxItem(item)}
                className={`${item.gridSpan} group cursor-pointer bg-surface-container-lowest p-space-sm rounded shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className={`relative w-full ${item.aspectRatio} overflow-hidden rounded bg-surface-container`}>
                  <img alt={item.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" loading="lazy" src={item.image} />
                  <div className="absolute top-space-xs left-space-xs">
                    <span className={`${item.tagClass} font-label-sm text-label-sm uppercase px-space-2xs py-space-3xs tracking-widest rounded`}>
                      {item.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-space-xs right-space-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-surface-container-lowest text-primary p-space-2xs rounded shadow-sm flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">fullscreen</span>
                    </div>
                  </div>
                </div>
                <div className="pt-space-md pb-space-2xs flex flex-col md:flex-row md:items-baseline justify-between gap-space-xs">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">{item.title}</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-3xs max-w-xl">{item.description}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider shrink-0 mt-space-sm md:mt-0">
                    <span>{item.location}</span>
                    {item.subLocation && <span>{item.subLocation}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Archival Metadata Metric Strip */}
          <div className="mt-space-2xl p-space-lg bg-surface-container-lowest rounded shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-lg text-left">
              <div className="flex flex-col">
                <span className="font-headline-lg text-headline-lg text-primary leading-none">1:8</span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mt-space-2xs">Cohort Instructor Ratio</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-lg text-headline-lg text-primary leading-none">40+</span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mt-space-2xs">Stage Practice Hours</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-lg text-headline-lg text-primary leading-none">100%</span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mt-space-2xs">Recorded Waveform Audits</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-lg text-headline-lg text-primary leading-none">2,400+</span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mt-space-2xs">Alumni In Executive Roles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="w-full bg-surface-container-lowest py-space-2xl md:py-space-3xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="bg-primary text-on-primary rounded p-space-xl md:p-space-2xl relative overflow-hidden shadow-md">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-5 pointer-events-none flex items-center justify-end pr-space-lg">
              <svg className="w-96 h-96 text-on-primary" fill="currentColor" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="48" stroke="currentColor" strokeWidth="1.5"></circle>
                <circle cx="50" cy="50" fill="none" r="32" stroke="currentColor" strokeWidth="1"></circle>
                <polygon fill="none" points="50,12 88,78 12,78" stroke="currentColor" strokeWidth="1"></polygon>
              </svg>
            </div>
            <div className="relative z-10 max-w-2xl flex flex-col gap-space-sm items-start">
              <div className="inline-flex items-center gap-space-2xs px-space-xs py-space-3xs bg-on-primary/10 text-primary-fixed font-label-sm text-label-sm uppercase tracking-widest rounded">
                Admissions Open • Spring Cohort
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary tracking-tight">
                Want to Be Part of the Experience?
              </h2>
              <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed">
                Visit our campus, observe an unscripted debate cohort, and sit with our senior speech mentors for a diagnostic voice evaluation.
              </p>
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <Link href="/book-counselling" className="inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md uppercase tracking-wider px-space-md py-space-xs rounded transition-colors duration-150 shadow-sm">
                  Book Free Counselling
                </Link>
                <Link href="/courses" className="inline-flex items-center justify-center bg-on-primary/10 hover:bg-on-primary/20 text-on-primary font-label-md text-label-md uppercase tracking-wider px-space-md py-space-xs rounded transition-colors duration-150">
                  Explore Curriculum
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Lightbox Modal */}
      {lightboxItem && (
        <div 
          className="fixed inset-0 z-50 bg-primary/95 flex items-center justify-center p-space-sm md:p-space-lg transition-opacity duration-300"
          onClick={() => setLightboxItem(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-surface-container-lowest rounded overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-space-md py-space-xs bg-surface-container-lowest">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-widest bg-surface-container px-space-2xs py-space-3xs rounded text-primary">
                  {lightboxItem.tag}
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Documentary Record</span>
              </div>
              <button 
                onClick={() => setLightboxItem(null)}
                className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-primary transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
            {/* Lightbox Media Area */}
            <div className="relative w-full aspect-[16/10] bg-surface-container flex items-center justify-center overflow-hidden">
              <img alt={lightboxItem.title} className="w-full h-full object-contain" src={lightboxItem.image}/>
            </div>
            {/* Lightbox Footer */}
            <div className="p-space-md bg-surface-container-lowest flex flex-col md:flex-row items-start md:items-center justify-between gap-space-xs">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">{lightboxItem.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{lightboxItem.description}</p>
              </div>
              <Link href="/book-counselling" className="shrink-0 inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-sm text-label-sm uppercase tracking-wider px-space-sm py-space-2xs rounded transition-colors">
                Observe Live Class
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
